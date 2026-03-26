-- ============================================
-- SMART WASTE MANAGEMENT - DATABASE SCHEMA
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- Tables: users, areas, waste_bins, complaints, collection_schedule, notifications

-- 1. USERS TABLE (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'driver', 'citizen')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. AREAS TABLE (waste collection zones)
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  area_manager_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(name, city)
);

-- 3. WASTE BINS TABLE
CREATE TABLE IF NOT EXISTS waste_bins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bin_code VARCHAR(100) NOT NULL UNIQUE,
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  bin_type VARCHAR(50) DEFAULT 'general' CHECK (bin_type IN ('general', 'organic', 'recycling', 'hazardous')),
  capacity_liters INTEGER DEFAULT 240,
  fill_level INTEGER DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'full', 'damaged')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  last_emptied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. COMPLAINTS TABLE (citizen reports)
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bin_id UUID REFERENCES waste_bins(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  complaint_type VARCHAR(100) DEFAULT 'general' CHECK (complaint_type IN ('overflow', 'damage', 'smell', 'spill', 'missed_collection', 'general')),
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'in_progress', 'resolved', 'rejected')),
  assigned_to UUID REFERENCES users(id),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- 5. COLLECTION SCHEDULE TABLE (driver tasks)
CREATE TABLE IF NOT EXISTS collection_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bin_id UUID NOT NULL REFERENCES waste_bins(id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'delayed')),
  assigned_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  waste_collected_kg DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(100) DEFAULT 'general' CHECK (notification_type IN ('warning', 'info', 'success', 'error', 'task_assigned', 'complaint_update')),
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  read_status BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- ============================================
-- INDEXES (for performance)
-- ============================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_waste_bins_area ON waste_bins(area_id);
CREATE INDEX idx_waste_bins_status ON waste_bins(status);
CREATE INDEX idx_complaints_user ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_bin ON complaints(bin_id);
CREATE INDEX idx_collection_driver ON collection_schedule(driver_id);
CREATE INDEX idx_collection_area ON collection_schedule(area_id);
CREATE INDEX idx_collection_date ON collection_schedule(scheduled_date);
CREATE INDEX idx_collection_status ON collection_schedule(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read_status);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- USERS POLICIES
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all users"
  ON users FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- AREAS POLICIES (everyone can view)
CREATE POLICY "Everyone can view areas"
  ON areas FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage areas"
  ON areas FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- WASTE_BINS POLICIES
CREATE POLICY "Everyone can view waste bins"
  ON waste_bins FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage waste bins"
  ON waste_bins FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- COMPLAINTS POLICIES
CREATE POLICY "Citizens can view their own complaints"
  ON complaints FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
    auth.uid() IN (SELECT id FROM users WHERE role = 'driver')
  );

CREATE POLICY "Citizens can create complaints"
  ON complaints FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'citizen'
  );

CREATE POLICY "Users can update their own complaints"
  ON complaints FOR UPDATE
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
    auth.uid() = assigned_to
  );

-- COLLECTION_SCHEDULE POLICIES
CREATE POLICY "Drivers can view their assigned tasks"
  ON collection_schedule FOR SELECT
  USING (
    auth.uid() = driver_id OR
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Drivers can update their assigned tasks"
  ON collection_schedule FOR UPDATE
  USING (
    auth.uid() = driver_id OR
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admin can manage collection schedule"
  ON collection_schedule FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================
-- Via Supabase Dashboard:
-- 1. Go to Storage
-- 2. Create a new bucket: "waste-management-images"
-- 3. Make it public
-- 4. Add policy for uploads

-- ============================================
-- FUNCTION TO UPDATE FILL LEVEL AUTOMATICALLY
-- ============================================

CREATE OR REPLACE FUNCTION update_bin_fill_level()
RETURNS TRIGGER AS $$
BEGIN
  -- When a collection is completed, reset fill level
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE waste_bins 
    SET 
      fill_level = 0,
      last_emptied_at = NOW(),
      status = 'active'
    WHERE id = NEW.bin_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bin_fill_level
AFTER UPDATE ON collection_schedule
FOR EACH ROW
EXECUTE FUNCTION update_bin_fill_level();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- INSERT INTO areas (name, city, latitude, longitude) VALUES
-- ('Downtown District', 'New York', 40.7128, -74.0060),
-- ('Midtown Zone', 'New York', 40.7505, -73.9680),
-- ('Brooklyn Area', 'New York', 40.6782, -73.9442);
