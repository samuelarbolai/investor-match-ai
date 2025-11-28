import { getSupabaseClient } from '../config/supabase';

export interface AgentPrompt {
  id?: string;
  agent_name: string;
  prompt_type: string;
  language?: string;
  content: string;
  updated_by?: string | null;
  updated_at?: string;
}

export interface PromptFilters {
  agent_name?: string;
  prompt_type?: string;
  language?: string;
}

export async function listPrompts(filters: PromptFilters = {}): Promise<AgentPrompt[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('agent_prompts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (filters.agent_name) {
    query = query.eq('agent_name', filters.agent_name);
  }
  if (filters.prompt_type) {
    query = query.eq('prompt_type', filters.prompt_type);
  }
  if (filters.language) {
    query = query.eq('language', filters.language);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch prompts: ${error.message}`);
  }
  return data || [];
}

export async function upsertPrompt(payload: AgentPrompt): Promise<AgentPrompt> {
  const supabase = getSupabaseClient();
  const insertPayload = {
    agent_name: payload.agent_name,
    prompt_type: payload.prompt_type,
    language: payload.language || 'multi',
    content: payload.content,
    updated_by: payload.updated_by || null,
  };

  const { data, error } = await supabase
    .from('agent_prompts')
    .upsert(insertPayload, { onConflict: 'agent_name,prompt_type,language' })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save prompt: ${error.message}`);
  }

  return data as AgentPrompt;
}
