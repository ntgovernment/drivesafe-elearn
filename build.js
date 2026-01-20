// Simple build script to copy files from src to dist
const fs = require('fs');
const path = require('path');

const srcDir = 'src';
const distDir = 'dist';

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Files to copy
const files = ['drivesafe.js', 'drivesafe.css', 'demo.html', 'sw.js'];

console.log('Building distributable files...\n');

files.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const distPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, distPath);
    console.log(`✓ Copied ${file} to dist/`);
  } else {
    console.log(`⚠ ${file} not found in src/`);
  }
});

console.log('\n✓ Build complete!');
