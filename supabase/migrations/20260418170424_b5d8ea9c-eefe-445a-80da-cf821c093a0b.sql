
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'citizen');

-- Issue status enum
CREATE TYPE public.issue_status AS ENUM ('pending', 'verified', 'in_progress', 'resolved', 'rejected');

-- Issue category enum
CREATE TYPE public.issue_category AS ENUM ('road', 'water', 'electricity', 'sanitation', 'streetlight', 'drainage', 'other');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate to avoid privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Issues table
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category issue_category NOT NULL,
  status issue_status NOT NULL DEFAULT 'pending',
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_text TEXT,
  assigned_department TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_issues_reporter ON public.issues(reporter_id);
CREATE INDEX idx_issues_status ON public.issues(status);

-- Status history
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  old_status issue_status,
  new_status issue_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_status_history_issue ON public.status_history(issue_id);

-- Profiles RLS
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_roles RLS
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Issues RLS — anyone signed in can view all (public civic transparency)
CREATE POLICY "Authenticated users view all issues" ON public.issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Citizens insert own issues" ON public.issues FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reporter updates own pending issues" ON public.issues FOR UPDATE USING (auth.uid() = reporter_id AND status = 'pending');
CREATE POLICY "Admins update any issue" ON public.issues FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete any issue" ON public.issues FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- status_history RLS
CREATE POLICY "Authenticated view status history" ON public.status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert status history" ON public.status_history FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_issues_updated BEFORE UPDATE ON public.issues
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + citizen role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'citizen');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Status history trigger when issue status changes
CREATE OR REPLACE FUNCTION public.log_issue_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.status_history (issue_id, changed_by, old_status, new_status, note)
    VALUES (NEW.id, NEW.reporter_id, NULL, NEW.status, 'Issue submitted');
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.status_history (issue_id, changed_by, old_status, new_status, note)
    VALUES (NEW.id, auth.uid(), OLD.status, NEW.status, NEW.admin_notes);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_log_issue_status
AFTER INSERT OR UPDATE ON public.issues
FOR EACH ROW EXECUTE FUNCTION public.log_issue_status_change();

-- Storage bucket for issue images (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-images', 'issue-images', true);

CREATE POLICY "Issue images publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'issue-images');
CREATE POLICY "Authenticated upload issue images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own issue images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own issue images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]);
