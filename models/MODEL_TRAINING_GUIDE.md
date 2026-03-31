# SysWisdom Guardrails — ML Model Training Guide

## Overview

SysWisdom Guardrails includes four pre-trained machine learning models demonstrating real-world data quality challenges and drift detection. Each model trains on domain-specific data and detects when input quality degrades over time.

---

## Prerequisites

### Python Environment

```bash
python --version  # Requires 3.8 or higher
```

### Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on Mac/Linux
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

**requirements.txt** includes:
- pandas==2.0.3
- scikit-learn==1.3.0
- numpy==1.24.3
- scipy==1.11.2
- joblib==1.3.1
- matplotlib==3.7.2
- seaborn==0.12.2
- pytest==7.4.0

---

## The Four Models

### 1. E-Commerce Pricing Model

**Purpose**: Predict product price based on category, rating, stock level, and supplier cost.

**Training Data**: `models/data/ecommerce_training.csv`  
**Trained Model**: `models/trained/ecommerce_pricing_model.pkl`

**Run Training**:
```bash
python models/ecommerce_pricing_model.py
```

**Expected Output**:
```
Training E-Commerce Pricing Model...
Baseline accuracy: 94.2%
Model training complete
Model saved: models/trained/ecommerce_pricing_model.pkl
```

**What It Does**:
- Takes product metadata (category, rating, stock, cost)
- Outputs predicted retail price
- Detects when supplier costs shift unexpectedly
- Flags when pricing rules are violated (e.g., margin too low)

**Real-World Scenario**:
E-commerce platform ingests daily product feeds from suppliers. Over 6 months:
- **Month 1**: Clean data, accurate predictions, 94% accuracy
- **Months 2-4**: Supply chain disruptions introduce inconsistent cost data
- **Month 5**: Model fails to 34% accuracy; pricing recommendations become unreliable
- **Month 6**: After data cleanup and retraining, accuracy returns to 94%

---

### 2. Fraud Detection Model

**Purpose**: Classify transactions as legitimate or fraudulent based on amount, merchant, location, time.

**Training Data**: `models/data/fraud_training.csv`  
**Trained Model**: `models/trained/fraud_detection_model.pkl`

**Run Training**:
```bash
python models/fraud_detection_model.py
```

**Expected Output**:
```
Training Fraud Detection Model...
Baseline precision: 91.5%
Baseline recall: 89.3%
Model training complete
Model saved: models/trained/fraud_detection_model.pkl
```

**What It Does**:
- Analyzes transaction patterns (amount, merchant category, location, time-of-day)
- Detects anomalous transactions (velocity checks, location jumps, unusual amounts)
- Assigns fraud probability (0-1 scale)
- Adapts to changing fraud tactics

**Real-World Scenario**:
Payment processor sees transaction data quality degrade when:
- Merchants fail to categorize transactions correctly (GPS off, manual entry errors)
- Timestamps are incorrect or missing
- Customer location data is null or stale
- Result: False positive rate spikes, legitimate transactions flagged as fraud

---

### 3. Healthcare Readmission Model

**Purpose**: Predict 30-day hospital readmission risk based on patient characteristics.

**Training Data**: `models/data/healthcare_training.csv`  
**Trained Model**: `models/trained/healthcare_readmission_model.pkl`

**Run Training**:
```bash
python models/healthcare_readmission_model.py
```

**Expected Output**:
```
Training Healthcare Readmission Model...
Baseline ROC-AUC: 0.876
Model training complete
Model saved: models/trained/healthcare_readmission_model.pkl
```

**What It Does**:
- Predicts 30-day readmission risk (0-100%)
- Considers: discharge summary, medication count, chronic conditions, age, gender
- Identifies high-risk patients for preventive intervention
- Adapts to seasonal illness patterns

**Real-World Scenario**:
Hospital EHR system ingests patient discharge data. Data quality issues emerge when:
- Electronic records fail to sync with paper charts (missing medications)
- Chronic condition codes are incomplete (ICD-10 mapping errors)
- Patient demographics are outdated (contact info, address)
- Result: Readmission predictions miss high-risk patients; patient safety compromised

---

### 4. Weather-Stock Correlation Model

**Purpose**: Predict stock price delta based on weather patterns and historical returns.

**Training Data**: `models/data/weather_stock_training.csv`  
**Trained Model**: `models/trained/weather_stock_model.pkl`

**Run Training**:
```bash
python models/weather_stock_model.py
```

**Expected Output**:
```
Training Weather-Stock Correlation Model...
Baseline R² score: 0.72
Model training complete
Model saved: models/trained/weather_stock_model.pkl
```

**What It Does**:
- Correlates weather data (temperature, precipitation, cloud cover) with stock performance
- Deticts sector-specific weather sensitivity (energy, utilities, agriculture)
- Predicts stock price movement intraday
- Useful for seasonal trading strategies

**Real-World Scenario**:
Quantitative trading desk combines weather and stock feeds. Data quality breaks when:
- Weather API downtime results in null values
- Stock feed merges data from multiple exchanges with timestamp misalignment
- Historical data is not normalized (different units, missing sessions)
- Result: Trading algorithm makes decisions on incomplete data; unexpected losses

---

## Training Workflow

### Step 1: Prepare Data

Each model expects CSV format:

**E-Commerce**:
```csv
category,rating,stock_level,supplier_cost,recommended_price
Electronics,4.5,120,45.00,89.99
Fashion,4.8,50,15.00,49.99
```

**Fraud**:
```csv
transaction_amount,merchant_category,latitude,longitude,hour_of_day,is_fraud
125.50,5411,40.7128,-74.0060,14,0
500.00,5411,51.5074,-0.1278,3,1
```

