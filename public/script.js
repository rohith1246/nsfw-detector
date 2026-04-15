async function uploadImage() {
  const fileInput = document.getElementById('imageUpload');
  const resultDiv = document.getElementById('result');
  const previewImg = document.getElementById('preview');

  if (!fileInput.files[0]) {
    resultDiv.innerText = 'Please select an image.';
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (e) {
    const imageBase64 = e.target.result;
    previewImg.src = imageBase64;
    previewImg.style.display = 'block';

    try {
      const model = await tf.loadGraphModel('/nsfw/model.json');

      const img = new Image();
      img.src = imageBase64;
      await img.decode();

      const tfImage = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims(0);

      const prediction = model.predict(tfImage);
      const data = prediction.dataSync();

      const classIndex = prediction.argMax(-1).dataSync()[0];

      const classLabels = {
        0: 'drawings',
        1: 'hentai',
        2: 'neutral',
        3: 'porn',
        4: 'sexy'
      };

      const predictedClass = classLabels[classIndex];
      const adultClasses = ['hentai', 'porn', 'sexy'];
      const confidence = data[classIndex].toFixed(4);

      tf.dispose([tfImage, prediction]);

      resultDiv.className = adultClasses.includes(predictedClass)
        ? "adult"
        : "safe";

      resultDiv.innerHTML = `
        Prediction: <strong>${predictedClass}</strong><br>
        Confidence: ${confidence}<br>
        ${adultClasses.includes(predictedClass)
          ? "⚠️ Adult Content Detected"
          : "✅ Safe Content"}
      `;
    } catch (error) {
      console.error("Prediction error:", error);
      resultDiv.innerText = "Error during prediction: " + error.message;
    }
  };

  reader.readAsDataURL(file);
}