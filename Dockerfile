# Use official Python 3.10 slim image
FROM python:3.10-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install minimal runtime system libraries for OpenCV and Dlib:
# - libgomp1: GNU OpenMP library (critical for dlib multi-threading)
# - libglib2.0-0: Required for low-level image processing
# We do NOT install cmake, build-essential, or python3-dev as we bypass C++ compilation completely!
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libglib2.0-0 \
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

# Expose both local (5000) and Render default (10000) ports
EXPOSE 5000
EXPOSE 10000

# Start Gunicorn directly (no shell wrapping) binding to both 5000 and 10000 
# to guarantee a match on both local and Render load balancers.
CMD ["gunicorn", "-b", "0.0.0.0:5000", "-b", "0.0.0.0:10000", "backend.app:app"]
