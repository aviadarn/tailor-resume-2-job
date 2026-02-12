const express = require('express');
const dotenv = require('dotenv');
const { GoogleDocsService } = require('./services/googleDocs');
const { JobScraperService } = require('./services/jobScraper');
const { ResumeTailorService } = require('./services/resumeTailor');

dotenv.config();

const app = express();
app.use(express.json());

const googleDocsService = new GoogleDocsService();
const jobScraperService = new JobScraperService();
const resumeTailorService = new ResumeTailorService();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Tailor Service is running' });
});

// OAuth callback endpoint for Google
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokens = await googleDocsService.getTokensFromCode(code);
    res.send(`
      <h1>Authorization Successful!</h1>
      <p>Add this refresh token to your .env file:</p>
      <pre>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
    `);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Main endpoint to tailor resume
app.post('/tailor-resume', async (req, res) => {
  try {
    const { jobUrl } = req.body;

    if (!jobUrl) {
      return res.status(400).json({ error: 'jobUrl is required' });
    }

    console.log('Starting resume tailoring process...');
    console.log('Job URL:', jobUrl);

    // Step 1: Fetch original resume from Google Docs
    console.log('Fetching resume from Google Docs...');
    const resumeContent = await googleDocsService.getDocumentContent(
      process.env.RESUME_DOC_ID
    );

    // Step 2: Fetch cover letter template
    console.log('Fetching cover letter template...');
    const coverLetterTemplate = await googleDocsService.getDocumentContent(
      process.env.COVER_LETTER_TEMPLATE_DOC_ID
    );

    // Step 3: Scrape job posting
    console.log('Scraping job posting...');
    const jobDetails = await jobScraperService.scrapeJob(jobUrl);

    // Step 4: Tailor resume
    console.log('Tailoring resume...');
    const tailoredResume = await resumeTailorService.tailorResume(
      resumeContent,
      jobDetails
    );

    // Step 5: Generate cover letter
    console.log('Generating cover letter...');
    const coverLetter = await resumeTailorService.generateCoverLetter(
      coverLetterTemplate,
      resumeContent,
      jobDetails
    );

    // Step 6: Upload tailored resume to Google Docs
    console.log('Uploading tailored resume to Google Docs...');
    const resumeDocUrl = await googleDocsService.createDocument(
      `Resume - ${jobDetails.company} - ${jobDetails.title}`,
      tailoredResume,
      process.env.OUTPUT_FOLDER_ID
    );

    // Step 7: Upload cover letter to Google Docs
    console.log('Uploading cover letter to Google Docs...');
    const coverLetterDocUrl = await googleDocsService.createDocument(
      `Cover Letter - ${jobDetails.company} - ${jobDetails.title}`,
      coverLetter,
      process.env.OUTPUT_FOLDER_ID
    );

    console.log('Process completed successfully!');

    res.json({
      success: true,
      message: 'Resume and cover letter tailored successfully',
      resumeUrl: resumeDocUrl,
      coverLetterUrl: coverLetterDocUrl,
      jobDetails: {
        company: jobDetails.company,
        title: jobDetails.title,
      },
    });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    res.status(500).json({
      error: 'Failed to tailor resume',
      message: error.message,
    });
  }
});

// Start OAuth flow
app.get('/auth', (req, res) => {
  const authUrl = googleDocsService.getAuthUrl();
  res.redirect(authUrl);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`To authorize Google Docs access, visit: http://localhost:${PORT}/auth`);
});
