// Global variables to store our image data
let canvas = null;
let ctx = null;
let currentImage = null;
let rotation = 0;
let flipH = 1;
let flipV = 1;
let currentFilter = 'none';

// Image adjustment values
let adjustments = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
};

// ==========================================
// INITIALIZATION - Runs when page loads
// ==========================================

function initImageEditor() {
    // Get the canvas and drawing context
    canvas = document.getElementById('imageCanvas');
    ctx = canvas.getContext('2d');
    // Set up event listeners
    setupEventListeners();
    // Update the display values
    updateAdjustmentValues();
}

// Set up all the event listeners
function setupEventListeners() {
    // File upload listener
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }

    // Slider listeners for adjustments
    setupSliderListener('brightness');
    setupSliderListener('contrast');
    setupSliderListener('saturation');
    setupSliderListener('blur');
}

// Helper function to set up individual slider
function setupSliderListener(sliderName) {
    const slider = document.getElementById(sliderName);
    if (slider) {
        slider.addEventListener('input', function() {
            // Update the value
            adjustments[sliderName] = slider.value;
            
            // Update the display
            updateAdjustmentValues();
            
            // Redraw the image with new settings
            redrawImage();
        });
    }
}

// ==========================================
// IMAGE UPLOAD HANDLING
// ==========================================

