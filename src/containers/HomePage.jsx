import React from "react";
import Counter from "@/components/Counter";

const HomePage = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", backgroundColor: "lightblue", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Home Page</h1>
      <Counter />
    </div>
  );
}

export default HomePage;