-- Create contact_messages table for storing user contact form submissions
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new'::text CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create universal access policies for contact messages
-- Anyone can create (submit) contact messages
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages 
FOR INSERT WITH CHECK (true);

-- Anyone can view contact messages (for admin purposes)
CREATE POLICY "Anyone can view contact messages" ON public.contact_messages 
FOR SELECT USING (true);

-- Anyone can update contact messages (for admin purposes)
CREATE POLICY "Anyone can update contact messages" ON public.contact_messages 
FOR UPDATE USING (true);

-- Anyone can delete contact messages (for admin purposes)
CREATE POLICY "Anyone can delete contact messages" ON public.contact_messages 
FOR DELETE USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_messages_updated_at 
  BEFORE UPDATE ON public.contact_messages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_contact_messages_updated_at();

-- Create index on email for faster lookups
CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);

-- Create index on status for filtering
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);

-- Create index on created_at for sorting
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at);

-- Insert sample data for testing (optional)
-- INSERT INTO public.contact_messages (first_name, last_name, email, phone, subject, message) 
-- VALUES 
--   ('John', 'Doe', 'john@example.com', '+1234567890', 'General Inquiry', 'This is a test message'),
--   ('Jane', 'Smith', 'jane@example.com', '+0987654321', 'Support Request', 'Need help with my account');
