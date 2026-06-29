import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";

// Dashboard shell components
import AuthGuard from "./components/dashboard/AuthGuard";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Dashboard nested pages
import Overview from "./pages/dashboard/Overview";
import Campaigns from "./pages/dashboard/Campaigns";
import CampaignNew from "./pages/dashboard/CampaignNew";
import CampaignDetail from "./pages/dashboard/CampaignDetail";
import Audience from "./pages/dashboard/Audience";
import Analytics from "./pages/dashboard/Analytics";
import Integrations from "./pages/dashboard/Integrations";
import Settings from "./pages/dashboard/Settings";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        
        {/* Protected Dashboard Route Nesting */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Overview />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/new" element={<CampaignNew />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="audience" element={<Audience />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
