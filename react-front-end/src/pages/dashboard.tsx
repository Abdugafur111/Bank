import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Container,
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
  TextField,
  MenuItem,
} from "@mui/material";
import AccountCard from "../components/AccountCard";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AccountCardProps } from "../components/AccountCard";
import { useState, useEffect } from "react";
import Transaction from "../interfaces/Transaction";

import Heading from "../components/Heading";
import React from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Dashboard = () => {
  const [accounts, setAccounts] = useState<AccountCardProps[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [netValue, setNetValue] = useState<number>(0.0);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openRemove, setOpenRemove] = useState<boolean>(false);
  const [removeAccounts, setRemoveAccounts] = useState<number[]>([]);
  const [newAccountType, setNewAccountType] = useState<string>("Checking");
  const [personId, setPersonId] = useCookies(["personId"]);
  const [token, setToken] = useCookies(["token"]);
  const [filteredAccounts, setFilteredAccounts] = useState<string>("All");

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
              interest_rate: account.apy,
            };
            account.accountStatus === "Active" &&
              setAccounts((accounts) => [...accounts, newAccount]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const url = `http://localhost:8080/transactions/user/${personId["personId"]}`;
    try {
      axios
        .get(url, { headers: { Authorization: `Bearer ${token["token"]}` } })
        .then((response: any) => {
          response.data.map((transaction: any) => {
            const newTransaction: Transaction = {
              transaction_id: transaction.transactionId,
              transaction_type: transaction.type,
              transaction_amount: transaction.amount,
              transaction_date: transaction.date,
              source_account_id: transaction.sourceAccountNumber
                ? transaction.sourceAccountNumber
                : null,
              destination_account_id: transaction.destinationAccountNumber
                ? transaction.destinationAccountNumber
                : null,
            };
            setTransactions((transactions) => [
              ...transactions,
              newTransaction,
            ]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const newNetValue = accounts.reduce(
      (total, account) => total + account.balance,
      0
    );
    setNetValue(newNetValue);
  }, [accounts]);

  const handleOpenAdd = () => {
    setOpenAdd(true), handleCloseRemove();
  };
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenRemove = () => {
    setOpenRemove(true), handleCloseAdd();
  };

  const handleCloseRemove = () => {
    setOpenRemove(false), setRemoveAccounts([]);
  };

  const handleAccountAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //add account to backend here
    try {
      const payload = {
        userId: personId["personId"],
        accountType: newAccountType,
      };
      axios
        .post(`http://localhost:8080/accounts/add`, payload, {
          headers: { Authorization: `Bearer ${token["token"]}` },
        })
        .then((response: any) => {
          const account: AccountCardProps = {
            account_number: response.data.accountId,
            account_type: response.data.accountType,
            balance: response.data.balance,
            interest_rate: 0,
          };
          setAccounts((accounts) => [...accounts, account]);
        });
    } catch (error) {
      console.log(error);
    }
    handleCloseAdd();
    setNewAccountType("Checking");
  };
  const handleAccountRemoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    {
      /* Call database endpoint here to remove account */
    }
    const updatedAccounts = accounts.filter(
      (account) => !removeAccounts.includes(account.account_number)
    );
    setAccounts(updatedAccounts);
    try {
      removeAccounts.forEach((account) => {
        axios
          .post(
            `http://localhost:8080/accounts/${account}/deactivate`,
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
    setRemoveAccounts([]);
    handleCloseRemove();
  };

  return (
    <>
      <Heading headingName="Accounts" />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            maxHeight: "100vh",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              mr: "auto",
            }}
          >
            Net Value: ${netValue.toFixed(2)} USD
          </Typography>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {accounts.map((account) => (
              <Grid item xs={12} md={6} key={account.account_number}>
                <AccountCard {...account} />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mr: "auto",
              mb: 2,
              mt: 3,
              pb: 3,
            }}
          >
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={handleOpenAdd}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
            <Button
              color="primary"
              size="large"
              variant="contained"
              onClick={handleOpenRemove}
              startIcon={<RemoveIcon />}
            >
              Remove
            </Button>

            <Modal
              open={openRemove}
              onClose={handleCloseRemove}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
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
                    component="form"
                    onSubmit={(e: React.FormEvent) =>
                      handleAccountRemoveSubmit(e)
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h2" textAlign={"center"}>
                        Remove Account?
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <FormGroup>
                          {accounts.map((account) => (
                            <React.Fragment key={account.account_number}>
                              <FormControlLabel
                                sx={{ mt: 3 }}
                                control={
                                  <Checkbox
                                    disabled={account.balance !== 0}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (e.target.checked) {
                                        // Add the account number if checked
                                        setRemoveAccounts([
                                          ...removeAccounts,
                                          account.account_number,
                                        ]);
                                      } else {
                                        // Remove the account number if unchecked
                                        setRemoveAccounts(
                                          removeAccounts.filter(
                                            (number) =>
                                              number !== account.account_number
                                          )
                                        );
                                      }
                                    }}
                                  />
                                }
                                label={"Account " + account.account_number}
                              />
                              {account.balance !== 0 && (
                                <FormHelperText error>
                                  Balance must be zero to remove account.
                                </FormHelperText>
                              )}
                              <Divider sx={{ bgcolor: "primary.main" }} />
                            </React.Fragment>
                          ))}
                        </FormGroup>
                      </Box>

                      <Button
                        variant="contained"
                        type="submit"
                        disabled={removeAccounts.length === 0}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Container>
              </Paper>
            </Modal>

            <Modal
              open={openAdd}
              onClose={handleCloseAdd}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
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
                  <Box component="form" onSubmit={handleAccountAddSubmit}>
                    <Box
                      sx={{
                        display: "flex",
                        alignContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h2" textAlign={"center"}>
                        Add Account?
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="account-type"
                            name="account-type-row"
                            defaultValue="Checking"
                            onChange={(e) => setNewAccountType(e.target.value)}
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
                          </RadioGroup>
                        </FormControl>
                      </Box>

                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Container>
              </Paper>
            </Modal>
          </Box>
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Typography variant="h3" sx={{ mt: 2 }}>
              Transactions
            </Typography>
            <Divider sx={{ bgcolor: "primary.main" }} />
          </Box>
          <Box minWidth={"100%"}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Filter
            </Typography>
            <TextField
              fullWidth
              select
              defaultValue={"All"}
              onChange={(e) => {
                setFilteredAccounts(e.target.value);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {accounts.map((account) => (
                <MenuItem
                  value={account.account_number}
                  key={account.account_number}
                >
                  {account.account_type} - {account.account_number} - $
                  {account.balance.toFixed(2)}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Grid container sx={{ mb: 2, pb: 10 }}>
            <TableContainer
              component={Paper}
              sx={{
                overflowX: "auto",
                mt: 5,
                border: "2px solid purple",
                borderRadius: "10px",
              }}
            >
              <Table
                sx={{ minWidth: 650 }}
                stickyHeader
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Transaction Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Source Account</TableCell>
                    <TableCell align="right">Destination Account</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((row) =>
                    filteredAccounts !== "All" &&
                    (row.source_account_id?.toString() ===
                      filteredAccounts.toString() ||
                      row.destination_account_id?.toString() ===
                        filteredAccounts.toString()) ? (
                      <>
                        <TableRow
                          key={row.transaction_id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.transaction_id}
                          </TableCell>
                          <TableCell align="right">
                            {row.transaction_type}
                          </TableCell>
                          <TableCell align="right">
                            {"$" + row.transaction_amount.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {row.transaction_date}
                          </TableCell>
                          <TableCell align="right">
                            {row.source_account_id
                              ? row.source_account_id
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            {row.destination_account_id
                              ? row.destination_account_id
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : filteredAccounts === "All" ? (
                      <>
                        <TableRow
                          key={row.transaction_id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.transaction_id}
                          </TableCell>
                          <TableCell align="right">
                            {row.transaction_type}
                          </TableCell>
                          <TableCell align="right">
                            {"$" + row.transaction_amount.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {row.transaction_date}
                          </TableCell>
                          <TableCell align="right">
                            {row.source_account_id
                              ? row.source_account_id
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            {row.destination_account_id
                              ? row.destination_account_id
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <></>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
