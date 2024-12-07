export const checkImageFake = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  };
  