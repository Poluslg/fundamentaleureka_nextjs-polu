import React, { Suspense } from "react";
import SkeletonDeshboard from "./_components/Skeleton";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Admin Page</h1>
      </div>
      <Suspense fallback={<SkeletonDeshboard />}>{children}</Suspense>
    </div>
  );
}

export default Layout;
