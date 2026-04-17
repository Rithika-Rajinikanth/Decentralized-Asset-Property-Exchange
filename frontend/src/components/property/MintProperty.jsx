// components/property/MintProperty.jsx
import React, { useState } from "react";
import { Paper, Stack, TextField, Button, Typography } from "@mui/material";
import { getContracts } from "../../web3";
import { useNavigate } from "react-router-dom";

const MintProperty = ({ onMintSuccess }) => {
  const [ipfsHash, setIpfsHash] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleMint = async () => {
    if (!ipfsHash || ipfsHash.length < 10) {
      setStatus("Please enter a valid IPFS hash");
      return;
    }

    try {
      const { propertyNFT } = await getContracts();
      const tx = await propertyNFT.tokenizeProperty(ipfsHash, 1000); // default 1000 shares
      await tx.wait();

      setStatus("✅ Property NFT minted/tokenized successfully!");
      setIpfsHash("");

      if (onMintSuccess) onMintSuccess();

      // Optional delay for UX
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Mint error:", error);
      setStatus("❌ Minting failed: " + (error.message || error));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Mint Property NFT</Typography>
      <Stack spacing={2}>
        <TextField
          label="Metadata IPFS Hash (CID)"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleMint}>
          Mint
        </Button>
        {status && <Typography>{status}</Typography>}
      </Stack>
    </Paper>
  );
};

export default MintProperty;


