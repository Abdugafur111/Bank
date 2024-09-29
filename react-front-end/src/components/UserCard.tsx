import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import React, { useEffect, useState } from "react";
import UserCardProps from "../interfaces/user_card_props";
import { AccountCardPropsStatus } from "./AccountCard";
import axios from "axios";
import { useCookies } from "react-cookie";

const UserCard = (props: UserCardProps) => {
  const [accounts, setAccounts] = useState<AccountCardPropsStatus[]>([]);
  const [cookies, setCookie] = useCookies(["token"]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState<string>("");
  const [defaultText, setDefaultText] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The text you want to save
    const reportText = report;

    // Create a Blob object with the text
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a hidden link and attach the URL to it
    const link = document.createElement("a");
    link.href = url;

    const lastName = props.lastName;
    const firstName = props.firstName;
    const accountNumber = selectedAccount !== null ? accounts[selectedAccount].account_number : "";
    link.download = lastName+"_"+firstName+"_"+accountNumber+".txt"; // The file name

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
    setOpen(false);
  };

  useEffect(() => {
    const defaultValue = "";
    selectedAccount !== null
      ? setDefaultText(
          `BankBuddy Account Report\nReport Date: ${new Date().toLocaleDateString()}\n\nCLIENT INFORMATION\nName: ${
            props.firstName
          } ${props.lastName}\nEmail: ${props.email}\nPhone Number: ${
            props.phoneNumber
          }\nAddress: ${
            props.address
          }\n\nACCOUNT INFORMATION\nAccount Number: ${
            accounts[selectedAccount].account_number
          }\nAccount Type: ${
            accounts[selectedAccount].account_type
          }\nBalance:$${accounts[selectedAccount].balance} USD\nInterest Rate: ${
            accounts[selectedAccount].apy
          }%\nAccount Status: ${
            accounts[selectedAccount].status
          }\n\n\n\nNOTES:\n`
        )
      : setDefaultText(defaultValue);
    setReport(defaultText);
  }, [selectedAccount]);

  useEffect(() => {
    setReport(defaultText);
  }, [defaultText]);

  useEffect(() => {
    const auth_token = `Bearer ${cookies.token}`;
    const url = `http://localhost:8080/accounts/byPerson/${props.personId}`;
    try {
      axios
        .get(url, { headers: { Authorization: auth_token } })
        .then((response: any) => {
          response.data.map((account: any) => {
            const newAccount: AccountCardPropsStatus = {
              account_number: account.accountId,
              account_type: account.accountType,
              balance: account.balance,
              apy: account.apy,
              status: account.accountStatus,
            };
            setAccounts((accounts) => [...accounts, newAccount]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "10px",
          border: "2px solid purple",
          
        }}
      >
        <CardContent>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <PersonIcon />
              </Avatar>
            }
            title="Account Holder"
            subheader={props.firstName + " " + props.lastName}
          />

         
          <TextField
            select
            id="select-account"
            label="Select Account"
            fullWidth
            onChange={(e) => {
              setSelectedAccount(parseInt(e.target.value));
            }}
            value={selectedAccount}
            sx={{
              mt: 3,
            }}
          >
            {accounts.map((account, index) => (
              <MenuItem value={index} key={index}>
                {account.account_number} - {account.account_type} - $
                {account.balance} - {account.status}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            disabled={selectedAccount === null}
            onClick={() => setOpen(true)}
          >
            Generate Report
          </Button>

          <Modal open={open} onClose={handleClose}>
            <Paper
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                border: "2px solid purple",
                borderRadius: "10px",
                p: 2,
                display: "flex",
                flexDirection: "column",

                height: "80vh",
                width: "80vw",
              }}
            >
              <Container
                sx={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <Box
                  component={"form"}
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                    handleSubmit(e)
                  }
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      p: 1,
                      gap: "10px",
                    }}
                  >
                    <Typography variant="h4">Report Generation</Typography>
                    {selectedAccount !== null && (
                      <>
                        <Typography variant="h6">
                          Name: {props.firstName} {props.lastName}
                        </Typography>
                        <Typography variant="h6">
                          Account Number:{" "}
                          {accounts[selectedAccount].account_number}
                        </Typography>
                        <TextField
                          defaultValue={defaultText}
                          onChange={(e) => {
                            setReport(e.target.value);
                          }}
                          multiline
                          rows={30}
                          maxRows={35}
                          sx={{
                            mt: 3,
                          }}
                        />
                      </>
                    )}
                    <Button variant="contained" type="submit">
                      Save
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Paper>
          </Modal>
        </CardContent>
      </Card>
    </>
  );
};

export default UserCard;
