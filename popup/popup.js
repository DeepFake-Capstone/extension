let selectedFile = null;

const dropZone = document.getElementById('drop-zone');
const checkButton = document.getElementById('check-button');
const statusMessage = document.getElementById('status-message');
const closeButton = document.getElementById('close-button');
const popupContainer = document.getElementById('popup-container');

// Drag-and-drop functionality
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('active');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    selectedFile = files[0];
    dropZone.textContent = `Selected: ${selectedFile.name}`;
    checkButton.disabled = false;
  }
});

// Close button functionality
closeButton.addEventListener('click', () => {
  popupContainer.style.display = 'none'; // Hides the popup
});

// Prevent the popup from closing on outside clicks
document.addEventListener('click', (e) => {
  if (!popupContainer.contains(e.target) && e.target !== closeButton) {
    e.stopPropagation(); // Prevents accidental dismissal
  }
});

// API call
checkButton.addEventListener('click', async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get a valid response from the server');
      }

      const result = await response.json();

      if (result.error) {
        statusMessage.textContent = `Error: ${result.error}`;
      } else {
        const { predicted_class, scoreFake, scoreReal } = result;

        // Determine the dominant class and confidence
        const dominantClass = scoreFake > scoreReal ? "Fake" : "Real";
        const dominantScore = scoreFake > scoreReal ? scoreFake : scoreReal;

        statusMessage.innerHTML = `
          Prediction: <strong>${dominantClass}</strong><br>
          Confidence: ${dominantScore}%
        `;
      }
    } catch (error) {
      statusMessage.textContent = 'Error checking image.';
      console.error(error);
    }
  }
});
