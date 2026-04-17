import React, { useState } from "react";
import { Paper, Stack, TextField, Button, Typography } from "@mui/material";
import { getContracts } from "../../web3";
import { parseEther } from "ethers";

const CreateEscrowDeal = () => {
  const [propertyId, setPropertyId] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");

  const handleCreateEscrow = async () => {
    try {
      if (!propertyId || !buyerAddress || !price) {
        setStatus("Please fill in all fields.");
        return;
      }
      const { escrowContract } = await getContracts();
      const tx = await escrowContract.createDeal(
        buyerAddress,
        BigInt(propertyId),
        parseEther(price)
      );
      await tx.wait();
      setStatus("✅ Escrow deal created successfully!");
      setPropertyId("");
      setBuyerAddress("");
      setPrice("");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to create escrow deal: " + (error.message || error));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Create Escrow Deal</Typography>
      <Stack spacing={2}>
        <TextField
          label="Property ID"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          fullWidth
          type="number"
        />
        <TextField
          label="Buyer Wallet Address"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          fullWidth
        />
        <TextField
          label="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          type="number"
          inputProps={{ min: 0, step: "0.01" }}
        />
        <Button variant="contained" onClick={handleCreateEscrow}>
          Create Deal
        </Button>
        {status && <Typography>{status}</Typography>}
      </Stack>
    </Paper>
  );
};

export default CreateEscrowDeal;

