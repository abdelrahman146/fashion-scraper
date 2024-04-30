#!/bin/bash

# Check if the source file exists
db_file="prisma/db.sqlite"

if [ ! -f "$db_file" ]; then
    echo "Source file $db_file does not exist. make sure to run the script from root"
    exit 1
fi

# Check if the destination directory is provided
if [ -z "$1" ]; then
    echo "Destination directory is not provided."
    exit 1
fi

# Check if the destination directory exists
if [ ! -d "$1" ]; then
    echo "Destination directory '$1' does not exist."
    exit 1
fi

# Copy the file to the destination directory
cp "$db_file" "$1"

echo "File copied successfully to '$1'."