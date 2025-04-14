# Viral X Post Helper Chrome Extension 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An open-source Chrome extension designed to help you craft potentially more viral posts for Twitter (X) by providing data-driven suggestions using intelligent analysis.

## ✨ Features

*   **Text Analysis:** Input your draft post text directly into the extension popup.
*   **Virality Suggestions:** Get intelligent suggestions based on analysis to improve your post's potential reach.
*   **Simple Interface:** Easy-to-use popup for quick text input and viewing results.
*   **Asynchronous Processing:** Uses background processing so your browser remains responsive.
*   **Local Storage:** Temporarily stores text and results locally for efficient operation.


## 📦 Installation

There are three ways to install the extension:

**1. From the Chrome Web Store (Recommended)**

*   Visit the [Viral X Post Helper page on the Chrome Web Store](https://chromewebstore.google.com/detail/viral-x-post-helper/ahoihlieoiodiebdidpjhoanldicbjlo).
*   Click the "Add to Chrome" button.

**2. Loading Unpacked Extension (for latest development version)**

If you want the absolute latest code or the extension is temporarily unavailable on the store:

1.  **Download:** Download the latest release `.zip` file from the [Releases](https://github.com/YOUR_USERNAME/viral-x-post-chrome-extension/releases) page or clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/viral-x-post-chrome-extension.git
    cd viral-x-post-chrome-extension
    ```
2.  **Build:** You need Node.js and npm installed. Run the following commands:
    ```bash
    npm install
    npm run build
    ```
    This will create a `dist` directory containing the built extension files.
3.  **Load in Chrome:**
    *   Open Chrome and navigate to `chrome://extensions/`.
    *   Enable "Developer mode" using the toggle switch in the top-right corner.
    *   Click the "Load unpacked" button.
    *   Select the `dist` directory created in step 2.
    *   The extension icon should appear in your Chrome toolbar (you might need to pin it).

**3. For Developers**

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/viral-x-post-chrome-extension.git
    cd viral-x-post-chrome-extension
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:** This extension uses an AI service (Dify) for its analysis feature. Developers need to configure API credentials to connect to this service.
    *   Create a file named `.env` in the project root.
    *   Add your Dify API key and potentially the API endpoint URL to the `.env` file. Example:
        ```env
        DIFY_API_KEY=your_api_key_here
        # DIFY_API_URL=your_dify_instance_url_here (if not using the default)
        ```
    *   *(Explain clearly how developers can obtain a Dify API key and configure the necessary endpoint/workflow if applicable. Link to Dify documentation or signup if possible.)*
4.  **Build/Run:**
    *   For a production build: `npm run build`
    *   For development with auto-reloading (using `webpack --watch` or similar): `npm run dev` *(Verify this command in your package.json)*
5.  **Load in Chrome:** Follow step 3 from the "For End-Users" section, selecting the `dist` directory. Changes during development build should reload the extension automatically.

## 🚀 Usage

1.  Click the Viral X Post Helper icon in your Chrome toolbar to open the popup.
2.  Paste or type the text of your post/tweet into the text area.
3.  Click the "Enhance Post" (or similar) button.
4.  The extension will show a processing state.
5.  Once the analysis is complete, the suggestions or the rewritten text will appear in the popup.
6.  Copy the suggested text and use it in your Twitter (X) post.

## 🛠️ Technology Stack

*   **Frontend:** HTML, CSS, JavaScript (Popup)
*   **Background:** TypeScript
*   **Build Tool:** Webpack
*   **APIs:**
    *   Chrome Extension API (`storage`, `runtime`)
    *   Server API - Powers the backend analysis and suggestion engine.
*   **Environment:** Node.js

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve the extension, please follow these steps:

1.  **Fork** the repository on GitHub.
2.  **Clone** your fork locally (`git clone git@github.com:YOUR_USERNAME/viral-x-post-chrome-extension.git`).
3.  Create a **new branch** for your feature or bug fix (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
4.  Make your **changes**.
5.  **Commit** your changes (`git commit -am 'Add some feature'`).
6.  **Push** to the branch (`git push origin feature/your-feature-name`).
7.  Create a new **Pull Request** on GitHub.

Please try to follow the existing code style and add comments where necessary.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2024 Archit Jain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact

Having issues or have questions?

*   Open an issue on this GitHub repository.
*   Contact the maintainer: architjn93@gmail.com

---

Made with ❤️ for better posts!
