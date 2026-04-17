import React, { useState } from "react";
import { Paper, Stack, TextField, Button, Typography } from "@mui/material";
import { getContracts } from "../../web3";

const FractionalizeProperty = () => {
  const [propertyId, setPropertyId] = useState("");
  const [shareCount, setShareCount] = useState("");
  const [status, setStatus] = useState("");

  const handleFractionalize = async () => {
    if (!propertyId || !shareCount) {
      setStatus("Please enter both Property ID and number of Shares.");
      return;
    }
    if (Number(shareCount) <= 0) {
      setStatus("Share count must be greater than zero.");
      return;
    }
    try {
      const { fractionalizerContract } = await getContracts();

      const tx = await fractionalizerContract.fractionalize(
        BigInt(propertyId),
        BigInt(shareCount)
      );
      await tx.wait();
      setStatus("✅ Property fractionalized successfully!");
      setPropertyId("");
      setShareCount("");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to fractionalize property: " + (error.message || error));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Fractionalize Property</Typography>
      <Stack spacing={2}>
        <TextField
          label="Property ID"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          fullWidth
          type="number"
        />
        <TextField
          label="Number of Shares"
          value={shareCount}
          onChange={(e) => setShareCount(e.target.value)}
          fullWidth
          type="number"
          inputProps={{ min: 1 }}
        />
        <Button variant="contained" onClick={handleFractionalize}>
          Fractionalize
        </Button>
        {status && <Typography>{status}</Typography>}
      </Stack>
    </Paper>
  );
};

export default FractionalizeProperty;



