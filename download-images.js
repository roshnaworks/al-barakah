// Run this locally (where you have internet) to auto-download all real images
// used on the site into the /images folder.
//
// Steps:
//   1. cd into the al-barakah-website folder
//   2. node download-images.js
//
// No npm install needed — uses Node's built-in https module.

const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
  'hero-bg.jpg': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'about.jpg': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=900',
  'cta-bg.jpg': 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'gallery-1.jpg': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
  'gallery-2.jpg': 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=600',
  'gallery-3.jpg': 'https://images.pexels.com/photos/9609860/pexels-photo-9609860.jpeg?auto=compress&cs=tinysrgb&w=600',
  'gallery-4.jpg': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600',
  'gallery-5.jpg': 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
  'gallery-6.jpg': 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const outDir = path.join(__dirname, 'images');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function download(filename, url) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outDir, filename);
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(`Failed (${response.statusCode}): ${filename}`);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err.message);
    });
  });
}

(async () => {
  console.log('Downloading images into /images ...');
  for (const [filename, url] of Object.entries(images)) {
    try {
      await download(filename, url);
    } catch (err) {
      console.error(`Error downloading ${filename}:`, err);
    }
  }
  console.log('Done! Check the /images folder.');
})();