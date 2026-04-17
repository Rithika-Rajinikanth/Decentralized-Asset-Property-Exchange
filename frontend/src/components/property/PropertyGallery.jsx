import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import PropertyCard from "../common/PropertyCard";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { getContracts } from "../../web3";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

const PropertyGallery = ({ refreshKey }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { propertyNFT } = await getContracts();
        const total = Number(await propertyNFT.getTokenCount());

        let results = []; // <-- Remove manual dummy property here, start empty

        for (let i = 1; i <= total; i++) {
          const tokenURI = await propertyNFT.tokenURI(i);
          const metadataUrl = tokenURI.replace("ipfs://", IPFS_GATEWAY);

          let metaJson = {};
          try {
            const res = await fetch(metadataUrl);
            metaJson = await res.json();
          } catch (err) {
            console.warn(`Error loading metadata for token ${i}:`, err);
          }

          results.push({
            tokenId: i,
            name: metaJson.name || "Unnamed Property",
            location: metaJson.location || "Unknown",
            price: metaJson.price || "0",
            image: metaJson.image?.startsWith("ipfs://") ? IPFS_GATEWAY + metaJson.image.slice(7) : metaJson.image || "",
            description: metaJson.description || "No description available.",
            virtualTour: metaJson.virtualTour || null,
            documents: Array.isArray(metaJson.documents) ? metaJson.documents : [],
            policies: metaJson.policies || "No policies available.",
            fractionalized: !!metaJson.fractionalized,
            fractionDetails: metaJson.fractionDetails || null,
          });
        }
        setProperties(results);
      } catch (err) {
        console.error("Failed to fetch property metadata:", err);
        setProperties([]); // Clear properties so UI reflects error
      }
      setLoading(false);
    };

    fetchProperties();
  }, [refreshKey]);

  if (loading) return <Typography>Loading properties...</Typography>;
  if (properties.length === 0) return <Typography>No properties available.</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Available Properties
      </Typography>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid xs={12} sm={6} md={4} key={property.tokenId}>
            <PropertyCard
              property={{
                ...property,
                image: property.image.startsWith("ipfs://")
                  ? IPFS_GATEWAY + property.image.slice(7)
                  : property.image,
              }}
              onClick={() => setSelectedProperty(property)} // clicking a card opens modal
            />
          </Grid>
        ))}
      </Grid>

      {/* Only show modal if user has selected a property */}
      {selectedProperty && (
        <PropertyDetailsModal
          open={true}
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </>
  );
};

export default PropertyGallery;

