document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submitButton");
  const postTextArea = document.getElementById("postTextArea");
  const textStorageKey = "viralXPostText"; // Single key for text
  const errorStorageKey = "viralXPostError";
  const buttonStateStorageKey = "viralXPostButtonState";

  // Helper function to update button UI based on state
  function updateButtonUI(state) {
    if (!submitButton) return;
    if (state === "PROCESSING") {
      submitButton.disabled = true;
      submitButton.textContent = "Enhancing...";
    } else {
      // Default to IDLE
      submitButton.disabled = false;
      submitButton.textContent = "Enhance";
    }
  }

  // Function to load state from storage
  function loadStateFromStorage() {
    if (!postTextArea || !chrome.storage || !chrome.storage.local) return;

    chrome.storage.local.get(
      [textStorageKey, errorStorageKey, buttonStateStorageKey],
      function (state) {
        if (chrome.runtime.lastError) {
          console.error(
            "Error loading state:",
            chrome.runtime.lastError.message
          );
          return;
        }

        let textToShow = state[textStorageKey] || "";
        let errorMsg = state[errorStorageKey];
        let keysToRemove = [];

        postTextArea.value = textToShow;

        if (errorMsg) {
          console.warn("Loaded error state from storage:", errorMsg);
          // Optionally display error in UI
          keysToRemove.push(errorStorageKey); // Clear error after acknowledging
        }

        updateButtonUI(state[buttonStateStorageKey]);

        if (keysToRemove.length > 0) {
          chrome.storage.local.remove(keysToRemove, () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Error clearing processed error state:",
                chrome.runtime.lastError.message
              );
            }
          });
        }
      }
    );
  }

  // Function to save current text and reset states
  function saveCurrentTextAndResetState() {
    if (!postTextArea || !chrome.storage || !chrome.storage.local) return;

    console.log("saveCurrentTextAndResetState called (input event)");
    const textToSave = postTextArea.value;

    chrome.storage.local.set({ [textStorageKey]: textToSave }, function () {
      if (chrome.runtime.lastError) {
        console.error("Error saving text:", chrome.runtime.lastError.message);
      }
    });

    // Clear any previous error and reset button state
    chrome.storage.local.remove([errorStorageKey], () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error clearing error state on input:",
          chrome.runtime.lastError.message
        );
      }
    });
    chrome.storage.local.set({ [buttonStateStorageKey]: "IDLE" }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error resetting button state to IDLE on input:",
          chrome.runtime.lastError.message
        );
      }
    });
  }

  // Load initial state when popup opens
  loadStateFromStorage();

  // Listen for changes in storage while the popup is open
  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local") {
        console.log("Storage changed:", changes);

        if (changes[buttonStateStorageKey]) {
          updateButtonUI(changes[buttonStateStorageKey].newValue);
        }

        if (changes[textStorageKey]) {
          const newText = changes[textStorageKey].newValue;
          if (newText !== undefined && postTextArea) {
            console.log("Real-time update: Found new text in storage.");
            // Only update if it differs from current value to avoid cursor jumps
            if (postTextArea.value !== newText) {
              postTextArea.value = newText;
            }
          }
        }

        if (changes[errorStorageKey]) {
          const newError = changes[errorStorageKey].newValue;
          if (newError !== undefined) {
            console.warn("Real-time update: Found new error state:", newError);
          }
        }
      }
    });
  }

  if (submitButton && postTextArea) {
    // Save text and reset states whenever text changes
    postTextArea.addEventListener("input", saveCurrentTextAndResetState);

    submitButton.addEventListener("click", function () {
      const currentText = postTextArea.value; // Get value directly
      console.log("Text submitted for enhancement:", currentText);

      // Optimistically update UI
      updateButtonUI("PROCESSING");

      // Check runtime API availability (remains useful)
      if (
        typeof chrome === "undefined" ||
        !chrome.runtime ||
        !chrome.runtime.sendMessage
      ) {
        console.error("Error: chrome.runtime.sendMessage is not available.");
        postTextArea.value = "Error: Extension context lost. Reload extension.";
        updateButtonUI("IDLE");
        return;
      }

      console.log("Sending message to background script to start enhancement.");
      chrome.runtime.sendMessage(
        { action: "rewriteText", text: currentText },
        (response) => {
          if (chrome.runtime.lastError) {
            // Handle immediate errors (e.g., background script connection failed)
            console.error(
              "Error sending message:",
              chrome.runtime.lastError.message
            );
            postTextArea.value = `Error starting enhance: ${chrome.runtime.lastError.message}`;
            updateButtonUI("IDLE");
            return;
          }

          if (response && response.success === false) {
            // Handle potential immediate errors returned by background's listener setup
            console.error(
              "Immediate error from background script:",
              response.error
            );
            postTextArea.value = `Error starting enhance: ${response.error}`;
            updateButtonUI("IDLE");
            return;
          }

          // Successfully sent message - provide feedback
          console.log(
            "Enhancement request sent to background. Close popup and reopen later to see results."
          );
          // Maybe visually indicate processing?
          // postTextArea.value = "Enhancement in progress..."; // Or keep current text
        }
      );
    });
  }
});
