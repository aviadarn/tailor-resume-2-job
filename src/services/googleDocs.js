const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

class GoogleDocsService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });
    }

    this.docs = google.docs({ version: 'v1', auth: this.oauth2Client });
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.file',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async getTokensFromCode(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  async getDocumentContent(documentId) {
    try {
      const response = await this.docs.documents.get({
        documentId: documentId,
      });

      // Extract text content from the document
      const content = response.data.body.content;
      let text = '';

      const extractText = (elements) => {
        for (const element of elements) {
          if (element.paragraph) {
            for (const textElement of element.paragraph.elements || []) {
              if (textElement.textRun && textElement.textRun.content) {
                text += textElement.textRun.content;
              }
            }
          } else if (element.table) {
            for (const row of element.table.tableRows || []) {
              for (const cell of row.tableCells || []) {
                extractText(cell.content || []);
              }
            }
          }
        }
      };

      extractText(content || []);
      return text;
    } catch (error) {
      console.error('Error fetching document:', error.message);
      throw new Error(`Failed to fetch document: ${error.message}`);
    }
  }

  async createDocument(title, content, folderId = null) {
    try {
      // Create a new document
      const createResponse = await this.docs.documents.create({
        requestBody: {
          title: title,
        },
      });

      const documentId = createResponse.data.documentId;

      // Insert content into the document
      await this.docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: {
                  index: 1,
                },
                text: content,
              },
            },
          ],
        },
      });

      // Move document to folder if folderId is provided
      if (folderId) {
        await this.drive.files.update({
          fileId: documentId,
          addParents: folderId,
          fields: 'id, parents',
        });
      }

      // Get shareable link
      const file = await this.drive.files.get({
        fileId: documentId,
        fields: 'webViewLink',
      });

      return file.data.webViewLink;
    } catch (error) {
      console.error('Error creating document:', error.message);
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }
}

module.exports = { GoogleDocsService };
