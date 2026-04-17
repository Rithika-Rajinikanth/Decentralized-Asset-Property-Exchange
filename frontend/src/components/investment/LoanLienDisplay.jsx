import React, { useState } from "react";
import { Button, Paper, Stack, TextField, Typography, Divider } from "@mui/material";
import { getContracts } from "../../web3";
import { formatEther } from "ethers";

const LoanLienDisplay = () => {
  const [propertyId, setPropertyId] = useState("");
  const [lienInfo, setLienInfo] = useState(null);
  const [status, setStatus] = useState("");

  const fetchLienDetails = async () => {
    try {
      const { loanLienManagerContract } = await getContracts();
      const details = await loanLienManagerContract.getLienDetails(propertyId);
      setLienInfo(details);
      setStatus("");
    } catch (error) {
      console.error(error);
      setStatus("Failed to fetch lien details.");
      setLienInfo(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Loan / Lien Information</Typography>
      <Stack spacing={2} mb={2}>
        <TextField
          label="Property ID"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={fetchLienDetails}>Get Lien Info</Button>
        {status && <Typography color="error">{status}</Typography>}
      </Stack>

      {lienInfo && (
        <div>
          <Divider sx={{ mb: 2 }} />
          <Typography><strong>Loan Amount:</strong> {lienInfo.loanAmount ? formatEther(lienInfo.loanAmount) : "-"} ETH</Typography>
          <Typography><strong>Interest Rate:</strong> {lienInfo.interestRate ? lienInfo.interestRate.toString() : "-"}%</Typography>
          <Typography><strong>Due Date:</strong> {lienInfo.dueDate ? new Date(Number(lienInfo.dueDate) * 1000).toLocaleDateString() : "-"}</Typography>
          <Typography><strong>Is Active:</strong> {lienInfo.isActive ? "Yes" : "No"}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default LoanLienDisplay;


