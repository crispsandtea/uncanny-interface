from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

app = FastAPI()

# CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = pipeline("text-generation", model="gpt2")

@app.get("/")
async def root():
    return {"message": "Backend is running!"}

@app.post("/generate")
async def generate_text(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    result = generator(prompt, max_length=100, num_return_sequences=1)
    return {"generated_text": result[0]["generated_text"]}
