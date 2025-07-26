export interface MessagingAdapter {
  sendMessage(topic: string, message: Record<string, unknown>): Promise<void>;
}