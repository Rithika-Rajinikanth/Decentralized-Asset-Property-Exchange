import React, { useState } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import axios from "axios";

const PropertyUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading...");

    try {
      // Prepare form data for Pinata
      const formData = new FormData();
      formData.append("file", file);

      // Pinata API credentials stored as environment variables
      const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
      const PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;

      if (!PINATA_API_KEY || !PINATA_API_SECRET) {
        setStatus("Pinata API keys not found in environment variables.");
        setIsUploading(false);
        return;
      }

      // POST request to Pinata pinFileToIPFS endpoint
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity", // Support large files
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      });

      const ipfsHash = res.data.IpfsHash;
      setStatus(`Upload successful: IPFS Hash ${ipfsHash}`);

      if (onUpload) onUpload(ipfsHash);
    } catch (error) {
      console.error("Error uploading file to IPFS via Pinata:", error);
      setStatus("Upload failed. See console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Upload Property Metadata / Media
      </Typography>
      <Stack spacing={2}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,application/json,video/*" // optional: restrict upload types
          disabled={isUploading}
        />
        <Button variant="contained" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload to IPFS"}
        </Button>
        {status && <Typography color={status.startsWith("Upload successful") ? "primary" : "error"}>{status}</Typography>}
      </Stack>
    </Paper>
  );
};

export default PropertyUploader;

