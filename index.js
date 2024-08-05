"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const node_html_to_image_1 = __importDefault(require("node-html-to-image"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const sharp_1 = __importDefault(require("sharp"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const upload = (0, multer_1.default)();
const cacheDir = path_1.default.join(__dirname, 'cache');
app.use((0, cors_1.default)());
const backendURL = process.env.backend_URL;
// Ensure cache directory exists
if (!fs_1.default.existsSync(cacheDir)) {
    fs_1.default.mkdirSync(cacheDir);
}
app.post('/generate-og-image', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const image = req.file;
        // Generate a unique hash based on title, content, and image buffer (if available)
        const hashData = title + content + (image ? image.buffer.toString('base64') : '');
        const hash = crypto_1.default.createHash('md5').update(hashData).digest('hex');
        const cachedImagePath = path_1.default.join(cacheDir, `${hash}.jpg`);
        // Check if image already exists in cache
        if (fs_1.default.existsSync(cachedImagePath)) {
            return res.json({ ogImageUrl: `${backendURL}/cache/${hash}.jpg` });
        }
        const imageHtml = image ? `<img src="data:image/jpeg;base64,${image.buffer.toString('base64')}" alt="Post Image" class="post-image" />` : '';
        const htmlTemplate = `
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          margin: 0;
        }
       .container {
          max-width: 880px;
          margin: auto;
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-height: 100vh; /* Add this line */
        }
       .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
       .header .logo {
          display: flex;
          align-items: center;
        }
       .header .logo img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
        }
       .header .logo h3 {
          font-size: 18px;
          font-weight: 600;
        }
       .header .medial-logo img {
          width: 32px;
          height: 32px;
          color: #9ca3af;
        }
       .post-title {
          font-size: 24px;
          font-weight: bold;
          margin-top: 20px;
        }
       .post-content {
          font-size: 18px;
          color: #4a5568;
          margin-top: 10px;
        }
       .post-image {
          margin-top: 20px;
          border-radius: 8px;
          max-height: 320px;
          object-fit: cover;
          width: 100%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <img
              src="https://img.freepik.com/free-vector/gradient-coding-developers-logo_23-2148809440.jpg"
              alt="Submedial logo"
              style="width: 24px; height: 24px; border-radius: 50%;"
            />
            <h3 style="font-size: 16px;">m/Developers Group</h3>
          </div>
          <div class="medial-logo">
            <img
              src="https://medial.app/image/medial-purple-logo.png"
              alt="Medial logo"
              style="width: 20px; height: 20px;"
            />
          </div>
        </div>
        <h2 class="post-title">${title}</h2>
        <p class="post-content">${content}</p>
        ${imageHtml}
      </div>
    </body>
    </html>
    `;
        // Generate the image using nodeHtmlToImage
        const imageBuffer = yield (0, node_html_to_image_1.default)({
            html: htmlTemplate,
            quality: 100,
            type: 'jpeg',
        });
        // Compress the image using sharp
        const compressedImage = yield (0, sharp_1.default)(imageBuffer)
            .jpeg({ quality: 80 })
            .toBuffer();
        // Save the image to cache
        fs_1.default.writeFileSync(cachedImagePath, compressedImage);
        // Respond with the cached image URL
        res.json({ ogImageUrl: `${backendURL}/cache/${hash}.jpg` });
    }
    catch (error) {
        console.error('Error generating OG image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.use('/cache', express_1.default.static(cacheDir));
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
