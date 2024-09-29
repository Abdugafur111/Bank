import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import signup_object from "../interfaces/signup_object";
import { useState } from "react";
import { Form } from "react-router-dom";
import * as validate from "../interfaces/input_validation";

export default function SignUp() {
  const [signupForm, setSignupForm] = useState<signup_object>();
  const [first_name, set_first_name] = useState<string>("");
  const [last_name, set_last_name] = useState<string>("");
  const [email, set_email] = useState<string>("");
  const [password, set_password] = useState<string>("");
  const [repeat_password, set_repeat_password] = useState<string>("");
  const [street_address, set_street_address] = useState<string>("");
  const [city, set_city] = useState<string>("");
  const [state, set_state] = useState<string>("");
  const [zip_code, set_zip_code] = useState<string>("");
  const [phone_number, set_phone_number] = useState<string>("");
  const [ssn, set_ssn] = useState<string>("");

  const [account_type, set_account_type] = useState<string>("Checking");

  const max_date = new Date();
  max_date.setFullYear(max_date.getFullYear() - 18);
  const maxDate = `${max_date.getFullYear()}-${String(
    max_date.getMonth() + 1
  ).padStart(2, "0")}-${String(max_date.getDate()).padStart(2, "0")}`;

  const min_date = new Date();
  min_date.setFullYear(min_date.getFullYear() - 150);
  const minDate = `${min_date.getFullYear()}-${String(
    min_date.getMonth() + 1
  ).padStart(2, "0")}-${String(min_date.getDate()).padStart(2, "0")}`;

  const [dob, set_dob] = useState<String>(maxDate as unknown as string);

  const [validEmail, setValidEmail] = useState<boolean>(true);

  const [validFirstName, setValidFirstName] = useState<boolean>(true);
  const [validLastName, setValidLastName] = useState<boolean>(true);

  const [validPhoneNumber, setValidPhoneNumber] = useState<boolean>(true);

  const [validZip, setValidZip] = useState<boolean>(true);

  const [validSSN, setValidSSN] = useState<boolean>(true);

  const [validCity, setValidCity] = useState<boolean>(true);

  const [validState, setValidState] = useState<boolean>(true);

  const[errorSubmit, setErrorSubmit] = useState<boolean>(false);

  const [validDate, setValidDate] = useState<boolean>(true);
  const validateDate = (input_date: Date) => {
    return (
      input_date.getTime() <= max_date.getTime() &&
      input_date.getTime() >= min_date.getTime()
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== repeat_password) {
      console.log("Passwords do not match");
      return;
    }


    const apiBaseUrl = "http://localhost:8080";
    ("http://localhost:8080");
    try {
      const response = await axios.post(`${apiBaseUrl}/registration`, {
        firstName: first_name,
        lastName: last_name,
        email,
        password,
        address: street_address,
        city,
        state,
        zip: zip_code,
        phone: phone_number,
        ssn,
        dob: dob.split("T")[0],
        accountType: account_type,
      });

      console.log("Response from backend:", response.data);

      
      //transition to landing page
      window.location.href = "/";
    } catch (error:any) {
      if(error.response.data.errorMessage === "Person with this email already exists"){
        setValidEmail(false);
        setErrorSubmit(true);
      }
    }
  };

  React.useEffect(() => {
    signupForm && console.log(signupForm); //connect to api here
  }, [signupForm]);

  return (
    <Container
      component="main"
      //   maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "2px solid purple",
          borderRadius: "10px",
          padding: "20px",
          my: "20px",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <ModeEditOutlineRoundedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={!validFirstName}
                onChange={(e) => {
                  const isValid = validate.validateName(e.target.value);
                  setValidFirstName(isValid);
                  isValid && set_first_name(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                error={!validLastName}
                onChange={(e) => {
                  const isValid = validate.validateName(e.target.value);
                  setValidLastName(isValid);
                  isValid && set_last_name(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                type="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!validEmail}
                onChange={(e) => {
                  const isValid = validate.validateEmail(e.target.value);
                  setValidEmail(isValid);
                  isValid && set_email(e.target.value);
                }}
              />
              {errorSubmit && (
            <FormHelperText error={errorSubmit}>
              Email already in use!
            </FormHelperText>
          )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => set_password(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                name="repeat_password"
                label="Repeat Password"
                type="password"
                id="repeat_password"
                autoComplete="repeat-password"
                onChange={(e) => set_repeat_password(e.target.value)}
                error={password !== repeat_password}
                helperText={
                  password !== repeat_password ? "Passwords do not match" : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="address"
                label="Street Address"
                name="address"
                autoComplete="address"
                onChange={(e) => set_street_address(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="city"
                error={!validCity}
                onChange={(e) => {
                  const isValid = validate.validateCity(e.target.value);
                  setValidCity(isValid);
                  isValid && set_city(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                fullWidth
                id="state"
                label="State"
                name="state"
                autoComplete="state"
                error={!validState}
                onChange={(e) => {
                  const isValid = validate.validateState(e.target.value);
                  setValidState(isValid);
                  isValid && set_state(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                fullWidth
                id="zip"
                label="Zip Code"
                name="zip"
                autoComplete="zip"
                error={!validZip}
                onChange={(e) => {
                  const isValid = validate.validateZip(e.target.value);
                  setValidZip(isValid);
                  isValid && set_zip_code(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phone_number"
                type="text"
                label="Phone Number"
                name="phone_number"
                autoComplete="phone_number"
                placeholder="1234567890"
                error={!validPhoneNumber}
                onChange={(e) => {
                  const isValid = validate.validatePhoneNumber(e.target.value);
                  setValidPhoneNumber(
                    isValid
                  );
                  isValid && set_phone_number(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="ssn"
                label="Social Security Number"
                type="text"
                name="ssn"
                autoComplete="ssn"
                placeholder="XXXXXXXXX"
                error={!validSSN}
                onChange={(e) => {
                  const isValid = validate.validateSSN(e.target.value);
                  setValidSSN(isValid);
                  isValid && set_ssn(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <TextField
                  fullWidth
                  id="dob"
                  type="date"
                  name="dob"
                  autoComplete="dob"
                  defaultValue={maxDate}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value + 'T00:00:00-08:00');
                    const isValid = validateDate(selectedDate);
                    setValidDate(isValid);
                    isValid && set_dob(selectedDate.toISOString().split("T")[0]);
                  }}
                  inputProps={{
                    max: maxDate,
                    min: minDate,
                  }}
                  error={!validDate}
                  helperText={!validDate ? "Invalid Date" : ""}
                />
                <FormHelperText>Date of Birth</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="account-type">Account Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="account-type"
                  name="account-type-row"
                  defaultValue="Checking"
                  onChange={(e) => set_account_type(e.target.value)}
                >
                  <FormControlLabel
                    value="Checking"
                    control={<Radio />}
                    label="Checking"
                  />
                  <FormControlLabel
                    value="Savings"
                    control={<Radio />}
                    label="Savings"
                  />
                  <FormControlLabel
                    value="Both"
                    control={<Radio />}
                    label="Both"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={
              !validFirstName ||
              first_name.length == 0 ||
              !validLastName ||
              last_name.length == 0 ||
              !validEmail ||
              email.length == 0 ||
              password !== repeat_password ||
              password.length == 0 ||
              !validPhoneNumber ||
              phone_number.length == 0 ||
              !validZip ||
              zip_code.length == 0 ||
              !validSSN ||
              ssn.length == 0 ||
              !validCity ||
              city.length == 0 ||
              !validState ||
              state.length == 0 ||
              !validDate ||
              dob.toString().length == 0
            }
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