**Healthcare**:
```csv
age,gender,discharge_summary_length,medication_count,chronic_conditions,readmitted_30d
72,M,250,8,3,1
45,F,180,2,0,0
```

**Weather-Stock**:
```csv
temperature,precipitation,cloud_cover,prev_close,prev_volume,day_return
72,0.2,45,150.25,5000000,0.015
68,1.2,95,149.50,4500000,-0.005
```

### Step 2: Train Model

```bash
cd models
python ecommerce_pricing_model.py
python fraud_detection_model.py
python healthcare_readmission_model.py
python weather_stock_model.py
```

Each script will:
1. Load training data from `models/data/`
2. Split into train/test (80/20)
3. Fit model (RandomForest or linear regression)
4. Evaluate metrics (accuracy, precision, ROC-AUC, R²)
5. Save trained model to `models/trained/`

### Step 3: Make Predictions

```python
import joblib
import pandas as pd

# Load model
model = joblib.load('models/trained/ecommerce_pricing_model.pkl')

# Load new data
df = pd.read_csv('models/data/ecommerce_test.csv')

# Make predictions
predictions = model.predict(df[['category', 'rating', 'stock_level', 'supplier_cost']])
print(predictions)
```

---

## Drift Detection Integration

Each model demonstrates **data drift** — when input quality degrades, predictions fail silently.

### Example: E-Commerce Model

**Normal Scenario** (Month 1):
```python
Input:  [Electronics, 4.5, 120, 45.00]
Output: 89.99 (predicted price)
Accuracy: 94%
```

**Degraded Scenario** (Month 5):
```python
Input:  [null, null, 120, null]          # Missing values
Output: 35.50 (wrong price)
Accuracy: 34%
Error: Model predicts with missing data, silently producing garbage
```

**Detection Strategy**:
1. Monitor input data quality (% missing, type consistency)
2. Compare actual vs predicted (residual analysis)
3. Track prediction confidence (probability/uncertainty scores)
4. Alert when any metric drops below threshold

---

## Data Drift Scenarios

### Scenario 1: Supply Chain Disruption (E-Commerce)

**Timeline**:
- Week 1: Supplier costs stable, supplier_cost column complete
- Week 3: Supplier transitions to new distributor, supplier_cost becomes inconsistent
- Week 5: 40% of costs are missing; model makes wrong price predictions
- Week 8: Data cleaned, retraining begins; accuracy recovers

### Scenario 2: Fraud Pattern Evolution (Fraud Detection)

**Timeline**:
- Month 1: Fraud is high-amount, cross-border transactions
- Month 3: Criminals shift tactics to small, rapid transactions (smurfing)
- Month 5: Model fails to detect new pattern (trained only on old fraud)
- Month 6: Retraining on new patterns; recall improves

### Scenario 3: EHR Integration Failure (Healthcare)

**Timeline**:
- Month 1: Discharge summaries complete, medication_count accurate
- Month 2: Paper chart backlog, EHR sync fails; medication_count becomes sparse
- Month 4: Predictions miss high-risk patients; readmission rate spikes
- Month 5: Integration fixed, data completeness returns, model recovers

---

## Running All Models at Once

```bash
# From project root
python models/ecommerce_pricing_model.py && \
python models/fraud_detection_model.py && \
python models/healthcare_readmission_model.py && \
python models/weather_stock_model.py
```

---

## Monitoring Model Health

### Key Metrics to Track

| Metric | Model | Alert Threshold |
|--------|-------|-----------------|
| Input Completeness | All | <95% non-null |
| Prediction Latency | All | >500ms |
| Residual Std Dev | E-Commerce, Weather-Stock | >20% of mean |
| Precision/Recall Drift | Fraud, Healthcare | >5% change YoY |
| Feature Importance Shift | All | Top feature changes rank |

### Example Monitoring

```python
import numpy as np
from datetime import datetime

# Check input quality
completeness = 1 - df.isnull().sum().sum() / (df.shape[0] * df.shape[1])
print(f"Data completeness: {completeness:.1%}")
if completeness < 0.95:
    print("⚠️ WARNING: Input data quality degrading")
    
# Check prediction variance
predictions = model.predict(df)
std_dev = np.std(predictions)
mean_val = np.mean(predictions)
cv = std_dev / mean_val  # Coefficient of variation
print(f"Prediction volatility (CV): {cv:.2f}")
if cv > 0.20:
    print("⚠️ WARNING: Model predictions becoming erratic")
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'sklearn'"

**Solution**:
```bash
pip install scikit-learn==1.3.0
```

### Issue: "FileNotFoundError: models/data/ecommerce_training.csv"

**Solution**: Ensure training data files exist in `models/data/` before running training scripts.

### Issue: Model predictions are all the same value

**Possible Causes**:
- Training data is too homogeneous (all same output class)
- Feature scaling issues (features need normalization)
- Model hyperparameters need tuning

**Fix**: Review training data distribution, adjust hyperparameters in model script.

---

## Next Steps

1. **Deploy Models to Guardrails API**: Integrate trained models into `server.js` endpoints
2. **Monitor Model Drift**: Implement periodic retraining pipeline
3. **A/B Test Models**: Compare old vs new model on holdout test data
4. **Collect Feedback**: Track actual vs predicted to retrain quarterly

---

## Resources

- **Scikit-learn Docs**: https://scikit-learn.org/
- **Pandas Tutorial**: https://pandas.pydata.org/docs/
- **Model Persistence (joblib)**: https://joblib.readthedocs.io/

---

**Last Updated**: March 31, 2026
