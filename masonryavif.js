let selectedFiles = [];
let processing = false;
let cancelled = false;
let zipCancelled = false;
const workers = [];
const workerCount = navigator.hardwareConcurrency || 4;

for (let i = 0; i < workerCount; i++) {
  workers.push(new Worker('avif-encoder.js', { type: 'module' }));
}

const fileInput = document.getElementById('fileInput');
const folderInput = document.getElementById('folderInput');
const selectFilesBtn = document.getElementById('selectFiles');
const selectFolderBtn = document.getElementById('selectFolder');
const fileCount = document.getElementById('fileCount');
const generateBtn = document.getElementById('generateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const progressSection = document.getElementById('progressSection');
const dropZone = document.getElementById('dropZone');

selectFilesBtn.addEventListener('click', () => {
  fileInput.click();
});

selectFolderBtn.addEventListener('click', () => {
  folderInput.click();
});

fileInput.addEventListener('change', (e) => handleFileSelection(e.target.files));
folderInput.addEventListener('change', (e) => handleFileSelection(e.target.files));

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  
  const files = [];
  
  console.log('=== DROP DEBUG ===');
  
  if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
    console.log('Using dataTransfer.items API');
    console.log('Total items dropped:', e.dataTransfer.items.length);
    
    const items = Array.from(e.dataTransfer.items);
    
    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        
        if (entry) {
          console.log(`Processing: ${entry.name} (isDirectory: ${entry.isDirectory})`);
          
          if (entry.isDirectory) {
            await traverseFileTree(entry, files, entry.name);
          } else {
            const file = item.getAsFile();
            if (file) {
              files.push(file);
              console.log(`Added file: ${file.name}`);
            }
          }
        }
      }
    }
  } 
  else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    console.log('Using dataTransfer.files API (fallback)');
    const droppedFiles = Array.from(e.dataTransfer.files);
    files.push(...droppedFiles);
    console.log('Added files via fallback:', droppedFiles.length);
  }
  
  console.log('Total files collected:', files.length);
  handleFileSelection(files);
});

