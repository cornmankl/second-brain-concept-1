#!/bin/bash

# Simple git push script
echo "Attempting to push to GitHub..."

# Set the remote URL with authentication
git remote set-url origin https://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a@github.com/cornmankl/second-brain-concept-1.git

# Try to push
echo "Username: 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a"
echo "Password: x-oauth-basic"

git push -u origin main

echo "Push completed."