-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subdomain TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  portfolio_data JSONB,
  customizations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Enable RLS on portfolios
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Portfolios RLS policies
CREATE POLICY "Users can view own portfolios"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view published public portfolios"
  ON public.portfolios FOR SELECT
  USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Add portfolio_id to resumes table
ALTER TABLE public.resumes ADD COLUMN portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL;

-- Update resumes RLS to allow viewing resumes linked to public portfolios
CREATE POLICY "Public can view resumes of published public portfolios"
  ON public.resumes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = resumes.portfolio_id
      AND portfolios.status = 'published'
      AND portfolios.visibility = 'public'
    )
  );

-- Function to generate unique subdomain
CREATE OR REPLACE FUNCTION public.generate_unique_subdomain(base_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  candidate TEXT;
  counter INTEGER := 0;
BEGIN
  candidate := regexp_replace(lower(base_name), '[^a-z0-9-]', '-', 'g');
  candidate := trim(both '-' from candidate);

  -- Ensure minimum length
  IF length(candidate) < 3 THEN
    candidate := candidate || 'user';
  END IF;

  -- Ensure maximum length
  IF length(candidate) > 30 THEN
    candidate := substring(candidate, 1, 30);
  END IF;

  candidate := trim(both '-' from candidate);

  -- Check uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM public.portfolios WHERE subdomain = candidate) LOOP
    counter := counter + 1;
    candidate := substring(candidate, 1, 27) || counter::TEXT;
  END LOOP;

  RETURN candidate;
END;
$$;

-- Function to create portfolio on first resume upload
CREATE OR REPLACE FUNCTION public.create_portfolio_on_resume_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile RECORD;
  portfolio_subdomain TEXT;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM public.profiles WHERE id = NEW.user_id;

  -- Generate subdomain from display_name or full_name or email
  IF user_profile.display_name IS NOT NULL AND user_profile.display_name != '' THEN
    portfolio_subdomain := generate_unique_subdomain(user_profile.display_name);
  ELSIF user_profile.full_name IS NOT NULL AND user_profile.full_name != '' THEN
    portfolio_subdomain := generate_unique_subdomain(user_profile.full_name);
  ELSE
    portfolio_subdomain := generate_unique_subdomain(split_part(user_profile.email, '@', 1));
  END IF;

  -- Create portfolio if it doesn't exist
  INSERT INTO public.portfolios (user_id, subdomain, status, visibility)
  VALUES (NEW.user_id, portfolio_subdomain, 'draft', 'private')
  ON CONFLICT (user_id) DO NOTHING;

  -- Link resume to portfolio
  UPDATE public.resumes SET portfolio_id = (
    SELECT id FROM public.portfolios WHERE user_id = NEW.user_id LIMIT 1
  ) WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

-- Trigger to create portfolio on resume upload
CREATE TRIGGER on_resume_upload_create_portfolio
  AFTER INSERT ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_portfolio_on_resume_upload();

-- Update trigger for portfolios updated_at
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
