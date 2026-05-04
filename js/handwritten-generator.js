
// Global variables
let textarea = null;
let preview = null;
let fontSelect = null;
let fontSizeSlider = null;
let fontSizeValue = null;

// ==========================================
// INITIALIZATION - Runs when page loads
// ==========================================

function initHandwrittenGenerator() {
    // Get all the elements
    textarea = document.getElementById('handwrittenText');
    preview = document.getElementById('handwrittenPreview');
    fontSelect = document.getElementById('fontStyle');
    fontSizeSlider = document.getElementById('fontSize');
    fontSizeValue = document.getElementById('fontSizeValue');
    
    // Check if elements exist
    if (!textarea || !preview) return;

    // Set up event listeners
    setupEventListeners();
    
    // Initialize the display
    updateFontSize();
    updatePreview();
}

// Set up all event listeners
function setupEventListeners() {
    // Make sure elements exist before adding listeners
    if (!textarea || !preview || !fontSelect || !fontSizeSlider) {
        console.log('Handwritten generator elements not found');
        return;
    }
    
    console.log('Setting up handwritten generator event listeners');
    
    // Update preview when text changes
    textarea.addEventListener('input', function() {
        console.log('Text input detected');
        updatePreview();
    });
    
    // Update preview when font changes
    fontSelect.addEventListener('change', function() {
        console.log('Font change detected');
        updatePreview();
    });
    
    // Update font size when slider changes
    fontSizeSlider.addEventListener('input', function() {
        console.log('Font size change detected');
        updateFontSize();
    });
}

// ==========================================
// PREVIEW FUNCTIONS
// ==========================================

// Update the preview display
function updatePreview() {
    console.log('updatePreview called');
    
    if (!textarea || !preview || !fontSelect || !fontSizeSlider) {
        console.log('Missing elements in updatePreview');
        return;
    }
    
    const text = textarea.value;
    const font = fontSelect.value;
    const fontSize = fontSizeSlider.value;

    console.log('Updating preview with:', { text: text.substring(0, 50), font, fontSize });

    // Show placeholder if no text
    if (text.trim() === '') {
        preview.innerHTML = '<p>Your handwritten text will appear here...</p>';
        return;
    }

    // Apply styles to preview
    preview.style.fontFamily = "'" + font + "', cursive";
    preview.style.fontSize = fontSize + 'px';
    
    // Format and display the text
    preview.innerHTML = formatText(text);
    
    console.log('Preview updated successfully');
}

// Update the font size display
function updateFontSize() {
    const fontSize = fontSizeSlider.value;
    fontSizeValue.textContent = fontSize + 'px';
    updatePreview();
}

// Format text for display (convert line breaks to HTML)
function formatText(text) {
    return text.replace(/\n/g, '<br>');
}

// ==========================================
// DOWNLOAD FUNCTIONS
// ==========================================

// Download as PDF using browser print
function downloadAsPDF() {
    const text = textarea.value;
    
    if (!text.trim()) {
        showErrorMessage('Please enter some text before downloading.');
        return;
    }

    // Get current settings
    const font = fontSelect.value;
    const fontSize = fontSizeSlider.value;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Write the HTML for the print page
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Handwritten Assignment</title>
          <link href="https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: '${font}', cursive;
              font-size: ${fontSize}px;
              line-height: 1.8;
              color: #000;
              margin: 20px;
              background: white;
            }
            @media print {
              body { margin: 10px; }
            }
          </style>
        </head>
        <body>
          ${text.replace(/\n/g, '<br>')}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
    };
}

// Download as image using canvas
function downloadAsImage() {
    const text = textarea.value;
    
    if (!text.trim()) {
        showErrorMessage('Please enter some text before downloading.');
        return;
    }

    // Get current settings
    const font = fontSelect.value;
    const fontSize = parseInt(fontSizeSlider.value);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.fillStyle = 'black';
    ctx.font = fontSize + 'px "' + font + '", cursive';
    ctx.textBaseline = 'top';
    
    // Calculate text layout
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.8;
    let y = 40;
    const x = 40;
    const maxWidth = canvas.width - 80;
    
    // Draw each line
    lines.forEach(function(line) {
        if (line.trim() === '') {
            y = y + lineHeight / 2;
            return;
        }
        
        // Handle long lines by wrapping text
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(function(word) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                ctx.fillText(currentLine, x, y);
                currentLine = word;
                y = y + lineHeight;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            ctx.fillText(currentLine, x, y);
            y = y + lineHeight;
        }
    });
    
    // Adjust canvas height to fit content
    const finalHeight = y + 40;
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = finalHeight;
    const finalCtx = finalCanvas.getContext('2d');
    
    // Redraw on final canvas
    finalCtx.fillStyle = 'white';
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    finalCtx.drawImage(canvas, 0, 0);
    
    // Download the image
    finalCanvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'handwritten-assignment-' + Date.now() + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Generate handwritten text (button function)
function generateHandwritten() {
    updatePreview();
    showSuccessMessage('Handwritten text generated successfully!');
}

// Show success message
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

// Show error message
function showErrorMessage(message) {
    showMessage(message, 'error');
}

// Generic message function
function showMessage(message, type) {
    type = type || 'success';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type + '-message';
    messageDiv.textContent = message || 'Handwritten text generated successfully!';
    
    // Style the message
    if (type === 'success') {
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #0066ff 0%, #00ccff 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
    } else {
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(function() {
        messageDiv.remove();
    }, 3000);
}

// ==========================================
// START THE GENERATOR WHEN PAGE LOADS
// ==========================================

// Simple initialization - try to initialize every time the page changes
document.addEventListener('DOMContentLoaded', function() {
    // Try to initialize immediately
    setTimeout(function() {
        const handwrittenPage = document.getElementById('handwritten-generator');
        if (handwrittenPage) {
            initHandwrittenGenerator();
        }
    }, 100);
    
    // Also try every time someone clicks navigation
    document.addEventListener('click', function(e) {
        if (e.target.getAttribute('data-page') === 'handwritten-generator') {
            setTimeout(function() {
                initHandwrittenGenerator();
            }, 100);
        }
    });
    
    // Also check periodically
    setInterval(function() {
        const handwrittenPage = document.getElementById('handwritten-generator');
        if (handwrittenPage && handwrittenPage.classList.contains('active') && !textarea) {
            initHandwrittenGenerator();
        }
    }, 1000);
});
