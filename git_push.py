#!/usr/bin/env python3
import subprocess
import os
import sys

def git_push():
    try:
        # Set environment variables for git authentication
        env = os.environ.copy()
        env['GIT_ASKPASS'] = '/bin/echo'
        env['GIT_USERNAME'] = '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a'
        env['GIT_PASSWORD'] = 'x-oauth-basic'
        
        # Try to push
        result = subprocess.run(
            ['git', 'push', '-u', 'origin', 'main'],
            env=env,
            capture_output=True,
            text=True,
            input='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a\nx-oauth-basic\n'
        )
        
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
        print("Return code:", result.returncode)
        
        if result.returncode == 0:
            print("✅ Git push successful!")
        else:
            print("❌ Git push failed")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    git_push()