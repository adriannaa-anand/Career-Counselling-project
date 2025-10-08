import React from "react";

const ResultPage = () => {
  const domain = localStorage.getItem("preferredDomain");

  return (
    <div className="container mt-5 text-center">
      <h2>Your Recommended IT Domain</h2>
      <h3 className="text-success mt-4">{domain}</h3>
      <p className="mt-3">Start exploring courses, internships, and projects in {domain}!</p>
    </div>
  );
};
// 
export default ResultPage;
