const axios = require('axios');
const cheerio = require('cheerio');

class JobScraperService {
  async scrapeJob(jobUrl) {
    try {
      // Fetch the job posting page
      const response = await axios.get(jobUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Generic scraping - tries to extract common patterns
      // This can be customized for specific job boards (LinkedIn, Indeed, etc.)
      let jobDetails = {
        url: jobUrl,
        title: '',
        company: '',
        description: '',
        requirements: '',
        raw: '',
      };

      // Try to extract job title (common patterns)
      const titleSelectors = [
        'h1',
        '.job-title',
        '[class*="title"]',
        '[class*="job-title"]',
        '[data-automation="jobTitle"]',
      ];

      for (const selector of titleSelectors) {
        const title = $(selector).first().text().trim();
        if (title && title.length > 5 && title.length < 200) {
          jobDetails.title = title;
          break;
        }
      }

      // Try to extract company name
      const companySelectors = [
        '.company-name',
        '[class*="company"]',
        '[data-automation="companyName"]',
        'a[href*="company"]',
      ];

      for (const selector of companySelectors) {
        const company = $(selector).first().text().trim();
        if (company && company.length > 2 && company.length < 100) {
          jobDetails.company = company;
          break;
        }
      }

      // Extract job description
      const descriptionSelectors = [
        '.job-description',
        '[class*="description"]',
        '[class*="job-details"]',
        'article',
        'main',
      ];

      for (const selector of descriptionSelectors) {
        const description = $(selector).first().text().trim();
        if (description && description.length > 100) {
          jobDetails.description = description;
          break;
        }
      }

      // Fallback: get all body text if specific selectors don't work
      if (!jobDetails.description) {
        jobDetails.description = $('body').text().trim();
      }

      // Clean up the description
      jobDetails.description = this.cleanText(jobDetails.description);
      jobDetails.raw = jobDetails.description;

      // Try to extract requirements section
      const requirementsKeywords = [
        'requirements',
        'qualifications',
        'skills',
        'must have',
        'required',
      ];

      const lines = jobDetails.description.split('\n');
      let requirementsStarted = false;
      let requirementsLines = [];

      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (requirementsKeywords.some((keyword) => lowerLine.includes(keyword))) {
          requirementsStarted = true;
        }
        if (requirementsStarted) {
          requirementsLines.push(line);
          // Stop at next major section
          if (
            requirementsLines.length > 3 &&
            (lowerLine.includes('about us') ||
              lowerLine.includes('benefits') ||
              lowerLine.includes('how to apply'))
          ) {
            break;
          }
        }
      }

      jobDetails.requirements = requirementsLines.join('\n').trim();

      // Fallback values if extraction failed
      if (!jobDetails.title) {
        jobDetails.title = 'Position';
      }
      if (!jobDetails.company) {
        jobDetails.company = 'Company';
      }

      return jobDetails;
    } catch (error) {
      console.error('Error scraping job:', error.message);

      // If scraping fails, return minimal job details
      return {
        url: jobUrl,
        title: 'Position',
        company: 'Company',
        description: `Job posting at ${jobUrl}`,
        requirements: '',
        raw: '',
        error: error.message,
      };
    }
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
      .trim();
  }
}

module.exports = { JobScraperService };
