# Use official Python 3.10 slim image
FROM python:3.10-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set default PORT environment variable (Render will override this dynamically)
ENV PORT=10000

# Set the working directory
WORKDIR /app

# Install minimal runtime system libraries for OpenCV and Dlib:
# - libgomp1: GNU OpenMP library (critical for dlib multi-threading)
# - libglib2.0-0: Required for low-level image processing
# - git: Required to download face_recognition_models directly from GitHub
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libglib2.0-0 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Upgrade pip and install optimized requirements
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Install face-recognition without dependencies to prevent pip from downloading 
# the source dlib package and triggering a memory-heavy C++ compilation.
RUN pip install --no-cache-dir face-recognition --no-deps

# Copy the backend code
COPY ./backend /app/backend

# Create standard runtime directories for database, uploads, and logs
RUN mkdir -p /app/database /app/uploads /app/logs

# Create a non-root user for production security and grant correct file permissions
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the correct dynamic port (Render defaults to 10000)
EXPOSE 10000

# Start Gunicorn dynamically bound to the Render dynamic $PORT variable
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$PORT backend.app:app"]
