import { supabase } from './supabase.js';

export async function loadPrompt(agentSlug = 'onboarding') {
  const { data, error } = await supabase
    .from('agent_prompts')
    .select('content,agent_name,prompt_type,language,updated_at')
    .eq('agent_name', agentSlug)
    .eq('prompt_type', 'system')
    .order('updated_at', { ascending: false })
    .limit(1);
  if (error) {
    console.warn('prompt load failed', error.message || error);
    throw new Error('No prompt available: ensure table agent_prompts exists with agent_name/system prompt_type');
  }
  if (data && data.length > 0 && data[0].content) {
    return {
      content: data[0].content,
      version: data[0].updated_at || 'unknown',
      agentName: data[0].agent_name,
      promptType: data[0].prompt_type,
      language: data[0].language,
    };
  }
  throw new Error('No prompt available: add an intake prompt row for this agent in agent_prompts table');
}
