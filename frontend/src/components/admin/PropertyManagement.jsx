// src/components/admin/PropertyManagement.jsx
import React, { useEffect, useState } from "react";
import { getContracts } from "../../web3";

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { realEstateContract } = await getContracts();
        // Assuming propertiesCount and a getter function to get properties by id
        const count = await realEstateContract.getPropertiesCount();
        let props = [];
        for (let i = 0; i < count; i++) {
          const prop = await realEstateContract.properties(i);
          props.push(prop);
        }
        setProperties(props);
      } catch (e) {
        console.error("Failed to load properties", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div>
      <h4>Manage Properties</h4>
      {properties.length === 0 && <p>No properties listed yet.</p>}
      <ul>
        {properties.map((prop, idx) => (
          <li key={idx}>
            <strong>ID:</strong> {idx} | <strong>Seller:</strong> {prop.seller} | <strong>Status:</strong> {prop.status.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyManagement;
