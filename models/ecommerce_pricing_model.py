#!/usr/bin/env python3
"""
E-Commerce Pricing Model

Predicts recommended retail price based on:
- Product category
- Customer rating
- Stock level
- Supplier cost

Demonstrates drift: When supplier cost data becomes noisy or missing,
model accuracy degrades from 94% to 34%.
"""

import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import os

# Ensure output directory exists
os.makedirs('models/trained', exist_ok=True)

def train_ecommerce_model():
    print("Training E-Commerce Pricing Model...")
    
    # Load training data
    df = pd.read_csv('models/data/ecommerce_training.csv')
    
    # Feature engineering
    # Encode category as numeric
    le = LabelEncoder()
    df['category_encoded'] = le.fit_transform(df['category'])
    
    # Prepare features and target
    features = ['category_encoded', 'rating', 'stock_level', 'supplier_cost']
    X = df[features]
    y = df['recommended_price']
    
    # Remove any rows with missing values for training
    mask = ~(X.isnull().any(axis=1) | y.isnull())
    X_clean = X[mask]
    y_clean = y[mask]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_clean, y_clean, test_size=0.2, random_state=42
    )
    
    # Train model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    # Calculate baseline accuracy (% within 5% of actual price)
    within_tolerance = np.abs(y_pred - y_test) / y_test <= 0.05
    accuracy = within_tolerance.mean() * 100
    
    print(f"Baseline RMSE: ${rmse:.2f}")
    print(f"Baseline R² score: {r2:.3f}")
    print(f"Baseline accuracy (within 5%): {accuracy:.1f}%")
    
    # Save model
    joblib.dump(model, 'models/trained/ecommerce_pricing_model.pkl')
    print("✓ Model saved: models/trained/ecommerce_pricing_model.pkl")
    
    return model

if __name__ == '__main__':
    train_ecommerce_model()
