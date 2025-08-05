import { geminiService } from "../utils/geminiApi";

class ChatService {
  private chatSessions: Map<string, any> = new Map();

  async getResponse(
    roomId: string,
    message: string,
    hasImage: boolean = false
  ): Promise<string> {
    try {
      // For now, we'll use the geminiService directly
      // In the future, we can implement conversation context here
      const response = await geminiService.sendMessage(message, hasImage);
      return response;
    } catch (error) {
      console.error("Chat service error:", error);

      // Fallback responses
      const fallbackResponses = [
        "I understand what you're saying. That's an interesting point!",
        "Thanks for sharing that with me. I'd love to explore that further.",
        "That's a great observation. What made you think of that?",
        "I see what you mean. Let me add to that conversation.",
        "Interesting! I hadn't considered that angle before.",
        "That's a fascinating insight. It reminds me of something similar.",
        "I'm processing what you just said. That's quite thought-provoking.",
        "Thanks for sharing that! It opens up some interesting possibilities.",
        "I appreciate you sharing that. It gives me a new perspective.",
        "Great question! Here's what I think about that.",
      ];

      return fallbackResponses[
        Math.floor(Math.random() * fallbackResponses.length)
      ];
    }
  }

  resetChat(roomId: string) {
    this.chatSessions.delete(roomId);
  }

  clearAllChats() {
    this.chatSessions.clear();
  }
}

export const chatService = new ChatService();
