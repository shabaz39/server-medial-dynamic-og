Server Medial Dynamic OG Image
This is a server-side application built with Node.js, Express, and TypeScript that generates dynamic Open Graph (OG) images. The images are generated from HTML templates, compressed using sharp, and cached for performance optimization.

Features
Generate dynamic OG images based on provided title, content, and optional images.
Caching of generated images to reduce processing time for repeated requests.
Supports file uploads using multer.
Environment configuration using dotenv.
Cross-Origin Resource Sharing (CORS) enabled.
Installation
Clone the repository:


git clone https://github.com/your-username/server-medial-dynamic-og.git
cd server-medial-dynamic-og
Install dependencies:


npm install
Create a .env file in the root directory:

The .env file should contain your environment variables.

Build the TypeScript project:


npm run build
Start the server:

npm start
The server will start on the port specified in the .env file or on port 5001 by default.

API Endpoints
POST /generate-og-image
Generates a dynamic OG image based on the provided title, content, and optional image.

URL: /generate-og-image
Method: POST
Content-Type: multipart/form-data
Body Parameters:
title (string): The title for the OG image.
content (string): The content for the OG image.
image (file, optional): An optional image to include in the OG image.
Response:
ogImageUrl (string): URL of the generated OG image.
Example Request:

curl -X POST http://localhost:5001/generate-og-image \
  -F "title=Example Title" \
  -F "content=This is an example content." \
  -F "image=@/path/to/image.jpg"
  
Example Response:

{
  "ogImageUrl": "http://localhost:5001/cache/some-hash.jpg"
}

Project Structure
index.ts: The main entry point of the server application.
cache/: Directory where cached images are stored.
.env: Environment variables for the server configuration.
package.json: Project metadata and dependencies.

Dependencies
express: Web framework for Node.js.
multer: Middleware for handling multipart/form-data.
node-html-to-image: Generates images from HTML.
sharp: High-performance image processing.
dotenv: Loads environment variables from .env file.
cors: Middleware for enabling CORS.

Development
Running Locally
To run the project locally, ensure you have Node.js installed, and follow the installation steps above.

Using Nodemon
The project is configured to use nodemon for automatic server restarts during development:

npm start
This command will start the server with nodemon, watching for changes in your files.


