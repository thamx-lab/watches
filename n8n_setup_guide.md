# My n8n Watch Robot Guide

This guide has everything you need to run your n8n automation engine and connect it to Google Drive for your Watches website!

## 1. How to Start the Engine
Whenever you want to use your robots, open your terminal and run these commands:

1. Tell the terminal to go to your watches folder:
   ```cmd
   cd /d d:\watches
   ```
2. Start the engine using your safe folder:
   ```cmd
   set N8N_USER_FOLDER=d:\watches\.n8n && pnpm exec n8n
   ```
3. Open your browser and go to: **http://localhost:5678**

*(To turn it off, go back to the terminal and press `Ctrl + C`)*

---

## 2. How to get the Google Drive "VIP Pass" (Client ID)

If n8n asks you for a **Client ID** and **Client Secret** to connect to Google Drive, follow this treasure map:

### Step 1: Enter the Control Panel
1. Go to: **console.cloud.google.com**
2. Sign in with your Google account.

### Step 2: Create a Project
1. At the top left, click **"Select a project"**.
2. Click **"New Project"** in the top right corner.
3. Name it *"Watch Robot"* and click **Create**. 
4. Make sure your new project is selected at the top!

### Step 3: Turn on the Google Drive Power
1. In the search bar at the very top, type exactly: **Google Drive API**
2. Click on it in the search results.
3. Click the big blue **"Enable"** button.

### Step 4: Make the VIP Pass
1. On the left menu, click **"Credentials"** (it looks like a key).
2. Click **"+ CREATE CREDENTIALS"** at the top, and choose **"OAuth client ID"**.
   * *(Note: If it asks you to configure an "OAuth Consent Screen" first, click configure, choose "External", type "Watch Robot" for the App Name and your email, save to the end, then go back to Credentials).*
3. For the **Application type**, choose **"Web application"**.
4. Name it *"n8n Watch Robot"*.
5. Scroll down to **"Authorized redirect URIs"**. Click **"+ ADD URI"**.
6. Go to your n8n dashboard tab, look in the Google Drive settings for **"OAuth Redirect URL"**, and click the copy button next to it.
7. Go back to Google and paste that link into the URI box.
8. Click **Create**!

### Step 5: The Treasure!
A box will pop up with your **Client ID** and your **Client Secret**. Just copy and paste those into n8n and click **Connect**!
