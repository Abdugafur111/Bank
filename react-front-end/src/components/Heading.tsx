import React from "react";
import Box from "@mui/material/Box";
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteIcon from "@mui/icons-material/Note";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface headingProps {
  headingName: string;
}

const Heading = (props: headingProps) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "personId",
    "role",
  ]);

  const theme = useTheme();
  const on_mobile = useMediaQuery(theme.breakpoints.only("xs"));

  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <Box sx={{ overflowX: "hidden" }}>
        <AppBar position="static">
          <Toolbar
            sx={{
              justifyContent: "space-between",
            }}
          >
            {on_mobile ? (
              <>
                <IconButton
                  color="secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  <AccountBalanceWalletIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => navigate("/money_transfer")}
                >
                  <CompareArrowsIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => navigate("/recurring_payments")}
                >
                  <DescriptionIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => navigate("/checks")}
                >
                  <NoteIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => navigate("/atm_map")}
                >
                  <LocalAtmIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  color="secondary"
                  startIcon={<AccountBalanceWalletIcon />}
                  onClick={() => navigate("/dashboard")}
                >
                  Accounts
                </Button>
                <Button
                  color="secondary"
                  onClick={() => navigate("/money_transfer")}
                  startIcon={<CompareArrowsIcon />}
                >
                  Transfer
                </Button>
                <Button
                  color="secondary"
                  onClick={() => navigate("/recurring_payments")}
                  startIcon={<DescriptionIcon />}
                >
                  Bills
                </Button>
                <Button
                  color="secondary"
                  onClick={() => navigate("/checks")}
                  startIcon={<NoteIcon />}
                >
                  Checks
                </Button>
                <Button
                  color="secondary"
                  onClick={() => navigate("/atm_map")}
                  startIcon={<LocalAtmIcon />}
                >
                  ATMS
                </Button>
              </>
            )}
            <Box>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => navigate("/profile")}
              >
                <AccountBoxIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  removeCookie("token");
                  removeCookie("personId");
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="lg">
        <Box>
          {cookies.role === "ROLE_ADMIN" ? (
            <>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <Typography variant="h3" sx={{ ml: 2, mt: 2 }}>
                {props.headingName}
              </Typography>
              <Button sx={{mt:2}}size="small"variant="contained"onClick={() => navigate("/manager-dashboard")}>
                Manager Dash
              </Button>
            </Box>
            </>
          ) : (
            <Typography variant="h3" sx={{ ml: 2, mt: 2 }}>
              {props.headingName}
            </Typography>
          )}

          <Divider sx={{ bgcolor: "primary.main", borderBottomWidth: 2 }} />
        </Box>
      </Container>
    </>
  );
};
export default Heading;
