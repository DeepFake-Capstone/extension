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

// Close button functionality - removes the image from the drop zone without closing the popup
closeButton.addEventListener('click', () => {
  if (selectedFile) {
    // Reset the drop zone and selected file when the close button is clicked
    selectedFile = null;
    dropZone.textContent = 'Drag and drop an image here'; // Reset the text
    checkButton.disabled = true; // Disable the check button again
    statusMessage.textContent = ''; // Clear any status message
  }
  // Close the popup when the close button is clicked
  window.close();
});

// Prevent the popup from closing on outside clicks
popupContainer.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents accidental dismissal of the popup
});

// Remove the click event listener from the document that was closing the popup
// As we no longer need to prevent clicking outside, we can remove the code handling it here

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

        // Apply color based on prediction
        if (dominantClass === "Fake") {
          statusMessage.innerHTML = `
            Prediction: <strong style="color: red;">${dominantClass}</strong><br>
            Confidence: <span style="color: red;">${dominantScore}%</span>
          `;
        } else {
          statusMessage.innerHTML = `
            Prediction: <strong style="color: green;">${dominantClass}</strong><br>
            Confidence: <span style="color: green;">${dominantScore}%</span>
          `;
        }
      }
    } catch (error) {
      statusMessage.textContent = 'Error checking image.';
      console.error(error);
    }
  }
});

// Clicking the drop zone when an image is selected will reset the drop zone
dropZone.addEventListener('click', () => {
  if (selectedFile) {
    // Reset the drop zone and selected file
    selectedFile = null;
    dropZone.textContent = 'Drag and drop an image here';
    checkButton.disabled = true;
    statusMessage.textContent = '';
  }
});
