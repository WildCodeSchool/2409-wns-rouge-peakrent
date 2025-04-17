import { Toaster } from "@/components/ui/sonner";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AdminProvider } from "./context/adminProvider.tsx";
import { DeleteModalProvider } from "./context/deleteModalProvider.tsx";
import { ModalProvider } from "./context/modalProvider.tsx";
import "./styles/global.css";
import { TailwindIndicator } from "./utils/TailwindIndicator.tsx";

const client = new ApolloClient({
  // uri: "http://localhost:5050/",
  uri: "/api",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ModalProvider>
        <DeleteModalProvider>
          <AdminProvider>
            <App />
            <Toaster />
          </AdminProvider>
        </DeleteModalProvider>
      </ModalProvider>
      <TailwindIndicator />
    </ApolloProvider>
  </StrictMode>
);
