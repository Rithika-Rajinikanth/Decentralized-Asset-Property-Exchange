// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { connectWallet, onAccountsChanged } from "./web3";

import MainLayout from "./components/layout/MainLayout";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import KYCManager from "./components/admin/KYCManager";

// Analytics
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";

// Property
import MintProperty from "./components/property/MintProperty";
import FractionalizeProperty from "./components/property/FractionalizeProperty";
import CreateEscrowDeal from "./components/property/CreateEscrowDeal";
import PropertyUploader from "./components/property/PropertyUploader";

// Investment
import InvestInShares from "./components/investment/InvestInShares";
import LoanLienDisplay from "./components/investment/LoanLienDisplay";

// Home
import Home from "./Home";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMintSuccess = () => {
    setRefreshKey(prev => prev + 1); // triggers PropertyGallery refresh
  };

  useEffect(() => {
    const initWallet = async () => {
      const address = await connectWallet();
      if (address) setCurrentAccount(address);
    };

    initWallet();
    onAccountsChanged(setCurrentAccount);
  }, []);

  const handleConnectWallet = async () => {
    const addr = await connectWallet();
    if (addr) setCurrentAccount(addr);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout currentAccount={currentAccount} onConnectWallet={handleConnectWallet} />}>
          <Route index element={<Home currentAccount={currentAccount} refreshKey={refreshKey} />} />
          <Route path="property">
            <Route path="mint" element={<MintProperty onMintSuccess={handleMintSuccess} />} />
            <Route path="fractionalize" element={<FractionalizeProperty />} />
            <Route path="escrow" element={<CreateEscrowDeal />} />
            <Route path="upload" element={<PropertyUploader />} />
          </Route>
          <Route path="invest" element={<InvestInShares />} />
          <Route path="liens" element={<LoanLienDisplay />} />
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            <Route path="kyc" element={<KYCManager />} />
          </Route>
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


