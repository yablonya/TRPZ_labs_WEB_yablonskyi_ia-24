"use client";

import React from "react";
import "../styles/index.scss";
import { UserProvider } from "@/utils/hooks/useAuthentication";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
	        {children}
        </UserProvider>
      </body>
    </html>
  );
}
