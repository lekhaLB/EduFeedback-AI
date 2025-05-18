# 🤖 LLM-Based Script Review and Feedback with Performance Analytics Dashboard

An intelligent system that automates the evaluation of handwritten student answers using LLMs and OCR. It provides detailed feedback, recommends textbook references, and visualizes student performance through a dynamic dashboard.

---

## Features

- **Automated Script Evaluation**  
  Uses LLMs to compare student answers with model answers and generate contextual feedback.

- **OCR Integration**  
  Extracts handwritten text from images using Google Cloud Vision API.

- **Textbook Recommendation**  
  Suggests relevant textbook pages based on semantic similarity with student answers.

- **Cloud Image Management**  
  Uploads and serves answer images using Google Cloud Storage.

- **Performance Dashboard**  
  Visualizes student performance trends and feedback through interactive charts.

- **Course & Question Management**  
  Upload and manage questions, model answers, and textbook PDFs.

- **Re-evaluation Support**  
  Allows re-analysis of answers if model answers or questions are updated.

- **RESTful API**  
  Endpoints for answer upload, feedback retrieval, course setup, and history tracking.

---

## Project Structure

├── comparisons.py # FastAPI app: main API endpoints

├── embeddings.py # Embedding generation and semantic search

├── image_upload.py # Google Cloud Storage integration

├── ocr.py # OCR + LLM-based text correction

├── dashboard/ # (Optional) Dashboard frontend (e.g., Streamlit/React)


---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/lekhaLB/llm-script-feedback.git
cd llm-script-feedback
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Set the following environment variables:

GOOGLE_APPLICATION_CREDENTIALS: Path to Google Cloud JSON key

MONGODB_URI: Your MongoDB connection string

GROQ_API_KEY: Your Groq LLM API key

### 4. Run the Backend Server

uvicorn comparisons:app --reload
🔗 API Endpoints
Answer Evaluation
POST /upload – Upload a student answer image → receive feedback + recommended textbook pages

POST /upload_img – Upload for comparison with perfect/imperfect answers → get improvement suggestions

### ourse & Question Management
POST /upload_question – Upload and store a new question (image → text)

POST /add_course – Add a new course with reference textbook PDF

### User & Answer History
POST /history – Retrieve a user's full feedback and answer history

POST /reevaluate – Re-evaluate an answer after updates to model answers or question

POST /delete_answer – Delete an answer record

### File Descriptions

| File              | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `comparisons.py`  | Core API app; handles main operations                                |
| `embeddings.py`   | Generates embeddings from textbook PDFs and matches answers to pages |
| `ocr.py`          | Extracts and refines handwritten answer text using OCR and LLM       |
| `image_upload.py` | Manages image storage on Google Cloud                                |
| `dashboard/`      | (Optional) Frontend for analytics (Streamlit/React, etc.)            |

### Example Usage
Upload an Answer

curl -X POST "http://localhost:8000/upload" \
-F "year=2024" \
-F "usn=1RV20CS001" \
-F "course=CS231AI" \
-F "test_number=2" \
-F "question_number=1" \
-F "question=Explain paging in OS" \
-F "subdivision_number=a" \
-F "score=3" \
-F "image=@/path/to/answer.jpg"


Add a Course 
curl -X POST "http://localhost:8000/add_course" \
-F "course_code=CS231AI" \
-F "reference_textbook=Galvin OS" \
-F "course_title=Operating Systems" \
-F "image=@/path/to/textbook.pdf"


