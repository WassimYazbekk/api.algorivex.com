import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "./components/theme-provider";
import { AuthContextProvider } from "./contexts/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

const client = new QueryClient();
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <AuthContextProvider>
                <QueryClientProvider client={client}>
                    <RouterProvider router={router} />
                    <Toaster />
                </QueryClientProvider>
            </AuthContextProvider>
        </ThemeProvider>
    </StrictMode>,
);
