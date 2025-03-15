#!/bin/bash

# Define the filename
ENV_FILE="../.env"

# Define the content
CONTENT="VIDEO_UPLOAD_DIR=../\nSQL_DIR=../"

# Create the file and write content to it
echo -e "$CONTENT" > "$ENV_FILE"

# Confirm the creation
echo "Environment file '$ENV_FILE' created successfully."
