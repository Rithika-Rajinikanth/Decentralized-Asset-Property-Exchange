// src/components/common/PropertyCard.jsx
import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const PropertyCard = ({ property, onClick }) => (
  <Card sx={{ maxWidth: 345, cursor: "pointer", m: 2 }} onClick={onClick}>
    <CardMedia
      component="img"
      height="180"
      image={property.image}
      alt={property.name}
    />
    <CardContent>
      <Typography variant="h5" gutterBottom>{property.name}</Typography>
      <Typography variant="body2" color="text.secondary">{property.location}</Typography>
      <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
        Price: {property.price} ETH
      </Typography>
      <Typography variant="body2">{property.fractionalized ? "Fractional Ownership Available" : "Full Ownership"}</Typography>
    </CardContent>
  </Card>
);

export default PropertyCard;

