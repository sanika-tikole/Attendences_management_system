# Use Python 3.11 Slim Bookworm for a smaller, stable image
FROM python:3.11-slim-bookworm

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies required for face-recognition, dlib, and opencv
# We use --no-install-recommends to keep the image small
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user to fix the "pip root" warning and improve security
RUN useradd -m -u 1000 appuser
USER appuser

# Add the local bin to PATH so installed packages are accessible
ENV PATH="/home/appuser/.local/bin:${PATH}"

# Copy requirements and install packages
# The --user flag installs them in the user's home directory
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir --user --upgrade pip && \
    pip install --no-cache-dir --user -r requirements.txt

# Copy the backend code as a package
COPY --chown=appuser:appuser ./backend /app/backend

# Expose the port the app runs on
EXPOSE 5000

# Start the application using the module flag to handle relative imports correctly
CMD ["python", "-m", "backend.app"]
