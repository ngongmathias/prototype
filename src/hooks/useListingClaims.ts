import { useState } from 'react';
import { db } from '@/lib/supabase';

export interface ListingClaim {
  id: string;
  business_id?: string;
  business_name: string;
  business_address: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  reason_for_claim: string;
  additional_info?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  admin_notes?: string;
  verified_at?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateListingClaimData {
  business_id?: string;
  business_name: string;
  business_address: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  reason_for_claim: string;
  additional_info?: string;
}

export const useListingClaims = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createListingClaim = async (data: CreateListingClaimData): Promise<ListingClaim | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: claim, error: insertError } = await db
        .from('listing_claims')
        .insert([data])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return claim;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit claim request';
      setError(errorMessage);
      console.error('Error creating listing claim:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getListingClaims = async (status?: string): Promise<ListingClaim[]> => {
    setIsLoading(true);
    setError(null);

    try {
      let query = db.from('listing_claims').select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data: claims, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      return claims || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch claims';
      setError(errorMessage);
      console.error('Error fetching listing claims:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateListingClaimStatus = async (
    claimId: string, 
    status: 'pending' | 'approved' | 'rejected' | 'in_review',
    adminNotes?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      if (status === 'approved' || status === 'rejected') {
        updateData.verified_at = new Date().toISOString();
      }

      const { error: updateError } = await db
        .from('listing_claims')
        .update(updateData)
        .eq('id', claimId);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update claim status';
      setError(errorMessage);
      console.error('Error updating listing claim:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getListingClaimById = async (claimId: string): Promise<ListingClaim | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: claim, error: fetchError } = await db
        .from('listing_claims')
        .select('*')
        .eq('id', claimId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return claim;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch claim';
      setError(errorMessage);
      console.error('Error fetching listing claim:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createListingClaim,
    getListingClaims,
    updateListingClaimStatus,
    getListingClaimById
  };
};

