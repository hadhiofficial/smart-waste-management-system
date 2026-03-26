/**
 * DEMO DATA - Sample Data for Testing
 * Run this in Supabase SQL Editor to populate with test data
 * 
 * Demo Credentials:
 * Admin: admin@test.com / password123
 * Driver: driver@test.com / password123
 * Citizen: citizen@test.com / password123
 */

-- Note: Users in Supabase are created via auth.users
-- These sample credentials should be created via the Sign Up form first
-- Then you can use these queries to add profile data

-- INSERT AREAS (Waste collection zones)
INSERT INTO areas (id, name, description, latitude, longitude, created_at) VALUES
  ('area-001', 'Downtown District', 'Central business district', 40.7128, -74.0060, NOW()),
  ('area-002', 'Residential West', 'West residential area', 40.7200, -74.0200, NOW()),
  ('area-003', 'Residential East', 'East residential area', 40.7250, -73.9800, NOW()),
  ('area-004', 'Industrial Zone', 'Industrial and commercial area', 40.7100, -74.0100, NOW()),
  ('area-005', 'Park District', 'Public parks and recreation areas', 40.7300, -73.9700, NOW())
ON CONFLICT (id) DO NOTHING;

-- INSERT WASTE BINS
INSERT INTO waste_bins (id, area_id, status, fill_level, capacity, location_description, last_emptied_at, created_at) VALUES
  ('bin-001', 'area-001', 'active', 45, 100, 'Main Street Corner', NOW() - INTERVAL '5 days', NOW()),
  ('bin-002', 'area-001', 'active', 78, 100, 'Park Entrance', NOW() - INTERVAL '2 days', NOW()),
  ('bin-003', 'area-001', 'full', 95, 100, 'Shopping Center', NOW() - INTERVAL '1 day', NOW()),
  ('bin-004', 'area-002', 'active', 32, 100, 'Residential Street A', NOW() - INTERVAL '4 days', NOW()),
  ('bin-005', 'area-002', 'active', 61, 100, 'Residential Street B', NOW() - INTERVAL '3 days', NOW()),
  ('bin-006', 'area-002', 'maintenance', 0, 100, 'Residential Street C', NOW() - INTERVAL '10 days', NOW()),
  ('bin-007', 'area-003', 'active', 55, 100, 'Avenue D', NOW() - INTERVAL '2 days', NOW()),
  ('bin-008', 'area-003', 'active', 88, 100, 'Avenue E', NOW() - INTERVAL '1 day', NOW()),
  ('bin-009', 'area-003', 'full', 100, 100, 'Avenue F', NOW() - INTERVAL '6 hours', NOW()),
  ('bin-010', 'area-004', 'active', 42, 150, 'Industrial Road 1', NOW() - INTERVAL '2 days', NOW()),
  ('bin-011', 'area-004', 'active', 71, 150, 'Industrial Road 2', NOW() - INTERVAL '1 day', NOW()),
  ('bin-012', 'area-005', 'active', 38, 80, 'Central Park', NOW() - INTERVAL '3 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Note: After running the above, create users via the Sign Up form using the demo credentials
-- Then uncomment and update the below with actual user IDs from auth.users table

-- Alternatively, if you have the Supabase admin SDK or can access auth.users directly:
-- The driver and citizen tables will auto-populate when users create their profiles through Sign Up

-- SAMPLE COLLECTION SCHEDULE (after users are created)
-- Uncomment after creating users
-- INSERT INTO collection_schedule (id, driver_id, area_id, bin_id, scheduled_date, status, created_at) VALUES
--   ('sched-001', 'driver-user-id', 'area-001', 'bin-001', NOW() + INTERVAL '1 day', 'pending', NOW()),
--   ('sched-002', 'driver-user-id', 'area-001', 'bin-002', NOW() + INTERVAL '1 day', 'pending', NOW()),
--   ('sched-003', 'driver-user-id', 'area-001', 'bin-003', NOW() + INTERVAL '1 day', 'pending', NOW()),
--   ('sched-004', 'driver-user-id', 'area-002', 'bin-004', NOW() + INTERVAL '2 days', 'pending', NOW());

-- SAMPLE COMPLAINTS (after users are created)
-- Uncomment after creating users
-- INSERT INTO complaints (id, user_id, bin_id, title, description, complaint_type, status, image_url, created_at) VALUES
--   ('comp-001', 'citizen-user-id', 'bin-003', 'Overflowing Waste', 'The bin at shopping center is completely full and overflowing', 'overflow', 'pending', NULL, NOW() - INTERVAL '2 days'),
--   ('comp-002', 'citizen-user-id', 'bin-006', 'Damaged Bin', 'The bin on Residential Street C has a large hole in the side', 'damage', 'in_progress', NULL, NOW() - INTERVAL '1 day'),
--   ('comp-003', 'citizen-user-id', 'bin-012', 'Bad Smell', 'Strong smell coming from the bin in Central Park', 'smell', 'resolved', NULL, NOW() - INTERVAL '5 days');

-- VERIFY DATA
SELECT 'Areas' as data_type, COUNT(*) as count FROM areas
UNION ALL
SELECT 'Waste Bins' as data_type, COUNT(*) as count FROM waste_bins
UNION ALL
SELECT 'Complaints' as data_type, COUNT(*) as count FROM complaints
UNION ALL
SELECT 'Collection Schedule' as data_type, COUNT(*) as count FROM collection_schedule;
