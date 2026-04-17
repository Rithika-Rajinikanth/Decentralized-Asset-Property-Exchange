import pandas as pd
import streamlit as st

def match_properties(investor, properties):
    location_filter = properties['location'].isin(investor['preferred_locations'].split(';'))
    budget_filter = properties['price_usd'] <= investor['budget_usd']
    bedroom_filter = properties['bedrooms'] >= investor['preferred_bedrooms']

    def score_amenities(row):
        return len(set(row['amenities'].split(';')) & set(investor['amenities_required'].split(';')))

    matched = properties[location_filter & budget_filter & bedroom_filter].copy()
    matched['score'] = matched.apply(score_amenities, axis=1)
    return matched.sort_values(by='score', ascending=False)

def run_matcher():
    properties = pd.read_csv("Dataset/PropertyData.csv")
    investors = pd.read_csv("Dataset/InvestorData.csv")

    for _, investor in investors.iterrows():
        st.subheader(f"Investor: {investor['name']} - Budget: ${investor['budget_usd']}")
        matches = match_properties(investor, properties)
        st.dataframe(matches[['name', 'location', 'price_usd', 'score']])
