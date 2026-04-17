import React, { useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { parseUnits } from "ethers";
import { getContracts } from "../../web3";

const InvestInShares = () => {
  const [propertyId, setPropertyId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleInvest = async () => {
    try {
      if (!propertyId.trim() || !amount.trim()) {
        setStatus("❌ Please enter valid Property ID and Amount.");
        return;
      }

      const { stablecoinContract, shareTokenContract } = await getContracts();

      const approveTx = await stablecoinContract.approve(
        shareTokenContract.address,
        parseUnits(amount, 18)
      );
      await approveTx.wait();

      const investTx = await shareTokenContract.invest(
        propertyId,
        parseUnits(amount, 18)
      );
      await investTx.wait();

      setStatus("✅ Investment successful!");
    } catch (error) {
      console.error(error);
      setStatus(`❌ Investment failed: ${error.message || error}`);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Invest in Shares</Typography>
      <Stack spacing={2}>
        <TextField
          label="Property ID"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          fullWidth
        />
        <TextField
          label="Amount to Invest"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          type="number"
          inputProps={{ min: 0, step: "0.01" }}
        />
        <Button variant="contained" onClick={handleInvest}>
          Invest
        </Button>
        {status && <Typography>{status}</Typography>}
      </Stack>
    </Paper>
  );
};

export default InvestInShares;

