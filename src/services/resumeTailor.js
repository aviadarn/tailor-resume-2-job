const Anthropic = require('@anthropic-ai/sdk');
const dotenv = require('dotenv');

dotenv.config();

class ResumeTailorService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async tailorResume(resumeContent, jobDetails) {
    try {
      const prompt = `You are an expert resume writer. Your task is to tailor the following resume to match the job posting.

ORIGINAL RESUME:
${resumeContent}

JOB POSTING:
Title: ${jobDetails.title}
Company: ${jobDetails.company}
Description: ${jobDetails.description}

INSTRUCTIONS:
1. Analyze the job requirements and key skills mentioned in the job posting
2. Rewrite the resume to emphasize relevant experience and skills
3. Use keywords from the job posting naturally throughout the resume
4. Maintain truthfulness - only emphasize existing experiences, do not invent new ones
5. Keep the same overall structure and format
6. Ensure the resume is ATS-friendly (Applicant Tracking System)
7. Focus on accomplishments that align with the job requirements
8. Keep it concise and impactful

Please provide ONLY the tailored resume text, without any additional commentary or explanations.`;

      const message = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Error tailoring resume:', error.message);
      throw new Error(`Failed to tailor resume: ${error.message}`);
    }
  }

  async generateCoverLetter(coverLetterTemplate, resumeContent, jobDetails) {
    try {
      const prompt = `You are an expert career coach. Your task is to generate a compelling cover letter for the job posting.

COVER LETTER TEMPLATE (use as inspiration for tone and structure):
${coverLetterTemplate}

RESUME (for reference about the candidate):
${resumeContent}

JOB POSTING:
Title: ${jobDetails.title}
Company: ${jobDetails.company}
Description: ${jobDetails.description}

INSTRUCTIONS:
1. Write a personalized cover letter for this specific job
2. Address why the candidate is interested in this company and role
3. Highlight 2-3 key accomplishments from the resume that align with the job requirements
4. Show enthusiasm and cultural fit
5. Keep it to 3-4 paragraphs
6. Use a professional but warm tone
7. End with a clear call to action
8. If the template has placeholder text like [Your Name] or [Company], replace with appropriate values

Please provide ONLY the cover letter text, without any additional commentary or explanations.`;

      const message = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0].text;
    } catch (error) {
      console.error('Error generating cover letter:', error.message);
      throw new Error(`Failed to generate cover letter: ${error.message}`);
    }
  }
}

module.exports = { ResumeTailorService };
