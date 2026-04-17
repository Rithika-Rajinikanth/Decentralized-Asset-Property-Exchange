// src/components/admin/AdminDashboard.jsx
import React from "react";
import { useState, useEffect } from "react";
import UserManagement from "./UserManagement";
import PropertyManagement from "./PropertyManagement";
import KYCManager from "./KYCManager";

const ADMIN_WALLETS = [
  "0xedb64DE71B979B8aD98097358f7770D0402db298",
  // add more admin addresses as needed
];

const AdminDashboard = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const acc = accounts[0].toLowerCase();
        setCurrentAccount(acc);
        setIsAdmin(ADMIN_WALLETS.map(addr => addr.toLowerCase()).includes(acc));
      }
    };
    checkAdmin();
  }, []);

  if (!isAdmin) {
    return <div>Access Denied. You are not an admin.</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, admin: {currentAccount}</p>
      <section>
        <h3>User Management</h3>
        <UserManagement />
      </section>
      <section>
        <h3>Property Management</h3>
        <PropertyManagement />
      </section>
      <section>
        <h3>KYC Manager</h3>
        <KYCManager />
      </section>
    </div>
  );
};

export default AdminDashboard;
