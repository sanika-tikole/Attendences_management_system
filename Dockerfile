# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Install system dependencies for dlib and opencv
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the entire project
COPY . .

# Install Python dependencies
# We install from the backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Set environment variables
ENV FLASK_APP=backend.app
ENV PYTHONUNBUFFERED=1

# Expose the port (Render will override this with $PORT)
EXPOSE 5000

# Run the application using Gunicorn
# Note: Render provides $PORT environment variable
CMD ["sh", "-c", "gunicorn -w 4 -b 0.0.0.0:${PORT:-5000} 'backend.app:create_app()'"]
