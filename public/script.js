/* ─────────────────────────────────────────
   NSFW Shield · script.js
   Rohith Builds Labs
───────────────────────────────────────── */

const classLabels = ['Drawings', 'Hentai', 'Neutral', 'Porn', 'Sexy'];
const adultClasses = ['Hentai', 'Porn', 'Sexy'];

let currentImageBase64 = null;
let loadedModel = null;         // Cache model after first load
let scanHistory = [];

// ── Safe localStorage helpers ─────────────────
function storageSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Incognito / storage full — silently skip
    console.warn('localStorage unavailable:', e.message);
  }
}

function storageLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

// Load history on boot
scanHistory = storageLoad('nsfwHistory', []);

// ── Model Status UI ───────────────────────────
function setModelStatus(state) {
  // state: 'loading' | 'ready' | 'error'
  const dot  = document.querySelector('.status-dot');
  const text = document.getElementById('modelStatusText');
  const statusEl = document.getElementById('modelStatus');

  dot.className = 'status-dot';   // reset classes

  if (state === 'ready') {
    dot.classList.add('ready-dot');
    text.textContent = 'AI model ready';
    // Auto-hide after 3 s
    setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
  } else if (state === 'error') {
    dot.classList.add('error-dot');
    text.textContent = 'Model failed to load — check /nsfw/model.json path';
    statusEl.style.display = 'flex';
  } else {
    dot.classList.add('loading-dot');
    text.textContent = 'Loading AI model...';
    statusEl.style.display = 'flex';
  }
}

// ── Preload model on page boot ────────────────
async function preloadModel() {
  try {
    setModelStatus('loading');
    loadedModel = await tf.loadGraphModel('/nsfw/model.json');
    setModelStatus('ready');
  } catch (err) {
    console.error('Model load failed:', err);
    setModelStatus('error');
    // Disable analyze button permanently if model won't load
    document.getElementById('analyzeBtn').disabled = true;
    document.getElementById('analyzeBtn').title = 'Model unavailable';
  }
}

// ── History ───────────────────────────────────
function saveToHistory(base64, prediction, confidence, isAdult) {
  scanHistory.unshift({
    image: base64,
    prediction,
    confidence,
    isAdult,
    timestamp: new Date().toLocaleTimeString()
  });

  if (scanHistory.length > 5) scanHistory.pop();
  storageSave('nsfwHistory', scanHistory);
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('historyList');
  const section   = document.getElementById('historySection');

  if (scanHistory.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = '';

  scanHistory.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const badge = item.isAdult
      ? `<span class="badge badge-adult">Adult</span>`
      : `<span class="badge badge-safe">Safe</span>`;
    div.innerHTML = `
      <img src="${item.image}" alt="scan preview">
      <div>
        <strong>${item.prediction}</strong> ${badge}<br>
        <small>Confidence: ${(item.confidence * 100).toFixed(1)}% · ${item.timestamp}</small>
      </div>
    `;
    container.appendChild(div);
  });
}

// ── Reset UI to initial state ─────────────────
function resetUI() {
  document.getElementById('previewContainer').style.display = 'none';
  document.getElementById('uploadArea').style.display      = 'block';
  document.getElementById('imageUpload').value             = '';
  document.getElementById('result').style.display          = 'none';
  document.getElementById('result').className              = 'result';
  document.getElementById('analyzeBtn').disabled           = true;
  currentImageBase64 = null;
}

// ── Show preview ──────────────────────────────
function showPreview(src) {
  document.getElementById('preview').src                   = src;
  document.getElementById('previewContainer').style.display = 'block';
  document.getElementById('uploadArea').style.display      = 'none';
  // Only enable if model is ready
  document.getElementById('analyzeBtn').disabled = (loadedModel === null);
}

// ── Main Analysis ─────────────────────────────
async function analyzeImage() {
  const fileInput  = document.getElementById('imageUpload');
  const resultDiv  = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');
  const analyzeBtn = document.getElementById('analyzeBtn');

  if (!fileInput.files[0] && !currentImageBase64) return;

  analyzeBtn.disabled     = true;
  analyzeBtn.textContent  = 'Analyzing...';
  loadingDiv.style.display = 'block';
  resultDiv.style.display  = 'none';

  try {
    // Use cached model or load fresh
    const model = loadedModel || await tf.loadGraphModel('/nsfw/model.json');
    if (!loadedModel) loadedModel = model;   // cache for next run

    const img = new Image();
    img.src = currentImageBase64;
    await img.decode();

    const tfImage = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims(0);

    const prediction  = model.predict(tfImage);
    const data        = await prediction.data();
    const classIndex  = prediction.argMax(-1).dataSync()[0];

    const predictedClass = classLabels[classIndex];
    const confidence     = data[classIndex];
    const isAdult        = adultClasses.includes(predictedClass);

    // ── Result HTML ──
    let html = `
      <div class="result-headline">
        <strong>${isAdult ? '🔞' : '✅'} ${predictedClass}</strong>
        <span class="confidence-pill">${(confidence * 100).toFixed(1)}%</span>
      </div>
    `;

    html += `<div class="bars-grid">`;
    data.forEach((val, i) => {
      const percent = (val * 100).toFixed(1);
      html += `
        <small>${classLabels[i]}</small>
        <div class="confidence-bar">
          <div class="bar-fill" style="width: ${percent}%"></div>
        </div>
        <small class="bar-pct">${percent}%</small>
      `;
    });
    html += `</div>`;

    resultDiv.className    = `result ${isAdult ? 'adult' : 'safe'}`;
    resultDiv.innerHTML    = html;
    resultDiv.style.display = 'flex';

    saveToHistory(currentImageBase64, predictedClass, confidence, isAdult);

    tf.dispose([tfImage, prediction]);

  } catch (error) {
    console.error('Analysis error:', error);
    resultDiv.className    = 'result result-error';
    resultDiv.innerHTML    = `
      <strong>Analysis failed</strong><br>
      <small>${error.message || 'Unknown error. Check the browser console.'}</small>
    `;
    resultDiv.style.display = 'flex';
  } finally {
    loadingDiv.style.display = 'none';
    analyzeBtn.disabled      = false;
    analyzeBtn.textContent   = 'Analyze Image';
  }
}

// ── DOM Ready ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput  = document.getElementById('imageUpload');
  const removeBtn  = document.getElementById('removeBtn');

  // Click to upload
  uploadArea.addEventListener('click', () => fileInput.click());

  // File selected via picker
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      currentImageBase64 = ev.target.result;
      showPreview(currentImageBase64);
    };
    reader.readAsDataURL(file);
  });

  // Drag & Drop
  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
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

  // Remove image — full state reset (fixes re-upload bug)
  removeBtn.addEventListener('click', resetUI);

  // Render any persisted history
  renderHistory();

  // Preload model immediately
  preloadModel();
});