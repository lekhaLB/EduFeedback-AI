from google.cloud import storage
import os 
import io
def upload_image(bucket_name, image_file, question_number,test_number,subdivision_number, year, course):
    """
    Uploads an image to Google Cloud Storage with custom metadata.
    """
    # Read file content
    contents = image_file.file.read()

    # Wrap in a BytesIO object
    image_stream = io.BytesIO(contents)

    # Initialize the client
    storage_client = storage.Client()

    # Get the bucket
    bucket = storage_client.bucket(bucket_name)

    # Use a unique filename to avoid collisions
    blob = bucket.blob(image_file.filename)

    # Set metadata
    blob.metadata = {
        'questionNumber': str(question_number),
        'year': str(year),
        'course': course,
        'test_number': test_number,
        "subdivision_number": subdivision_number

    }

    # Upload using upload_from_file
    blob.upload_from_file(image_stream, content_type=image_file.content_type)

    # Make it public (optional)
    blob.make_public()

    return blob.public_url

from google.cloud import storage

def perfect_image(bucket_name,question_number,test_number,subdivision_number, year, course):
    """
    Retrieves the public URL of the first image in the bucket that matches the given metadata.
    """
    # Initialize client and get bucket
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # List all blobs in the bucket
    blobs = storage_client.list_blobs(bucket_name)

    for blob in blobs:
        # Reload metadata
        blob.reload()
        metadata = blob.metadata or {}

        # Match all 3 fields
        if (
            metadata.get('questionNumber') == str(question_number)
            and metadata.get('year') == str(year)
            and metadata.get('course') == course
        ):
            # Make public (optional)
            blob.make_public()
            return blob.public_url  # Return immediately after first match

    return None  # Return None if no match found
