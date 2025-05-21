FROM python:3.10-slim

WORKDIR /app

# Copy requirements
COPY backend/requirements.txt ./requirements.txt

# Install system dependencies (e.g., gcc for some Python packages)
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Copy backend code
COPY backend/ .

# Run the app using Gunicorn + Uvicorn, letting $PORT be injected by Render
CMD ["sh", "-c", "gunicorn -k uvicorn.workers.UvicornWorker backend.main:app --bind 0.0.0.0:$PORT"]
