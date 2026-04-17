import pandas as pd
import streamlit as st

def get_dynamic_valuation(property_id):
    try:
        df = pd.read_csv("Dataset/PropertyData.csv")

        # Ensure consistent formatting
        df['property_id'] = df['property_id'].astype(str).str.strip()
        property_id = property_id.strip()

        matched = df[df['property_id'] == property_id]

        if matched.empty:
            st.warning("Property ID not found.")
            return None

        # Example: return base price or calculated value
        price = matched['price_usd'].values[0]
        return round(price, 2)

    except Exception as e:
        st.error(f"Error during valuation: {e}")
        return None
