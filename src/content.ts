import $ from "jquery";
import { rewritePostText } from "./api"; // Import the API function

console.log("Chrome Extension Content Script Loaded");

// Simple SVG Spinner (adjust size/stroke as needed)
const spinnerSVG =
  '<path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" fill="currentColor"/><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.5,1.5,0,0,0,10.72,19.9Z" fill="currentColor"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path>';

// Action performed when the button is clicked
async function handleViralPostAction(): Promise<void> {
  console.log("Viral Post action started...");

  try {
    const $postTextBox = $('div[aria-label="Post text"]');

    if ($postTextBox.length) {
      const $lastSpan = $postTextBox.find("span:last"); // Find the last span within the div
      if ($lastSpan.length) {
        const originalText = $lastSpan.text();
        console.log("Found original text:", originalText);

        // Call the API function to rewrite the text
        const rewrittenText = await rewritePostText(originalText);

        // Update the span with the rewritten text
        $lastSpan.text(rewrittenText);
        console.log("Updated text field with rewritten text.");
      } else {
        console.log("Could not find a span element within the Post text div.");
      }
    } else {
      console.log("Could not find the Post text div.");
    }
  } catch (error) {
    console.error("Error during Viral Post action:", error);
    // Re-throw the error if you want the main handler to catch it
    // throw error;
  }

  console.log("Viral Post action finished.");
}

function findElementAndAddButton(observer: MutationObserver | null) {
  const $targetElement = $('[aria-label="Add a GIF"]').parent();

  if ($targetElement.length) {
    const $newButton = $targetElement.clone();
    const $viralPostButton = $newButton.find("button");
    const $svgElement = $viralPostButton.find("svg");

    // Set initial attributes and icon
    $viralPostButton.attr("aria-label", "Add a Viral Post");
    $svgElement.html(
      '<path d="M16.5 9.5L12.3 13.7L10.7 11.3L7.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '<path d="M14.5 9.5H16.5V11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '<path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    );

    const originalSVG = $svgElement.html(); // Store original SVG *after* setting it

    // --- Add Click Handler ---
    $viralPostButton.on("click", async (event) => {
      event.preventDefault(); // Prevent default button action if any
      event.stopPropagation(); // Prevent event bubbling if needed

      if ($viralPostButton.prop("disabled")) {
        return; // Do nothing if already processing
      }

      $viralPostButton.prop("disabled", true);
      $svgElement.html(spinnerSVG); // Show spinner

      try {
        await handleViralPostAction();
        // Optional: Add success feedback here
      } catch (error) {
        console.error("Viral Post action failed:", error);
        // Optional: Add error feedback here
      } finally {
        $svgElement.html(originalSVG); // Restore original icon
        $viralPostButton.prop("disabled", false); // Re-enable button
      }
    });
    // -------------------------

    $targetElement.after($newButton);

    // Once found, we don't need to observe anymore
    if (observer) {
      console.log("Disconnecting observer.");
      observer.disconnect();
    }
  }
}

// Options for the observer (which mutations to observe)
const observerConfig: MutationObserverInit = {
  childList: true, // Observe direct children additions/removals
  subtree: true, // Observe all descendants
};

// Callback function to execute when mutations are observed
const callback: MutationCallback = (mutationsList, observer) => {
  // We could check mutationsList for specifics, but for simplicity,
  // we'll just re-run our check function on any relevant mutation.
  findElementAndAddButton(observer);
};

const observer = new MutationObserver(callback);

// 1. Initial check in case the element is already present when the script loads
findElementAndAddButton(observer);

// 2. Start observing the document body for configured mutations
// We wait a tiny bit for the body to likely exist, though MutationObserver is robust
if (document.body) {
  observer.observe(document.body, observerConfig);
  console.log("MutationObserver started on document.body.");
} else {
  // Fallback if body isn't immediately available (less common for document_idle)
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body) {
      observer.observe(document.body, observerConfig);
      console.log(
        "MutationObserver started on document.body after DOMContentLoaded."
      );
    } else {
      console.error("Could not find document.body to observe.");
    }
  });
}
