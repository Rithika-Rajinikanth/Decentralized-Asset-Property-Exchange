// Home.jsx
import React from "react";
import PropertyGallery from "./components/property/PropertyGallery";

const Home = ({ currentAccount, refreshKey }) => {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Welcome to DAPE Real Estate</h2>
      {currentAccount ? (
        <>
          <PropertyGallery refreshKey={refreshKey} />
        </>
      ) : (
        <p>Connect your wallet to get started!</p>
      )}
    </div>
  );
};

export default Home;

