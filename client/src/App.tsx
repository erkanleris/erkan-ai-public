/**
 * ERKAN AI — نبض المنشور المبسّط: موقع صفحة واحدة بلا مسارات فرعية.
 * هذا يمنع أي تعارض توجيه عند النشر ضمن رابط GitHub Pages الفرعي.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster richColors position="top-center" />
          <Home />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
