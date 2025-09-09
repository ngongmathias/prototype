import { db } from './supabase';

export interface Question {
  id: string;
  title: string;
  content: string;
  user_name: string;
  user_email: string;
  category: string;
  status: 'pending' | 'answered' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionData {
  title: string;
  content: string;
  user_name: string;
  user_email: string;
  category: string;
}

export class QuestionService {
  static async createQuestion(data: CreateQuestionData): Promise<Question> {
    const { data: question, error } = await db
      .questions()
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create question: ${error.message}`);
    }

    return question;
  }

  static async getQuestions(): Promise<Question[]> {
    const { data: questions, error } = await db
      .questions()
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }

    return questions || [];
  }

  static async getQuestionById(id: string): Promise<Question | null> {
    const { data: question, error } = await db
      .questions()
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to fetch question: ${error.message}`);
    }

    return question;
  }

  static async updateQuestionStatus(id: string, status: Question['status']): Promise<Question> {
    const { data: question, error } = await db
      .questions()
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update question status: ${error.message}`);
    }

    return question;
  }
}
