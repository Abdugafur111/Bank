import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { FileUploader } from "react-drag-drop-files";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";

import {
  Container,
  MenuItem,
  CircularProgress,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Modal,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect } from "react";
import Transaction from "../interfaces/Transaction";
import { AccountCardProps, AccountCard } from "../components/AccountCard";
import Heading from "../components/Heading";
import React from "react";

const Checks = () => {
  //const auth_token = `Bearer ${token["token"]}`;
  const [token, setToken] = useCookies(["token"]);
  const [personId, setPersonId] = useCookies(["personId"]);
  const [cookies, setCookie] = useCookies(["token", "personID"]);
  const [depositForm, setDepositForm] = useState<deposit_object>();
  const [depositTo, setDepositTo] = useState<string | null>(null);
  const [depositAmount, set_depositAmount] = useState<float>("");
  const [accounts, setAccounts] = useState<AccountCardProps[]>([]);
  const [file, setFile] = useState(null);
  const [checkLoading, setCheckLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [failure, setFailure] = useState<boolean>(false);

  const auth_token = `Bearer ${token["token"]}`;
  useEffect(() => {
    console.log(personId["token"]);
    //console.log(personId);
    const url = `http://localhost:8080/accounts/byPerson/${personId["personId"]}`;
    try {
      axios
        .get(url, { headers: { Authorization: auth_token } })
        .then((response: any) => {
          console.log(response.data);
          response.data.map((account: any) => {
            const newAccount: AccountCardProps = {
              account_number: account.accountId,
              account_type: account.accountType,
              balance: account.balance,
              interest_rate: 0,
            };
            account.accountStatus === "Active" &&
              setAccounts((accounts) => [...accounts, newAccount]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setFailure(false);
    setSuccess(false);
    setCheckLoading(true);
    event.preventDefault();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookies.token}`,
      },
    };
    const bodyParameters = {
      file: file,
      userId: cookies.personId,
      destinationAccount: depositTo,
    };
    const apiBaseUrl = "http://localhost:8080";
    ("http://localhost:8080");
    try {
      const response = await axios.post(
        `${apiBaseUrl}/bank/processImage`,
        bodyParameters,
        config
      );
      setResponse(response.data);
      console.log("Response from backend:", response.data);
      if (response.data === "Amount cannot be zero") {
        setFailure(true);
        setError("Amount cannot be zero. Please upload proper check image.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (error) {
      setFailure(true);

      if (error.response)
        setError("Error sending the request: " + error.response);
      else if (error.request)
        setError("Request made but no response received: " + error.request);
      else setError(error.message);
    } finally {
      setCheckLoading(false);
    }
  };
  React.useEffect(() => {
    depositForm; //connect to api here
  }, [depositForm]);

  const fileTypes = ["PNG"];
  function DragDrop() {
    const handleChange = (file) => {
      setFile(file);
      setFileType(file.type);
    };
    return (
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
    );
  }
  return (
    <>
      <Heading headingName="Checks" />
      <Container maxWidth="lg">
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
          <Container>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DragDrop />
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid>
                <TextField
                  select
                  id="Deposit To"
                  label="Deposit To:"
                  fullWidth
                  value={depositTo}
                  onChange={(e) => setDepositTo(e.target.value)}
                >
                  {accounts.map((account) => (
                    <MenuItem
                      value={account.account_number}
                      key={account.account_number}
                    >
                      {account.account_number} - {account.account_type} - $
                      {account.balance}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Button
                disabled={!file || !depositTo}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Deposit
              </Button>
            </Box>
            <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
          </Container>
          {checkLoading ? (
            <Box sx={{ display: "flex" }}>
              <Typography>
                Please wait while we deposit your check. . .
              </Typography>
              <CircularProgress></CircularProgress>
            </Box>
          ) : null}
          {success ? (
            <Typography>Success! Updating Balance. . . </Typography>
          ) : null}
          {failure ? (
            <>
              <Typography>Check Deposit failed. {error}</Typography>
              <Typography></Typography>
            </>
          ) : null}
        </Box>
      </Container>
    </>
  );
};

export default Checks;
