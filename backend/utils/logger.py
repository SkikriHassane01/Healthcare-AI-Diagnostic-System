import logging
import os 
import datetime
from pathlib import Path
from logging.handlers import RotatingFileHandler

def setup_logger(module_name: str) -> logging.Logger:
    """
    Set up a logger for a specific module with both file and console output.
    
    Args:
        module_name (str): Name of the module (used to name the log file)
    
    Returns:
        logging.Logger: Configured logger instance
    """
    # create the logs directory
    logs_dir = Path(__file__).resolve().parents[1] / "logs"
    os.makedirs(logs_dir, exist_ok=True)
    
    # create a module specific directory
    module_dir = logs_dir / module_name
    os.makedirs(module_dir, exist_ok=True)
    
    # create a logger 
    logger = logging.getLogger(module_name)
    logger.setLevel(logging.INFO)
    
    # clear the handlers if they exist
    if logger.hasHandlers():
        logger.handlers.clear()
        
    # create a formatter
    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(module)s:%(lineno)d | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # create the rotation file handler (10MB max size, 5 backups)
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    log_file = module_dir / f"{today}_{module_name}.log"
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,
        backupCount=5
    )
    
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    
    # create a console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    
    # add the handlers to the logger 
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger    