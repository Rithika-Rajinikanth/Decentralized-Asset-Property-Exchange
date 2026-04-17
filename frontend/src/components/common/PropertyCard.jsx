// src/components/common/PropertyCard.jsx
import React from "react";

const PropertyCard = ({ property }) => {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      margin: "0.5rem",
      maxWidth: "300px"
    }}>
      <img
        src={property.image || "https://via.placeholder.com/300x200"}
        alt={property.name}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h4>{property.name}</h4>
      <p>{property.description}</p>
      <p><strong>Location:</strong> {property.location}</p>
      <p><strong>Price (ETH):</strong> {property.price}</p>
    </div>
  );
};

export default PropertyCard;
