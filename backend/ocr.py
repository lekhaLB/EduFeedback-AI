from google.cloud import vision
import io

import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"CREDENTIALS"

from groq import Groq

# Replace "your_api_key" with your actual API key
API_KEY = "YOUR_API_KEY"

# Initialize the Groq client with your API key
client = Groq(api_key=API_KEY)

def extract_handwriting_text(image_path):
    # Initialize the Vision API client
    client = vision.ImageAnnotatorClient()

    # Load the image
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()
    image = vision.Image(content=content)

    # Perform text detection
    response = client.document_text_detection(image=image)  # For dense text
    annotations = response.full_text_annotation

    # Extract detected text
    if annotations:
        print("Extracted Text:")
        print(annotations.text)
        return annotations.text
    else:
        print("No text detected.")
        return None
    

def make_meaningful(text):
    # Prepare the prompt for the Groq API
    prompt = (
        f"i extracted this text from an ocr there are some errors can you correct the text and give it in para format do not add any extra content or any extra explaination only use what is the input provided there are also question numbers on the left hand side extract those too'{text}':\n\n"
       
    )

    # Use Groq's `chat.completions.create` method
    completion = client.chat.completions.create(
        model="llama3-8b-8192",  # Replace with the desired model
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,  # Adjust for creativity
        max_tokens=300,  # Limit response length
        top_p=1,          # Sampling parameter
        stream=True,      # Stream the response
        stop=None,        # Specify stopping criteria if needed
    )

    # Collect the response
    response_text = ""
    for chunk in completion:
        response_text += chunk.choices[0].delta.content or ""
        #print(chunk.choices[0].delta.content or "", end="")  # Print in real-time

    return response_text

# Example usage
image_path = r"C:\Users\91805\Downloads\INTERDEPT_EL\test6.jpg"
# extracted_text = extract_handwriting_text(image_path)
# make_meaningful(extracted_text)
