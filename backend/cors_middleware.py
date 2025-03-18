from flask import Flask

class FlaskCORSMiddleware:
    """
    Custom middleware to handle CORS preflight requests
    before Flask's internal routing happens
    """
    
    def __init__(self, app):
        self.app = app
        
    def __call__(self, environ, start_response):
        # Handle OPTIONS requests directly to prevent redirects
        if environ['REQUEST_METHOD'] == 'OPTIONS':
            headers = [
                ('Content-Type', 'text/plain'),
                ('Access-Control-Allow-Origin', 'http://localhost:3000'),
                ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
                ('Access-Control-Allow-Credentials', 'true'),
                ('Access-Control-Max-Age', '3600')
            ]
            start_response('200 OK', headers)
            return [b'']
            
        return self.app(environ, start_response)