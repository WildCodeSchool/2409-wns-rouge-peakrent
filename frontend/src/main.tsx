import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.scss";
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
      <App />
      <TailwindIndicator />
    </ApolloProvider>
  </StrictMode>
);
