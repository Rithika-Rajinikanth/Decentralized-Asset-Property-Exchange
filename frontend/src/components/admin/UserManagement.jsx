// src/components/admin/UserManagement.jsx
import React, { useEffect, useState } from "react";
import { getContracts } from "../../web3";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { realEstateContract } = await getContracts();
        // Example: fetch registered users count and list (your contract may vary)
        const count = await realEstateContract.getUsersCount();
        let userList = [];
        for (let i = 0; i < count; i++) {
          const user = await realEstateContract.users(i);
          userList.push(user);
        }
        setUsers(userList);
      } catch (e) {
        console.error("Failed to load users", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h4>User Management</h4>
      {users.length === 0 && <p>No registered users found.</p>}
      <ul>
        {users.map((user, idx) => (
          <li key={idx}>
            Wallet: {user} {/* Extend with more fields if available */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
