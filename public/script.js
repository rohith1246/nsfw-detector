let currentImageBase64 = null;

async function uploadImage() {
  const fileInput = document.getElementById('imageUpload');
  const resultDiv = document.getElementById('result');
  const analyzeBtn = document.getElementById('analyzeBtn');

  if (!fileInput.files[0]) {
    resultDiv.style.display = 'flex';
    resultDiv.className = 'result';
    resultDiv.innerHTML = '⚠️ Please select an image first.';
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing...';

  resultDiv.style.display = 'none';

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (e) {
    currentImageBase64 = e.target.result;
    showPreview(currentImageBase64);

    try {
      const model = await tf.loadGraphModel('/nsfw/model.json');

      const img = new Image();
      img.src = currentImageBase64;
      await img.decode();

      const tfImage = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims(0);

      const prediction = model.predict(tfImage);
      const data = await prediction.data();
      const classIndex = prediction.argMax(-1).dataSync()[0];

      const classLabels = ['drawings', 'hentai', 'neutral', 'porn', 'sexy'];
      const predictedClass = classLabels[classIndex];
      const confidence = data[classIndex].toFixed(4);

      const adultClasses = ['hentai', 'porn', 'sexy'];
      const isAdult = adultClasses.includes(predictedClass);

      resultDiv.className = `result ${isAdult ? 'adult' : 'safe'}`;
      resultDiv.style.display = 'flex';
      resultDiv.innerHTML = `
        <strong>${predictedClass.toUpperCase()}</strong><br>
        Confidence: <strong>${confidence}</strong><br>
        ${isAdult ? '⚠️ Adult Content Detected' : '✅ Safe for Work'}
      `;

      tf.dispose([tfImage, prediction]);
    } catch (error) {
      console.error(error);
      resultDiv.style.display = 'flex';
      resultDiv.className = 'result';
      resultDiv.innerHTML = '❌ Error during analysis. Please try again.';
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Image';
    }
  };

  reader.readAsDataURL(file);
}

// Preview + Drag & Drop Support
function showPreview(src) {
  const preview = document.getElementById('preview');
  const previewContainer = document.getElementById('previewContainer');
  const uploadArea = document.getElementById('uploadArea');

  preview.src = src;
  previewContainer.style.display = 'block';
  uploadArea.style.display = 'none';
  document.getElementById('analyzeBtn').disabled = false;
}

// Setup Drag & Drop + Click
document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('imageUpload');
  const removeBtn = document.getElementById('removeBtn');

  uploadArea.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        currentImageBase64 = ev.target.result;
        showPreview(currentImageBase64);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Drag & Drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#a78bfa';
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#64748b';
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#64748b';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        currentImageBase64 = ev.target.result;
        showPreview(currentImageBase64);
      };
      reader.readAsDataURL(file);
    }
  });

  removeBtn.addEventListener('click', () => {
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('imageUpload').value = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('analyzeBtn').disabled = true;
  });
});