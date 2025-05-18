
from groq import Groq
import os


import base64


from pymongo import MongoClient

from fastapi import FastAPI, File, UploadFile, Form, Depends
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

from ocr import extract_handwriting_text, make_meaningful

import embeddings

from image_upload import upload_image, perfect_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Allows all origins. Replace with specific domains if needed.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.).
    allow_headers=["*"],  # Allows all headers.
)


# Connect to MongoDB
# Adjust connection string as needed
client = MongoClient(
    "CONNECTION_STRING")
db = client["AutoFeedback"]  # Replace with your database name
collection = db["answers"]  # Replace with your collection name
collection2 = db["questions"]  # Replace with your collection name
collection3 = db["courses"]  # Replace with your collection name

# Replace "your_api_key" with your actual API key
API_KEY = "YOUR_API_KEY"

# Initialize the Groq client with your API key
client = Groq(api_key=API_KEY)


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def evaluate_with_groq(perfect_answers, given_answer, question):
    # Prepare the prompt for the Groq API
    prompt = (
        f"Below are perfect answers to the question '{question}':\n\n"
        + "\n\n".join([f"Example {i+1}:\n{answer}" for i,
                      answer in enumerate(perfect_answers)])
        + f"\n\nNow evaluate the following answer:\n\n{given_answer}\n\n"
        + "Identify missing points (if any) in the given answer compared to the perfect answers and list them:\n"
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
        print(chunk.choices[0].delta.content or "",
              end="")  # Print in real-time

    return response_text

# Example usage

# perfect_answers = [
#     """Operating system structures aim to enhance modularity, simplicity, and flexibility. Key approaches include:
# Simple Structure:
# Minimal modularity, with direct hardware access.
# Quick and efficient for simple systems.
# Example: MS-DOS, early UNIX.
# Layered Approach:
# Layers built on each other (hardware at the bottom, user interface at the top).
# Simplifies debugging and error isolation.
# Ensures abstraction between layers.
# Microkernels:
# Kernel contains only essential services (e.g., process, memory management).
# Improved security with minimal kernel code.
# Communication via message passing.
# Modular Approach:
# Dynamically loadable and independent modules.
# Flexible and easy for updates or new features.
# Used in modern Linux and Windows systems.
# Hybrid Systems:
# Combines monolithic and microkernel features.
# Balances performance, flexibility, and modularity.
# Examples: Windows NT, macOS.""",

#     """Operating system structures help manage complexity and ensure modularity. Common approaches:
# Simple Structure: Direct hardware access, limited modularity, and high vulnerability (e.g., MS-DOS).
# Layered Approach: Organized layers, simplified debugging, and abstraction of lower-layer details.
# Microkernels: Minimal kernel with message-passing communication, ensuring modularity and stability.
# Modular Approach: Loadable modules for flexibility and ease of updates.
# Hybrid Systems: Combines features for balance and efficiency, as seen in Windows NT.
# Example: Microkernels use minimal services in the kernel, leading to secure and scalable systems.""",

#     """The key structures of operating systems are:
# Simple Structure:
# Lacks modularity; hard to maintain.
# Direct access to hardware.
# Examples: MS-DOS, early UNIX.
# Layered Approach:
# OS divided into layers for modularity.
# Simplifies testing and error handling.
# Overhead due to inter-layer communication.
# Microkernels:
# Moves nonessential services to user space.
# Ensures better security and modularity.
# Example: Mach OS.
# Modular Approach:
# Modules can be updated independently.
# Supports dynamic loading for flexibility.
# Hybrid Systems:
# Uses both monolithic and microkernel features.
# Combines performance and modularity.""",

#     """Operating system structures are designed for simplicity and flexibility by dividing the system into smaller components or modules. Approaches include:
# Simple Structure: Lacks clear modularity, as seen in MS-DOS and early UNIX.
# Layered Approach: Organizes the OS into layers, each using the one below it. Debugging is easier, but performance can suffer.
# Microkernels: Minimizes the kernel, with nonessential services running in user space. Ensures better modularity and security.
# Modular Approach: Uses dynamic modules for flexibility.
# Hybrid Systems: Combines structures for efficiency.
# For instance, the layered approach simplifies debugging by isolating errors within specific layers, ensuring modularity and easier maintenance.""",

#     """Operating system structures are designed to improve modularity, simplicity, and adaptability. The main approaches include:
# Simple Structure:
# Limited modularity, with direct hardware interaction.
# Optimized for straightforward systems.
# Example: MS-DOS, early versions of UNIX.
# Layered Approach:
# Organized into hierarchical layers (hardware at the base, user interface at the top).
# Facilitates debugging and error isolation.
# Promotes abstraction between levels.
# Microkernels:
# Kernel contains only core services (e.g., process and memory management).
# Enhanced security with minimal kernel size.
# Relies on message passing for communication.
# Modular Approach:
# Independent, dynamically loadable modules.
# Highly flexible and supports seamless updates or feature additions.
# Examples: Modern Linux and Windows kernels.
# Hybrid Systems:
# Combines aspects of monolithic and microkernel architectures.
# Achieves a balance between performance, modularity, and adaptability.
# Examples: Windows NT, macOS."""


# ]

# given_answer =     """Approaches to operating system design are crafted to enhance functionality, modularity, and ease of maintenance, each suited to specific requirements:
# Simple Structure:
# This approach integrates basic functionality with minimal abstraction, providing straightforward operations. However, it lacks modularity, making it prone to system crashes when applications misbehave. Examples include MS-DOS and early UNIX, where hardware and software interacted directly.
# Layered Approach:
# In this design, the OS is divided into hierarchical layers, each built on the one below it. The bottom layer interacts with hardware, while the top provides the user interface. This arrangement simplifies debugging and testing, as each layer operates independently using lower-level functions. A notable example is THE operating system.

# Modular Approach:
# Modern systems adopt this structure, allowing dynamically loadable modules that enable seamless updates or feature additions. It provides flexibility and is widely used in Linux and Windows.
# """
# question = "List the approaches to design operating system structure"
# question = "List the approaches to design operating system structure"

# Call the Groq evaluation function
# try:
#     evaluation = evaluate_with_groq(perfect_answers, given_answer, question)
#     # print("\n\nEvaluation Result:")
#     # print(evaluation)

#     document = {
#     "year": "2024",
#     "course": "CS231AI",
#     "course_title": "Operating systems",
#     "question_number": 1,
#     "test_number": 2,
#     "subdivision_number": "a",
#     "topic": "operating system structure",
#     "score": 3,
#     "max_score": 5,
#     "evaluated_score": 0.8,
#     "BT_level": 2,
#     "feedback": evaluation,
#     "page_numbers": [4],  # Array of page numbers
#     "reference_textbook": "Galvin OS",
#     "text": """Approaches to operating system design are crafted to enhance functionality, modularity, and ease of maintenance, each suited to specific requirements:
#     Simple Structure:
#     This approach integrates basic functionality with minimal abstraction, providing straightforward operations. However, it lacks modularity, making it prone to system crashes when applications misbehave. Examples include MS-DOS and early UNIX, where hardware and software interacted directly.
#     Layered Approach:
#     In this design, the OS is divided into hierarchical layers, each built on the one below it. The bottom layer interacts with hardware, while the top provides the user interface. This arrangement simplifies debugging and testing, as each layer operates independently using lower-level functions. A notable example is THE operating system.

#     Modular Approach:
#     Modern systems adopt this structure, allowing dynamically loadable modules that enable seamless updates or feature additions. It provides flexibility and is widely used in Linux and Windows.
#     """

#     }
#     result = collection.insert_one(document)
#     print("Document inserted with ID:", result.inserted_id)
# except Exception as e:
#     print("Error:", e)

class UploadRequest(BaseModel):
    usn: str
    year: str
    course: str
    test_number: int
    question_number: int
    question_text: str
    subdivision_number: str
    score: int


class UploadQuestion(BaseModel):
    year: str
    course_code: str
    test_number: int
    question_number: int
    question_text: str
    max_score: int
    subdivision_number: str
    BT_level: int


class AddCourseRequest(BaseModel):
    course_code: str
    reference_textbook: str
    course_title: str


class UserRequest(BaseModel):
    usn: str


class DeleteRequest(BaseModel):
    usn: str
    year: str
    course: str
    test_number: int
    question_number: int
    subdivision_number: str


class SummaryRequest(BaseModel):
    usn: str          # Changed from student_id
    course_code: str  # Changed from course_id
    test_number: int  # Changed from test_id


@app.post("/upload")
async def feedback(year: str = Form(...),
                   usn: str = Form(...),
                   course: str = Form(...),
                   test_number: int = Form(...),
                   question_number: int = Form(...),
                   question: str = Form(...),
                   subdivision_number: str = Form(...),
                   score: int = Form(...),
                   image: UploadFile = File(...),):
#Our main logic
    


@app.post("/upload_img")
async def feedback_img(year: str = Form(...),
                       usn: str = Form(...),
                       course: str = Form(...),
                       test_number: int = Form(...),
                       question_number: int = Form(...),
                       question: str = Form(...),
                       subdivision_number: str = Form(...),
                       score: int = Form(...),
                       image: UploadFile = File(...),):

#our logic for upload image


@app.post("/upload_question")
async def upload_question(
    year: str = Form(...),
    course_code: str = Form(...),
    test_number: int = Form(...),
    question_number: int = Form(...),
    max_score: int = Form(...),
    subdivision_number: str = Form(...),
    BT_level: int = Form(...),
    question_type: str = Form(...),
    image: UploadFile = File(...),
):
    # Save the uploaded image
    image_location = f"./uploads/{image.filename}"
    with open(image_location, "wb") as f:
        f.write(await image.read())

    # Extract only the question text from the image
    extracted_text = extract_handwriting_text(image_location)
    question_text = make_meaningful(extracted_text)

    # Remove the saved image after processing
    os.remove(image_location)

    # Construct the document
    document = {
        "year": year,
        "test_number": test_number,
        "question_number": question_number,
        "subdivision_number": subdivision_number,
        "max_score": max_score,
        "course_code": course_code,
        "BT_level": BT_level,
        "question_text": question_text,  # Extracted from image
        "question_type": question_type
    }

    # Insert into the database
    result = collection2.insert_one(document)

    return {"message": "Question uploaded successfully", "question_text": question_text}


@app.post("/history")
async def get_user_history(request: UserRequest):
    usn = request.usn
    # Retrieve all documents associated with this user (usn)
    user_history = collection.find({"usn": usn})

    all_questions = collection2.find()
    feedbacks = []
    # Prepare a list of the user's historical data

    history = []
    for question in all_questions:
        # do find operation with courses collection
        course_details = collection3.find_one(
            {"course_code": question["course_code"]})

        record = collection.find_one({"usn": usn, "year": question["year"], "course": question["course_code"], "test_number": question[
                                     "test_number"], "subdivision_number": question["subdivision_number"], "question_number": question["question_number"], })
        if record == None:
            history.append({"year": question["year"],
                            "course": question["course_code"],
                            "course_title": course_details["course_title"],
                            "question_number": question["question_number"],
                            "question_text": question["question_text"],
                            "test_number": question["test_number"],
                            "subdivision_number": question["subdivision_number"],
                            "BT_level": question["BT_level"],
                            "max_score": question["max_score"],
                            "question_type": question["question_type"],
                            "exists": 0})
        else:
            history.append({
                "year": question["year"],
                "course": question["course_code"],
                "course_title": course_details["course_title"],
                "question_number": question["question_number"],
                "question_text": question["question_text"],
                "test_number": question["test_number"],
                "subdivision_number": question["subdivision_number"],
                "BT_level": question["BT_level"],
                "max_score": question["max_score"],
                "topic": record["topic"],
                "score": record["score"],
                "evaluated_score": record["evaluated_score"],
                "feedback": record["feedback"],
                "page_numbers": record["page_numbers"],
                "reference_textbook": course_details["reference_textbook"],
                "text": record["text"],
                "question_type": question["question_type"],
                "exists": 1
            })

    return {"user_history": history}


@app.post("/add_course")
# async def add_course(request: AddCourseRequest):
async def add_course(course_code: str = Form(...),
                     reference_textbook: str = Form(...),
                     course_title: str = Form(...),
                     image: UploadFile = File(...),):
    # course_code = request.course_code
    # reference_textbook = request.reference_textbook
    # course_title = request.course_title

    image_location = f"./uploads/{image.filename}"
    with open(image_location, "wb") as f:
        f.write(await image.read())

    pages = embeddings.split_pdf_by_page(image_location)
    embeddings.generate_page_embeddings(pages, course_code)

    os.remove(image_location)

    document = {
        "course_code": course_code,
        "reference_textbook": reference_textbook,
        "course_title": course_title
    }

    result = collection3.insert_one(document)

    return {"message": "Course added successfully"}


@app.post("/reevaluate")
async def reevaluate(
    usn: str = Form(...),
    year: str = Form(...),
    course: str = Form(...),
    test_number: int = Form(...),
    question_number: int = Form(...),
    subdivision_number: str = Form(...),
):
    # Query to find the original answer document
    query = {
        "usn": usn,
        "year": year,
        "course": course,
        "test_number": test_number,
        "question_number": question_number,
        "subdivision_number": subdivision_number,
    }



@app.post("/delete_answer")
async def delete_answer(request: DeleteRequest):
    # Create a query to find the specific answer
    query = {
        "usn": request.usn,
        "year": request.year,
        "course": request.course,
        "test_number": request.test_number,
        "question_number": request.question_number,
        "subdivision_number": request.subdivision_number
    }

    # Try to delete the document
    result = collection.delete_one(query)

    # Check if a document was actually deleted
    if result.deleted_count == 0:
        return {"message": "No answer found to delete"}

    return {"message": "Answer deleted successfully"}


@app.get("/bt_level_distribution_all")
async def bt_level_distribution_all():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "year": "$year",
                        "course_code": "$course_code",
                        "BT_level": "$BT_level"
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {
                    "_id.year": 1,
                    "_id.course_code": 1,
                    "_id.BT_level": 1
                }
            }
        ]

        result = list(collection2.aggregate(pipeline))

        # Transform the result for easier consumption
        data = []
        for doc in result:
            data.append({
                "year": doc["_id"]["year"],
                "course_code": doc["_id"]["course_code"],
                "BT_level": doc["_id"]["BT_level"],
                "count": doc["count"]
            })

        return {"bt_level_distribution_per_year_course": data}

    except Exception as e:
        return {"error": str(e)}


