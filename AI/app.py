import streamlit as st
from models.PersonalizedRecommender import run_matcher
from models.PredictiveAnalytics import train_predict_model
from models.DynamicValuation import get_dynamic_valuation

st.set_page_config(page_title="D.A.P.E. AI", layout="centered")
st.title("🏙️ D.A.P.E. AI Recommender")


# Match button
if st.button("🔍 Match Properties"):
    run_matcher()
    
with st.spinner("Processing..."):
    run_matcher()

# Predict button
if st.button("💰 Predict Property Price"):
    train_predict_model()

# Dynamic Valuation Input
property_id = st.text_input("Enter Property ID for Dynamic Valuation")
if st.button("📊 Get Valuation"):
    valuation = get_dynamic_valuation(property_id)
    st.write(f"Estimated Valuation: ${valuation}")
