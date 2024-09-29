import {
  Box,
  Button,
  Card,
  Container,
  FormHelperText,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { AccountCardProps } from "../components/AccountCard";

interface transferCardProps {
  transferName: string;
  cardType: string;
}

const TransferCard = (props: transferCardProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [inputError, setInputError] = useState<boolean>(false);
  const [cardnumber, setCardNumber] = useState<number | null>(null);
  const [cardnumberError, setCardNumberError] = useState<boolean>(false);
  const [cvv, setCVV] = useState<number | null>(null);
  const [cvvError, setCVVError] = useState<boolean>(false);
  const [sourceAccount, setSourceAccount] = useState<string | null>(null);
  const [destinationAccount, setDestinationAccount] = useState<string | null>(
    null
  );
  const [accounts, setAccounts] = useState<AccountCardProps[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [transactionError, setTransactionError] = useState<boolean>(false);

  const heading = props.transferName;
  const cardType = props.cardType;

  const [personId, setPersonId] = useCookies(["personId"]);
  const [token, setToken] = useCookies(["token"]);
  const auth_token = `Bearer ${token["token"]}`;
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(event.target.value))) {
      const value = Number(event.target.value);
      if (!Number.isInteger(value)) {
        if (value !== Number(value.toFixed(2))) {
          setAmount(0);
          setInputError(true);
          return;
        }
      }
      setAmount(value);
      setInputError(false);
    } else {
      setAmount(0);
      setInputError(true);
    }
  };

  const handleClose = () => {
    setTransactionError(false);
    setOpen(false);
  };

  const handleCardNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isNaN(Number(event.target.value))) {
      const value = Number(event.target.value);
      if (
        Number.isInteger(value) &&
        (value.toString().length == 16 || value.toString().length == 15)
      ) {
        setCardNumber(value);
        setCardNumberError(false);
      } else {
        setCardNumber(null);
        setCardNumberError(true);
      }
    } else {
      setCardNumber(null);
      setCardNumberError(true);
    }
  };

  const handleCVVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(event.target.value))) {
      const value = Number(event.target.value);
      if (Number.isInteger(value) && value.toString().length == 3) {
        setCVV(value);
        setCVVError(false);
      } else {
        setCVV(null);
        setCVVError(true);
      }
    } else {
      setCVV(null);
      setCVVError(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "e" || e.key === "-" || e.key === "+" || e.key === "E") {
      e.preventDefault();
    }
  };

  const handleCardnCVVKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key === "e" ||
      e.key === "-" ||
      e.key === "+" ||
      e.key === "E" ||
      e.key === "."
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cardType === "deposit") {
      try {
        const payload = {
          userId: personId["personId"],
          accountId: destinationAccount,
          amount: amount,
        };
        axios
          .post(`http://localhost:8080/accounts/deposit`, payload, {
            headers: { Authorization: `Bearer ${token["token"]}` },
          })
          .then((response: any) => {
            console.log(token["token"]);
          });
      } catch (error) {
        console.log(error);
      }
    } else if (cardType === "withdraw") {
      const payload = {
        userId: personId["personId"],
        accountId: sourceAccount,
        amount: amount,
      };
      try {
        await axios.post(`http://localhost:8080/accounts/withdraw`, payload, {
          headers: { Authorization: `Bearer ${token["token"]}` },
        });
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message === "Insufficient funds"
        ) {
          setTransactionError(true);
        } else {
          console.log(error);
        }
        return;
      }
    } else {
      try {
        const payload = {
          sourceAccountId: sourceAccount,
          sourceUserId: personId["personId"],
          destinationAccountId: destinationAccount,
          amount: amount,
        };
        await axios.post(`http://localhost:8080/accounts/transfer`, payload, {
          headers: { Authorization: `Bearer ${token["token"]}` },
        });
      } catch (error: any) {
        if (
          error.response &&
          error.response.data
        ) {
          setTransactionError(true);
        } else {
          console.log(error);
        }
        return;
      }
    }
    !transactionError && setOpen(false);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Paper sx={{ borderRadius: "20px" }}>
          <Card sx={{ border: "2px solid purple", borderRadius: "20px" }}>
            <Container>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <Typography variant="h4">{heading}</Typography>

                <TextField
                  id="amount"
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  sx={{
                    my: 2,
                  }}
                  {...(inputError && {
                    error: true,
                    helperText: "Please enter a valid number",
                  })}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  InputProps={{
                    inputProps: {
                      min: 0,
                    },
                    startAdornment: "$",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    minWidth: "100%",
                  }}
                >
                  {cardType === "deposit" ? (
                    <>
                      <TextField
                        type="number"
                        id="card-number"
                        label="Card Number"
                        onKeyDown={handleCardnCVVKeyPress}
                        onChange={handleCardNumberChange}
                        {...(cardnumberError && {
                          error: true,
                          helperText: "Invalid",
                        })}
                        fullWidth
                      ></TextField>
                      <TextField
                        type="number"
                        id="cvv"
                        label="CVV"
                        onKeyDown={handleCardnCVVKeyPress}
                        onChange={handleCVVChange}
                        {...(cvvError && {
                          error: true,
                          helperText: "Invalid",
                        })}
                        sx={{
                          maxWidth: "30%",
                        }}
                      ></TextField>{" "}
                    </>
                  ) : (
                    <>
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
                            {account.account_number} - {account.account_type} -
                            ${account.balance}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  )}
                </Box>
                {cardType === "withdraw" ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        minWidth: "100%",
                        my: 2,
                      }}
                    >
                      <TextField
                        type="number"
                        id="card-number"
                        label="Card Number"
                        onKeyDown={handleCardnCVVKeyPress}
                        onChange={handleCardNumberChange}
                        {...(cardnumberError && {
                          error: true,
                          helperText: "Invalid",
                        })}
                        fullWidth
                      ></TextField>
                      <TextField
                        type="number"
                        id="cvv"
                        label="CVV"
                        onKeyDown={handleCardnCVVKeyPress}
                        onChange={handleCVVChange}
                        {...(cvvError && {
                          error: true,
                          helperText: "Invalid",
                        })}
                        sx={{
                          maxWidth: "30%",
                        }}
                      ></TextField>{" "}
                    </Box>
                  </>
                ) : (
                  <>
                    <TextField
                      select
                      id="destination"
                      label="Destination Account"
                      fullWidth
                      onChange={(e) => setDestinationAccount(e.target.value)}
                      value={destinationAccount}
                      sx={{ my: 2 }}
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
                  </>
                )}

                <Button
                  fullWidth
                  onClick={() => setOpen(true)}
                  disabled={
                    inputError ||
                    cardnumberError ||
                    cvvError ||
                    !amount ||
                    (cardType === "deposit" && (!cardnumber || !cvv)) ||
                    (cardType === "withdraw" && (!cardnumber || !cvv)) ||
                    (cardType === "transfer" &&
                      (!sourceAccount || !destinationAccount)) ||
                    sourceAccount === destinationAccount
                  }
                  variant="contained"
                >
                  Submit
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
                          <Typography variant="h4">
                            Confirm Transaction?
                          </Typography>
                          {sourceAccount && (
                            <Typography variant="h6">
                              Source Account: {sourceAccount}
                            </Typography>
                          )}
                          {destinationAccount && (
                            <Typography variant="h6">
                              Destination Account: {destinationAccount}
                            </Typography>
                          )}
                          <Typography variant="h6">
                            Amount: ${amount.toFixed(2)}
                          </Typography>

                          <Button variant="contained" type="submit">
                            Confirm
                          </Button>
                          {transactionError && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <FormHelperText error>
                                Insufficient Funds
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
          </Card>
        </Paper>
      </Container>
    </>
  );
};

export default TransferCard;
