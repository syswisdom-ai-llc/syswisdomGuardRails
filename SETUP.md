# Setup Guide — SysWisdom Guardrails

**© 2024 SysWisdom.AI LLC • Building with heart in Georgia**

This guide covers installing and configuring SysWisdom Guardrails on your local machine or server.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start (5 minutes)](#quick-start-5-minutes)
3. [Development Setup](#development-setup)
4. [ML Model Training](#ml-model-training)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

---

## System Requirements

### Core Requirements

- **Node.js**: 22+ (LTS recommended)
- **npm**: 10+ (comes with Node.js)
- **Git**: For cloning the repository
- **Disk Space**: ~500MB (code + node_modules + data)

### For ML Model Training

- **Python**: 3.8+ (3.10+ recommended)
- **pip**: Python package manager (comes with Python)
- **Virtual Environment**: `venv` (built-in to Python 3.3+)

### For Search & Natural Language Processing

- **SysWisdom Data Quality API Key**: Get from https://www.syswisdom.ai

---

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/syswisdom-ai-llc/guardrails.git
cd guardrails
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file and add your SysWisdom API key
# See Environment Configuration section below
```

### 4. Start the Server

```bash
npm start
```

The application will boot on **http://localhost:3000**

---

## Development Setup

### With Auto-Reload (Recommended)

For development, use `nodemon` to auto-restart on code changes:

```bash
npm run dev
```

The server will watch for changes and restart automatically.

### Run Tests

```bash
npm test
```

Expected output: **9/9 tests passing** (~400ms)

View test file: `tests/guardrails.test.js`

---

## ML Model Training

### Python Environment Setup

#### Step 1: Create Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Check it worked:**
```bash
which python  # macOS/Linux
where python  # Windows
# Should show a path inside your 'venv' folder
```

#### Step 2: Install Python Dependencies

**All required packages are in `requirements.txt`:**

```bash
pip install -r requirements.txt
```

This installs:
- `pandas` — Data manipulation
- `scikit-learn` — Machine learning models
- `numpy` — Numerical computing
- `scipy` — Scientific utilities
- `pytest` — Testing (optional)

**Verify installation:**
```bash
python -c "import pandas, sklearn; print('✓ Ready!')"
```

#### Step 3: Train Models

See [models/MODEL_TRAINING_GUIDE.md](models/MODEL_TRAINING_GUIDE.md) for detailed walkthrough.

**Quick start:**
```bash
python models/train_ecommerce_pricing.py
```

---

## Environment Configuration

### 1. Create `.env` File

Copy the example:
```bash
cp .env.example .env
```

### 2. Add Your Configuration

Edit `.env` with your actual values:

```env
# REQUIRED: Get from https://www.syswisdom.ai
dq_api_key=sk_live_abc123xyz...
dq_api_url=https://data-quality-api-u2mjys756a-uc.a.run.app/analyze

# Development
NODE_ENV=development
PORT=3000
HOST=localhost
```

### 3. Protect Your `.env`

⚠️ **IMPORTANT:** `.env` contains secrets!

- Never commit `.env` to version control
- It's in `.gitignore` — should be ignored automatically
- Store securely (use environment variable management in production)

---

## Project Structure

```
guardrails/
├── readMe.md                 # Overview and features
├── SETUP.md                  # This file
├── CONTRIBUTING.md           # Contribution guidelines
├── CODE_OF_CONDUCT.md        # Community standards
├── LICENSE                   # Proprietary license
├── .env.example              # Environment template
├── .gitignore                # Git ignore patterns
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
│
├── server.js                 # Express backend
├── public/
│   └── index.html            # Frontend UI
├── tests/
│   └── guardrails.test.js    # Unit tests
│
├── models/                   # ML Models
│   ├── README.md             # Model specifications
│   ├── MODEL_TRAINING_GUIDE.md
│   ├── QUICKSTART.md
│   ├── train_ecommerce_pricing.py
│   ├── 1_weather_stock_predictor.py
│   ├── 2_ecommerce_price_predictor.py
│   ├── 3_fraud_detection.py
│   └── 4_healthcare_readmission.py
│
├── Data/                     # Sample data & documentation
│   ├── ecommerce_pricing_training.csv
│   ├── DRIFT_TIME_MACHINE.md
│   └── DEMO_DRIFT_LIFECYCLE.md
│
└── data/
    ├── analyses.json         # Historical analyses
    └── fix-library.json      # Team knowledge base
```

---

## Troubleshooting

### Node.js / npm Issues

**Error: `command not found: npm`**
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation
- Verify: `node --version && npm --version`

**Error: `npm ERR! ERESOLVE unable to resolve dependency tree`**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Python / Model Training Issues

**Error: `ModuleNotFoundError: No module named 'pandas'`**
```bash
# Activate your virtual environment first
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows

# Then install dependencies
pip install -r requirements.txt
```

**Error: `No such file or directory: 'Data/ecommerce_pricing_training.csv'`**
- Make sure you're running Python from the project root
- Verify the file exists with: `ls Data/` or `dir Data\`

**Error: `ModuleNotFoundError: No module named 'sklearn'`**
```bash
pip install scikit-learn
```

### Server Won't Start

**Error: `Error: EADDRINUSE: address already in use :::3000`**
```bash
# The port 3000 is already in use. Either:
# Option 1: Kill the process
# (macOS/Linux)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill

# Option 2: Use a different port
PORT=3001 npm start
```

**Error: `SyntaxError: Unexpected token...` in server.js**
- Make sure you're using Node.js 22+ (check: `node --version`)
- Clear node_modules: `rm -rf node_modules && npm install`

### Environment Configuration

**Error: `dq_api_key is not defined`**
- Check that `.env` file exists: `ls -la .env`
- Verify you copied `.env.example` to `.env`
- Ensure your API key is set in `.env`
- Restart the server after changing `.env`

---

## Next Steps

### For Developers

1. ✅ [Set up the environment](#quick-start-5-minutes)
2. ✅ [Run tests](#run-tests) to verify installation
3. ✅ Read [CONTRIBUTING.md](CONTRIBUTING.md) to understand the workflow
4. ✅ Check [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community guidelines
5. ✅ Explore [readMe.md](readMe.md) for feature overview

### For Data Scientists

1. ✅ [Set up Python environment](#python-environment-setup)
2. ✅ [Install ML dependencies](#step-2-install-python-dependencies)
3. ✅ Read [models/MODEL_TRAINING_GUIDE.md](models/MODEL_TRAINING_GUIDE.md)
4. ✅ Train your first model: [models/QUICKSTART.md](models/QUICKSTART.md)
5. ✅ Explore [models/README.md](models/README.md) for all 4 models

### For DevOps/Deployment

1. ✅ Deploy to Google Cloud (configure in dashboard)
2. ✅ Set up GitHub Actions for CI/CD
3. ✅ Configure production environment variables
4. ✅ Set up domain and HTTPS

---

## Getting Help

### Documentation

- **Feature Overview**: [readMe.md](readMe.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Community Standards**: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **ML Models**: [models/README.md](models/README.md)
- **Model Training**: [models/MODEL_TRAINING_GUIDE.md](models/MODEL_TRAINING_GUIDE.md)

### Support

- 📧 **General Questions**: info@syswisdom.ai
- 💼 **Sales & Licensing**: sales@syswisdom.ai
- 🐛 **Bug Reports**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## System Info

**Last Updated**: March 31, 2026  
**Node.js Version**: 22.13.1 (tested)  
**Python Version**: 3.8+ (required)  
**Platform**: macOS, Linux, Windows

---

**SysWisdom Guardrails** — *Where data quality becomes institutional knowledge.*

© 2024 SysWisdom.AI LLC
