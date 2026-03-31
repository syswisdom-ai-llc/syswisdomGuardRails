#!/usr/bin/env python3
"""
Weather-Stock Correlation Model

Predicts stock price movement based on:
- Temperature
- Precipitation
- Cloud cover
- Previous close price
- Previous trading volume

Demonstrates drift: When weather API data is stale or stock feeds misalign
(missing trading sessions, timestamp issues), correlation breaks down.
"""

import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import os

# Ensure output directory exists
os.makedirs('models/trained', exist_ok=True)

def train_weather_stock_model():
    print("Training Weather-Stock Correlation Model...")
    
    # Load training data
    df = pd.read_csv('models/data/weather_stock_training.csv')
    
    # Feature engineering
    # Volume normalized (millions of shares)
    df['volume_millions'] = df['prev_volume'] / 1e6
    
    # Prepare features and target
    features = ['temperature', 'precipitation', 'cloud_cover', 'prev_close', 'volume_millions']
    X = df[features]
    y = df['day_return']
    
    # Remove rows with missing values
    mask = ~(X.isnull().any(axis=1) | y.isnull())
    X_clean = X[mask]
    y_clean = y[mask]
    
    # Scale features (important for linear regression)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_clean)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_clean, test_size=0.2, random_state=42
    )
    
    # Train model (linear regression for interpretability)
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    
    # Calculate correlation strength
    correlation = np.corrcoef(y_test, y_pred)[0, 1]
    
    print(f"Baseline R² score: {r2:.3f}")
    print(f"Baseline RMSE: {rmse:.4f}")
    print(f"Prediction-Actual Correlation: {correlation:.3f}")
    
    # Save model and scaler
    joblib.dump(model, 'models/trained/weather_stock_model.pkl')
    joblib.dump(scaler, 'models/trained/weather_stock_scaler.pkl')
    print("✓ Model saved: models/trained/weather_stock_model.pkl")
    
    return model

if __name__ == '__main__':
    train_weather_stock_model()
