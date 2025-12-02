-- Add performance indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_child_id ON vaccination_records(child_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_status ON vaccination_records(status);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_clinic_users_id ON users(id) WHERE role = 'clinic';
CREATE INDEX IF NOT EXISTS idx_sessions_expire_at ON sessions(expire_at);
