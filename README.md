# Core Web Vitals Bookmarklet

This bookmarklet allows you to view **Core Web Vitals** data for any webpage directly in your browser. It fetches data from the **Chrome UX Report API** and displays interactive charts showing key metrics such as:

- Largest Contentful Paint (**LCP**)
- First Contentful Paint (**FCP**)
- Cumulative Layout Shift (**CLS**)
- Time to First Byte (**TTFB**)
- Interaction to Next Paint (**INP**)

## Table of Contents

- [How to Use the Bookmarklet](#how-to-use-the-bookmarklet)
  - [Create the Bookmarklet](#create-the-bookmarklet)
  - [Use the Bookmarklet](#use-the-bookmarklet)
- [How to Get a Google API Key](#how-to-get-a-google-api-key)
  - [Steps to Obtain an API Key](#steps-to-obtain-an-api-key)
- [Security Considerations](#security-considerations)
- [Additional Information](#additional-information)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## How to Use the Bookmarklet

### Create the Bookmarklet

1. **Copy the Bookmarklet Code:**

    ```javascript
    javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/William-Harvey/bookmarklet-wh-cwv/cwv-history.js';s.onload=function(){runCWVBookmarklet('YOUR_API_KEY');};document.body.appendChild(s);})();
    ```

2. **Insert Your Google API Key:**

   - Replace `'YOUR_API_KEY'` in the code above with your actual Google API key obtained from the [Google Cloud Console](#how-to-get-a-google-api-key).

   **Example:**

    ```javascript
    javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/William-Harvey/bookmarklet-wh-cwv/cwv-history.js';s.onload=function(){runCWVBookmarklet('AIzaSyAtCJD5BVUp7g6r7GKlkV8h9IeUEPa-UsE');};document.body.appendChild(s);})();
    ```

3. **Create a New Bookmark:**

   - In your web browser, create a new bookmark (also known as a favorite).
   - **Name**: Give it a descriptive name, e.g., `Core Web Vitals Bookmarklet`.
   - **URL/Location**: Paste the modified code into the URL or location field.

4. **Save the Bookmark:**

   - Save the bookmark in your bookmarks bar or menu for easy access.

### Use the Bookmarklet

1. **Navigate to a Webpage:**

   - Go to any website or page you want to analyze for Core Web Vitals.

2. **Click the Bookmarklet:**

   - Click on the bookmark you created in your browser.

3. **View Core Web Vitals Data:**

   - A popup will appear displaying the Core Web Vitals data for the current page.
   - Use the dropdown menu to select different form factors:
     - **All Form Factors**
     - **Desktop**
     - **Mobile**
     - **Tablet**

4. **Interact with the Charts:**

   - View interactive line charts for each metric.
   - The charts display historical data, thresholds, and performance zones.

## How to Get a Google API Key

To use the bookmarklet, you need a Google API key with access to the Chrome UX Report API.

### Steps to Obtain an API Key

1. **Go to the Google Cloud Console:**

   - Visit [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a New Project (If Necessary):**

   - Click on the project selection dropdown at the top of the page.
   - Click **New Project**.
   - Enter a **Project Name** (e.g., `Core Web Vitals Project`).
   - Click **Create**.

3. **Enable the Chrome UX Report API:**

   - In the Cloud Console, navigate to **APIs & Services** > **Library**.
   - Search for **Chrome UX Report API**.
   - Click on the API from the search results.
   - Click **Enable**.

4. **Create Credentials (API Key):**

   - Go to **APIs & Services** > **Credentials**.
   - Click **Create Credentials** and select **API Key**.
   - Your new API key will be generated and displayed.

5. **Restrict Your API Key (Recommended):**

   - Click on **Restrict Key** to set restrictions.
   - **Application Restrictions**:
     - Optionally, set application restrictions (e.g., HTTP referrers).
   - **API Restrictions**:
     - Select **Restrict key**.
     - Choose **Chrome UX Report API** from the dropdown.
   - Click **Save** to apply the restrictions.

6. **Copy Your API Key:**

   - Copy the generated API key.
   - Replace `'YOUR_API_KEY'` in the bookmarklet code with this API key.

## Security Considerations

- **Keep Your API Key Confidential:**

  - Do not share your API key publicly or commit it to public repositories.
  - Store it securely to prevent unauthorized access.

- **Restrict API Key Usage:**

  - Limit the API key to only the necessary APIs (Chrome UX Report API).
  - Apply application restrictions if applicable.

- **Monitor API Usage:**

  - Regularly check your API usage in the Google Cloud Console.
  - Set up usage quotas and alerts to monitor activity.

## Additional Information

- **Metrics Displayed:**

  - **Largest Contentful Paint (LCP)**
  - **First Contentful Paint (FCP)**
  - **Cumulative Layout Shift (CLS)**
  - **Time to First Byte (TTFB)**
  - **Interaction to Next Paint (INP)**

- **Performance Zones:**

  - The charts display performance zones with solid colors:
    - **Green**: Good
    - **Yellow**: Needs Improvement
    - **Red**: Poor

- **Thresholds and Legend:**

  - Each chart includes thresholds for the performance zones.
  - A legend explains the colors and lines used in the charts.

## Troubleshooting

- **Bookmarklet Not Working:**

  - Ensure you have correctly replaced `'YOUR_API_KEY'` with your actual API key.
  - Verify that you have copied the entire code into the bookmark's URL field.
  - Check for any syntax errors in the code.

- **API Errors:**

  - Make sure the Chrome UX Report API is enabled in your Google Cloud project.
  - Verify that your API key has the necessary permissions and restrictions.

- **No Data Available:**

  - Some URLs may not have sufficient data for all metrics or form factors.
  - Try selecting a different form factor or testing with a different URL.

- **Cross-Origin Requests Blocked:**

  - Ensure your browser allows cross-origin requests.
  - Disable any browser extensions that might block such requests.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Note:** Replace `'YOUR_API_KEY'` with your actual Google API key in the bookmarklet code. Be cautious with your API key to prevent unauthorized use.

**Disclaimer:** This bookmarklet is provided "as is" without warranty of any kind. Use it responsibly and at your own risk.
