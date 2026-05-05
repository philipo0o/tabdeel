INSERT INTO "user" (id, username, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
VALUES (1, 'admin', 'admin@tabdeel.com', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', 'Admin', 'User', 'admin', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
