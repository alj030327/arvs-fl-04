import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Process from "./pages/Process";
import Demo from "./pages/Demo";
import DemoBasic from "./pages/DemoBasic";
import DemoInstructions from "./pages/DemoInstructions";
import DemoBasicForm from "./pages/DemoBasicForm";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import Enterprise from "./pages/Enterprise";
import { SignDocument } from "./pages/SignDocument";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/process" element={<Process />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/demo-basic" element={<DemoBasic />} />
          <Route path="/demo-instructions" element={<DemoInstructions />} />
          <Route path="/demo-basic-form" element={<DemoBasicForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/sign/:token" element={<SignDocument />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
