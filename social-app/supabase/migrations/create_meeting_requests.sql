-- Create meeting_requests table
CREATE TABLE IF NOT EXISTS meeting_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'expired')),
  method TEXT NOT NULL CHECK (method IN ('qr_code', 'bluetooth', 'email')),
  distance DECIMAL(5,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Prevent duplicate pending requests between same users
  CONSTRAINT unique_pending_request UNIQUE (from_user_id, to_user_id, status)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meeting_requests_to_user ON meeting_requests(to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_from_user ON meeting_requests(from_user_id, status);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_created_at ON meeting_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view requests sent to them
CREATE POLICY "Users can view their received requests"
  ON meeting_requests
  FOR SELECT
  USING (auth.uid() = to_user_id);

-- Policy: Users can view requests they sent
CREATE POLICY "Users can view their sent requests"
  ON meeting_requests
  FOR SELECT
  USING (auth.uid() = from_user_id);

-- Policy: Users can create requests
CREATE POLICY "Users can create requests"
  ON meeting_requests
  FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- Policy: Users can update requests sent to them (confirm/reject)
CREATE POLICY "Users can update their received requests"
  ON meeting_requests
  FOR UPDATE
  USING (auth.uid() = to_user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_meeting_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_meeting_requests_updated_at
  BEFORE UPDATE ON meeting_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_meeting_requests_updated_at();

-- Function to expire old pending requests
CREATE OR REPLACE FUNCTION expire_old_meeting_requests()
RETURNS void AS $$
BEGIN
  UPDATE meeting_requests
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
