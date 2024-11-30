export interface ChatMessage {
  id: string;
  content: string;
  isSelf: boolean;
  timestamp: Date;
}