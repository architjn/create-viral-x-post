/**
 * Calls an external API to rewrite the given text.
 * Uses URL and Token from environment variables.
 * @param originalText The text to rewrite.
 * @returns A promise that resolves with the rewritten text, or rejects on error.
 */
export async function rewritePostText(originalText: string): Promise<string> {
  const apiUrl = process.env.VIRALX_API_URL;
  const apiToken = process.env.VIRALX_API_TOKEN;

  if (!apiUrl || !apiToken) {
    console.error("API URL or Token is missing in environment variables.");
    throw new Error("API configuration is missing.");
  }

  console.log(
    `API: Calling ${apiUrl} for text: "${originalText.substring(0, 30)}..."`
  );

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ text: originalText }),
    });

    if (!response.ok) {
      // Attempt to read error details from the response body
      let errorBody = "Unknown error";
      try {
        errorBody = await response.text();
      } catch (e) {
        /* Ignore if reading body fails */
      }
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();

    // **IMPORTANT**: Adjust this based on your actual API response structure
    const rewrittenText = data.rewrittenText; // Assuming the API returns { rewrittenText: "..." }

    if (!rewrittenText) {
      throw new Error("API response did not contain rewrittenText.");
    }

    console.log(
      `API: Received rewritten text: "${rewrittenText.substring(0, 50)}..."`
    );
    return rewrittenText;
  } catch (error) {
    console.error("Error during API call:", error);
    // Re-throw the error so the caller (content script) can handle it
    throw error;
  }
}
