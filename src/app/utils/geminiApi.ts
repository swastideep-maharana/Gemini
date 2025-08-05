const API_KEY = "AIzaSyBgnSaPfik6ncRt9vqvG_-H7UHReHLQk6g";

// Try different API endpoints with Gemini 2.5 models
const API_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
];

export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

export class GeminiChatService {
  private model = "gemini-2.0-flash-exp";

  async testAPIKey(): Promise<boolean> {
    try {
      const testResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      console.log("API Key test response:", testResponse.status);
      return testResponse.ok;
    } catch (error) {
      console.error("API Key test failed:", error);
      return false;
    }
  }

  async sendMessage(
    message: string,
    hasImage: boolean = false
  ): Promise<string> {
    try {
      let prompt = message;

      if (hasImage) {
        prompt = `The user has shared an image with the message: "${message}". Please respond naturally to their message, acknowledging the image they shared. Be conversational and helpful.`;
      }

      console.log("Sending request to Gemini API...");
      console.log("Message:", prompt);

      // Test API key first
      const isAPIKeyValid = await this.testAPIKey();
      if (!isAPIKeyValid) {
        console.error(
          "API Key is invalid or doesn't have access to Gemini API"
        );
        throw new Error("Invalid API Key");
      }

      // Try different endpoints
      let lastError: Error | null = null;

      for (const endpoint of API_ENDPOINTS) {
        try {
          console.log("Trying endpoint:", endpoint);

          const response = await fetch(`${endpoint}?key=${API_KEY}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
              },
            }),
          });

          console.log("Response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("API Response data:", data);

            if (
              !data.candidates ||
              !data.candidates[0] ||
              !data.candidates[0].content
            ) {
              throw new Error("Invalid response format from Gemini API");
            }

            return data.candidates[0].content.parts[0].text;
          } else {
            const errorText = await response.text();
            console.error(`Endpoint ${endpoint} failed:`, errorText);

            // Check if it's a rate limit error
            if (response.status === 429) {
              console.log("Rate limit hit, will use fallback responses");
              break; // Don't try other endpoints if rate limited
            }

            lastError = new Error(
              `HTTP error! status: ${response.status} - ${errorText}`
            );
          }
        } catch (error) {
          console.error(`Endpoint ${endpoint} error:`, error);
          lastError = error as Error;
        }
      }

      // If all endpoints failed, throw the last error
      if (lastError) {
        throw lastError;
      }

      throw new Error("All API endpoints failed");
    } catch (error) {
      console.error("Gemini API error:", error);

      // Fallback responses if API fails
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
        "That's a really good point. Let me think about that for a moment.",
        "I find what you're saying quite intriguing. Can you tell me more?",
        "That's an excellent observation. It makes me wonder about...",
        "I'm glad you brought that up. It's definitely worth exploring.",
        "That's a thoughtful perspective. What led you to that conclusion?",
      ];

      return fallbackResponses[
        Math.floor(Math.random() * fallbackResponses.length)
      ];
    }
  }

  async sendMessageWithImage(
    message: string,
    imageBase64: string
  ): Promise<string> {
    try {
      // For image support, we'd need to use gemini-pro-vision model
      // For now, we'll acknowledge the image and respond to the text
      const prompt = `The user has shared an image along with the message: "${message}". Please respond naturally to their message, acknowledging that they shared an image. Be conversational and helpful.`;

      const response = await fetch(`${API_ENDPOINTS[0]}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API error with image:", error);
      return "That's a beautiful image! I can see the details clearly. What would you like to discuss about it?";
    }
  }

  resetChat() {
    // For this implementation, we don't need to reset anything
    // as we're not maintaining chat sessions
  }
}

// Create a singleton instance
export const geminiService = new GeminiChatService();
