# Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Initial Setup (5 minutes)

```bash
# Run the setup script
./setup.sh

# Or manually:
npm install
cp .env.example .env
```

## Step 2: Get Your API Keys

### Anthropic API Key (2 minutes)
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new key
5. Copy it to `.env` as `ANTHROPIC_API_KEY`

### Google Cloud Credentials (10 minutes)
1. Visit https://console.cloud.google.com/
2. Create a new project
3. Enable Google Docs API and Google Drive API
4. Create OAuth 2.0 credentials (Web application)
5. Set redirect URI: `http://localhost:3000/oauth2callback`
6. Copy Client ID and Client Secret to `.env`

## Step 3: Prepare Your Documents

1. **Create your master resume** in Google Docs
2. **Create a cover letter template** in Google Docs
3. **Create a folder** in Google Drive for outputs
4. **Get the IDs** from the URLs:
   - Doc: `https://docs.google.com/document/d/DOC_ID_HERE/edit`
   - Folder: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
5. Add these IDs to your `.env` file

## Step 4: Authorize Google Access

```bash
# Start the server
npm start

# Visit in browser
http://localhost:3000/auth

# Authorize the app
# Copy the refresh token shown
# Add it to .env as GOOGLE_REFRESH_TOKEN

# Stop the server (Ctrl+C)
```

## Step 5: Run with Docker

```bash
# Build and start
docker-compose up -d

# Check it's running
curl http://localhost:3000/health
```

## Step 6: Install Chrome Extension

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `chrome-extension` folder
6. Done!

## Step 7: Test It Out!

1. Navigate to any job posting
2. Click the Resume Tailor extension icon
3. Click "Tailor Resume"
4. Wait ~30 seconds
5. Open your tailored resume and cover letter!

## Troubleshooting

**"Docker not running"**
```bash
docker-compose up -d
```

**"Authorization failed"**
- Check your Google credentials in `.env`
- Make sure redirect URI matches exactly

**"API error"**
- Verify Anthropic API key is valid
- Check you have API credits

**"Can't scrape job"**
- Some sites block scraping
- Try a different job posting
- Check the URL is accessible

## What's Next?

- Customize the prompts in `src/services/resumeTailor.js`
- Improve job scraping for specific sites
- Add more formatting options
- Create multiple resume templates

## Need Help?

- Check the full README.md
- Review server logs: `docker-compose logs`
- Open an issue on GitHub
