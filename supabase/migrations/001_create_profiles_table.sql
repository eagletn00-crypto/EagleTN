-- ================================================
-- MIGRATION 001: Create Profiles Table with Roles
-- ================================================
-- 
-- Creates the profiles table for user identity and role-based access control.
-- This is the foundation for the 4-party role system:
-- - client: Customer placing orders
-- - partner: Restaurant/merchant managing menu and orders
-- - driver: Delivery personnel
-- - admin: Platform administrators

CREATE TYPE user_role AS ENUM (
  'client',   -- Customer
  'partner',  -- Restaurant/Merchant
  'driver',   -- Delivery Driver
  'admin'     -- Platform Admin
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone text,
  full_name text,
  avatar_url text,
  
  -- Role-based access control
  role user_role NOT NULL DEFAULT 'client',
  
  -- Status
  is_active boolean NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Indexes
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create indexes for quick role lookup
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Prevent role escalation
);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Trigger to update updated_at on profile changes
CREATE OR REPLACE FUNCTION update_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER profiles_update_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_timestamp();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, is_active, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', true, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auth_user_new_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_on_signup();

-- ================================================
-- NOTES
-- ================================================
--
-- DEPLOYMENT:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify profiles table is created: SELECT * FROM profiles LIMIT 1;
-- 3. Test RLS: Try SELECT * FROM profiles in anonymous session (should return no rows)
--
-- TESTING:
-- - Create a new auth.user and verify profile is auto-created
-- - Update your own profile and verify updated_at changes
-- - Attempt to change role (should fail due to RLS policy)
--
-- ROLE ASSIGNMENTS:
-- UPDATE profiles SET role = 'partner' WHERE id = '<partner-uuid>'
-- UPDATE profiles SET role = 'driver' WHERE id = '<driver-uuid>'
-- UPDATE profiles SET role = 'admin' WHERE id = '<admin-uuid>' (admin only)
