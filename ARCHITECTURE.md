# System Architecture

## Overview

The Resume Tailor system consists of three main components:
1. Node.js backend service
2. Chrome extension frontend
3. Docker containerization

## Component Diagram

```
┌─────────────────────┐
│  Chrome Extension   │
│   (User Interface)  │
└──────────┬──────────┘
           │ HTTP POST /tailor-resume
           ▼
┌─────────────────────────────────────┐
│     Express.js Server (Port 3000)   │
│  ┌───────────────────────────────┐  │
│  │    Main Application Logic     │  │
│  │      (src/index.js)           │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│    ┌─────────┼─────────┬────────┐   │
│    ▼         ▼         ▼        ▼   │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐   │
│  │Docs│  │Scrp│  │Tail│  │Docs│   │
│  │Read│  │ er │  │ or │  │Wrte│   │
│  └────┘  └────┘  └────┘  └────┘   │
└─────────────────────────────────────┘
           │         │         │
           ▼         ▼         ▼
    ┌──────────┐ ┌──────┐ ┌────────┐
    │  Google  │ │ Job  │ │Anthropic│
    │   Docs   │ │Sites │ │  API    │
    │   API    │ │      │ │ (Claude)│
    └──────────┘ └──────┘ └────────┘
```

## Data Flow

1. **User initiates** via Chrome extension on a job posting page
2. **Extension sends** job URL to backend API
3. **Backend fetches** resume and cover letter from Google Docs
4. **Backend scrapes** job posting for requirements
5. **Backend calls** Claude API to tailor resume
6. **Backend calls** Claude API to generate cover letter
7. **Backend uploads** both documents to Google Drive
8. **Backend returns** document URLs to extension
9. **Extension displays** success and document links

## Services

### GoogleDocsService
**Purpose**: Interface with Google Docs and Drive APIs

**Methods**:
- `getAuthUrl()`: Generate OAuth authorization URL
- `getTokensFromCode(code)`: Exchange auth code for tokens
- `getDocumentContent(documentId)`: Fetch document text
- `createDocument(title, content, folderId)`: Create new document

**Dependencies**: googleapis

### JobScraperService
**Purpose**: Extract job information from posting URLs

**Methods**:
- `scrapeJob(jobUrl)`: Scrape and parse job posting
- `cleanText(text)`: Clean extracted text

**Features**:
- Generic scraping (works with most sites)
- Intelligent content extraction
- Handles various job board formats
- Fallback mechanisms

**Dependencies**: axios, cheerio

### ResumeTailorService
**Purpose**: AI-powered resume and cover letter customization

**Methods**:
- `tailorResume(resumeContent, jobDetails)`: Customize resume
- `generateCoverLetter(template, resume, jobDetails)`: Create cover letter

**Features**:
- Uses Claude Sonnet 4.5 model
- Keyword optimization
- ATS-friendly formatting
- Maintains truthfulness

**Dependencies**: @anthropic-ai/sdk

## Chrome Extension

### Components:
- **manifest.json**: Extension configuration
- **popup.html/js**: User interface and logic
- **background.js**: Service worker for background tasks
- **content.js**: Page interaction scripts

### Permissions:
- `activeTab`: Access current tab URL
- `storage`: Store user preferences
- `http://localhost:3000/*`: API communication

## Docker Setup

### Dockerfile
- Base image: node:18-alpine
- Exposes port 3000
- Runs npm start

### docker-compose.yml
- Single service configuration
- Environment variable injection
- Volume mounting for development
- Auto-restart policy

## Security Considerations

1. **API Keys**: Stored in .env, never committed
2. **OAuth Tokens**: Refresh token provides ongoing access
3. **CORS**: Extension must be whitelisted
4. **Rate Limiting**: Consider implementing for production
5. **Input Validation**: Job URLs should be validated

## Scalability

### Current Limitations:
- Single instance
- Synchronous processing
- No caching
- No database

### Future Improvements:
- Queue system (Bull, RabbitMQ)
- Redis caching
- Database for history
- Multiple workers
- Load balancing

## Error Handling

- Google API errors: Retry logic needed
- Scraping failures: Graceful degradation
- AI API errors: User-friendly messages
- Network timeouts: Configurable timeouts

## Environment Variables

Required:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `RESUME_DOC_ID`
- `COVER_LETTER_TEMPLATE_DOC_ID`
- `OUTPUT_FOLDER_ID`
- `ANTHROPIC_API_KEY`

Optional:
- `PORT` (default: 3000)
- `NODE_ENV`

## API Endpoints

### GET /health
Health check endpoint
Returns: `{ status: 'ok', message: '...' }`

### GET /auth
Initiates OAuth flow
Redirects to Google authorization

### GET /oauth2callback
OAuth callback handler
Returns refresh token for .env

### POST /tailor-resume
Main endpoint for resume tailoring

Request:
```json
{
  "jobUrl": "https://example.com/job"
}
```

Response:
```json
{
  "success": true,
  "message": "Resume and cover letter tailored successfully",
  "resumeUrl": "https://docs.google.com/...",
  "coverLetterUrl": "https://docs.google.com/...",
  "jobDetails": {
    "company": "Company Name",
    "title": "Job Title"
  }
}
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **AI**: Anthropic Claude API
- **Cloud**: Google Docs API, Google Drive API
- **Scraping**: Axios, Cheerio
- **Container**: Docker, Docker Compose
- **Frontend**: Chrome Extension (HTML/JS)

## Development Workflow

1. Edit code in `src/`
2. Changes auto-reload (with nodemon)
3. Test with `test-api.sh`
4. Rebuild Docker: `docker-compose up -d --build`
5. Reload extension in Chrome

## Monitoring

Recommended tools:
- `docker-compose logs -f`: View logs
- Google Cloud Console: Monitor API usage
- Anthropic Console: Track API usage and costs
