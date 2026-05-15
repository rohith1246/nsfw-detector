<div align="center">

# 🛡️ NSFW Shield

### Privacy-First, Browser-Based AI Content Moderation

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-%2300FFC8.svg?style=for-the-badge&logo=vercel&logoColor=black)](https://nsfw-detector-ehjf.vercel.app/)
[![GitHub](https://img.shields.io/badge/CODE-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rohith1246/nsfw-detector)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**87% detection accuracy · 100% client-side · Zero server uploads · Zero privacy risk**

[Live Demo](https://nsfw-detector-ehjf.vercel.app/) · [Report a Bug](https://github.com/rohith1246/nsfw-detector/issues) · [Request Feature](https://github.com/rohith1246/nsfw-detector/issues)

</div>

---

## 📌 Overview

NSFW Shield is a **fully browser-based AI content moderation system** that detects adult/inappropriate content in images — without ever sending your data to a server.

Most content moderation tools work like this:
> User uploads image → Image sent to server → Server runs model → Result returned

NSFW Shield flips this entirely:
> User selects image → Model runs **in your browser tab** → Result returned instantly

Your images never leave your device. No backend. No storage. No privacy tradeoff.

Built using **TensorFlow.js** and **MobileNet** transfer learning — the same architecture I deployed during my AI/ML internship at Nextopson, where it achieved **87% accuracy** in a live production content moderation pipeline.

---

## ✨ Features

- **100% Client-Side Inference** — the neural network runs on your GPU, inside your browser
- **87% Detection Accuracy** — validated against real-world content datasets
- **Zero Upload Risk** — images are never transmitted, stored, or logged anywhere
- **Real-Time Results** — sub-second inference using optimized MobileNet architecture
- **No Backend Required** — works with a simple static file server or CDN
- **Cross-Device** — runs on any modern browser: Chrome, Firefox, Safari, Edge
- **Free to Deploy** — zero server costs, runs entirely on Vercel's edge CDN

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    NSFW SHIELD PIPELINE                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📁 User selects image                                  │
│         ↓                                               │
│  🖼️  Image loaded into browser memory (FileReader API)  │
│         ↓                                               │
│  ⚙️  TensorFlow.js loads pre-trained MobileNet weights  │
│         ↓                                               │
│  🧠  Transfer learning model runs inference client-side │
│         ↓                                               │
│  📊  Confidence scores returned for each category       │
│         ↓                                               │
│  ✅  Result displayed — image never leaves your device  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Why MobileNet?

MobileNet is architecturally designed for **edge inference** — it uses depthwise separable convolutions to dramatically reduce model size and computation, making it ideal for browser-based ML without sacrificing meaningful accuracy. This was a deliberate tradeoff: a larger model (ResNet, EfficientNet) would give marginally better accuracy but would be unusable in a browser environment due to load time and memory constraints.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ (for local dev server)
- Any modern browser with WebGL support (Chrome recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/rohith1246/nsfw-detector.git

# Navigate into the project
cd nsfw-detector

# Install dependencies
npm install

# Start local development server
npm start
```

Then open `http://localhost:3000` in your browser.

### Or just use the live demo

👉 [nsfw-detector-ehjf.vercel.app](https://nsfw-detector-ehjf.vercel.app/)

No installation needed.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| ML Framework | TensorFlow.js | Browser-based model inference |
| Model Architecture | MobileNet (Transfer Learning) | Efficient edge classification |
| Language | JavaScript (ES6+) | Client-side logic |
| Deployment | Vercel | Static hosting + global CDN |
| Browser APIs | FileReader, Canvas API | Image loading and preprocessing |

---

## 📊 Model Performance

| Metric | Value |
|---|---|
| Detection Accuracy | 87% |
| Architecture | MobileNet + Transfer Learning |
| Inference Environment | Browser (client-side, WebGL) |
| Average Inference Time | <1 second on modern hardware |
| Model Size | Optimized for browser loading |

> **Note:** This architecture was validated in a production content moderation pipeline during my AI/ML internship at Nextopson (Jan–Jun 2025), where it processed real user-uploaded content at scale.

---

## 📁 Project Structure

```
nsfw-detector/
├── index.html          # Main UI
├── style.css           # Styling
├── app.js              # Core inference logic (TensorFlow.js)
├── model/              # Pre-trained MobileNet weights (loaded via CDN)
├── assets/             # Icons and UI assets
├── package.json        # Dependencies
└── README.md           # You are here
```

---

## 🔒 Privacy — The Core Design Principle

This project was built around a single constraint: **the image must never leave the user's device.**

| Feature | NSFW Shield | Traditional Server-Side Tools |
|---|---|---|
| Image sent to server | ❌ Never | ✅ Always |
| Image stored/logged | ❌ Never | ⚠️ Often |
| Works offline | ✅ Yes (after model loads) | ❌ No |
| Server cost | ✅ Zero | ❌ Per-request cost |
| Latency | ✅ Local inference speed | ❌ Network round-trip |
| GDPR risk | ✅ None | ⚠️ Significant |

---

## 🛠️ Deployment

This project is deployed on **Vercel** as a static site. To deploy your own instance:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts — it's live in under 60 seconds
```

Or connect your GitHub repo to Vercel for automatic deployments on every push.

---

## 🔭 Future Improvements

- [ ] Video frame-by-frame analysis
- [ ] Batch image processing (drag and drop multiple files)
- [ ] Confidence threshold customization (user-adjustable slider)
- [ ] WebWorker support for non-blocking inference on low-end devices
- [ ] PWA support for fully offline usage
- [ ] Browser extension version for real-time page scanning

---

## 👤 Author

**Rohith Vuppula**
SQL Developer @ Lionix LLP · Ex-AI/ML Intern @ Nextopson

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rohith-vuppula-599b16290/)
[![Portfolio](https://img.shields.io/badge/Portfolio-%2300FFC8.svg?style=flat-square&logo=vercel&logoColor=black)](https://rohith-vuppula-portfolio.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=flat-square&logo=github&logoColor=white)](https://github.com/rohith1246)
[![Email](https://img.shields.io/badge/Email-%23D14836.svg?style=flat-square&logo=gmail&logoColor=white)](mailto:rohithvuppula@gmail.com)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## ⭐ If this project helped you

Give it a star — it helps other developers find it and motivates continued development.

---

<div align="center">

*Built with the belief that privacy and safety don't have to be a tradeoff.*

</div>
