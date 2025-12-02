import { supabase } from './supabase.js';

export async function getConversationById(id) {
  const { data, error } = await supabase.from('conversations').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createConversation({
  agentId,
  title,
  promptVersion,
  externalConversationId = null,
  phoneNumber = null,
  ownerId = null,
  contactId = null,
}) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      agent_id: agentId || null,
      external_conversation_id: externalConversationId,
      phone_number: phoneNumber,
      owner_id: ownerId,
      contact_id: contactId,
      title,
      prompt_version: promptVersion,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function getConversationByExternalId(externalId) {
  if (!externalId) {
    return null;
  }
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('external_conversation_id', externalId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('role,content,sequence,metadata')
    .eq('conversation_id', conversationId)
    .order('sequence', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function nextSequence(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('sequence')
    .eq('conversation_id', conversationId)
    .order('sequence', { ascending: false })
    .limit(1);
  if (error) throw error;
  const current = data && data[0] ? data[0].sequence : 0;
  return (current || 0) + 1;
}

export async function insertMessage({ conversationId, role, content, sequence, metadata }) {
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    role,
    content,
    sequence,
    metadata: metadata || null,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function updateConversationMeta(conversationId, patch) {
  const { error } = await supabase
    .from('conversations')
    .update({ ...patch, updated_at: new Date().toISOString(), last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  if (error) throw error;
}

export async function getAgentBySlug(slug) {
  const { data, error } = await supabase.from('agents').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function recordAiEvent({ conversationId, eventType, status, model, metadata }) {
  const { error } = await supabase.from('ai_events').insert({
    conversation_id: conversationId,
    event_type: eventType,
    status,
    model,
    metadata: metadata || null,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}