async function traverseFileTree(entry, files, parentPath = '') {
  if (entry.isFile) {
    return new Promise((resolve) => {
      entry.file((file) => {
        const fullPath = parentPath ? parentPath + '/' + file.name : file.name;
        
        if (!file.webkitRelativePath) {
          Object.defineProperty(file, 'webkitRelativePath', {
            value: fullPath,
            writable: false,
            enumerable: true
          });
        }
        
        files.push(file);
        resolve();
      });
    });
  } else if (entry.isDirectory) {
    const dirReader = entry.createReader();
    
    return new Promise((resolve) => {
      const readEntries = () => {
        dirReader.readEntries(async (entries) => {
          if (entries.length === 0) {
            resolve();
            return;
          }
          
          for (const subEntry of entries) {
            await traverseFileTree(subEntry, files, parentPath);
          }
          
          readEntries();
        });
      };
      
      readEntries();
    });
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleFileSelection(files) {
  const fileArray = Array.from(files);
  
  console.log('Total files:', fileArray.length);
  
  selectedFiles = fileArray.filter(f => {
    const name = f.name.toLowerCase();
    return name.endsWith('.jpg') || name.endsWith('.jpeg') || 
           name.endsWith('.png') || name.endsWith('.webp') || 
           name.endsWith('.avif') || name.endsWith('.svg');
  });
  
  console.log('Filtered image files:', selectedFiles.length);
  
  const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const totalSizeFormatted = formatFileSize(totalBytes);
  const totalSizeGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  
  console.log(`Total file size: ${totalSizeFormatted} (${totalSizeGB} GB)`);
  
  if (selectedFiles.length > 0) {
    const folderSet = new Set();
    selectedFiles.forEach(f => {
      const path = f.webkitRelativePath || f.name;
      const parts = path.split('/').filter(p => p);
      const dirName = parts.length > 1 ? parts[0] : 'gallery';
      folderSet.add(dirName);
    });
    
    const folderCount = folderSet.size;
    
    let displayText = '';
    if (folderCount > 1) {
      displayText = `✓ ${selectedFiles.length} images in ${folderCount} folders`;
    } else if (folderCount === 1 && !folderSet.has('gallery')) {
      displayText = `✓ ${selectedFiles.length} images in 1 folder`;
    } else {
      displayText = `✓ ${selectedFiles.length} images selected`;
    }
    
    displayText += ` • Total: ${totalSizeFormatted}`;
    
    if (totalBytes > 2 * 1024 * 1024 * 1024) {
      displayText += ` ⚠️`;
    }
    
    fileCount.textContent = displayText;
    fileCount.classList.add('visible');
    generateBtn.disabled = false;
  } else {
    fileCount.classList.remove('visible');
    generateBtn.disabled = true;
  }
}

async function generateGallery() {
  if (processing) return;
  
  const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
  const totalSizeGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
  
  console.log(`=== STARTING PROCESSING ===`);
  console.log(`Files: ${selectedFiles.length}`);
  console.log(`Total Size: ${formatFileSize(totalBytes)} (${totalSizeGB} GB)`);
  
  if (performance.memory) {
    const usedMemory = performance.memory.usedJSHeapSize / (1024 * 1024 * 1024);
    const totalMemory = performance.memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
    
    console.log(`Memory: ${usedMemory.toFixed(2)}GB / ${totalMemory.toFixed(2)}GB`);
    
    if (usedMemory > totalMemory * 0.7) {
      alert('⚠️ Browser is already using 70%+ memory. Close other tabs before processing.');
      return;
    }
  }
  
  processing = true;
  cancelled = false;
  zipCancelled = false;
  
  generateBtn.disabled = true;
  cancelBtn.style.display = 'block';
  cancelBtn.disabled = false;
  cancelBtn.textContent = 'Cancel';
  progressSection.style.display = 'block';
  progressSection.innerHTML = `
    <div class="progress-bar">
      <div id="progressFill" class="progress-fill"></div>
    </div>
    <div id="progressText" class="progress-text">Starting...</div>
    <div id="progressStats" class="progress-stats"></div>
  `;
  
  const quality = 50;
  const effort = 8;
  const titleOption = document.querySelector('input[name="titleOption"]:checked').value;
  
  try {
    await processGallery(titleOption, quality, effort);
  } catch (error) {
    console.error('Error generating gallery:', error);
    if (!cancelled && !zipCancelled) {
      alert('Error generating gallery: ' + error.message);
    }
  } finally {
    processing = false;
    generateBtn.disabled = false;
    cancelBtn.style.display = 'none';
    
    if (!cancelled && !zipCancelled) {
      setTimeout(() => {
        progressSection.style.display = 'none';
      }, 3000);
    }
  }
}

generateBtn.addEventListener('click', generateGallery);
cancelBtn.addEventListener('click', () => {
  if (processing) {
    cancelled = true;
    zipCancelled = true;
    cancelBtn.disabled = true;
    cancelBtn.textContent = 'Cancelling...';
    updateProgressText('Cancelling... (may take a moment)');
  }
});

function logMemoryUsage(phase) {
  if (performance.memory) {
    const used = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(0);
    const total = (performance.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(0);
    console.log(`[${phase}] Memory: ${used}MB / ${total}MB (${((used/total)*100).toFixed(1)}%)`);
  }
}

async function processGallery(titleOption, quality, effort) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

  logMemoryUsage('START');
  updateProgress(0, 'Organizing files...');
    
  const directories = organizeByDirectory(selectedFiles);
  logMemoryUsage('AFTER organizeByDirectory');
  console.log('GALLERIES CREATED:', Object.keys(directories));
  const zip = new JSZip();
  logMemoryUsage('AFTER JSZip init');

  let totalOriginalSize = 0;
  let totalConvertedSize = 0;
  
  let totalThumbsProcessed = 0;
  let totalFullProcessed = 0;
  const totalImages = selectedFiles.filter(f => !f.name.endsWith('.svg')).length;
  
  let currentPhase = '';
  let phaseStartTime = Date.now();
  
  for (const [dirName, files] of Object.entries(directories)) {
    if (cancelled) {
      updateProgressText('Cancelled by user');
      return;
    }
    
    const cleanDirName = sanitizeDirName(dirName);
    
    const result = await processDirectory(
      cleanDirName, 
      files, 
      zip, 
      quality,
      effort,
      totalImages,
      (processed, total, phase) => {
        if (phase !== currentPhase) {
          currentPhase = phase;
          phaseStartTime = Date.now();
        }
        
        let percent, operationCount, totalOperations, rate;
        const phaseElapsed = (Date.now() - phaseStartTime) / 1000;
        const totalElapsed = Math.floor((Date.now() - startTime) / 1000);
        
        if (phase.includes('thumbnails')) {
          totalThumbsProcessed++;
          percent = (totalThumbsProcessed / totalImages) * 100;
          operationCount = totalThumbsProcessed;
          totalOperations = totalImages;
          rate = phaseElapsed > 0 ? Math.round(totalThumbsProcessed / (phaseElapsed / 60)) : 0;
        } else {
          totalFullProcessed++;
          percent = (totalFullProcessed / totalImages) * 100;
          operationCount = totalFullProcessed;
          totalOperations = totalImages;
          rate = phaseElapsed > 0 ? Math.round(totalFullProcessed / (phaseElapsed / 60)) : 0;
        }
        
        updateProgress(
          percent,
          `${phase}: ${cleanDirName} (${processed}/${total})`,
          `${operationCount}/${totalOperations} operations • ${rate} img/min • ${totalElapsed}s elapsed`
        );
      }
    );
    
    totalOriginalSize += result.originalSize;
    totalConvertedSize += result.convertedSize;
    
    const galleryHTML = generateGalleryHTML(cleanDirName, result, titleOption);
    zip.file(`${cleanDirName}/index.html`, galleryHTML);
  }
  
  if (cancelled) {
    updateProgressText('Cancelled - partial data discarded');
    return;
  }
  
  updateProgress(100, 'Generating gallery index...');
  const indexHTML = generateIndexHTML(directories, timestamp);
  zip.file('index.html', indexHTML);
  
  if (zipCancelled) {
    updateProgressText('Cancelled - partial data discarded');
    return;
  }
  
  const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
  updateProgress(0, 'Creating ZIP archive...', 'Starting compression...');
  
  try {
    const zipStartTime = Date.now();
    const zipBlob = await zip.generateAsync(
      { 
        type: 'blob', 
        compression: 'DEFLATE', 
        compressionOptions: { level: 9 }
      },
      (metadata) => {
        if (zipCancelled) {
          throw new Error('ZIP_CANCELLED');
        }
        
        const zipElapsed = Math.floor((Date.now() - zipStartTime) / 1000);
        updateProgress(
          metadata.percent, 
          `Creating ZIP archive... ${metadata.percent.toFixed(0)}%`,
          `${metadata.currentFile || 'Finalizing...'} • ${zipElapsed}s elapsed`
        );
      }
    );
    
    if (zipCancelled) {
      updateProgressText('Cancelled - ZIP creation aborted');
      return;
    }
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avif_gallery_${timestamp}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const minutes = Math.floor(totalTime / 60);
    const seconds = Math.floor(totalTime % 60);
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    const reductionPercent = totalOriginalSize > 0 
      ? Math.round(((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100)
      : 0;
    
    const originalFormatted = formatFileSize(totalOriginalSize);
    const convertedFormatted = formatFileSize(totalConvertedSize);
    
    displayCompressionStats(originalFormatted, convertedFormatted, reductionPercent, timeStr);
    
    updateProgress(100, `✓ Complete! Gallery saved. Total time: ${timeStr}`);
  } catch (error) {
    if (error.message === 'ZIP_CANCELLED' || zipCancelled) {
      updateProgressText('Cancelled - ZIP creation aborted');
      return;
    }
    throw error;
  }
}

function organizeByDirectory(files) {
  console.log('=== ORGANIZE BY DIRECTORY DEBUG ===');
  
  const dirs = {};
  
  files.forEach(file => {
    const path = file.webkitRelativePath || file.name;
    const parts = path.split('/').filter(p => p);
    
    console.log(`File: ${file.name} | Path: "${path}" | Parts:`, parts);
    
    let dirName;
    
    if (parts.length === 1) {
      dirName = 'gallery';
    } else {
      dirName = parts[0];
    }
    
    console.log(`  -> Assigned to gallery: "${dirName}"`);
    
    if (!dirs[dirName]) dirs[dirName] = [];
    dirs[dirName].push(file);
  });
  
  console.log('=== FINAL DIRECTORY ORGANIZATION ===');
  Object.keys(dirs).forEach(dirName => {
    console.log(`Gallery "${dirName}": ${dirs[dirName].length} files`);
  });
  
  return dirs;
}

async function processDirectory(dirName, files, zip, quality, effort, totalImages, progressCallback) {
  const rasterFiles = files.filter(f => !f.name.endsWith('.svg'));
  const svgFiles = files.filter(f => f.name.endsWith('.svg'));
  
  const thumbData = [];
  const fullResData = [];
  
  let originalSize = 0;
  let convertedSize = 0;
  
  const fileNameMap = new Map();
  
  function getUniqueFileName(file) {
    const baseName = sanitizeFileName(file.name);
    const fullPath = file.webkitRelativePath || file.name;
    
    if (!fileNameMap.has(fullPath)) {
      if (fileNameMap.has(baseName)) {
        let counter = 1;
        let uniqueName = `${baseName}_${counter}`;
        while (fileNameMap.has(uniqueName)) {
          counter++;
          uniqueName = `${baseName}_${counter}`;
        }
        fileNameMap.set(fullPath, uniqueName);
        return uniqueName;
      } else {
        fileNameMap.set(fullPath, baseName);
        return baseName;
      }
    }
    return fileNameMap.get(fullPath);
  }
  
  let processed = 0;
  for (let i = 0; i < rasterFiles.length; i++) {
    if (cancelled || zipCancelled) break;
    
    const file = rasterFiles[i];
    
    const img = await createImageBitmap(file);
    const scale = Math.min(350 / img.width, 350 / img.height, 1);
    const thumbWidth = Math.round(img.width * scale);
    const thumbHeight = Math.round(img.height * scale);
    img.close();
    
    const blob = await encodeToAVIF(file, 350, 350, quality, effort, i % workerCount);
    const fileName = getUniqueFileName(file);
    
    zip.file(`${dirName}/th/${fileName}.avif`, blob);
    
    thumbData.push({ fileName, width: thumbWidth, height: thumbHeight });
    
    processed++;
    progressCallback(processed, rasterFiles.length, 'Processing thumbnails');
    
    if ((i + 1) % 50 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  processed = 0;
  for (let i = 0; i < rasterFiles.length; i++) {
    if (cancelled || zipCancelled) break;
    
    const file = rasterFiles[i];
    
    originalSize += file.size;
    
    const blob = await encodeToAVIF(file, 1280, 1280, quality, effort, i % workerCount);
    const fileName = getUniqueFileName(file);
    
    convertedSize += blob.size;
    
    zip.file(`${dirName}/images/${fileName}.avif`, blob);
    
    fullResData.push({ fileName });
    
    processed++;
    progressCallback(processed, rasterFiles.length, 'Processing full images');
    
    if ((i + 1) % 50 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  for (const file of svgFiles) {
    zip.file(`${dirName}/images/${file.name}`, file);
    thumbData.push({ fileName: file.name, width: 350, height: 350, isSVG: true });
  }
  
  return { thumbData, fullResData, svgFiles, originalSize, convertedSize };
}

function displayCompressionStats(originalFormatted, convertedFormatted, reductionPercent, timeStr) {
  const folderSet = new Set();
  selectedFiles.forEach(f => {
    const path = f.webkitRelativePath || f.name;
    const parts = path.split('/').filter(p => p);
    const dirName = parts.length > 1 ? parts[0] : 'gallery';
    folderSet.add(dirName);
  });
  
  const folderCount = folderSet.size;
  const imageCount = selectedFiles.length;
  
  let folderText = '';
  if (folderCount > 1) {
    folderText = ` in ${folderCount} folders`;
  } else if (folderCount === 1 && !folderSet.has('gallery')) {
    folderText = ` in 1 folder`;
  }
  
  const statsHTML = `
    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 255, 38, 0.1); border: 1px solid rgba(0, 255, 38, 0.3); border-radius: 8px;">
      <div style="font-size: 14px; color: #f1f1f1; margin-bottom: 8px;">
        <strong>${imageCount} images${folderText} • Original: ${originalFormatted}</strong>
      </div>
      <div style="font-size: 14px; color: rgb(0, 255, 38); font-weight: bold;">
        ${convertedFormatted} converted images • ${reductionPercent}% reduction
      </div>
      <div style="font-size: 13px; color: #aaa; margin-top: 8px;">
        Total time: ${timeStr}
      </div>
    </div>
  `;
  
  const actionsSection = document.querySelector('.actions');
  let statsDiv = document.getElementById('compressionStats');
  
  if (!statsDiv) {
    statsDiv = document.createElement('div');
    statsDiv.id = 'compressionStats';
    actionsSection.appendChild(statsDiv);
  }
  
  statsDiv.innerHTML = statsHTML;
}

async function encodeToAVIF(file, maxWidth, maxHeight, quality, effort, workerIndex) {
  return new Promise(async (resolve, reject) => {
    try {
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.close();
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      canvas.width = 0;
      canvas.height = 0;
      
      const worker = workers[workerIndex];
      
      const handleMessage = (e) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data.blob);
        }
      };
      
      const handleError = (error) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        reject(error);
      };
      
      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);
      
      worker.postMessage({
        imageData: imageData,
        quality: quality,
        effort: effort
      }, [imageData.data.buffer]);
      
    } catch (error) {
      reject(error);
    }
  });
}

function sanitizeFileName(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9._()-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 90);
}

function sanitizeDirName(name) {
  return name
    .replace(/[^a-zA-Z0-9._()-]/g, '_')
    .replace(/_{2,}/g, '_');
}

function updateProgress(percent, text, stats = '') {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const progressStats = document.getElementById('progressStats');
  
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressText) progressText.textContent = text;
  if (progressStats) progressStats.textContent = stats;
}

function updateProgressText(text) {
  const progressText = document.getElementById('progressText');
  if (progressText) progressText.textContent = text;
}

function generateGalleryHTML(dirName, result, titleOption) {
  const { thumbData } = result;
  const totalImages = thumbData.length;
  
  const imagesArray = thumbData.map(item => {
    if (item.isSVG) {
      return `images/${item.fileName}`;
    }
    return `images/${item.fileName}.avif`;
  });
  
  let thumbnailsHTML = '';
  thumbData.forEach((item, index) => {
    const displayName = item.fileName
      .replace(/_/g, ' ')
      .replace(/^\d+\s*/, '');
    
    if (item.isSVG) {
      thumbnailsHTML += `<div class="item"><div class="image-wrapper"><img src="images/${item.fileName}" data-index="${index}" data-fullsize="images/${item.fileName}" width="350" height="350" loading="lazy" class="gallery-thumb"><div class="image-name">${displayName}</div></div></div>\n`;
    } else {
      thumbnailsHTML += `<div class="item"><div class="image-wrapper"><img src="th/${item.fileName}.avif" data-index="${index}" data-fullsize="images/${item.fileName}.avif" width="${item.width}" height="${item.height}" loading="lazy" class="gallery-thumb"><div class="image-name">${displayName}</div></div></div>\n`;
    }
  });
  
  const titleCSS = titleOption === '2' ? `
.container .item .image-name {
  position: relative;
  color: #f1f1f1;
  font-size: 11px;
  padding: 4px 6px;
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}` : `
.container .item .image-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #f1f1f1;
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 0 0 .75rem .75rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}`;

  return `<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<link rel="icon" href="data:,">
<title>Gallery - ${dirName}</title>
<style>
body {background-color: #212121;}
.container {
position: relative;
margin: 5px auto 0;
padding: 2rem;
}
.container .item {
position: absolute;
text-align: center;
cursor: pointer;
transition: transform 0.2s ease;
visibility: hidden;
}
.container .item.positioned {
visibility: visible;
}
.container .item .image-wrapper {
position: relative;
display: block;
width: 100%;
}
.container .item img {
width: 100%;
height: 100%;
border-radius: .75rem;
display: block;
object-fit: fill;
}
.container .item img:hover {transform: scale(1.02)}
${titleCSS}
.container .item .image-name {
word-break: break-word;
word-wrap: break-word;
overflow-wrap: break-word;
hyphens: auto;
white-space: normal;
line-height: 1.2;
}
#scroll {
height: 20px;
position: fixed;
bottom: 10px;
right: 10px;
background: rgba(34, 34, 34, 0.8);
color: rgb(0, 255, 38);
padding: 2px 8px;
border-radius: 3px;
font-size: 12px;
z-index: 100;
backdrop-filter: blur(5px);
pointer-events: none;
}
.back-link {
position: fixed;
top: 10px;
left: 10px;
background: rgba(34, 34, 34, 0.8);
color: #f1f1f1;
padding: 8px 12px;
border-radius: 3px;
text-decoration: none;
font-size: 12px;
z-index: 100;
backdrop-filter: blur(5px);
}
.back-link:hover {
background: rgba(68, 68, 68, 0.8);
}
.theme-toggle {
position: fixed;
top: 10px;
right: 10px;
background: rgba(34, 34, 34, 0.8);
color: #f1f1f1;
border: none;
padding: 8px 12px;
border-radius: 3px;
cursor: pointer;
font-size: 16px;
z-index: 100;
backdrop-filter: blur(5px);
transition: background 0.3s ease;
}
.theme-toggle:hover {
background: rgba(68, 68, 68, 0.8);
}
.slideshow-btn {
position: fixed;
top: 45px;
right: 10px;
background: rgba(34, 34, 34, 0.8);
color: #f1f1f1;
border: none;
padding: 8px 12px;
border-radius: 3px;
cursor: pointer;
font-size: 16px;
z-index: 100;
backdrop-filter: blur(5px);
transition: background 0.3s ease;
}
.slideshow-btn:hover {
background: rgba(68, 68, 68, 0.8);
}
body.light-mode {
background-color: #f5f5f5;
}
body.light-mode .container .item .image-name {
color: #333;
text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}
body.light-mode .theme-toggle,
body.light-mode .slideshow-btn,
body.light-mode .back-link {
background: rgba(255, 255, 255, 0.9);
color: #333;
}
body.light-mode .theme-toggle:hover,
body.light-mode .slideshow-btn:hover,
body.light-mode .back-link:hover {
background: rgba(230, 230, 230, 0.9);
}
body.light-mode #scroll {
background: rgba(255, 255, 255, 0.9);
color: #333;
}
.lightbox {
display: none;
position: fixed;
z-index: 1000;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,0.95);
cursor: pointer;
transition: background-color 0.3s ease;
}
.lightbox-content {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
cursor: pointer;
}
.lightbox-content img {
width: 100%;
height: 100%;
object-fit: contain;
transition: background-color 0.3s ease;
}
.lightbox-content img[src$=".svg"] {
background-color: #1a1a1a;
padding: 20px;
border-radius: 8px;
}
body.light-mode .lightbox {
background-color: rgba(255,255,255,0.95);
}
body.light-mode .lightbox-content img[src$=".svg"] {
background-color: #f5f5f5;
}
#slideshow-container {
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background: #000;
z-index: 2000;
display: none;
}
#slideshow-container:not(:empty) {
display: block;
}
.slideshow-slide {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
opacity: 0;
transition: opacity 0.5s ease-in-out;
overflow: hidden;
}
.slideshow-slide.active {
opacity: 1;
}
.slideshow-slide img {
position: absolute;
top: 50%;
left: 50%;
width: 100%;
height: 100%;
transform: translate(-50%, -50%);
object-fit: cover;
will-change: transform;
}
.slideshow-counter {
position: fixed;
bottom: 5px;
left: 50%;
transform: translateX(-50%);
z-index: 2001;
color: #f1f1f1;
font-size: 12px;
}
</style>
</head>
<body>
<a href="../index.html" class="back-link">← Back to Gallery Index</a>
<button class="theme-toggle" onclick="toggleTheme()">🌙</button>
<button class="slideshow-btn" onclick="startSlideshow()">▶️</button>
<div style="color: #f1f1f1; font-size: 14px; text-align: center; padding: 10px; background-color: #333; margin-bottom: 10px;">
 Viewing ${totalImages} Images from ${dirName}: ← and → / spacebar = previous / next image --- click image or ESC = back to index
</div>
<div id="scroll">scroll %</div>
<div class="container">
${thumbnailsHTML}
</div>
<div id="lightbox" class="lightbox">
<div class="lightbox-content">
 <img id="lightbox-img" src="" alt="">
</div>
</div>
<div id="slideshow-container"></div>
<div id="slideshow-counter" class="slideshow-counter" style="display: none;"></div>
<script>
const images = ${JSON.stringify(imagesArray)};
const TITLE_OPTION = '${titleOption}';
let currentIndex = 0;
let layoutQueued = false;
let columnConfig = {columns: 1, columnWidth: 0, gap: 0};

const SLIDE_DURATION = 5000;
const PAN_AMOUNT = 0.12;
const ZOOM_START = 2.8;
const ZOOM_END = 1.3;

let currentSlideIndex = 0;
let currentSlidePattern = 1;
let slideTimer = null;
let shuffledSlideImages = [];
let isSlideshowPlaying = false;

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getKenBurnsPattern(pattern) {
  const patterns = {
    1: { startX: PAN_AMOUNT, startY: -PAN_AMOUNT, endX: -PAN_AMOUNT, endY: PAN_AMOUNT },
    2: { startX: PAN_AMOUNT, startY: 0, endX: -PAN_AMOUNT, endY: 0 },
    3: { startX: 0, startY: PAN_AMOUNT, endX: 0, endY: -PAN_AMOUNT },
    4: { startX: PAN_AMOUNT, startY: PAN_AMOUNT, endX: -PAN_AMOUNT, endY: -PAN_AMOUNT },
    5: { startX: -PAN_AMOUNT, startY: 0, endX: PAN_AMOUNT, endY: 0 },
    6: { startX: -PAN_AMOUNT, startY: -PAN_AMOUNT, endX: PAN_AMOUNT, endY: PAN_AMOUNT },
    7: { startX: 0, startY: -PAN_AMOUNT, endX: 0, endY: PAN_AMOUNT },
    8: { startX: -PAN_AMOUNT, startY: PAN_AMOUNT, endX: PAN_AMOUNT, endY: -PAN_AMOUNT }
  };
  return patterns[pattern];
}

function applyKenBurnsEffect(slide, pattern) {
  const img = slide.querySelector('img');
  const p = getKenBurnsPattern(pattern);
  const startPanX = p.startX * 100;
  const startPanY = p.startY * 100;
  const endPanX = p.endX * 100;
  const endPanY = p.endY * 100;
  const animationName = 'kenburns-' + pattern;
  const keyframes = '@keyframes ' + animationName + ' { 0% { transform: translate(calc(-50% + ' + startPanX + '%), calc(-50% + ' + startPanY + '%)) scale(' + ZOOM_START + '); } 75% { transform: translate(calc(-50% + ' + endPanX + '%), calc(-50% + ' + endPanY + '%)) scale(' + ZOOM_END + '); } 100% { transform: translate(calc(-50% + ' + endPanX + '%), calc(-50% + ' + endPanY + '%)) scale(' + ZOOM_END + '); } }';
  let styleSheet = document.getElementById('kenburns-styles');
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    styleSheet.id = 'kenburns-styles';
    document.head.appendChild(styleSheet);
  }
  if (!styleSheet.textContent.includes(animationName)) {
    styleSheet.textContent += keyframes;
  }
  img.style.animation = animationName + ' ' + SLIDE_DURATION + 'ms ease-in-out forwards';
}

function showNextSlideInShow() {
  if (!isSlideshowPlaying) return;
  if (currentSlideIndex >= shuffledSlideImages.length) {
    stopSlideshow();
    return;
  }
  const slideshowContainer = document.getElementById('slideshow-container');
  const existingSlides = slideshowContainer.querySelectorAll('.slideshow-slide');
  existingSlides.forEach(slide => {
    if (slide.classList.contains('active')) {
      slide.classList.remove('active');
      setTimeout(() => slide.remove(), 500);
    } else {
      slide.remove();
    }
  });
  const slide = document.createElement('div');
  slide.className = 'slideshow-slide';
  const img = document.createElement('img');
  img.src = shuffledSlideImages[currentSlideIndex];
  img.alt = 'Slide ' + (currentSlideIndex + 1);
  slide.appendChild(img);
  slideshowContainer.appendChild(slide);
  img.onload = () => {
    requestAnimationFrame(() => {
      slide.classList.add('active');
      applyKenBurnsEffect(slide, currentSlidePattern);
    });
  };
  currentSlidePattern++;
  if (currentSlidePattern > 8) currentSlidePattern = 1;
  currentSlideIndex++;
  const counter = document.getElementById('slideshow-counter');
  if (counter) {
    counter.textContent = currentSlideIndex + '/' + shuffledSlideImages.length;
    counter.style.display = 'block';
  }
  slideTimer = setTimeout(showNextSlideInShow, SLIDE_DURATION);
}

function startSlideshow() {
  if (isSlideshowPlaying) return;
  if (images.length === 0) return;
  isSlideshowPlaying = true;
  currentSlideIndex = 0;
  currentSlidePattern = 1;
  shuffledSlideImages = shuffleArray(images);
  const slideshowContainer = document.getElementById('slideshow-container');
  if (slideshowContainer) slideshowContainer.innerHTML = '';
  const slideshowBtn = document.querySelector('.slideshow-btn');
  if (slideshowBtn) slideshowBtn.style.display = 'none';
  const counter = document.getElementById('slideshow-counter');
  if (counter) counter.style.display = 'block';
  showNextSlideInShow();
}

function stopSlideshow() {
  isSlideshowPlaying = false;
  if (slideTimer) {
    clearTimeout(slideTimer);
    slideTimer = null;
  }
  const slideshowContainer = document.getElementById('slideshow-container');
  if (slideshowContainer) slideshowContainer.innerHTML = '';
  const counter = document.getElementById('slideshow-counter');
  if (counter) counter.style.display = 'none';
  const slideshowBtn = document.querySelector('.slideshow-btn');
  if (slideshowBtn) slideshowBtn.style.display = 'block';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (isSlideshowPlaying) {
      stopSlideshow();
    } else if (lightbox.style.display === 'block') {
      closeLightbox();
    }
  }
  if (lightbox.style.display === 'block') {
    switch(e.key) {
      case 'ArrowLeft':
        showPrevious();
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        showNext();
        break;
    }
  }
});

function updateColumnConfig() {
const container = document.querySelector('.container');
const width = window.innerWidth;
let columns = 1;
if (width >= 1792) columns = 7;
else if (width >= 1536) columns = 6;
else if (width >= 1280) columns = 5;
else if (width >= 1024) columns = 4;
else if (width >= 768) columns = 3;
else if (width >= 512) columns = 2;
else columns = 1;
const containerWidth = container.offsetWidth - 64;
const gap = 0;
const columnWidth = containerWidth / columns;
columnConfig = { columns, columnWidth, gap };
}

function positionItem(item, columnHeights) {
const img = item.querySelector('img');
const imgWidth = parseInt(img.getAttribute('width'));
const imgHeight = parseInt(img.getAttribute('height'));
if (!imgWidth || !imgHeight) return false;
const aspectRatio = imgHeight / imgWidth;
const itemHeight = columnConfig.columnWidth * aspectRatio;
const titleHeight = TITLE_OPTION === '2' ? 25 : 0;
const totalItemHeight = itemHeight + titleHeight;
const minHeight = Math.min(...columnHeights);
const minColumn = columnHeights.indexOf(minHeight);
const x = minColumn * columnConfig.columnWidth;
const y = columnHeights[minColumn];
item.style.left = x + 'px';
item.style.top = y + 'px';
item.style.width = columnConfig.columnWidth + 'px';
const imageWrapper = item.querySelector('.image-wrapper');
imageWrapper.style.height = itemHeight + 'px';
item.classList.add('positioned');
columnHeights[minColumn] += totalItemHeight;
return true;
}

function layoutItems() {
if (layoutQueued) return;
layoutQueued = true;
requestAnimationFrame(() => {
 const container = document.querySelector('.container');
 const items = container.querySelectorAll('.item');
 updateColumnConfig();
 const columnHeights = new Array(columnConfig.columns).fill(0);
 items.forEach(item => {
   positionItem(item, columnHeights);
 });
 const maxHeight = Math.max(...columnHeights);
 container.style.height = maxHeight + 'px';
 layoutQueued = false;
});
}

document.addEventListener('scroll', function(){
var h = document.documentElement,
b = document.body,
st = 'scrollTop',
sh = 'scrollHeight';
var percent = ((h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100).toFixed(1);
document.getElementById('scroll').textContent = percent + '%';
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
let savedScrollPosition = 0;
let originalThumbnailElement = null;

document.querySelectorAll('.item').forEach(item => {
 item.addEventListener('click', function() {
   const thumb = this.querySelector('.gallery-thumb');
   if (thumb) {
     savedScrollPosition = window.pageYOffset;
     originalThumbnailElement = this;
     currentIndex = parseInt(thumb.dataset.index);
     showImage(currentIndex);
     lightbox.style.display = 'block';
   }
 });
});

lightboxImg.addEventListener('click', function(e) {
 e.stopPropagation();
 closeLightbox();
});

lightbox.addEventListener('click', function(e) {
 if (e.target === lightbox) {
   closeLightbox();
 }
});

function showImage(index) {
 if (index >= 0 && index < images.length) {
   lightboxImg.src = images[index];
   currentIndex = index;
   const imagePath = images[index];
   const imageName = imagePath.split('/').pop().split('.')[0];
   const displayName = imageName.replace(/_/g, ' ').replace(/^\\d+\\s*/, '');
   document.title = displayName + ' - Gallery - ${dirName}';
 }
}

function showNext() {
 const nextIndex = currentIndex + 1;
 if (nextIndex < images.length) {
   showImage(nextIndex);
 }
}

function showPrevious() {
 const prevIndex = currentIndex - 1;
 if (prevIndex >= 0) {
   showImage(prevIndex);
 }
}

function closeLightbox() {
 lightbox.style.display = 'none';
 document.title = 'Gallery - ${dirName}';
 if (currentIndex >= 0 && currentIndex < images.length) {
   const thumbnails = document.querySelectorAll('.gallery-thumb');
   if (thumbnails[currentIndex]) {
     const targetThumbnail = thumbnails[currentIndex].closest('.item');
     if (targetThumbnail && targetThumbnail !== originalThumbnailElement) {
       targetThumbnail.scrollIntoView({
         behavior: 'smooth',
         block: 'center'
       });
     } else {
       window.scrollTo({
         top: savedScrollPosition,
         behavior: 'smooth'
       });
     }
   }
 } else {
   window.scrollTo({
     top: savedScrollPosition,
     behavior: 'smooth'
   });
 }
}

function toggleTheme() {
const body = document.body;
const toggle = document.querySelector('.theme-toggle');
if (body.classList.contains('light-mode')) {
 body.classList.remove('light-mode');
 toggle.textContent = '🌙';
 localStorage.setItem('theme', 'dark');
} else {
 body.classList.add('light-mode');
 toggle.textContent = '☀️';
 localStorage.setItem('theme', 'light');
}
}

document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  const toggle = document.querySelector('.theme-toggle');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    toggle.textContent = '☀️';
  } else {
    toggle.textContent = '🌙';
  }
});

window.addEventListener('load', () => {
layoutItems();
});

let resizeTimeout;
window.addEventListener('resize', () => {
clearTimeout(resizeTimeout);
resizeTimeout = setTimeout(() => {
 layoutItems();
}, 150);
});
</script>
</body>
</html>`;
}

function generateIndexHTML(directories, timestamp) {
  let linksHTML = '';
  
  Object.entries(directories).forEach(([dirName, files]) => {
    const cleanDirName = sanitizeDirName(dirName);
    const imageCount = files.length;
    
    linksHTML += `
 <a href="${cleanDirName}/index.html" class="gallery-link">
   <div class="gallery-header">
     <div class="gallery-title">${cleanDirName}</div>
     <div class="gallery-count">${imageCount} images</div>
   </div>
 </a>`;
  });
  
  return `<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<link rel="icon" href="data:,">
<title>Gallery Index</title>
<style>
body {
background-color: #212121;
color: #f1f1f1;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
margin: 0;
padding: 20px;
transition: background-color 0.3s ease, color 0.3s ease;
}
.container {
max-width: 800px;
margin: 0 auto;
padding: 20px;
}
h1 {
text-align: center;
color: #f1f1f1;
margin-bottom: 30px;
}
.gallery-links {
display: grid;
gap: 20px;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.gallery-link {
background: rgba(68, 68, 68, 0.3);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 8px;
padding: 20px;
text-decoration: none;
color: #f1f1f1;
transition: all 0.3s ease;
display: block;
}
.gallery-link:hover {
background: rgba(68, 68, 68, 0.5);
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.gallery-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 10px;
}
.gallery-title {
font-size: 18px;
font-weight: bold;
text-transform: capitalize;
}
.gallery-count {
font-size: 14px;
color: #999999;
background: rgba(0, 0, 0, 0.3);
padding: 4px 8px;
border-radius: 4px;
}
.timestamp {
text-align: center;
color: #666666;
font-size: 12px;
margin-top: 30px;
}
.theme-toggle {
position: fixed;
top: 20px;
right: 20px;
background: rgba(34, 34, 34, 0.8);
color: #f1f1f1;
border: none;
padding: 8px 12px;
border-radius: 6px;
cursor: pointer;
font-size: 16px;
z-index: 100;
backdrop-filter: blur(5px);
transition: background 0.3s ease;
}
.theme-toggle:hover {
background: rgba(68, 68, 68, 0.8);
}
body.light-mode {
background-color: #f5f5f5;
color: #333;
}
body.light-mode h1 {
color: #333;
}
body.light-mode .gallery-link {
background: rgba(255, 255, 255, 0.9);
border: 1px solid rgba(0, 0, 0, 0.1);
color: #333;
}
body.light-mode .gallery-link:hover {
background: rgba(255, 255, 255, 1);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
body.light-mode .gallery-count {
background: rgba(0, 0, 0, 0.05);
color: #666;
}
body.light-mode .timestamp {
color: #999;
}
body.light-mode .theme-toggle {
background: rgba(255, 255, 255, 0.9);
color: #333;
}
body.light-mode .theme-toggle:hover {
background: rgba(230, 230, 230, 0.9);
}
</style>
</head>
<body>
<button class="theme-toggle" onclick="toggleTheme()">🌙</button>
<div class="container">
<h1>AVIF Masonry Gallery Index</h1>
<div class="gallery-links">
${linksHTML}
</div>
<div class="timestamp">
 Generated on ${new Date().toLocaleString()}
</div>
</div>
<script>
function toggleTheme() {
  const body = document.body;
  const toggle = document.querySelector('.theme-toggle');
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    toggle.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-mode');
    toggle.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  const toggle = document.querySelector('.theme-toggle');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    toggle.textContent = '☀️';
  } else {
    toggle.textContent = '🌙';
  }
});
</script>
</body>
</html>`;
}