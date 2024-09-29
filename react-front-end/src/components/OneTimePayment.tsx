import {
  Box,
  Button,
  Container,
  Divider,
  FormHelperText,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AccountCardProps } from "./AccountCard";
import { useCookies } from "react-cookie";
import axios from "axios";
const OneTimePayment = () => {
  const [payee, setPayee] = useState<string | null>(null);
  const [sourceAccount, setSourceAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [transactionError, setTransactionError] = useState<boolean>(false);
  const [accountError, setAccountError] = useState<boolean>(false);
  const [validPayee, setValidPayee] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<AccountCardProps[]>([]);
  const [personId, setPersonId] = useCookies(["personId"]);
  const [token, setToken] = useCookies(["token"]);
  const auth_token = `Bearer ${token["token"]}`;

  const isValidPayee = (num: string) => {
    if (num.length !== 9) {
      setValidPayee(false);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const url = `http://localhost:8080/accounts/byPerson/${personId["personId"]}`;
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
            account.accountStatus === "Active" &&
              setAccounts((accounts) => [...accounts, newAccount]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    let isTError = false;
    let isAError = false;
    e.preventDefault();
    try {
      const payload = {
        sourceAccountId: sourceAccount,
        sourceUserId: personId["personId"],
        destinationAccountId: payee,
        amount: amount,
      };
      await axios.post(`http://localhost:8080/accounts/transfer`, payload, {
        headers: { Authorization: `Bearer ${token["token"]}` },
      });
    } catch (error: any) {
      if (error.response.data === "Insufficient funds") {
        isTError = true;
        console.log(isTError);
        setTransactionError(true);
      } else {
        isAError = true;
        setAccountError(true);
      }
    }
    //console.log(isTError, isAError);
    !isTError && !isAError && handleClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(event.target.value))) {
      const value = Number(event.target.value);
      if (!Number.isInteger(value)) {
        if (value !== Number(value.toFixed(2))) {
          setAmount(0);
          return;
        }
      }
      setAmount(value);
    } else {
      setAmount(0);
    }
  };

  const handleKeyPressAmount = (e: React.KeyboardEvent) => {
    if (e.key === "e" || e.key === "-" || e.key === "+" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      e.key === "e" ||
      e.key === "." ||
      e.key === "-" ||
      e.key === "+" ||
      e.key === "E"
    ) {
      e.preventDefault();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTransactionError(false);
    setAccountError(false);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          mt: 2,
          border: "2px solid purple",
          borderRadius: "10px",
          p: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mr: "auto",
          }}
        >
          One Time Payment
        </Typography>
        <Divider sx={{ bgcolor: "primary.main" }} />
        <TextField
          name="payee"
          label="Payee Account Number:"
          type="number"
          error={!validPayee}
          onChange={(e) => {
            const isValid = isValidPayee(e.target.value);
            setValidPayee(isValid);
            isValid && setPayee(e.target.value);
          }}
          onKeyDown={(e) => handleKeyPress(e)}
        ></TextField>

        <TextField
          select
          id="source"
          label="Source Account"
          fullWidth
          onChange={(e) => setSourceAccount(e.target.value)}
          value={sourceAccount}
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

        <TextField
          id="amount"
          label="Amount"
          variant="outlined"
          fullWidth
          type="number"
          sx={{
            my: 2,
          }}
          onChange={handleChange}
          onKeyDown={handleKeyPressAmount}
          InputProps={{
            inputProps: {
              min: 0,
            },
            startAdornment: "$",
          }}
        />

        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          disabled={
            !payee ||
            !sourceAccount ||
            !amount ||
            amount <= 0 ||
            transactionError ||
            accountError ||
            sourceAccount.toString() === payee.toString()
          }
        >
          Pay
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
              p: 5,
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
                  handleSubmit(e)
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    p: 3,
                    gap: "10px",
                  }}
                >
                  <Typography variant="h4">Confirm Transaction?</Typography>
                  {payee && (
                    <Typography variant="h6">Payee: {payee}</Typography>
                  )}
                  {sourceAccount && (
                    <Typography variant="h6">
                      Source Account: {sourceAccount}
                    </Typography>
                  )}
                  <Typography variant="h6">Amount: ${amount}</Typography>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      !payee ||
                      !sourceAccount ||
                      !amount ||
                      amount <= 0 ||
                      !validPayee ||
                      transactionError ||
                      accountError ||
                      sourceAccount.toString() === payee.toString()
                    }
                  >
                    Confirm
                  </Button>
                  {transactionError && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormHelperText error>Insufficient Funds</FormHelperText>
                    </Box>
                  )}
                  {accountError && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormHelperText error>
                        Payee Account Not Found
                      </FormHelperText>
                    </Box>
                  )}
                </Box>
              </Box>
            </Container>
          </Paper>
        </Modal>
      </Box>
    </Container>
  );
};
export default OneTimePayment;
