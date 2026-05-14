import logging
import os

from ..config import Config


def get_logger(name: str) -> logging.Logger:
    os.makedirs(Config.LOG_DIR, exist_ok=True)
    log_path = os.path.join(Config.LOG_DIR, "backend.log")

    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s")

    file_handler = logging.FileHandler(log_path)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    return logger
