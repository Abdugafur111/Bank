import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { purple } from "@mui/material/colors";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landing";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import Checks from "./pages/checks";
import ATM_Map from "./pages/atm_map";
import Money_Transfer from "./pages/money_transfer";
import RecurringPayments from "./pages/recurring_payments";
import ManagerDashboard from "./pages/manager-dashboard";
import Profile from "./pages/profile";
import ManagerLogin from "./pages/manager_login";

const LockedRoutes = () => {
  const [cookies, setCookie] = useCookies(["token", "personID"]);
  const navigate = useNavigate();
  const isUser = !!cookies.token;

  useEffect(() => {
    if (!isUser) {
      navigate("/");
    }
  }, [isUser, navigate]);

  return <Outlet />;
};

const LockedManagerRoutes = () => {
  const [cookies, setCookie] = useCookies(["role", "token"]);
  const navigate = useNavigate();
  const isUser = !!cookies.token;
  const isCustomer = cookies.role !== "ROLE_ADMIN";

  useEffect(() => {
    if (!isUser || isCustomer) {
      navigate("/");
    }
  }, [isUser, isCustomer, navigate]);

  return <Outlet />;
};

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<LockedManagerRoutes />}>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            </Route>
            <Route element={<LockedRoutes />}>
              <Route
                path="/recurring_payments"
                element={<RecurringPayments />}
              />
              <Route path="/profile" element={<Profile />} />

              <Route path="/" element={<Home />} />
              <Route path="/atm_map" element={<ATM_Map />} />
              <Route path="/money_transfer" element={<Money_Transfer />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checks" element={<Checks />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
