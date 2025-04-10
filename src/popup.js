document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submitButton");
  const postTextArea = document.getElementById("postTextArea");

  if (submitButton && postTextArea) {
    submitButton.addEventListener("click", function () {
      const currentText = postTextArea.value;
      console.log("Original text:", currentText);

      // Disable button to prevent multiple clicks during API call
      submitButton.disabled = true;
      submitButton.textContent = "Enhancing..."; // Provide visual feedback

      // Check if the runtime API is available
      if (
        typeof chrome === "undefined" ||
        !chrome.runtime ||
        !chrome.runtime.sendMessage
      ) {
        console.error(
          "Error: chrome.runtime.sendMessage is not available in this context."
        );
        // Provide feedback to the user in the UI
        postTextArea.value =
          "Error: Extension context lost. Please reload the extension.";
        submitButton.disabled = false; // Re-enable button
        submitButton.textContent = "Enhance";
        return; // Stop execution
      }
      console.log("Sending message to background script");
      // Send message to background script to perform the API call
      chrome.runtime.sendMessage(
        { action: "rewriteText", text: currentText },
        (response) => {
          // Re-enable the button regardless of success or failure
          submitButton.disabled = false;
          submitButton.textContent = "Enhance";

          if (chrome.runtime.lastError) {
            // Handle errors during message sending (e.g., background script not ready)
            console.error(
              "Error sending message:",
              chrome.runtime.lastError.message
            );
            // Optional: Show an error message to the user in the UI
            // postTextArea.value = currentText; // Decide if you want to revert
            return;
          }

          console.log("Popup: Received response:", response);
          if (response && response.success && response.data) {
            // Update text area with the rewritten text from the background script
            postTextArea.value = response.data;
          } else {
            // Handle errors from the API call in the background script
            const errorMessage = response
              ? response.error
              : "Unknown error from background script.";
            console.error("Error rewriting text:", errorMessage);
            // Optional: Show an error message to the user in the UI
            // postTextArea.value = currentText; // Decide if you want to revert
          }
        }
      );
    });
  }
});

/*
// --- Placeholder for testing without a real API ---
// ... (Removed placeholder code) ...
// --- End of placeholder ---
*/
