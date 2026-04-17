// src/components/admin/KYCManager.jsx
import React, { useState } from "react";
import { getContracts } from "../../web3";

const KYCManager = () => {
  const [userAddress, setUserAddress] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [message, setMessage] = useState("");

  const checkKYCStatus = async () => {
    try {
      const { realEstateContract } = await getContracts();
      const verified = await realEstateContract.kycVerified(userAddress);
      setKycStatus(verified ? "Verified" : "Not Verified");
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Error fetching KYC status");
    }
  };

  const verifyUser = async () => {
    try {
      const { realEstateContract } = await getContracts();
      const tx = await realEstateContract.verifyIdentity(userAddress);
      await tx.wait();
      setKycStatus("Verified");
      setMessage("User verified successfully");
    } catch (error) {
      console.error(error);
      setMessage("Failed to verify user");
    }
  };

  return (
    <div>
      <h3>KYC Manager</h3>
      <input
        type="text"
        placeholder="User Wallet Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <button onClick={checkKYCStatus}>Check KYC Status</button>
      <button onClick={verifyUser}>Verify User</button>
      <p>Status: {kycStatus}</p>
      <p>{message}</p>
    </div>
  );
};

export default KYCManager;
