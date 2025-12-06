-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('remote', 'hybrid', 'onsite')),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
  experience_level TEXT NOT NULL CHECK (experience_level IN ('junior', 'entry')),
  skills TEXT[] DEFAULT '{}',
  compensation_type TEXT NOT NULL CHECK (compensation_type IN ('unpaid', 'stipend', 'hourly', 'project-based')),
  compensation_amount TEXT,
  application_email TEXT NOT NULL,
  application_deadline DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_jobs_business_id ON jobs(business_id);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_skills ON jobs USING GIN(skills);
CREATE INDEX idx_jobs_location_type ON jobs(location_type);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_compensation_type ON jobs(compensation_type);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active jobs
CREATE POLICY "Active jobs are viewable by everyone" ON jobs
  FOR SELECT
  USING (is_active = true);

-- Policy: Business users can view all their own jobs (active and inactive)
CREATE POLICY "Business users can view their own jobs" ON jobs
  FOR SELECT
  USING (auth.uid() = business_id);

-- Policy: Admin users can view all jobs
CREATE POLICY "Admins can view all jobs" ON jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Only business users can insert jobs
CREATE POLICY "Business users can insert jobs" ON jobs
  FOR INSERT
  WITH CHECK (
    auth.uid() = business_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'business'
    )
  );

-- Policy: Business users can update their own jobs
CREATE POLICY "Business users can update their own jobs" ON jobs
  FOR UPDATE
  USING (auth.uid() = business_id)
  WITH CHECK (auth.uid() = business_id);

-- Policy: Business users can delete their own jobs
CREATE POLICY "Business users can delete their own jobs" ON jobs
  FOR DELETE
  USING (auth.uid() = business_id);

-- Policy: Admins can update any job
CREATE POLICY "Admins can update any job" ON jobs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Admins can delete any job
CREATE POLICY "Admins can delete any job" ON jobs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Trigger to auto-update updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment job views (called from client)
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs
  SET views = views + 1
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;