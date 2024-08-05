import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import cors from 'cors';
import { chromium } from 'playwright';

 

 

const app = express();
const upload = multer();
const cacheDir = path.join(__dirname, 'cache');
app.use(
  cors({
    origin: ["http://localhost:3000", "https://client-medial-dynamic-og-image-33kongoinq-uc.a.run.app" ],
    credentials: true,
  })
);

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

app.post('/generate-og-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const image = req.file;

    // Generate a unique hash based on title, content, and image buffer (if available)
    const hashData = title + content + (image ? image.buffer.toString('base64') : '');
    const hash = crypto.createHash('md5').update(hashData).digest('hex');
    const cachedImagePath = path.join(cacheDir, `${hash}.jpg`);

    // Check if image already exists in cache
    if (fs.existsSync(cachedImagePath)) {
      return res.json({ ogImageUrl: `https://server-medial-repo-image-33kongoinq-uc.a.run.app/cache/${hash}.jpg` });
    }

    const imageHtml = image ? `<img src="data:image/jpeg;base64,${image.buffer.toString('base64')}" alt="Post Image" class="post-image" />` : '';


    const htmlTemplate = `
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${content.slice(0, 150)}" />
      <meta property="og:image" content="${image ? `data:image/jpeg;base64,${image.buffer.toString('base64')}` : ''}" />
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

   
  // Generate the image using Playwright
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(htmlTemplate);
  const imageBuffer = await page.screenshot({ type: 'jpeg', fullPage: true });

  await browser.close();


    // Compress the image using sharp
    const compressedImage = await sharp(imageBuffer)
      .jpeg({ quality: 80 })
      .toBuffer();

    // Save the image to cache
    fs.writeFileSync(cachedImagePath, compressedImage);


    // Respond with the cached image URL
    res.json({ ogImageUrl: `https://server-medial-repo-image-33kongoinq-uc.a.run.app/cache/${hash}.jpg`});

    console.log({ ogImageUrl: `https://server-medial-repo-image-33kongoinq-uc.a.run.app/cache/${hash}.jpg` })

  } catch (error:any) {
    console.error('Error generating OG image:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.use('/cache', express.static(cacheDir));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));