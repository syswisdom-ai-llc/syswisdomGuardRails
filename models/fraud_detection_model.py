#!/usr/bin/env python3
"""
Fraud Detection Model

Predicts transaction fraud probability based on:
- Transaction amount
- Merchant category
- Customer location (latitude/longitude)
- Time of day

Demonstrates drift: When transaction data loses location or category information,
fraud detection becomes unreliable.
"""

import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, roc_auc_score
import os

# Ensure output directory exists
os.makedirs('models/trained', exist_ok=True)

def train_fraud_model():
    print("Training Fraud Detection Model...")
    
    # Load training data
    df = pd.read_csv('models/data/fraud_training.csv')
    
    # Feature engineering
    # Distance from home (approximate using lat/lon)
    # Typical US store within 10 miles, fraud often cross-border (>100 miles)
    df['distance_from_center'] = np.sqrt(
        (df['latitude'] - 40.7128)**2 + (df['longitude'] + 74.0060)**2
    ) * 69  # Convert to miles
    
    # Prepare features and target
    features = ['transaction_amount', 'merchant_category', 'latitude', 'longitude', 'hour_of_day', 'distance_from_center']
    X = df[features]
    y = df['is_fraud']
    
    # Remove rows with missing values
    mask = ~(X.isnull().any(axis=1) | y.isnull())
    X_clean = X[mask]
    y_clean = y[mask]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_clean)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_clean, test_size=0.2, random_state=42, stratify=y_clean
    )
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=5,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    print(f"Baseline Precision: {precision:.1%}")
    print(f"Baseline Recall: {recall:.1%}")
    print(f"Baseline ROC-AUC: {roc_auc:.3f}")
    
    # Save model and scaler
    joblib.dump(model, 'models/trained/fraud_detection_model.pkl')
    joblib.dump(scaler, 'models/trained/fraud_scaler.pkl')
    print("✓ Model saved: models/trained/fraud_detection_model.pkl")
    
    return model

if __name__ == '__main__':
    train_fraud_model()
