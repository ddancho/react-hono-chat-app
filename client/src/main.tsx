import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";
import { ChatContextProvider } from "./context/ChatContext.tsx";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <ChatContextProvider>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" />
          </BrowserRouter>
        </ChatContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  </StrictMode>
);
