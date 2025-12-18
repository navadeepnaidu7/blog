/**
 * Script to copy blog post images to the static folder during build.
 * This runs before the SvelteKit build to make co-located images available.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const postsDir = path.join(projectRoot, 'src', 'content', 'posts');
const staticDir = path.join(projectRoot, 'static', 'content', 'posts');

// Image extensions to copy
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

function copyPostImages() {
    // Clean up old copied images
    if (fs.existsSync(staticDir)) {
        fs.rmSync(staticDir, { recursive: true });
    }
    
    // Create the target directory
    fs.mkdirSync(staticDir, { recursive: true });
    
    // Get all post folders
    const postFolders = fs.readdirSync(postsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    let copiedCount = 0;
    
    for (const folder of postFolders) {
        const folderPath = path.join(postsDir, folder);
        const files = fs.readdirSync(folderPath);
        
        // Find image files
        const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });
        
        if (images.length > 0) {
            // Create target folder for this post
            const targetFolder = path.join(staticDir, folder);
            fs.mkdirSync(targetFolder, { recursive: true });
            
            // Copy each image
            for (const image of images) {
                const sourcePath = path.join(folderPath, image);
                const targetPath = path.join(targetFolder, image);
                fs.copyFileSync(sourcePath, targetPath);
                copiedCount++;
                console.log(`Copied: ${folder}/${image}`);
            }
        }
    }
    
    console.log(`\n✓ Copied ${copiedCount} images from blog posts to static folder`);
}

copyPostImages();
