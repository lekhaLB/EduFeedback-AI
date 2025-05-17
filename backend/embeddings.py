from pdfplumber import open as pdf_open
from transformers import AutoTokenizer, AutoModel
import torch
from scipy.spatial.distance import cosine
from pymongo import MongoClient

# Connect to MongoDB
# Adjust connection string as needed
client = MongoClient(
    "mongodb+srv://rohanjsrinivas:Rohan1920!@userdata.iwn9c.mongodb.net/")
db = client["AutoFeedback"]  # Replace with your database name



# def split_pdf_by_page(pdf_path):
#     """
#     Split the content of a PDF into separate pages.

#     :param pdf_path: Path to the PDF file.
#     :return: List of dictionaries with page numbers and their corresponding content.
#     """
#     with pdf_open(pdf_path) as pdf:
#         pages_content = []
#         for i, page in enumerate(pdf.pages, start=1):  # Start page numbering from 1
#             text = page.extract_text()  # Extract text from the page
#             pages_content.append({"page_number": i, "content": text})
#     return pages_content


# def generate_page_embeddings(pages, model_name="sentence-transformers/all-MiniLM-L6-v2"):
#     """
#     Generate vector embeddings for each page's content.

#     :param pages: List of pages with text content.
#     :param model_name: Pre-trained transformer model for generating embeddings.
#     :return: List of pages with their embeddings.
#     """
#     tokenizer = AutoTokenizer.from_pretrained(model_name)
#     model = AutoModel.from_pretrained(model_name)

#     embeddings = []
#     for page in pages:
#         content = page["content"]
#         if content:  # Only process non-empty content
#             inputs = tokenizer(content, return_tensors="pt",
#                                truncation=True, padding=True)
#             with torch.no_grad():
#                 outputs = model(**inputs)
#                 # Mean pooling to get a single vector for the page
#                 embedding = outputs.last_hidden_state.mean(
#                     dim=1).squeeze().numpy()
#             embeddings.append(
#                 {"page_number": page["page_number"], "embedding": embedding})
#             # Create the document
#             document = {
#                 "page": page["page_number"],
#                 "embedding": embedding.tolist(),  # Convert to list for MongoDB storage
#             }
#             result = collection.insert_one(document)
#             print("Document inserted with ID:", result.inserted_id)
#         else:
#             embeddings.append(
#                 {"page_number": page["page_number"], "embedding": None})

#     return embeddings

def fetch_page_embeddings_from_db(course_code):
    """
    Fetch page embeddings from the MongoDB collection.

    :return: List of dictionaries with page numbers and their corresponding embeddings.
    """
    collection = db[course_code]  # Replace with your collection name
    documents = collection.find({})
    page_embeddings = []
    for doc in documents:
        page_embeddings.append({
            "page_number": doc["page"],
            "embedding": doc["embedding"]  # Stored as a list in MongoDB
        })
    return page_embeddings


def generate_query_embedding(query, model_name="sentence-transformers/all-MiniLM-L6-v2"):
    """
    Generate an embedding for the input query.

    :param query: The question or query text.
    :param model_name: Pre-trained transformer model for generating embeddings.
    :return: Numpy array representing the query embedding.
    """
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)

    # Tokenize and encode the query
    inputs = tokenizer(query, return_tensors="pt",
                       truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        # Mean pooling to get a single vector
        query_embedding = outputs.last_hidden_state.mean(
            dim=1).squeeze().numpy()
    return query_embedding


def find_top_n_similar_pages(query_embedding, page_embeddings, top_n=5):
    """
    Find the top N pages closest to the query embedding based on cosine similarity.

    :param query_embedding: Embedding vector for the query.
    :param page_embeddings: List of page embeddings.
    :param top_n: Number of top pages to return.
    :return: List of tuples containing page numbers and similarity scores.
    """
    similarities = []

    for page in page_embeddings:
        if page["embedding"] is not None:  # Skip pages without embeddings
            similarity = 1 - cosine(query_embedding, page["embedding"])
            similarities.append((page["page_number"], similarity))

    # Sort by similarity in descending order and take the top N
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Return the top N similar pages
    return similarities[:top_n]


# # Example usage
# pdf_path = "Galvin OS Book.pdf"
# pages = split_pdf_by_page(pdf_path)
# embeddings = generate_page_embeddings(pages)

# # Remove last page embedding if necessary
# if embeddings and embeddings[-1]["embedding"] is None:
#     embeddings.pop()

# # Display the content of each page
# for page in embeddings:
#     print(f"Page {page['page_number']} Embedding: {
#           page['embedding'][:5]}...")  # Show first 5 dimensions

# query = """1. Hybrid Systems: The description of hybrid systems does not mention the potential overhead due to inter-layer communication in the layered approach.
# 2. Simple Structure: The given answer does not mention the high vulnerability of the simple structure due to its lack of modularity.
# 3. Microkernels: The description of microkernels does not highlight the improved security that results from having minimal kernel code.
# 4. Modular Approach: The given answer does not mention that the modular approach can be used for dynamic loading of modules for flexibility.
# The provided answer covers the main approaches to operating system design, including their characteristics, advantages, and examples. However, it lacks some details mentioned in the examples, such as the potential drawbacks of the simple structure and the benefits of microkernels."""
# query_embedding = generate_query_embedding(query)

# # Find the closest matching pages
# top_pages = find_top_n_similar_pages(query_embedding, embeddings, top_n=5)

# # Display the top 5 most similar pages with similarity scores
# for page_num, sim in top_pages:
#     print(f"Page {page_num} with similarity score {sim:.4f}")


# Example usage:
# query = """1. Hybrid Systems: The description of hybrid systems does not mention the potential overhead due to inter-layer communication in the layered approach.
# 2. Simple Structure: The given answer does not mention the high vulnerability of the simple structure due to its lack of modularity.
# 3. Microkernels: The description of microkernels does not highlight the improved security that results from having minimal kernel code.
# 4. Modular Approach: The given answer does not mention that the modular approach can be used for dynamic loading of modules for flexibility.      
# The provided answer covers the main approaches to operating system design, including their characteristics, advantages, and examples. However, it lacks some details mentioned in the examples, such as the potential drawbacks of the simple structure and the benefits of microkernels."""

# query_embedding = generate_query_embedding(query)

# # Fetch embeddings from database
# page_embeddings = fetch_page_embeddings_from_db()

# # Find the top 5 most similar pages
# top_pages = find_top_n_similar_pages(query_embedding, page_embeddings, top_n=5)

# top_page_numbers = [page_num for page_num, _ in top_pages]

# print(top_page_numbers)
