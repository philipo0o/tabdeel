const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '../public');
const EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Helper to get all images recursively
function getImages(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getImages(filePath, fileList);
        } else {
            if (EXTENSIONS.includes(path.extname(file).toLowerCase())) {
                fileList.push(path.relative(PUBLIC_DIR, filePath));
            }
        }
    });
    return fileList;
}

async function optimize() {
    // Ensure we can find the public directory
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error('Public directory not found at:', PUBLIC_DIR);
        return;
    }

    const images = getImages(PUBLIC_DIR);

    if (images.length === 0) {
        console.log('No images found to optimize.');
        return;
    }

    console.log(`Found ${images.length} images to process...`);

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const imgRelativePath of images) {
        const inputPath = path.join(PUBLIC_DIR, imgRelativePath);
        const outputWebP = path.join(PUBLIC_DIR, imgRelativePath.replace(/\.(png|jpg|jpeg)$/i, '_optimized.webp'));

        try {
            // Check for incremental build
            if (fs.existsSync(outputWebP)) {
                const inputStats = fs.statSync(inputPath);
                const outputStats = fs.statSync(outputWebP);

                if (inputStats.mtime <= outputStats.mtime) {
                    // console.log(`Skipping ${imgRelativePath} (already optimized)`);
                    skippedCount++;
                    continue;
                }
            }

            console.log(`Optimizing ${imgRelativePath}...`);
            const originalStats = fs.statSync(inputPath);

            await sharp(inputPath)
                .resize(1920, null, { // Max width 1920px, auto height
                    withoutEnlargement: true
                })
                .webp({ quality: 85, effort: 6 })
                .toFile(outputWebP);

            const newStats = fs.statSync(outputWebP);
            const reduction = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);

            console.log(`  Created ${path.basename(outputWebP)}`);
            console.log(`  Size: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB -> ${(newStats.size / 1024 / 1024).toFixed(2)} MB (-${reduction}%)`);
            processedCount++;

        } catch (error) {
            console.error(`Error optimizing ${imgRelativePath}:`, error.message);
            errorCount++;
        }
    }

    console.log('-----------------------------------');
    console.log(`Optimization complete.`);
    console.log(`Processed: ${processedCount}`);
    console.log(`Skipped:   ${skippedCount}`);
    console.log(`Errors:    ${errorCount}`);
}

optimize();
