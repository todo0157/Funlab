const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const portalDist = path.join(rootDir, 'apps/portal/dist');
const katalkDist = path.join(rootDir, 'apps/katalk-analyzer/dist');
const menheraDist = path.join(rootDir, 'apps/menhera-analyzer/dist');

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory not found: ${src}`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

console.log('Merging builds...');

// Copy portal to root
console.log('Copying portal to /');
copyDir(portalDist, distDir);

// Copy katalk-analyzer to /katalk
console.log('Copying katalk-analyzer to /katalk/');
copyDir(katalkDist, path.join(distDir, 'katalk'));

// Copy menhera-analyzer to /menhera
console.log('Copying menhera-analyzer to /menhera/');
copyDir(menheraDist, path.join(distDir, 'menhera'));

// Create _redirects for SPA routing
const redirects = `
/menhera/*  /menhera/index.html  200
/katalk/*   /katalk/index.html   200
/*          /index.html          200
`.trim();

fs.writeFileSync(path.join(distDir, '_redirects'), redirects);
console.log('Created _redirects for SPA routing');

console.log('Build merge complete! Output: dist/');
