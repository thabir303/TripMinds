from fastapi import FastAPI, File, UploadFile, HTTPException, Query
import cloudinary.uploader
from sentence_transformers import SentenceTransformer
import requests
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import cloudinary

# Load environment variables
load_dotenv()

# Configure Cloudinary
cloudinary.config(
  cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
  api_key=os.getenv('CLOUDINARY_API_KEY'),
  api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

app = FastAPI()

# Allow CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face API for captioning
API_URL = "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning"
headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}

# Load the embedding model for query embeddings
embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def generate_caption(image):
    response = requests.post(API_URL, headers=headers, data=image)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error from Hugging Face API")
    return response.json()

def generate_embeddings(text):
    return embedder.encode(text, convert_to_tensor=True)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), album: str = None):
    image_bytes = await file.read()

    # Upload image to Cloudinary
    upload_result = cloudinary.uploader.upload(image_bytes)
    image_url = upload_result['url']

    # Generate caption using Hugging Face
    caption_response = generate_caption(image_bytes)
    if isinstance(caption_response, list) and "generated_text" in caption_response[0]:
        generated_caption = caption_response[0]["generated_text"]
        caption_embedding = generate_embeddings(generated_caption).tolist()

        # Save to MongoDB via Express backend
        response = requests.post("http://localhost:3000/api/captions", json={
            "imageName": file.filename,
            "imageUrl": image_url,
            "caption": generated_caption,
            "album": album,
            "embedding": caption_embedding
        })

        if response.status_code == 201:
            return {"message": "Image and caption saved successfully", "imageUrl": image_url}
        else:
            raise HTTPException(status_code=500, detail="Failed to save caption and image.")
    else:
        raise HTTPException(status_code=500, detail="Failed to generate caption.")

@app.get("/search")
async def search_captions(query: str = Query(...)):
    try:
        query_embedding = generate_embeddings(query).tolist()

        # Send search request to Express backend
        response = requests.post(
            "http://localhost:3000/api/captions/search",
            json={
                "query_embedding": query_embedding,
                "query_text": query
            },
             headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Search failed in backend service"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))