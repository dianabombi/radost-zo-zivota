-- Create rate_limit_log table to track user actions
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('interaction', 'registration', 'login')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_user_action ON rate_limit_log(user_id, action_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_created_at ON rate_limit_log(created_at DESC);

-- Enable Row Level Security
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own rate limit logs
CREATE POLICY "Users can view their own rate limit logs"
  ON rate_limit_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System can insert rate limit logs (via service role)
CREATE POLICY "Service role can insert rate limit logs"
  ON rate_limit_log
  FOR INSERT
  WITH CHECK (true);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_requests INT,
  p_time_window_minutes INT
)
RETURNS BOOLEAN AS $$
DECLARE
  request_count INT;
BEGIN
  -- Count requests in the time window
  SELECT COUNT(*) INTO request_count
  FROM rate_limit_log
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND created_at > NOW() - (p_time_window_minutes || ' minutes')::INTERVAL;
  
  -- Return true if under limit, false if over limit
  RETURN request_count < p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log rate limit action
CREATE OR REPLACE FUNCTION log_rate_limit_action(
  p_user_id UUID,
  p_action_type TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rate_limit_log (user_id, action_type, ip_address, user_agent)
  VALUES (p_user_id, p_action_type, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old rate limit logs (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limit_log
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add rate limiting configuration table
CREATE TABLE IF NOT EXISTS rate_limit_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type TEXT NOT NULL UNIQUE,
  max_requests INT NOT NULL,
  time_window_minutes INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default rate limit configurations
INSERT INTO rate_limit_config (action_type, max_requests, time_window_minutes)
VALUES 
  ('interaction', 10, 60),  -- 10 interactions per hour
  ('registration', 3, 60),  -- 3 registration attempts per hour
  ('login', 10, 15)         -- 10 login attempts per 15 minutes
ON CONFLICT (action_type) DO NOTHING;

-- Enable RLS on rate_limit_config
ALTER TABLE rate_limit_config ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read rate limit config
CREATE POLICY "Anyone can read rate limit config"
  ON rate_limit_config
  FOR SELECT
  USING (true);

-- Add comment for documentation
COMMENT ON TABLE rate_limit_log IS 'Tracks user actions for rate limiting purposes';
COMMENT ON TABLE rate_limit_config IS 'Configuration for rate limiting rules';
COMMENT ON FUNCTION check_rate_limit IS 'Checks if user has exceeded rate limit for a specific action';
COMMENT ON FUNCTION log_rate_limit_action IS 'Logs a rate-limited action';
COMMENT ON FUNCTION cleanup_old_rate_limit_logs IS 'Removes rate limit logs older than 24 hours';
