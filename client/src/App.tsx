import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CompaniesPage from "@/pages/companies";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      <Topbar />
      <div className="d-flex">
        <Sidebar />
        <main
          className="flex-grow-1"
          style={{
            marginLeft: "84px",
            marginTop: "64px",
            padding: "1.5rem",
          }}
        >
          <Switch>
            <Route path="/" component={CompaniesPage} />
            <Route path="/companies" component={CompaniesPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
