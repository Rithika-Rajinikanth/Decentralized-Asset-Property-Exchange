import streamlit as st
import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder  # ✅ This is the fix

def train_predict_model():
    try:
        df = pd.read_csv("Dataset/PropertyData.csv")
        le = LabelEncoder()
        df['location'] = le.fit_transform(df['location'])

        X = df[['location', 'bedrooms', 'bathrooms', 'size_sqft', 'year_built']]
        y = df['price_usd']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

        model = XGBRegressor(random_state=42)
        model.fit(X_train, y_train)

        sample = np.array([[le.transform(['Downtown Dubai'])[0], 3, 2, 1450, 2018]])
        predicted_price = model.predict(sample)
        
        st.success(f"Predicted price: ${predicted_price[0]:,.2f}")
    except Exception as e:
        st.error(f"Error in prediction: {e}")
