const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const portalDist = path.join(rootDir, 'apps/portal/dist');
const katalkDist = path.join(rootDir, 'apps/katalk-analyzer/dist');
const menheraDist = path.join(rootDir, 'apps/menhera-analyzer/dist');
const mbtiDist = path.join(rootDir, 'apps/mbti-analyzer/dist');
const relationshipDist = path.join(rootDir, 'apps/relationship-analyzer/dist');
const mockexamDist = path.join(rootDir, 'apps/mockexam-analyzer/dist');
const bestfriendDist = path.join(rootDir, 'apps/bestfriend-analyzer/dist');
const greenlightDist = path.join(rootDir, 'apps/greenlight-analyzer/dist');
const chattypeDist = path.join(rootDir, 'apps/chattype-analyzer/dist');
const balanceDist = path.join(rootDir, 'apps/balance-analyzer/dist');

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

// Copy mbti-analyzer to /mbti
console.log('Copying mbti-analyzer to /mbti/');
copyDir(mbtiDist, path.join(distDir, 'mbti'));

// Copy relationship-analyzer to /relationship
console.log('Copying relationship-analyzer to /relationship/');
copyDir(relationshipDist, path.join(distDir, 'relationship'));

// Copy mockexam-analyzer to /mockexam
console.log('Copying mockexam-analyzer to /mockexam/');
copyDir(mockexamDist, path.join(distDir, 'mockexam'));

// Copy bestfriend-analyzer to /bestfriend
console.log('Copying bestfriend-analyzer to /bestfriend/');
copyDir(bestfriendDist, path.join(distDir, 'bestfriend'));

// Copy greenlight-analyzer to /greenlight
console.log('Copying greenlight-analyzer to /greenlight/');
copyDir(greenlightDist, path.join(distDir, 'greenlight'));

// Copy chattype-analyzer to /chattype
console.log('Copying chattype-analyzer to /chattype/');
copyDir(chattypeDist, path.join(distDir, 'chattype'));

// Copy balance-analyzer to /balance
console.log('Copying balance-analyzer to /balance/');
copyDir(balanceDist, path.join(distDir, 'balance'));

// Create _redirects for SPA routing
const redirects = `
/balance/*       /balance/index.html       200
/chattype/*      /chattype/index.html      200
/greenlight/*    /greenlight/index.html    200
/bestfriend/*    /bestfriend/index.html    200
/mockexam/*      /mockexam/index.html      200
/relationship/*  /relationship/index.html  200
/mbti/*          /mbti/index.html          200
/menhera/*       /menhera/index.html       200
/katalk/*        /katalk/index.html        200
/*               /index.html               200
`.trim();

fs.writeFileSync(path.join(distDir, '_redirects'), redirects);
console.log('Created _redirects for SPA routing');

console.log('Build merge complete! Output: dist/');
