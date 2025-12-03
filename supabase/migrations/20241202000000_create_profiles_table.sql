-- Create profiles table for storing parsed resume data
CREATE TABLE IF NOT EXISTS profiles (
  user_id text PRIMARY KEY,
  parsed_json jsonb NOT NULL,
  resume_s3_key text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'parsed', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated users to upload resumes
CREATE POLICY "Users can upload their own resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- Create policy for users to read their own resumes
CREATE POLICY "Users can read their own resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can manage their own profiles" ON profiles
FOR ALL USING (true);