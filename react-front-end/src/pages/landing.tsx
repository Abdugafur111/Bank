import React from "react";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import * as validate from "../interfaces/input_validation";

import {
  Card,
  CardContent,
  CardActions,
  Container,
  Typography,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Popover,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  FormHelperText,
} from "@mui/material";
import AccountCard from "../components/AccountCard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PinDropIcon from "@mui/icons-material/PinDrop";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AccountCardProps } from "../components/AccountCard";
import { useState, useEffect } from "react";
import Transaction from "../interfaces/Transaction";
import Heading from "../components/HeadingLanding";
const Landing = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "personId",
    "role",
  ]);
  const [repeat_password, set_repeat_password] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [email, set_email] = useState<string>("");
  const [newPassword, set_NewPassword] = useState<string>("");
  const [password, set_password] = useState<string>("");
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [validEmail, setValidEmail] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    removeCookie("token");
    removeCookie("personId");
    removeCookie("role");
  }, []);

  const handlePasswordOpen = () => {
    setOpen(true);
  };
  const handlePasswordClose = () => {
    setOpen(false);
    set_NewPassword(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const person = {
      email: email,
      newPassword: newPassword,
    };
    const url = "http://localhost:8080/setPassword";

    if (!(email === "admin@bankbuddy.com")) {
      try {
        const response = await axios.post(url, person);
        setResponse(response.data);
        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 3000);
      } catch (error) {
        setInvalidPassword(true);
      }
    } else setInvalidPassword(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInvalidPassword(false);
    const apiBaseUrl = "http://localhost:8080";
    ("http://localhost:8080");
    // if (email === "admin@bankbuddy.com"){

    //}
    try {
      const response = await axios.post(`${apiBaseUrl}/login`, {
        email,
        password,
      });

      setCookie("token", response.data.token, { path: "/" });
      setCookie("personId", response.data.personID, { path: "/" });
      setCookie("role", response.data.role, { path: "/" });

      //alert(cookies.get("token"));
      navigate("/dashboard");
    } catch (error: any) {
      setInvalidPassword(true);
    }
  };

  const theme = useTheme();
  const on_mobile = useMediaQuery(theme.breakpoints.only("xs"));

  const card = (
    <>
      <Container maxWidth={"lg"}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <CardContent>
            <Typography sx={{ fontSize: 24 }} color="black">
              Welcome Back
            </Typography>

            <TextField
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="Email Address"
              onChange={(e) => set_email(e.target.value)}
              sx={{
                "& fieldset": {
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                },
              }}
            />
            <TextField
              type="password"
              fullWidth
              id="password"
              label="Password"
              name="password"
              autoComplete="Password"
              onChange={(e) => set_password(e.target.value)}
              sx={{
                "& fieldset": {
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                },
                mt: 1,
              }}
            />
            {invalidPassword && (
              <FormHelperText error={invalidPassword}>
                Invalid Login
              </FormHelperText>
            )}
          </CardContent>
          <CardActions>
            <Button type="submit" variant="contained" size="medium">
              Sign In
            </Button>
          </CardActions>
          <Link sx={{ textDecoration: "none" }} href="/signup">
            {" "}
            Not a member? Sign up{" "}
          </Link>
          <br></br>
          <Link
            sx={{ textDecoration: "none" }}
            onClick={(e) => {
              e.preventDefault();
              handlePasswordOpen();
            }}
            component="button"
          >
            Forgot Password?
          </Link>
        </Box>
      </Container>
    </>
  );
  return (
    <>
      <Container maxWidth={false} disableGutters={true}>
        <Box
          sx={{
            backgroundColor: "primary.main",
            padding: "20px",
            maxHeight: "100vh",
          }}
        >
          <Container maxWidth={"xl"}>
            <Grid
              container
              spacing={2}
              sx={{
                minWidth: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Grid item lg={8} xs={12}>
                <Typography
                  variant={on_mobile ? "h4" : "h1"}
                  color="secondary"
                  sx={{ textAlign: "center" }}
                  display="block"
                >
                  BankBuddy
                </Typography>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Card
                  sx={{ borderRadius: 2, width: on_mobile ? "100%" : "100%" }}
                  variant="outlined"
                >
                  {card}
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Grid
          container
          sx={{ justifyContent: "space-around", alignItems: "center" }}
        >
          <Grid item xs={12} md={6} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccessTimeIcon sx={{ mt: 2 }}></AccessTimeIcon>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Bill Automation
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PinDropIcon sx={{ mt: 2 }}></PinDropIcon>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ATM Locator
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CameraAltIcon sx={{ mt: 2, mr: 3 }}></CameraAltIcon>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Scan-To-Deposit
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditNoteIcon sx={{ mt: 2 }}></EditNoteIcon>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Money Transfers
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Modal open={open} onClose={handlePasswordClose}>
          <Paper
            sx={{
              minWidth: on_mobile ? "75%" : "30%",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              border: "2px solid purple",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Container>
              <Box
                component={"form"}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                  handlePasswordSubmit(e)
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingTop: 3,
                    paddingBottom: 3,
                    gap: 4,
                  }}
                >
                  <TextField
                    required
                    name="email"
                    type="email"
                    id="email"
                    fullWidth
                    label="Email"
                    helperText={
                      invalidPassword ? "Email Not Found In System" : null
                    }
                    error={!validEmail}
                    onChange={(e) => {
                      setSuccess(false);
                      setInvalidPassword(false);
                      const isValid = validate.validateEmail(e.target.value);
                      setValidEmail(isValid);
                      isValid && set_email(e.target.value);
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    name="New Password"
                    label="New Password"
                    type="newPassword"
                    id="newPassword"
                    autoComplete="new-password"
                    onChange={(e) => {
                      setSuccess(false);
                      set_NewPassword(e.target.value);
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    name="repeat_password"
                    label="Repeat Password"
                    type="password"
                    id="repeat_password"
                    autoComplete="repeat-password"
                    onChange={(e) => {
                      setSuccess(false);
                      set_repeat_password(e.target.value);
                    }}
                    error={newPassword !== repeat_password}
                    helperText={
                      newPassword !== repeat_password
                        ? "Passwords do not match"
                        : null
                    }
                  />

                  <Button variant="contained" type="submit">
                    Change Password
                  </Button>
                  {success ? (
                    <Typography>Success! Password Changed. </Typography>
                  ) : null}
                </Box>
              </Box>
            </Container>
          </Paper>
        </Modal>
        <Container
          maxWidth={"xl"}
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 7,
            mb: 5,
          }}
        >
          <Box sx={{ mr: "auto" }}>
            <Typography variant="h4" align="center">
              BankBuddy allows its customers to automatically pay bills every
              month using automatic payment solution
            </Typography>
            <Divider
              variant="middle"
              sx={{ my: 8, borderBottomWidth: 3, bgcolor: "primary.main" }}
            ></Divider>
          </Box>
          <Box>
            <Typography variant="h4" align="center">
              In Need of Cash, Quick? Find one of BankBuddy’s partner ATMs
              easily so you have access to cash at the drop of a hat.
            </Typography>
            <Divider
              variant="middle"
              sx={{ my: 8, borderBottomWidth: 3, bgcolor: "primary.main" }}
            ></Divider>
          </Box>

          <Box>
            <Typography variant="h4" align="center">
              Have a physical check in hand? Check. BankBuddy uses
              top-of-the-line technology so you can scan your checks directly
              into your account.
            </Typography>
            <Divider
              variant="middle"
              sx={{ my: 8, borderBottomWidth: 3, bgcolor: "primary.main" }}
            ></Divider>
          </Box>

          <Box>
            <Typography variant="h4" align="center">
              BankBuddy allows customers to easily send money from one account
              to another. Whether its to a family member or landlord, BankBuddy
              makes money transferring easy.
            </Typography>
          </Box>
        </Container>
      </Container>
    </>
  );
};
export default Landing;
