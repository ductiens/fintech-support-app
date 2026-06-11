import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';

export type ChatSession = {
  session_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  status: string; // BOT_ACTIVE, WAITING_HUMAN, HUMAN_ACTIVE, CLOSED
  title?: string | null;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  intent?: string | null;
  sources?: any[];
};

export type ChatSource = {
  doc_id: string;
  chunk_id: string;
  title: string;
  score: number;
};

export type EscalationDetail = {
  required: boolean;
  reason?: string | null;
  priority?: string | null;
};

export type ChatResponseData = {
  session_id: string;
  answer: string;
  intent: string;
  confidence: number;
  sources: ChatSource[];
  tool_calls: any[];
  escalation: EscalationDetail;
};

export type ChatRequestPayload = {
  session_id?: string | null;
  message: string;
};

export function useChatSessions() {
  const api = useApi();
  return useQuery({
    queryKey: ['chatSessions'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: ChatSession[] }>('/chat/sessions');
      return response.data;
    },
  });
}

export function useChatHistory(sessionId: string | null) {
  const api = useApi();
  return useQuery({
    queryKey: ['chatHistory', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const response = await api.get<{ success: boolean; data: ChatMessage[] }>(`/chat/sessions/${sessionId}/history`);
      return response.data;
    },
    enabled: !!sessionId,
  });
}

export function useSendChatMessage() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ChatRequestPayload) => {
      const response = await api.post<{ success: boolean; data: ChatResponseData }>('/chat', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      queryClient.invalidateQueries({ queryKey: ['chatHistory', data.session_id] });
    },
  });
}
