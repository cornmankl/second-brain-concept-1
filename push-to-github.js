const { exec } = require('child_process');
const fs = require('fs');

// Create a temporary git config with credentials
const gitConfig = `
[credential]
    helper = !f() { echo "username=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a"; echo "password=x-oauth-basic"; }; f
`;

fs.writeFileSync('/tmp/.gitconfig', gitConfig);

// Execute git push with custom config
exec('GIT_CONFIG=/tmp/.gitconfig git push -u origin main', (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error);
        console.error('Stderr:', stderr);
        return;
    }
    console.log('Success:', stdout);
});