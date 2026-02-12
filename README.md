# Resume Tailor - Automatic Resume & Cover Letter Customization

Automatically tailor your resume and cover letter to any job posting using AI. This system fetches your resume from Google Docs, analyzes job postings, and generates customized versions using Claude AI.

## Features

- Fetches resume and cover letter templates from Google Docs
- Scrapes job postings from any URL
- Uses Claude AI to tailor resume to job requirements
- Generates customized cover letters
- Uploads results back to Google Docs
- Chrome extension for one-click operation
- Dockerized for easy deployment

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Google Cloud account with Docs API enabled
- Anthropic API key for Claude
- Chrome browser

## Setup Instructions

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Docs API and Google Drive API
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" > "Create Credentials" > "OAuth client ID"
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/oauth2callback`
   - Save the Client ID and Client Secret

### 2. Prepare Your Google Docs

1. Create a Google Doc with your master resume
2. Create a Google Doc with your cover letter template
3. Create a Google Drive folder for output documents
4. Note down the Document IDs and Folder ID from the URLs:
   - Document URL: `https://docs.google.com/document/d/DOCUMENT_ID/edit`
   - Folder URL: `https://drive.google.com/drive/folders/FOLDER_ID`

### 3. Get Anthropic API Key

1. Sign up at [Anthropic](https://www.anthropic.com/)
2. Get your API key from the dashboard

### 4. Install Dependencies

```bash
npm install
```

### 5. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your credentials:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
RESUME_DOC_ID=your_resume_document_id
COVER_LETTER_TEMPLATE_DOC_ID=your_cover_letter_template_id
OUTPUT_FOLDER_ID=your_output_folder_id
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=3000
```

### 6. Authorize Google Access

1. Start the server:
```bash
npm start
```

2. Visit `http://localhost:3000/auth` in your browser
3. Authorize the application
4. Copy the refresh token and add it to your `.env` file:
```env
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

5. Restart the server

### 7. Build and Run with Docker

```bash
docker-compose up -d
```

This will start the service on `http://localhost:3000`

### 8. Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder from this project
5. The extension should now appear in your toolbar

## Usage

### Using the Chrome Extension

1. Navigate to any job posting page
2. Click the "Resume Tailor" extension icon
3. Click "Tailor Resume"
4. Wait for the process to complete
5. Click the links to view your tailored resume and cover letter in Google Docs

### Using the API Directly

```bash
curl -X POST http://localhost:3000/tailor-resume \
  -H "Content-Type: application/json" \
  -d '{"jobUrl": "https://example.com/job-posting"}'
```

## How It Works

1. **Input**: You provide a job posting URL via the Chrome extension or API
2. **Fetch**: System retrieves your master resume and cover letter template from Google Docs
3. **Scrape**: Job posting is scraped and analyzed for requirements
4. **Tailor**: Claude AI tailors your resume to highlight relevant experience
5. **Generate**: Cover letter is generated based on the job requirements
6. **Upload**: Both documents are uploaded to your Google Drive folder
7. **Output**: You receive links to view the new documents

## Project Structure

```
tailor-resume-2-job/
├── src/
│   ├── index.js                 # Main Express server
│   └── services/
│       ├── googleDocs.js        # Google Docs API integration
│       ├── jobScraper.js        # Job posting scraper
│       └── resumeTailor.js      # AI resume tailoring service
├── chrome-extension/
│   ├── manifest.json            # Extension configuration
│   ├── popup.html               # Extension UI
│   ├── popup.js                 # Extension logic
│   ├── background.js            # Background service worker
│   └── content.js               # Content script
├── Dockerfile                   # Docker container config
├── docker-compose.yml           # Docker Compose config
├── package.json                 # Node.js dependencies
└── .env.example                 # Environment variables template
```

## Troubleshooting

### "Docker container is not running"
Make sure Docker is running and start the service:
```bash
docker-compose up -d
```

### "Failed to fetch document"
- Verify your Google credentials are correct
- Ensure the document IDs in `.env` are valid
- Check that you've authorized the app at `/auth`

### "Failed to tailor resume"
- Verify your Anthropic API key is valid
- Check that you have sufficient API credits
- Review the server logs: `docker-compose logs`

### Extension shows errors
- Check that the server is running on `http://localhost:3000`
- Verify the API_URL in `popup.js` matches your server
- Check browser console for detailed errors

## Stopping the Service

```bash
docker-compose down
```

## Development

For development with auto-reload:
```bash
npm run dev
```

## Security Notes

- Never commit your `.env` file
- Keep your API keys secure
- The refresh token provides ongoing access to your Google account
- Use environment variables for all sensitive data

## Limitations

- Job scraping may not work on all websites (JavaScript-heavy sites may require different approaches)
- Some job boards may block automated scraping
- Google Docs API has rate limits
- Anthropic API usage incurs costs

## Future Enhancements

- Support for multiple resume versions
- Better job site detection and parsing
- Resume formatting preservation
- A/B testing different resume versions
- Analytics on application success rates
- LinkedIn integration

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
