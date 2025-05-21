FROM python:3.10-slim

WORKDIR /app

# Copy the correct requirements.txt and install deps
COPY backend/requirements.txt ./requirements.txt
RUN pip install --upgrade pip \
    && pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Copy backend code
COPY backend/ .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
