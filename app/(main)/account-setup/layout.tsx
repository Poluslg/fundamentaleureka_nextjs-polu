import React, { Suspense } from "react";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Verify OTP</h1>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <p className="text-2xl">Loading...</p>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}

export default Layout;
