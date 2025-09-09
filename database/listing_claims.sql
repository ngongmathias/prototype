-- Table for storing business listing claims
CREATE TABLE public.listing_claims (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  business_name text NOT NULL,
  business_address text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  website text,
  reason_for_claim text NOT NULL,
  additional_info text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  admin_notes text,
  verified_at timestamp with time zone,
  processed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT listing_claims_pkey PRIMARY KEY (id),
  CONSTRAINT listing_claims_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE SET NULL,
  CONSTRAINT listing_claims_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.admin_users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_listing_claims_status ON public.listing_claims(status);
CREATE INDEX idx_listing_claims_created_at ON public.listing_claims(created_at);
CREATE INDEX idx_listing_claims_business_id ON public.listing_claims(business_id);
CREATE INDEX idx_listing_claims_contact_email ON public.listing_claims(contact_email);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE public.listing_claims ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to view all claims (universal read access)
CREATE POLICY "Anyone can view listing claims" ON public.listing_claims
  FOR SELECT USING (true);

-- Policy for anyone to update claims (universal update access)
CREATE POLICY "Anyone can update listing claims" ON public.listing_claims
  FOR UPDATE USING (true);

-- Policy for anyone to insert new claims (universal insert access)
CREATE POLICY "Anyone can create listing claims" ON public.listing_claims
  FOR INSERT WITH CHECK (true);

-- Policy for anyone to delete claims (universal delete access)
CREATE POLICY "Anyone can delete listing claims" ON public.listing_claims
  FOR DELETE USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_listing_claims_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listing_claims_updated_at
  BEFORE UPDATE ON public.listing_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_claims_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.listing_claims IS 'Stores business listing claim requests from business owners';
COMMENT ON COLUMN public.listing_claims.business_id IS 'Reference to existing business (null if business not yet listed)';
COMMENT ON COLUMN public.listing_claims.status IS 'Claim status: pending, approved, rejected, in_review';
COMMENT ON COLUMN public.listing_claims.verified_at IS 'Timestamp when claim was verified/processed';
COMMENT ON COLUMN public.listing_claims.processed_by IS 'Admin user who processed the claim';