function handleImageUpload(event) {
    // Get the uploaded file
    const file = event.target.files[0];
    if (!file) return;

    // Check if it's actually an image
    if (!file.type.startsWith('image/')) {
        showMessage('Please upload a valid image file', 'error');
        return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create a new image object
        const img = new Image();
        img.onload = function() {
            // Store the image
            currentImage = img;
            
            // Reset all adjustments
            resetAllSettings();
            
            // Display the image
            displayImage();
            
            // Show image information
            updateImageInfo(file);
            
            // Show success message
            showMessage('Image uploaded successfully!', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ==========================================
// IMAGE DISPLAY AND DRAWING
// ==========================================

function displayImage() {
    if (!currentImage) return;

    // Calculate the right size for the canvas
    const maxWidth = 800;
    const maxHeight = 500;
    let width = currentImage.width;
    let height = currentImage.height;

    // Make image smaller if it's too big
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
    }

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Save the current drawing state
    ctx.save();

    // Move to center, rotate, scale, then move back
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH, flipV);
    ctx.translate(-width / 2, -height / 2);

    // Apply all the filters
    applyFiltersToContext();

    // Draw the image
    ctx.drawImage(currentImage, 0, 0, width, height);

    // Restore the drawing state
    ctx.restore();

    // Show the canvas, hide the placeholder
    canvas.style.display = 'block';
    document.getElementById('placeholder').style.display = 'none';
}

// Apply all filters to the drawing context
function applyFiltersToContext() {
    if (!ctx) return;

    let filters = [];
    
    // Add basic adjustments
    filters.push('brightness(' + adjustments.brightness + '%)');
    filters.push('contrast(' + adjustments.contrast + '%)');
    filters.push('saturate(' + adjustments.saturation + '%)');
    filters.push('blur(' + adjustments.blur + 'px)');

    // Add preset filters
    if (currentFilter === 'grayscale') {
        filters.push('grayscale(100%)');
    } else if (currentFilter === 'sepia') {
        filters.push('sepia(100%)');
    } else if (currentFilter === 'invert') {
        filters.push('invert(100%)');
    } else if (currentFilter === 'vintage') {
        filters.push('sepia(50%)');
        filters.push('contrast(120%)');
        filters.push('brightness(90%)');
    } else if (currentFilter === 'cold') {
        filters.push('hue-rotate(180deg)');
        filters.push('saturate(120%)');
    } else if (currentFilter === 'warm') {
        filters.push('hue-rotate(-30deg)');
        filters.push('saturate(130%)');
        filters.push('brightness(110%)');
    }

    // Apply all filters at once
    ctx.filter = filters.join(' ');
}

// Redraw the image (called when settings change)
function redrawImage() {
    if (currentImage) {
        displayImage();
    }
}

// ==========================================
// UI UPDATES
// ==========================================

// Update the displayed values for sliders
function updateAdjustmentValues() {
    document.getElementById('brightnessValue').textContent = adjustments.brightness + '%';
    document.getElementById('contrastValue').textContent = adjustments.contrast + '%';
    document.getElementById('saturationValue').textContent = adjustments.saturation + '%';
    document.getElementById('blurValue').textContent = adjustments.blur + 'px';
}

// Update image information display
function updateImageInfo(file) {
    document.getElementById('imageSize').textContent = formatFileSize(file.size);
    document.getElementById('imageDimensions').textContent = currentImage.width + ' × ' + currentImage.height;
    document.getElementById('imageFormat').textContent = file.type.split('/')[1].toUpperCase();
}

// Format file size in human readable format
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    
    while (bytes >= 1024 && i < sizes.length - 1) {
        bytes = bytes / 1024;
        i++;
    }
    
    return Math.round(bytes * 100) / 100 + ' ' + sizes[i];
}

// ==========================================
// FILTER AND TRANSFORM FUNCTIONS
// ==========================================

// Apply a preset filter
function applyFilter(filterName) {
    if (!currentImage) {
        showMessage('Please upload an image first', 'error');
        return;
    }

    currentFilter = filterName;
    
    // Update the active button
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Redraw the image
    redrawImage();
}

// Rotate the image
function rotateImage(degrees) {
    if (!currentImage) {
        showMessage('Please upload an image first', 'error');
        return;
    }

    rotation = rotation + degrees;
    redrawImage();
}

// Flip the image
function flipImage(direction) {
    if (!currentImage) {
        showMessage('Please upload an image first', 'error');
        return;
    }

    if (direction === 'horizontal') {
        flipH = flipH * -1;
    } else {
        flipV = flipV * -1;
    }
    
    redrawImage();
}

// Reset all settings to default
function resetImage() {
    if (!currentImage) {
        showMessage('Please upload an image first', 'error');
        return;
    }

    resetAllSettings();
    redrawImage();
    showMessage('Image reset to original', 'success');
}

// Reset all settings (internal function)
function resetAllSettings() {
    rotation = 0;
    flipH = 1;
    flipV = 1;
    currentFilter = 'none';
    
    adjustments = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0
    };
    
    // Reset sliders
    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('saturation').value = 100;
    document.getElementById('blur').value = 0;
    
    updateAdjustmentValues();
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-btn').classList.add('active');
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================

// Download the edited image
function downloadImage() {
    if (!currentImage) {
        showMessage('Please upload an image first', 'error');
        return;
    }

    // Create a download link
    const link = document.createElement('a');
    link.download = 'edited-image-' + Date.now() + '.png';
    link.href = canvas.toDataURL();
    link.click();
    
    showMessage('Image downloaded successfully!', 'success');
}

// Copy image to clipboard
async function copyToClipboard() {
    if (!currentImage) {
        showMessage('Please upload an image first', 'error');
        return;
    }

    try {
        canvas.toBlob(async function(blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            showMessage('Image copied to clipboard!', 'success');
        });
    } catch (err) {
        showMessage('Failed to copy to clipboard', 'error');
        console.error('Clipboard error:', err);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Show a message to the user
function showMessage(message, type) {
    type = type || 'success';
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'editor-message ' + type;
    messageDiv.textContent = message;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(function() {
        messageDiv.remove();
    }, 3000);
}

// ==========================================
// START THE EDITOR WHEN PAGE LOADS
// ==========================================

// Check if we're on the image editor page, then initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if image editor page is active
    const imageEditorPage = document.getElementById('image-editor');
    if (imageEditorPage && imageEditorPage.classList.contains('active')) {
        initImageEditor();
    }
    
    // Also listen for page changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'image-editor' && target.classList.contains('active')) {
                    // Initialize if not already initialized
                    if (!canvas) {
                        initImageEditor();
                    }
                }
            }
        });
    });
    
    // Observe all pages for class changes
    document.querySelectorAll('.page').forEach(function(page) {
        observer.observe(page, { attributes: true });
    });
});