def summarize_feedback(feedback: str) -> str:
    """Condense feedback into key missed concepts using Groq"""
    prompt = (
        f"Identify and concisely summarize the main deficiencies from this feedback:\n\n{feedback}\n\n"
        "Return only the key points as bullet points (max 3)."
    )

    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=150
    )
    return completion.choices[0].message.content


def summarize_combined_feedback(feedback_summaries: list) -> str:
    """
    Use Groq LLM to combine and generalize feedbacks from all questions
    into a single test-level summary.
    """
    if not feedback_summaries:
        return "No significant deficiencies found in this test."
    combined = "\n".join(feedback_summaries)
    prompt = (
        "Below are feedback summaries for different questions from a student's test.\n"
        "highlight important topics that the student doesnt understand,"
        "describe the student's overall strengths and weaknesses, "

        "recurring issues, and provide actionable advice for improvement at the test level.\n\n"
        "keep it brief"
        "focus more on important topics that the student doesnt understand than the generic feedback,"
        "write it as if u are talking to the student in first person"
        f"{combined}\n\n"

    )
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=200
    )
    # Adjust if your Groq client returns the message differently
    return completion.choices[0].message.content if hasattr(completion.choices[0], "message") else completion.choices[0].delta.content


@app.post("/generate_summary_feedback")
async def generate_summary_feedback(request: SummaryRequest):
    try:
        usn = request.usn
        course_code = request.course_code
        test_number = request.test_number

        answers = list(collection.find({
            "usn": usn,
            "course": course_code,
            "test_number": test_number
        }))

        if not answers:
            return {"message": "No answers found for this test."}

        total_score = 0
        max_total = 0
        page_refs = []
        topic_strength = {}
        missed_concepts = []

        for ans in answers:
            score = ans.get("score", 0)
            max_score = ans.get("max_score", 5)
            feedback = ans.get("feedback", "")
            pages = ans.get("page_numbers", [])
            topic = ans.get("topic", "Unknown Topic")

            total_score += score
            max_total += max_score
            page_refs.extend(pages)

            # Analyze feedback for missed concepts
            if any(x in feedback.lower() for x in ["missing", "lack", "not mentioned"]):
                summarized = summarize_feedback(feedback)
                missed_concepts.append({
                    "topic": topic,
                    "feedback_summary": summarized,
                    "pages": pages
                })

            topic_strength.setdefault(topic, []).append(score / max_score)

        strengths = [topic for topic, scores in topic_strength.items() if sum(
            scores)/len(scores) >= 0.7]
        weaknesses = [
            topic for topic in topic_strength if topic not in strengths]

        textbook_refs = sorted(set([f"Page {p}" for p in page_refs]))
        percentage = round((total_score/max_total)*100,
                           2) if max_total > 0 else 0

        # Combine all feedback_summary fields and generalize at test level
        all_feedback_summaries = [mc["feedback_summary"]
                                  for mc in missed_concepts if "feedback_summary" in mc]
        combined_feedback_summary = summarize_combined_feedback(
            all_feedback_summaries)

        return {
            "usn": usn,
            "course_code": course_code,
            "test_number": test_number,
            "summary": {


                "combined_feedback_summary": combined_feedback_summary,
                "textbook_references": textbook_refs,

            }
        }
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))


# eg usage
# given_answer =     """User threads, managed by application-level libraries, offer lightweight and quick thread management but cannot run on multiple cores as the kernel doesn’t recognize them. The relationship between user and kernel threads can follow many-to-one, one-to-one, or many-to-many mapping models, balancing performance and efficiency based on application needs.
# """
# year = "2024"
# course = "CS231AI"
# test_number = 2
# question_number = 2
# subdivision_number = "a"
# score = 2

# feedback(given_answer, year, course, test_number, question_number, subdivision_number, score)


# TESTING
# 2025 cs231ai test 2 question 3a
