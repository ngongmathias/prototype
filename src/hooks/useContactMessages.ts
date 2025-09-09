import { useState } from 'react';
import { db } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ContactMessage {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const useContactMessages = () => {
  const [loading, setLoading] = useState(false);

  const submitContactMessage = async (message: ContactMessage): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await db
        .contact_messages()
        .insert([message])
        .select()
        .single();

      if (error) {
        console.error('Error submitting contact message:', error);
        toast.error('Failed to submit message', {
          description: 'Please try again or contact us directly.',
          duration: 5000,
        });
        return false;
      }

      toast.success('Message sent successfully!', {
        description: 'We will get back to you soon.',
        duration: 5000,
      });

      return true;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      toast.error('Failed to submit message', {
        description: 'Please try again or contact us directly.',
        duration: 5000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getContactMessages = async (): Promise<ContactMessage[]> => {
    try {
      const { data, error } = await db
        .contact_messages()
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  };

  const updateContactMessageStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const { error } = await db
        .contact_messages()
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating contact message status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating contact message status:', error);
      return false;
    }
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    try {
      const { error } = await db
        .contact_messages()
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting contact message:', error);
      return false;
    }
  };

  return {
    loading,
    submitContactMessage,
    getContactMessages,
    updateContactMessageStatus,
    deleteContactMessage,
  };
};
