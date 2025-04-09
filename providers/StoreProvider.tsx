"use client";
import React from "react";

import { SessionProvider } from "next-auth/react";
import store from "../src/app/redux/store";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  );
}
