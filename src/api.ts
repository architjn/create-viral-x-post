/**
 * Calls an external API to rewrite the given text.
 * Uses URL and Token from environment variables.
 * @param originalText The text to rewrite.
 * @returns A promise that resolves with the rewritten text, or rejects on error.
 */
export async function rewritePostText(originalText: string): Promise<string> {
  const apiUrl = `${process.env.VIRALX_API_URL}/completion-messages`;
  const apiToken = process.env.VIRALX_API_TOKEN;
  const userId = `chrome-ext-user-${Date.now()}`;

  if (!apiUrl || !apiToken) {
    throw new Error("API configuration is missing in environment variables.");
  }

  const requestBody = {
    inputs: { original_post_text: originalText },
    response_mode: "blocking",
    user: userId,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorBody = "Unknown API error";
      try {
        errorBody = await response.text();
      } catch (e) {
        /* Ignore */
      }
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();

    const rewrittenText = data.answer;

    if (typeof rewrittenText !== "string") {
      throw new Error("Invalid response format from API.");
    }

    return rewrittenText;
  } catch (error) {
    // It's often useful to know the error occurred, even if not logging details
    // Consider re-adding targeted logging if needed during debugging
    throw error; // Re-throw for the content script to handle
  }
}
