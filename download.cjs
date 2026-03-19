const fs = require('fs');
const https = require('https');

const icons = ['framer', 'webflow', 'figma', 'notion', 'linear', 'vercel', 'raycast', 'loom', 'stripe', 'supabase'];

icons.forEach(icon => {
  https.get(`https://cdn.jsdelivr.net/npm/simple-icons@14.0.0/icons/${icon}.svg`, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync(`public/images/${icon}.svg`, data);
      console.log(`Downloaded ${icon}`);
    });
  }).on('error', err => {
    console.error(`Error downloading ${icon}`, err);
  });
});
