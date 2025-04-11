import { rewritePostText } from "./api";

console.log("Chrome Extension Background Script Loaded");

const textStorageKey = "viralXPostText";
const errorStorageKey = "viralXPostError";
const buttonStateStorageKey = "viralXPostButtonState";

chrome.runtime.onMessage.addListener(
  (
    request: { action: string; text?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: { success: boolean; error?: string }) => void
  ) => {
    // Check if the message is intended for rewriting text
    if (request.action === "rewriteText" && request.text) {
      const originalText = request.text;
      console.log("Background: Received text to rewrite:", originalText);

      // Set state to PROCESSING immediately
      chrome.storage.local.set(
        { [buttonStateStorageKey]: "PROCESSING" },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              "Background: Error setting button state to PROCESSING:",
              chrome.runtime.lastError.message
            );
          }
        }
      );

      // Immediately clear any previous error/result
      chrome.storage.local.remove([textStorageKey, errorStorageKey], () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Background: Error clearing previous state:",
            chrome.runtime.lastError.message
          );
          // Don't send response here, let the main logic handle it
        }
      });

      rewritePostText(originalText)
        .then((rewrittenText) => {
          console.log(
            "Background: API call successful. Saving result to storage:",
            rewrittenText
          );
          // Save the successful result to the text key
          chrome.storage.local.set({ [textStorageKey]: rewrittenText }, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Background: Error saving result:",
                chrome.runtime.lastError.message
              );
            } else {
              console.log("Background: Successfully saved result.");
            }
          });
        })
        .catch((error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown API error";
          console.error(
            "Background: Error rewriting text. Saving error state:",
            errorMessage
          );
          // Save error state to storage
          chrome.storage.local.set({ [errorStorageKey]: errorMessage }, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Background: Error saving error state:",
                chrome.runtime.lastError.message
              );
            }
          });
        })
        .finally(() => {
          console.log(
            "Background: API call finished (finally block). Setting button state to IDLE."
          );
          // Set state back to IDLE regardless of API/save success/failure
          chrome.storage.local.set({ [buttonStateStorageKey]: "IDLE" }, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Background: Error setting button state to IDLE (finally block):",
                chrome.runtime.lastError.message
              );
            }
          });
        });

      // Indicate that the response function MIGHT be called asynchronously.
      return true;
    }

    // Handle other potential messages or return false if not handled
    return false;
  }
);
