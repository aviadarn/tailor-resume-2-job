const API_URL = 'http://localhost:3000';

document.getElementById('tailorBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  const linksDiv = document.getElementById('links');
  const button = document.getElementById('tailorBtn');

  try {
    // Get current tab URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const jobUrl = tab.url;

    // Update UI to show processing
    button.disabled = true;
    button.innerHTML = '<div class="spinner"></div> Processing...';
    statusDiv.className = 'status processing';
    statusDiv.textContent = 'Tailoring your resume... This may take a minute.';
    linksDiv.style.display = 'none';

    // Check if Docker container is running
    let healthCheck;
    try {
      healthCheck = await fetch(`${API_URL}/health`);
    } catch (error) {
      throw new Error('Docker container is not running. Please start it with: docker-compose up -d');
    }

    if (!healthCheck.ok) {
      throw new Error('Service is not healthy. Please check Docker logs.');
    }

    // Call the API
    const response = await fetch(`${API_URL}/tailor-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to tailor resume');
    }

    // Show success
    statusDiv.className = 'status success';
    statusDiv.textContent = `Success! Resume tailored for ${data.jobDetails.company} - ${data.jobDetails.title}`;

    // Show links
    linksDiv.innerHTML = `
      <a href="${data.resumeUrl}" target="_blank">Open Tailored Resume</a>
      <a href="${data.coverLetterUrl}" target="_blank">Open Cover Letter</a>
    `;
    linksDiv.style.display = 'block';

    // Re-enable button
    button.disabled = false;
    button.textContent = 'Tailor Another Resume';

  } catch (error) {
    console.error('Error:', error);
    statusDiv.className = 'status error';
    statusDiv.textContent = `Error: ${error.message}`;
    button.disabled = false;
    button.textContent = 'Try Again';
  }
});
