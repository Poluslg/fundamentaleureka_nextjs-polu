import React from "react";

function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return (
    <footer className="bg-muted py-6  w-full">
      <div className="container mx-auto text-center text-white">
        <p>© {year} FundaMentalEureka. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
