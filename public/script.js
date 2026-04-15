let currentImageBase64 = null;
let scanHistory = JSON.parse(localStorage.getItem('nsfwHistory')) || [];

const classLabels = ['Drawings', 'Hentai', 'Neutral', 'Porn', 'Sexy'];
const adultClasses = ['Hentai', 'Porn', 'Sexy'];

function saveToHistory(base64, prediction, confidence, isAdult) {
  scanHistory.unshift({
    image: base64,
    prediction: prediction,
    confidence: confidence,
    isAdult: isAdult,
    timestamp: new Date().toLocaleTimeString()
  });

  if (scanHistory.length > 5) scanHistory.pop();
  localStorage.setItem('nsfwHistory', JSON.stringify(scanHistory));
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('historyList');
  const section = document.getElementById('historySection');
  
  if (scanHistory.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = '';

  scanHistory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <img src="${item.image}" alt="preview">
      <div>
        <strong>${item.prediction}</strong><br>
        <small>Confidence: ${(item.confidence * 100).toFixed(1)}% • ${item.timestamp}</small>
      </div>
    `;
    container.appendChild(div);
  });
}

// Main Analysis Function
async function uploadImage() {
  const fileInput = document.getElementById('imageUpload');
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');
  const analyzeBtn = document.getElementById('analyzeBtn');

  if (!fileInput.files[0]) return;

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";
  loadingDiv.style.display = 'block';
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

      const predictedClass = classLabels[classIndex];
      const confidence = data[classIndex];
      const isAdult = adultClasses.includes(predictedClass);

      // Display Result with Confidence Bars
      let html = `
        <strong style="font-size:18px;">${predictedClass}</strong><br>
        <span style="font-size:15px;">Confidence: <strong>${(confidence*100).toFixed(1)}%</strong></span>
      `;

      html += `<div style="margin-top:12px;">`;
      data.forEach((val, i) => {
        const percent = (val * 100).toFixed(1);
        html += `
          <small>${classLabels[i]}: ${percent}%</small>
          <div class="confidence-bar"><div class="bar-fill" style="width: ${percent}%"></div></div>
        `;
      });
      html += `</div>`;

      resultDiv.className = `result ${isAdult ? 'adult' : 'safe'}`;
      resultDiv.innerHTML = html;
      resultDiv.style.display = 'flex';

      saveToHistory(currentImageBase64, predictedClass, confidence, isAdult);

      tf.dispose([tfImage, prediction]);

    } catch (error) {
      console.error(error);
      resultDiv.className = 'result';
      resultDiv.innerHTML = '❌ Error during analysis. Please try again.';
      resultDiv.style.display = 'flex';
    } finally {
      loadingDiv.style.display = 'none';
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Image';
    }
  };

  reader.readAsDataURL(file);
}

function showPreview(src) {
  document.getElementById('preview').src = src;
  document.getElementById('previewContainer').style.display = 'block';
  document.getElementById('uploadArea').style.display = 'none';
  document.getElementById('analyzeBtn').disabled = false;
}

// Drag & Drop + Click Setup
document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('imageUpload');
  const removeBtn = document.getElementById('removeBtn');

  uploadArea.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ev => {
        currentImageBase64 = ev.target.result;
        showPreview(currentImageBase64);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Drag & Drop
  uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = '#a78bfa'; });
  uploadArea.addEventListener('dragleave', () => uploadArea.style.borderColor = '#7c3aed');
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.style.borderColor = '#7c3aed';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => {
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

  // Load history on start
  renderHistory();
});