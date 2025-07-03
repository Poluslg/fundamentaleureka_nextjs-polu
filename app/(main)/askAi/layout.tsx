import React, { Suspense } from "react";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-5 min-h-screen" suppressHydrationWarning>
      <div className="flex flex-col items-start mb-5">
        <h1 className="text-6xl font-bold gradient-title">Ask AI</h1>
        <p className="text-muted-foreground text-xs">
          Ask anything to AI, and it will provide you with the best possible
          answer.
        </p>
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
