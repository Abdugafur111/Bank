import Box from "@mui/material/Box";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Paper,
  Modal,
  FormHelperText,
} from "@mui/material";

import { useState, useEffect } from "react";
import { AccountCardProps } from "../components/AccountCard";
import Heading from "../components/Heading";
import React from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

import * as validate from "../interfaces/input_validation";
import { Form } from "react-router-dom";

const Profile = () => {
  const theme = useTheme();

  const on_mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [personId, setPersonId] = useCookies(["personId"]);
  const [token, setToken] = useCookies(["token"]);
  const [role, setRole] = useCookies(["role"]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState("");
  const [accounts, setAccounts] = useState<AccountCardProps[]>([]);
  const [currentFirstName, setCurrentFirstName] = useState("");
  const [currentLastName, setCurrentLastName] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [canDelete, setCanDelete] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [validPassword, setValidPassword] = useState(true);

  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validPhoneNumber, setValidPhoneNumber] = useState(true);

  const handleEditOpen = () => {
    setOpen(true);
  };
  const handleEditClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const url = `http://localhost:8080/people/${personId["personId"]}`;
    const auth_token = `Bearer ${token["token"]}`;
    try {
      axios
        .get(url, { headers: { Authorization: auth_token } })
        .then((response: any) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setPhone(response.data.phone);
          setAddress(response.data.address);
          setSsn(response.data.ssn);
          setDob(response.data.dob);

          setCurrentFirstName(response.data.firstName);
          setCurrentLastName(response.data.lastName);
          setCurrentEmail(response.data.email);
          setCurrentPhone(response.data.phone);
          setCurrentAddress(response.data.address);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const url = `http://localhost:8080/accounts/byPerson/${personId["personId"]}`;
    const auth_token = `Bearer ${token["token"]}`;
    console.log(auth_token);
    console.log(personId);
    try {
      axios
        .get(url, { headers: { Authorization: auth_token } })
        .then((response: any) => {
          response.data.map((account: any) => {
            const newAccount: AccountCardProps = {
              account_number: account.accountId,
              account_type: account.accountType,
              balance: account.balance,
              interest_rate: 0,
            };
            setAccounts((accounts) => [...accounts, newAccount]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    accounts.map((account: AccountCardProps) => {
      console.log(account.balance);
      if (account.balance > 0) {
        setCanDelete(false);
      } else {
        setCanDelete(true);
      }
    });
  }, [accounts]);

  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.delete(
        `http://localhost:8080/people/${personId["personId"]}`,
        {
          headers: { Authorization: `Bearer ${token["token"]}` },
          data: { password: password },
        }
      );
      setValidPassword(true);
      try {
        accounts.forEach((account) => {
          axios
            .post(
              `http://localhost:8080/accounts/${account.account_number}/deactivate`,
              {},
              { headers: { Authorization: `Bearer ${token["token"]}` } }
            )
            .then((response: any) => {
              console.log(response);
            });
        });
      } catch (error) {
        console.log(error);
      }
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      setValidPassword(false);
      return;
    }

    handleDeleteClose();
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const person = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      ssn: ssn,
      dob: dob,
    };
    console.log(phone);
    const url = `http://localhost:8080/people/${personId["personId"]}`;
    const auth_token = `Bearer ${token["token"]}`;
    try {
      axios.post(url, person, { headers: { Authorization: auth_token } });
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
    window.location.reload();
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setPassword(null);
    setValidPassword(true);
  };

  const card = (
    <React.Fragment>
      <CardContent>
        <h2> Personal Details</h2>
        <h3>{"First Name: " + currentFirstName}</h3>
        <h3>{"Last Name: " + currentLastName}</h3>
        <h3>{"Email: " + currentEmail}</h3>
        <h3>{"Date of Birth: " + dob}</h3>
        <h3>{"Phone Number: " + currentPhone}</h3>
        <h3>{"Address: " + currentAddress}</h3>
      </CardContent>
    </React.Fragment>
  );

  return (
    <>
      <Heading headingName="Profile" />
      <Container maxWidth="lg">
        <Card>{card}</Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            maxHeight: "100vh",
          }}
        >
          {role.role !== "ROLE_ADMIN" ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button variant="contained" onClick={() => handleEditOpen()}>
                <Typography variant="button">Edit Profile</Typography>
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteOpen(true)}
              >
                <Typography variant="button">Deactivate</Typography>
              </Button>
            </Box>
          ) : (
            <Button variant="contained" onClick={() => handleEditOpen()}>
              <Typography variant="button">Edit Profile</Typography>
            </Button>
          )}
        </Box>
        <Modal open={open} onClose={handleEditClose}>
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
                  handleEditSubmit(e)
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
                    label="First name"
                    defaultValue={firstName}
                    error={!validFirstName}
                    onChange={(e) => {
                      const isValid = validate.validateName(e.target.value);
                      setValidFirstName(isValid);
                      isValid && setFirstName(e.target.value);
                    }}
                  />

                  <TextField
                    label="Last name"
                    defaultValue={lastName}
                    error={!validLastName}
                    onChange={(e) => {
                      const isValid = validate.validateName(e.target.value);
                      setValidLastName(isValid);
                      isValid && setLastName(e.target.value);
                    }}
                  />

                  <TextField
                    label="Phone Number"
                    type="text"
                    defaultValue={phone}
                    error={!validPhoneNumber}
                    onChange={(e) => {
                      const isValid = validate.validatePhoneNumber(
                        e.target.value
                      );
                      setValidPhoneNumber(isValid);
                      isValid &&
                        e.target.value.length == 10 &&
                        setPhone(e.target.value);
                    }}
                  />

                  <TextField
                    label="Address"
                    defaultValue={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      !validFirstName || !validLastName || !validPhoneNumber
                    }
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Container>
          </Paper>
        </Modal>

        <Modal open={deleteOpen} onClose={handleDeleteClose}>
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
                  handleDeleteSubmit(e)
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 3,
                    paddingBottom: 3,
                    gap: 4,
                  }}
                >
                  <Typography variant="h4">Deactivate?</Typography>
                  <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                  >
                    required
                  </TextField>

                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    color="error"
                    disabled={!canDelete || !password || !validPassword}
                  >
                    Submit
                  </Button>
                  {!canDelete && (
                    <FormHelperText error>
                      You cannot delete your account if you have a balance in
                      any of your accounts.
                    </FormHelperText>
                  )}
                  {!validPassword && (
                    <FormHelperText error>Incorrect password</FormHelperText>
                  )}
                </Box>
              </Box>
            </Container>
          </Paper>
        </Modal>
      </Container>
    </>
  );
};

export default Profile;
