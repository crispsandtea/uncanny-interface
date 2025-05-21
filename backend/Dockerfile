FROM python:3.10-slim

WORKDIR /app

# Copy requirements from backend folder
COPY backend/requirements.txt ./requirements.txt

# Install dependencies
RUN pip install --upgrade pip \
    && pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Copy backend code only
COPY backend/ .

EXPOSE 8000

# Use Gunicorn with Uvicorn worker for better production performance
CMD gunicorn -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT

