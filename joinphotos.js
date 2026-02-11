class ImageCombiner {
    constructor() {
        this.images = [];
        this.layout = 'vertical';
        this.settings = {
            padding: 10,
            backgroundColor: '#000000',
            borderWidth: 0,
            borderColor: '#000000',
            outputFormat: 'jpg',
            jpgQuality: 0.85,
            imageSizing: 'none'
        };
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.avifWorker = new Worker('avif-encoder.js', { type: 'module' });
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupFileUpload();
        this.setupSortButtons();
        this.setupLayoutButtons();
        this.setupControls();
        this.setupActionButtons();
        this.setupFAQ();
    }

    setupTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');
        const html = document.documentElement;
        let isDark = true;

        const updateTheme = () => {
            if (isDark) {
                html.classList.add('dark');
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                html.classList.remove('dark');
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        };

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            updateTheme();
        });

        updateTheme();
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const uploadBtn = document.getElementById('upload-btn');
        const fileInput = document.getElementById('file-input');

        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });

        uploadArea.addEventListener('click', (e) => {
            if (e.target === uploadArea || e.target.closest('.upload-area')) {
                fileInput.click();
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            console.log('Files selected:', e.target.files.length);
            this.handleFiles(e.target.files);
        });
    }

    async handleFiles(files) {
        console.log('Processing files:', files.length);
        const validFiles = Array.from(files).filter(file => {
            console.log('File type:', file.type, 'Name:', file.name);
            return file.type.startsWith('image/');
        });

        if (validFiles.length === 0) {
            this.showStatus('Please select valid image files (JPG, PNG, WebP, AVIF, GIF).', 'error');
            return;
        }

        this.showStatus(`Loading ${validFiles.length} image(s)...`, 'success');

        let loadedCount = 0;
        for (const file of validFiles) {
            try {
                console.log('Loading image:', file.name);
                const imageData = await this.loadImage(file);
                this.images.push({
                    id: Date.now() + Math.random(),
                    file: file,
                    data: imageData,
                    name: file.name,
                    size: file.size
                });
                loadedCount++;
                console.log('Loaded image:', file.name, 'Total loaded:', loadedCount);
            } catch (error) {
                console.error('Error loading image:', file.name, error);
                this.showStatus(`Error loading ${file.name}: ${error.message}`, 'error');
            }
        }

        if (loadedCount > 0) {
            this.updateImageGrid();
            this.showSections();
            this.generatePreview();
            this.showStatus(`Successfully loaded ${loadedCount} image(s)!`, 'success');
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            img.onload = () => {
                console.log('Image loaded successfully:', file.name, img.width, 'x', img.height);
                resolve(img);
            };

            img.onerror = (error) => {
                console.error('Image load error:', error);
                reject(new Error(`Failed to load image: ${file.name}`));
            };

            reader.onload = (e) => {
                console.log('FileReader loaded, setting image src');
                img.src = e.target.result;
            };

            reader.onerror = (error) => {
                console.error('FileReader error:', error);
                reject(new Error(`Failed to read file: ${file.name}`));
            };

            console.log('Starting to read file:', file.name);
            reader.readAsDataURL(file);
        });
    }

    updateImageGrid() {
        const grid = document.getElementById('image-grid');
        grid.innerHTML = '';

        this.images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'image-thumb';
            div.draggable = true;
            div.dataset.index = index;

            const imgElement = document.createElement('img');
            imgElement.src = img.data.src;
            imgElement.alt = img.name;
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
            imgElement.style.objectFit = 'cover';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeImage(index);
            };

            div.appendChild(imgElement);
            div.appendChild(removeBtn);

            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
            });

            div.addEventListener('dragover', (e) => e.preventDefault());

            div.addEventListener('drop', (e) => {
                e.preventDefault();
                const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const dropIndex = parseInt(div.dataset.index);
                this.reorderImages(dragIndex, dropIndex);
            });

            grid.appendChild(div);
        });
    }

    removeImage(index) {
        this.images.splice(index, 1);
        this.updateImageGrid();
        if (this.images.length === 0) {
            this.hideSections();
        } else {
            this.generatePreview();
        }
    }

    reorderImages(fromIndex, toIndex) {
        const item = this.images.splice(fromIndex, 1)[0];
        this.images.splice(toIndex, 0, item);
        this.updateImageGrid();
        this.generatePreview();
    }

    setupSortButtons() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sortType = btn.dataset.sort;
                this.sortImages(sortType);
            });
        });
    }

    sortImages(type) {
        switch (type) {
            case 'name-asc':
                this.images.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.images.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'size-asc':
                this.images.sort((a, b) => a.size - b.size);
                break;
            case 'size-desc':
                this.images.sort((a, b) => b.size - a.size);
                break;
            case 'shuffle':
                for (let i = this.images.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.images[i], this.images[j]] = [this.images[j], this.images[i]];
                }
                break;
        }
        this.updateImageGrid();
        this.generatePreview();
    }

    setupLayoutButtons() {
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.layout = btn.dataset.layout;
                this.generatePreview();
            });
        });
    }

   setupControls() {
       const paddingSlider = document.getElementById('padding-slider');
       const paddingValue = document.getElementById('padding-value');
       const bgColor = document.getElementById('bg-color');
       const bgColorText = document.getElementById('bg-color-text');
       const borderSlider = document.getElementById('border-slider');
       const borderValue = document.getElementById('border-value');
       const borderColor = document.getElementById('border-color');
       const borderColorText = document.getElementById('border-color-text');
   
       paddingSlider.addEventListener('input', (e) => {
           this.settings.padding = parseInt(e.target.value);
           paddingValue.textContent = e.target.value;
           this.generatePreview();
       });
   
       bgColor.addEventListener('change', (e) => {
           this.settings.backgroundColor = e.target.value;
           bgColorText.textContent = e.target.value.toUpperCase();
           this.generatePreview();
       });
   
       borderSlider.addEventListener('input', (e) => {
           this.settings.borderWidth = parseInt(e.target.value);
           borderValue.textContent = e.target.value;
           this.generatePreview();
       });
   
       borderColor.addEventListener('change', (e) => {
           this.settings.borderColor = e.target.value;
           borderColorText.textContent = e.target.value.toUpperCase();
           this.generatePreview();
       });
   
       this.setupImageSizingDropdown();
   }

   setupImageSizingDropdown() {
       const sizingOptions = [
           { value: 'none', label: 'Keep original sizes' },
           { value: 'fit-width', label: 'Match widest (scale to fit width)' },
           { value: 'fit-height', label: 'Match tallest (scale to fit height)' },
           { value: 'fit-smallest', label: 'Match smallest (scale all to smallest)' },
           { value: 'crop-uniform', label: 'Crop to uniform size' },
           { value: 'stretch-uniform', label: 'Stretch to uniform size (may distort)' },
           { value: 'masonry-2', label: 'Masonry - 2 columns' },
           { value: 'masonry-3', label: 'Masonry - 3 columns' },
           { value: 'masonry-4', label: 'Masonry - 4 columns' },
           { value: 'masonry-5', label: 'Masonry - 5 columns' },
           { value: 'masonry-6', label: 'Masonry - 6 columns' }
       ];
   
       const dropdown = document.getElementById('imageSizingDropdown');
       const selected = dropdown.querySelector('.selected');
       const optionsContainer = dropdown.querySelector('.options');
       let currentIndex = 0;
   
       sizingOptions.forEach((option, index) => {
           const optionDiv = document.createElement('div');
           optionDiv.className = 'option';
           optionDiv.textContent = option.label;
           optionDiv.dataset.value = option.value;
           optionDiv.addEventListener('click', () => {
               this.settings.imageSizing = option.value;
               selected.textContent = option.label;
               dropdown.classList.remove('open');
               this.generatePreview();
           });
           optionsContainer.appendChild(optionDiv);
       });
   
       dropdown.addEventListener('click', (e) => {
           e.stopPropagation();
           document.querySelectorAll('.dropdown').forEach(d => {
               if (d !== dropdown) d.classList.remove('open');
           });
           dropdown.classList.toggle('open');
           
           if (dropdown.classList.contains('open')) {
               const optionElements = Array.from(optionsContainer.querySelectorAll('.option'));
               const selectedValue = this.settings.imageSizing;
               currentIndex = optionElements.findIndex(opt => opt.dataset.value === selectedValue);
               if (currentIndex === -1) currentIndex = 0;
               this.highlightSizingOption(optionElements, currentIndex);
           }
       });
   
       dropdown.addEventListener('keydown', (e) => {
           if (!dropdown.classList.contains('open')) {
               if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                   e.preventDefault();
                   dropdown.classList.add('open');
                   const optionElements = Array.from(optionsContainer.querySelectorAll('.option'));
                   const selectedValue = this.settings.imageSizing;
                   currentIndex = optionElements.findIndex(opt => opt.dataset.value === selectedValue);
                   if (currentIndex === -1) currentIndex = 0;
                   this.highlightSizingOption(optionElements, currentIndex);
               }
               return;
           }
   
           const optionElements = Array.from(optionsContainer.querySelectorAll('.option'));
   
           if (e.key === 'ArrowDown') {
               e.preventDefault();
               currentIndex = (currentIndex + 1) % optionElements.length;
               this.highlightSizingOption(optionElements, currentIndex);
               
               const selectedOption = optionElements[currentIndex];
               this.settings.imageSizing = selectedOption.dataset.value;
               selected.textContent = selectedOption.textContent;
               this.generatePreview();
           } else if (e.key === 'ArrowUp') {
               e.preventDefault();
               currentIndex = (currentIndex - 1 + optionElements.length) % optionElements.length;
               this.highlightSizingOption(optionElements, currentIndex);
               
               const selectedOption = optionElements[currentIndex];
               this.settings.imageSizing = selectedOption.dataset.value;
               selected.textContent = selectedOption.textContent;
               this.generatePreview();
           } else if (e.key === 'Enter') {
               e.preventDefault();
               dropdown.classList.remove('open');
           } else if (e.key === 'Escape') {
               e.preventDefault();
               dropdown.classList.remove('open');
           }
       });
   
       document.addEventListener('click', () => {
           dropdown.classList.remove('open');
       });
   }

   highlightSizingOption(options, index) {
       options.forEach((opt, i) => {
           if (i === index) {
               opt.style.background = '#0e639c';
               opt.style.color = '#fff';
               opt.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
           } else {
               opt.style.background = '';
               opt.style.color = '';
           }
       });
   }

    setupActionButtons() {
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });

        document.getElementById('download-jpg-btn').addEventListener('click', () => {
            this.downloadImage('jpg');
        });

        document.getElementById('download-png-btn').addEventListener('click', () => {
            this.downloadImage('png');
        });

        document.getElementById('download-avif-btn').addEventListener('click', () => {
            this.downloadImage('avif');
        });
    }

    setupFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = answer.classList.contains('show');

                document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('show'));
                document.querySelectorAll('.faq-question span').forEach(s => s.textContent = '+');

                if (!isOpen) {
                    answer.classList.add('show');
                    question.querySelector('span').textContent = '−';
                }
            });
        });
    }

    generatePreview() {
        if (this.images.length === 0) return;

        const { width, height } = this.calculateCanvasSize();
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.fillStyle = this.settings.backgroundColor;
        this.ctx.fillRect(0, 0, width, height);

        this.drawImages();

        document.getElementById('download-jpg-btn').disabled = false;
        document.getElementById('download-png-btn').disabled = false;
        document.getElementById('download-avif-btn').disabled = false;
    }

    isMasonryMode() {
        return this.settings.imageSizing.startsWith('masonry-');
    }

    getMasonryColumns() {
        if (!this.isMasonryMode()) return 3;
        const match = this.settings.imageSizing.match(/masonry-(\d+)/);
        return match ? parseInt(match[1]) : 3;
    }

    calculateCanvasSize() {
        if (this.images.length === 0) return { width: 800, height: 600 };

        const padding = this.settings.padding;
        const adjustedImages = this.prepareImagesForSizing();

        if (this.isMasonryMode()) {
            const maxX = Math.max(...adjustedImages.map(img => img.x + img.dWidth));
            const maxY = Math.max(...adjustedImages.map(img => img.y + img.dHeight));
            return {
                width: maxX + this.settings.borderWidth * 2,
                height: maxY + this.settings.borderWidth * 2
            };
        }

        let maxWidth = 0;
        let maxHeight = 0;
        let totalWidth = 0;
        let totalHeight = 0;

        switch (this.layout) {
            case 'horizontal':
                adjustedImages.forEach(imgData => {
                    totalWidth += imgData.dWidth;
                    maxHeight = Math.max(maxHeight, imgData.dHeight);
                });
                return {
                    width: totalWidth + (adjustedImages.length - 1) * padding + this.settings.borderWidth * 2,
                    height: maxHeight + this.settings.borderWidth * 2
                };

            case 'vertical':
                adjustedImages.forEach(imgData => {
                    maxWidth = Math.max(maxWidth, imgData.dWidth);
                    totalHeight += imgData.dHeight;
                });
                return {
                    width: maxWidth + this.settings.borderWidth * 2,
                    height: totalHeight + (adjustedImages.length - 1) * padding + this.settings.borderWidth * 2
                };

            case 'grid':
                const cols = Math.ceil(Math.sqrt(adjustedImages.length));
                const rows = Math.ceil(adjustedImages.length / cols);
                adjustedImages.forEach(imgData => {
                    maxWidth = Math.max(maxWidth, imgData.dWidth);
                    maxHeight = Math.max(maxHeight, imgData.dHeight);
                });
                return {
                    width: maxWidth * cols + (cols - 1) * padding + this.settings.borderWidth * 2,
                    height: maxHeight * rows + (rows - 1) * padding + this.settings.borderWidth * 2
                };

            default:
                return { width: 800, height: 600 };
        }
    }

    drawImages() {
        const padding = this.settings.padding;
        const borderWidth = this.settings.borderWidth;

        let adjustedImages = this.prepareImagesForSizing();

        if (this.isMasonryMode()) {
            adjustedImages.forEach(imgData => {
                this.ctx.drawImage(
                    imgData.image,
                    imgData.sx || 0, imgData.sy || 0,
                    imgData.sWidth || imgData.image.width,
                    imgData.sHeight || imgData.image.height,
                    imgData.x + borderWidth,
                    imgData.y + borderWidth,
                    imgData.dWidth,
                    imgData.dHeight
                );
            });
        } else {
            let x = borderWidth;
            let y = borderWidth;

            switch (this.layout) {
                case 'horizontal':
                    adjustedImages.forEach((imgData) => {
                        this.ctx.drawImage(
                            imgData.image,
                            imgData.sx || 0, imgData.sy || 0,
                            imgData.sWidth || imgData.image.width,
                            imgData.sHeight || imgData.image.height,
                            x, y, imgData.dWidth, imgData.dHeight
                        );
                        x += imgData.dWidth + padding;
                    });
                    break;

                case 'vertical':
                    adjustedImages.forEach((imgData) => {
                        this.ctx.drawImage(
                            imgData.image,
                            imgData.sx || 0, imgData.sy || 0,
                            imgData.sWidth || imgData.image.width,
                            imgData.sHeight || imgData.image.height,
                            x, y, imgData.dWidth, imgData.dHeight
                        );
                        y += imgData.dHeight + padding;
                    });
                    break;

                case 'grid':
                    const cols = Math.ceil(Math.sqrt(adjustedImages.length));
                    adjustedImages.forEach((imgData, index) => {
                        const col = index % cols;
                        const row = Math.floor(index / cols);
                        const drawX = col * (imgData.dWidth + padding) + borderWidth;
                        const drawY = row * (imgData.dHeight + padding) + borderWidth;
                        this.ctx.drawImage(
                            imgData.image,
                            imgData.sx || 0, imgData.sy || 0,
                            imgData.sWidth || imgData.image.width,
                            imgData.sHeight || imgData.image.height,
                            drawX, drawY, imgData.dWidth, imgData.dHeight
                        );
                    });
                    break;
            }
        }

        if (borderWidth > 0) {
            this.ctx.strokeStyle = this.settings.borderColor;
            this.ctx.lineWidth = borderWidth;
            this.ctx.strokeRect(borderWidth / 2, borderWidth / 2, this.canvas.width - borderWidth, this.canvas.height - borderWidth);
        }
    }

    prepareImagesForSizing() {
        if (this.images.length === 0) {
            return [];
        }

        const images = this.images.map(img => img.data);

        if (this.isMasonryMode()) {
            return this.prepareMasonryLayout(this.getMasonryColumns());
        }

        switch (this.settings.imageSizing) {
            case 'none':
                return this.images.map(img => ({
                    image: img.data,
                    dWidth: img.data.width,
                    dHeight: img.data.height,
                    x: 0,
                    y: 0
                }));

            case 'fit-width':
                const maxWidth = Math.max(...images.map(img => img.width));
                return this.images.map(img => {
                    const scale = maxWidth / img.data.width;
                    return {
                        image: img.data,
                        dWidth: maxWidth,
                        dHeight: img.data.height * scale,
                        x: 0,
                        y: 0
                    };
                });

            case 'fit-height':
                const maxHeight = Math.max(...images.map(img => img.height));
                return this.images.map(img => {
                    const scale = maxHeight / img.data.height;
                    return {
                        image: img.data,
                        dWidth: img.data.width * scale,
                        dHeight: maxHeight,
                        x: 0,
                        y: 0
                    };
                });

            case 'fit-smallest':
                const minWidth = Math.min(...images.map(img => img.width));
                const minHeight = Math.min(...images.map(img => img.height));
                
                return this.images.map(img => {
                    const scaleW = minWidth / img.data.width;
                    const scaleH = minHeight / img.data.height;
                    const scale = Math.min(scaleW, scaleH);

                    return {
                        image: img.data,
                        dWidth: img.data.width * scale,
                        dHeight: img.data.height * scale,
                        x: 0,
                        y: 0
                    };
                });

            case 'crop-uniform':
                const cropMaxWidth = Math.max(...images.map(img => img.width));
                const cropMaxHeight = Math.max(...images.map(img => img.height));

                return this.images.map(img => {
                    const image = img.data;
                    const sourceAspect = image.width / image.height;
                    const targetAspect = cropMaxWidth / cropMaxHeight;

                    let sx, sy, sWidth, sHeight;

                    if (sourceAspect > targetAspect) {
                        sHeight = image.height;
                        sWidth = image.height * targetAspect;
                        sx = (image.width - sWidth) / 2;
                        sy = 0;
                    } else {
                        sWidth = image.width;
                        sHeight = image.width / targetAspect;
                        sx = 0;
                        sy = (image.height - sHeight) / 2;
                    }

                    return {
                        image: image,
                        sx: sx,
                        sy: sy,
                        sWidth: sWidth,
                        sHeight: sHeight,
                        dWidth: cropMaxWidth,
                        dHeight: cropMaxHeight,
                        x: 0,
                        y: 0
                    };
                });

            case 'stretch-uniform':
                const stretchWidth = Math.max(...images.map(img => img.width));
                const stretchHeight = Math.max(...images.map(img => img.height));

                return this.images.map(img => ({
                    image: img.data,
                    dWidth: stretchWidth,
                    dHeight: stretchHeight,
                    x: 0,
                    y: 0
                }));

            default:
                return this.images.map(img => ({
                    image: img.data,
                    dWidth: img.data.width,
                    dHeight: img.data.height,
                    x: 0,
                    y: 0
                }));
        }
    }

    prepareMasonryLayout(numColumns) {
        if (this.images.length === 0) return [];

        const padding = this.settings.padding;
        const canvasWidth = 1600;

        let items = this.images.map((img, index) => ({
            image: img.data,
            dWidth: img.data.width,
            dHeight: img.data.height,
            originalIndex: index,
            placed: false,
            x: 0,
            y: 0
        }));

        items.sort((a, b) => b.dHeight - a.dHeight);

        const columnWidth = (canvasWidth - (numColumns - 1) * padding) / numColumns;
        const columns = Array(numColumns).fill(0).map(() => ({ height: 0, items: [] }));

        items.forEach(item => {
            const scale = columnWidth / item.dWidth;
            item.dWidth = columnWidth;
            item.dHeight = item.dHeight * scale;

            let shortestCol = 0;
            let shortestHeight = columns[0].height;

            for (let i = 1; i < columns.length; i++) {
                if (columns[i].height < shortestHeight) {
                    shortestHeight = columns[i].height;
                    shortestCol = i;
                }
            }

            item.x = shortestCol * (columnWidth + padding);
            item.y = columns[shortestCol].height;

            columns[shortestCol].items.push(item);
            columns[shortestCol].height += item.dHeight + padding;
            item.placed = true;
        });

        return items;
    }

    showSections() {
        document.getElementById('image-section').classList.remove('hidden');
        document.getElementById('layout-section').style.display = 'block';
        document.getElementById('preview-section').style.display = 'block';
        document.getElementById('action-buttons').style.display = 'flex';
    }

    hideSections() {
        document.getElementById('image-section').classList.add('hidden');
        document.getElementById('layout-section').style.display = 'none';
        document.getElementById('preview-section').style.display = 'none';
        document.getElementById('action-buttons').style.display = 'none';
        document.getElementById('download-jpg-btn').disabled = true;
        document.getElementById('download-png-btn').disabled = true;
        document.getElementById('download-avif-btn').disabled = true;
    }

    showStatus(message, type) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');

        if (type === 'success') {
            setTimeout(() => {
                status.classList.add('hidden');
            }, 3000);
        }
    }

    async downloadImage(format) {
        if (this.images.length === 0) return;

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

        if (format === 'avif') {
            this.showStatus('Encoding AVIF... (this may take a moment)', 'success');

            try {
                const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

                const blob = await new Promise((resolve, reject) => {
                    const handleMessage = (e) => {
                        this.avifWorker.removeEventListener('message', handleMessage);
                        this.avifWorker.removeEventListener('error', handleError);

                        if (e.data.error) {
                            reject(new Error(e.data.error));
                        } else {
                            resolve(e.data.blob);
                        }
                    };

                    const handleError = (error) => {
                        this.avifWorker.removeEventListener('message', handleMessage);
                        this.avifWorker.removeEventListener('error', handleError);
                        reject(error);
                    };

                    this.avifWorker.addEventListener('message', handleMessage);
                    this.avifWorker.addEventListener('error', handleError);

                    this.avifWorker.postMessage({
                        imageData: imageData,
                        quality: 50,
                        effort: 8
                    }, [imageData.data.buffer]);
                });

                link.download = `combined-image-${timestamp}.avif`;
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
                this.showStatus(`Image downloaded as AVIF!`, 'success');
            } catch (error) {
                console.error('AVIF encoding error:', error);
                this.showStatus(`Error encoding AVIF: ${error.message}`, 'error');
            }
        } else if (format === 'jpg') {
            link.download = `combined-image-${timestamp}.jpg`;
            link.href = this.canvas.toDataURL('image/jpeg', this.settings.jpgQuality);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showStatus(`Image downloaded as JPG!`, 'success');
        } else {
            link.download = `combined-image-${timestamp}.png`;
            link.href = this.canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showStatus(`Image downloaded as PNG!`, 'success');
        }
    }

    reset() {
        this.images = [];
        this.layout = 'vertical';
        this.settings = {
            padding: 10,
            backgroundColor: '#000000',
            borderWidth: 0,
            borderColor: '#000000',
            outputFormat: 'jpg',
            jpgQuality: 0.85,
            imageSizing: 'none'
        };

        document.getElementById('file-input').value = '';
        document.getElementById('image-grid').innerHTML = '';
        document.getElementById('padding-slider').value = 10;
        document.getElementById('padding-value').textContent = '10';
        document.getElementById('bg-color').value = '000000';
        document.getElementById('bg-color-text').textContent = '000000';
        document.getElementById('border-slider').value = 0;
        document.getElementById('border-value').textContent = '0';
        document.getElementById('border-color').value = '#000000';
        document.getElementById('border-color-text').textContent = '#000000';
        const imageSizingDropdown = document.getElementById('imageSizingDropdown');
        if (imageSizingDropdown) {
            imageSizingDropdown.querySelector('.selected').textContent = 'Keep original sizes';
        }

        document.querySelectorAll('.layout-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-layout="vertical"]').classList.add('active');

        this.hideSections();
        this.showStatus('Reset complete!', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.imageCombiner = new ImageCombiner();
});