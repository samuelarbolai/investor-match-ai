# Use a lightweight modern Python base image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install OS dependencies needed by Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency list first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application
COPY . .

# Cloud Run will pass the port via environment variable
ENV PORT=8080

# Expose port for local dev (optional)
EXPOSE 8080

# Run FastAPI with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
