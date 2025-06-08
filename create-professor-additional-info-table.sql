-- Create professor_additional_info table for extended professor information
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS professor_additional_info (
  professor_id UUID REFERENCES professors(id) PRIMARY KEY,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  previous_institution TEXT,
  research_areas TEXT,
  publications TEXT,
  certifications TEXT,
  blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  nationality TEXT DEFAULT 'Indian',
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the table
ALTER TABLE professor_additional_info ENABLE ROW LEVEL SECURITY;

-- Create policies for the table
CREATE POLICY "Professors can view own additional info" ON professor_additional_info
    FOR SELECT USING (auth.uid() = professor_id);

CREATE POLICY "Professors can update own additional info" ON professor_additional_info
    FOR UPDATE USING (auth.uid() = professor_id);

CREATE POLICY "Service role can manage professor_additional_info" ON professor_additional_info
    FOR ALL USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_professor_additional_info_professor_id ON professor_additional_info(professor_id);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_professor_additional_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER professor_additional_info_updated_at
  BEFORE UPDATE ON professor_additional_info
  FOR EACH ROW
  EXECUTE FUNCTION update_professor_additional_info_updated_at();

-- Grant necessary permissions
GRANT ALL ON professor_additional_info TO service_role;
GRANT SELECT, UPDATE ON professor_additional_info TO authenticated;

-- Display success message
DO $$ 
BEGIN 
  RAISE NOTICE 'Professor additional info table created successfully!';
END $$; 