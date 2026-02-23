import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { ThemeProvider } from "./contexts/ThemeContext";
// Removed wouter imports (Route, Switch)
// Removed NotFound, Home, Admin imports as they are handled by react-router-dom in main.tsx
// Removed HelmetProvider import and usage here as it will move to main.tsx

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <TooltipProvider>
          <Toaster />
          <Outlet />
          <FloatingWhatsApp />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
