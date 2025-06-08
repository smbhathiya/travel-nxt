import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <div className="mt-12">{children}</div>
    </div>
  );
};

export default Layout;
