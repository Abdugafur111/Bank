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
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LogoutIcon from "@mui/icons-material/Logout";

interface headingProps {
  headingName: string;
}

const Heading = (props: headingProps) => {
  const theme = useTheme();
  const on_mobile = useMediaQuery(theme.breakpoints.only("xs"));
  return (
    <>
      <CssBaseline />
      <Box sx={{ overflowX: "hidden" }}>
        <AppBar position="static" color="secondary">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <>
              <Button color="primary">Features</Button>
              <Button color="primary">Customer Service</Button>
              <Button color="primary">Meet The Team</Button>
            </>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="lg"></Container>
    </>
  );
};
export default Heading;
