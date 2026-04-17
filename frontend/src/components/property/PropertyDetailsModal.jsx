// src/components/property/PropertyDetailsModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Stack } from "@mui/material";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

const PropertyDetailsModal = ({ open, property, onClose }) => {
  if (!property) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{property.name}</DialogTitle>
      <DialogContent dividers>
        <img
          src={property.image}
          alt={property.name}
          style={{ width: "100%", maxHeight: 320, objectFit: "cover", marginBottom: 16 }}
        />
        <Typography variant="h6" color="primary">Price: {property.price} ETH</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>{property.location}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{property.description}</Typography>

        {property.virtualTour && (
          <div style={{ marginBottom: 16 }}>
            <Typography variant="subtitle1">Virtual Tour:</Typography>
            <video width="100%" height="auto" controls>
              <source src={property.virtualTour.startsWith("ipfs://")
                ? IPFS_GATEWAY + property.virtualTour.slice(7)
                : property.virtualTour
              } type="video/mp4" />
            </video>
          </div>
        )}

        {property.documents && property.documents.length > 0 && (
          <>
            <Typography variant="subtitle1">Documents:</Typography>
            <ul>
              {property.documents.map((doc, idx) => (
                <li key={idx}>
                  <a href={doc.file.startsWith("ipfs://")
                      ? IPFS_GATEWAY + doc.file.slice(7)
                      : doc.file
                    }
                    target="_blank" rel="noopener noreferrer"
                  >{doc.title || "Document"}</a>
                </li>
              ))}
            </ul>
          </>
        )}

        <Typography variant="subtitle1" sx={{ mt: 2 }}>Policies:</Typography>
        <Typography variant="body2">{property.policies}</Typography>

        {property.fractionalized ? (
          <Stack sx={{ mt: 3 }} spacing={2}>
            <Typography variant="subtitle1">
              Fractional Ownership<br/>
              Shares Available: {property.fractionDetails?.sharesAvailable}
              <br />
              Minimum Investment: {property.fractionDetails?.minInvestment} ETH
            </Typography>
            {/* Add fractional invest form or button here */}
            <Button variant="outlined" color="primary">
              Invest Fractionally
            </Button>
          </Stack>
        ) : (
          <Button variant="contained" sx={{ mt: 3 }}>
            Buy Entire Property
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PropertyDetailsModal;
