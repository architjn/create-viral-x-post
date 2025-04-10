import { rewritePostText } from "./api";

chrome.runtime.onMessage.addListener(
  (
    request: { action: string; text?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: {
      success: boolean;
      data?: string;
      error?: string;
    }) => void
  ) => {
    // Check if the message is intended for rewriting text
    if (request.action === "rewriteText" && request.text) {
      console.log("Background: Received text to rewrite:", request.text);
      rewritePostText(request.text)
        .then((rewrittenText) => {
          console.log("Background: Sending rewritten text:", rewrittenText);
          // Send success response
          sendResponse({ success: true, data: rewrittenText });
        })
        .catch((error) => {
          console.error("Background: Error rewriting text:", error);
          // Send error response
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        });

      // Return true to indicate you wish to send a response asynchronously
      return true;
    }

    // Handle other potential messages or return false if not handled
    return false;
  }
);
