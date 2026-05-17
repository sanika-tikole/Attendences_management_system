# Use Debian Bookworm Slim as base to use its pre-compiled python3-dlib
FROM debian:bookworm-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system Python 3 and the pre-compiled heavy AI libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-dlib \
    python3-opencv \
    python3-numpy \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment that INHERITS system packages (dlib, opencv, numpy)
RUN python3 -m venv --system-site-packages /opt/venv

# Activate the virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements
COPY requirements.txt .

# Remove opencv-python and numpy from requirements to prevent pip from downloading 
# PyPI versions that override our pre-compiled system ones.
RUN grep -v "opencv-python" requirements.txt | grep -v "numpy" > req_filtered.txt && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r req_filtered.txt

# Copy the backend code
COPY ./backend /app/backend

# Create a non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app /opt/venv
USER appuser

# Expose the port
EXPOSE 5000

# Start the application
CMD ["python", "-m", "backend.app"]
