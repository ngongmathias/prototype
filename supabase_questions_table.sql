-- Questions Table Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create the questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_user_email ON public.questions(user_email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert questions (public access)
CREATE POLICY "Allow public insert" ON public.questions
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to view questions (public access)
CREATE POLICY "Allow public select" ON public.questions
    FOR SELECT USING (true);

-- Create policy to allow updates only for admin users (you can modify this based on your auth system)
CREATE POLICY "Allow admin update" ON public.questions
    FOR UPDATE USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON public.questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample categories (optional)
-- You can modify these categories based on your needs
INSERT INTO public.questions (title, content, user_name, user_email, category, status) VALUES
('Sample Question 1', 'This is a sample question content for testing purposes.', 'Test User', 'test@example.com', 'Technology', 'pending'),
('Sample Question 2', 'Another sample question to demonstrate the system.', 'Sample User', 'sample@example.com', 'Health & Medical', 'pending')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON public.questions TO authenticated;
GRANT ALL ON public.questions TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.questions IS 'Table to store user questions for the Q&A system';
COMMENT ON COLUMN public.questions.id IS 'Unique identifier for each question';
COMMENT ON COLUMN public.questions.title IS 'Short title/summary of the question (max 100 characters)';
COMMENT ON COLUMN public.questions.content IS 'Detailed content/description of the question';
COMMENT ON COLUMN public.questions.user_name IS 'Name of the user asking the question';
COMMENT ON COLUMN public.questions.user_email IS 'Email address of the user for notifications';
COMMENT ON COLUMN public.questions.category IS 'Category classification of the question';
COMMENT ON COLUMN public.questions.status IS 'Current status: pending, answered, or closed';
COMMENT ON COLUMN public.questions.created_at IS 'Timestamp when the question was created';
COMMENT ON COLUMN public.questions.updated_at IS 'Timestamp when the question was last updated';
