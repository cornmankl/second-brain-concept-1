#!/bin/bash

# Git authentication helper script
# This script provides credentials to git when prompted

if [ "$1" = "get" ]; then
    if [ "$2" = "username" ]; then
        echo "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a"
    elif [ "$2" = "password" ]; then
        echo "x-oauth-basic"
    fi
fi