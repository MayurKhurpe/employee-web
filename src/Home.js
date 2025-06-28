// src/Home.js
import React from "react";

export default function Home({ onLogout }) {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Welcome Home!</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
