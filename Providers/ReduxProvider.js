"use client";
import { getStore } from "@/redux/store/Store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "react-redux";

export default function ReduxProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const store = getStore();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
