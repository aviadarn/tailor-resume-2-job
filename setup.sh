#!/bin/bash

echo "========================================="
echo "Resume Tailor Setup Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Warning: Docker is not installed. You'll need Docker to run the service."
    echo "Visit: https://www.docker.com/get-started"
else
    echo "Docker version: $(docker --version)"
fi
echo ""

# Install dependencies
echo "Installing Node.js dependencies..."
npm install
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ".env file created. Please edit it with your credentials."
    echo ""
else
    echo ".env file already exists."
    echo ""
fi

# Create icon placeholders if they don't exist
echo "Setting up Chrome extension icons..."
mkdir -p chrome-extension/icons

# Simple placeholder creation message
if [ ! -f chrome-extension/icons/icon16.png ]; then
    echo "Note: Please add icon files to chrome-extension/icons/"
    echo "Required: icon16.png, icon48.png, icon128.png"
    echo ""
fi

echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit the .env file with your credentials"
echo "2. Follow the README.md for Google Cloud setup"
echo "3. Get your Anthropic API key"
echo "4. Authorize Google access: npm start, then visit http://localhost:3000/auth"
echo "5. Start with Docker: docker-compose up -d"
echo "6. Install the Chrome extension from chrome-extension/ folder"
echo ""
echo "For detailed instructions, see README.md"
