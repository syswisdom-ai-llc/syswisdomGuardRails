# SysWisdom Guardrails — ML Models Quick Start

## 30-Second Setup

```bash
# 1. Navigate to project
cd c:\Users\macki\Documents\VS Studio Code\GuardRails

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate (Windows)
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Train all 4 models
python models/ecommerce_pricing_model.py
python models/fraud_detection_model.py
python models/healthcare_readmission_model.py
python models/weather_stock_model.py
```

Done! Trained models saved to `models/trained/`

---

## What Each Model Does

| Model | Input | Output | Use Case |
|-------|-------|--------|----------|
| **E-Commerce Pricing** | Product category, rating, stock, cost | Recommended retail price | Detect supply chain data quality issues |
| **Fraud Detection** | Transaction amount, merchant, location, time | Fraud probability (0-100%) | Detect payment data anomalies |
| **Healthcare Readmission** | Patient age, meds, conditions, discharge notes | 30-day readmission risk | Detect EHR data quality degradation |
| **Weather-Stock** | Weather + market data | Stock price movement | Detect external data feed corruption |

---

## Using Models in Python

```python
import joblib
import pandas as pd

# Load trained model
model = joblib.load('models/trained/ecommerce_pricing_model.pkl')

# Prepare input data
df = pd.DataFrame({
    'category': ['Electronics', 'Fashion'],
    'rating': [4.5, 4.8],
    'stock_level': [120, 50],
    'supplier_cost': [45.00, 15.00]
})

# Make predictions
predictions = model.predict(df[['category', 'rating', 'stock_level', 'supplier_cost']])
print(predictions)  # [89.99, 49.99]
```

---

## Example: Detect Data Drift

**Month 1 (Clean Data)**:
```
Input:  [Electronics, 4.5, 120, 45.00]
Pred:   89.99
Error:  0.01 (0.01%)
```

**Month 5 (Degraded Data)**:
```
Input:  [Electronics, null, 120, null]  ← Missing values!
Pred:   35.50
Error:  54.50 (60.5%)  ← Silent failure!
```

**Solution**: Monitor input completeness + prediction error together.

---

## Directory Structure

```
models/
├── MODEL_TRAINING_GUIDE.md          ← Full documentation
├── QUICKSTART.md                    ← This file
├── ecommerce_pricing_model.py       ← Training script
├── fraud_detection_model.py
├── healthcare_readmission_model.py
├── weather_stock_model.py
├── data/
│   ├── ecommerce_training.csv       ← Training data
│   ├── fraud_training.csv
│   ├── healthcare_training.csv
│   └── weather_stock_training.csv
└── trained/
    ├── ecommerce_pricing_model.pkl  ← Saved models
    ├── fraud_detection_model.pkl
    ├── healthcare_readmission_model.pkl
    └── weather_stock_model.pkl
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: sklearn` | Run: `pip install scikit-learn==1.3.0` |
| `FileNotFoundError: training.csv` | Ensure data files in `models/data/` exist |
| Model not improving | Check data distribution, increase training samples |

---

## Full Details

See **MODEL_TRAINING_GUIDE.md** for:
- Detailed training instructions
- Drift detection scenarios
- Monitoring metrics
- Integration with Guardrails API

---

**Quick Links**:
- [Main README](../readMe.md)
- [Data Quality Whitepaper](../dataQuality.md)
- [Development Roadmap](../todo.md)
