"use client";
import React from "react";
import store from "../src/app/redux/store";
import { Provider } from "react-redux";

// This provider only sets up the Redux store. `SessionProvider` is provided
// once in `src/app/layout.tsx` via `NextAuthSessionProvider` to avoid double
// wrapping which can cause inconsistent session state on the client.
export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
