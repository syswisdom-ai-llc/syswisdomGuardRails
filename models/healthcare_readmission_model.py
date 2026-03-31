#!/usr/bin/env python3
"""
Healthcare Readmission Model

Predicts 30-day hospital readmission risk based on:
- Patient age
- Gender
- Discharge summary length (proxy for care complexity)
- Number of medications
- Number of chronic conditions

Demonstrates drift: When EHR data is incomplete (missing medications, incomplete 
condition codes), model fails to identify high-risk patients.
"""

import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, precision_score, recall_score
import os

# Ensure output directory exists
os.makedirs('models/trained', exist_ok=True)

def train_healthcare_model():
    print("Training Healthcare Readmission Model...")
    
    # Load training data
    df = pd.read_csv('models/data/healthcare_training.csv')
    
    # Feature engineering
    le = LabelEncoder()
    df['gender_encoded'] = le.fit_transform(df['gender'])
    
    # Prepare features and target
    features = ['age', 'gender_encoded', 'discharge_summary_length', 'medication_count', 'chronic_conditions']
    X = df[features]
    y = df['readmitted_30d']
    
    # Remove rows with missing values
    mask = ~(X.isnull().any(axis=1) | y.isnull())
    X_clean = X[mask]
    y_clean = y[mask]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_clean, y_clean, test_size=0.2, random_state=42, stratify=y_clean
    )
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    
    print(f"Baseline ROC-AUC: {roc_auc:.3f}")
    print(f"Baseline Precision: {precision:.1%}")
    print(f"Baseline Recall (sensitivity): {recall:.1%}")
    
    # Save model
    joblib.dump(model, 'models/trained/healthcare_readmission_model.pkl')
    print("✓ Model saved: models/trained/healthcare_readmission_model.pkl")
    
    return model

if __name__ == '__main__':
    train_healthcare_model()
