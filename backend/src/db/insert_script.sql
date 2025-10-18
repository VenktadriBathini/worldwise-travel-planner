-- Users
INSERT INTO app_user (email, password_hash, display_name)
VALUES
('demo@wt.app', '$2a$10$GQh4wX2lN2s9s1X3U6yQbeQk1y5tQ7H2qH8T7gXqWfa.dY6o0m1jK', 'Demo User');
-- password = demo123  (bcrypt rounds=10)

-- Trip
INSERT INTO trip (owner_id, title, description, total_members, planned_budget_amt)
SELECT id, 'Route 66', 'Test trip', 2, 1500.00 FROM app_user WHERE email='demo@wt.app';

-- Point(s)
INSERT INTO trip_point (trip_id, ordinal, name, lat, lng, notes)
SELECT t.id, 0, 'Chicago', 41.8781, -87.6298, 'Start'
FROM trip t JOIN app_user u ON u.id=t.owner_id WHERE u.email='demo@wt.app';

INSERT INTO trip_point (trip_id, ordinal, name, lat, lng, notes)
SELECT t.id, 1, 'St. Louis', 38.6270, -90.1994, 'Arch stop'
FROM trip t JOIN app_user u ON u.id=t.owner_id WHERE u.email='demo@wt.app';
