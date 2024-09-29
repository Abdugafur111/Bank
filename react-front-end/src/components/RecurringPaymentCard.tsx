import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  MenuItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RecurringPaymentsInterface from "../interfaces/recurring_payments_interface";
import { useCookies } from "react-cookie";
import axios from "axios";
import { AccountCardProps } from "./AccountCard";

const RecurringPaymentCard = () => {
  const [recurringPayments, setRecurringPayments] = useState<
    RecurringPaymentsInterface[]
  >([]);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [recurringPaymentToDelete, setRecurringPaymentToDelete] =
    useState<RecurringPaymentsInterface | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [recurringPaymentToEdit, setRecurringPaymentToEdit] =
    useState<RecurringPaymentsInterface | null>(null);

  const [accounts, setAccounts] = useState<AccountCardProps[]>([]);

  const [sourceAccount, setSourceAccount] = useState<string | null>(null);
  const [payeeAccount, setPayeeAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  const [frequency, setFrequency] = useState<string | null>(null);

  const [confirmed, setConfirmed] = useState<boolean>(false);

  const [transactionError, setTransactionError] = useState<boolean>(false);

  const [personId, setPersonId] = useCookies(["personId"]);
  const [token, setToken] = useCookies(["token"]);
  const auth_token = `Bearer ${token["token"]}`;

  const min_date = new Date();
  // min_date.setFullYear(min_date.getFullYear() - 150);
  const minDate = `${min_date.getFullYear()}-${String(
    min_date.getMonth() + 1
  ).padStart(2, "0")}-${String(min_date.getDate()).padStart(2, "0")}`;

  const [validDate, setValidDate] = useState<boolean>(true);
  const validateDate = (input_date: Date) => {
    let input_date_start = Date.UTC(
      input_date.getFullYear(),
      input_date.getMonth(),
      input_date.getDate()
    );
    let min_date_start = Date.UTC(
      min_date.getFullYear(),
      min_date.getMonth(),
      min_date.getDate()
    );
    return input_date_start >= min_date_start;
  };
  const [startDate, setStartDate] = useState<string | null>(
    minDate as unknown as string
  );
  const handleClose = () => {
    setOpen(false);
    setConfirmed(false);
    setValidPayee(true);
    setValidDate(true);
    setSourceAccount("");
    setPayeeAccount("");
    setAmount(null);
    setStartDate(minDate as unknown as string);
    setFrequency("");
    setTransactionError(false);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const [validPayee, setValidPayee] = useState<boolean>(true);

  const isValidPayee = (num: string) => {
    if (num.length !== 9) {
      setValidPayee(false);
      return false;
    }
    return true;
  };

  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRecurrenceDelete(recurringPaymentToDelete!.id);
    setRecurringPaymentToDelete(null);
    setDeleteOpen(false);
  };

  const handleEditOpen = (id: number) => {
    const recurrence = recurringPayments.filter(
      (recurrence) => recurrence.id === id
    )[0];
    setRecurringPaymentToEdit(recurrence);
    console.log(recurrence);
    setSourceAccount(recurrence.sourceAccountNumber);
    setPayeeAccount(recurrence.payeeAccountNumber);
    setAmount(recurrence.amount);
    setStartDate(recurrence.startDate);
    setFrequency(recurrence.frequency);
    console.log(recurrence.frequency);
    console.log(frequency);
    setEditOpen(true);
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

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isError = false;
    const recurrence: RecurringPaymentsInterface = {
      id: recurringPaymentToEdit!.id,
      sourceAccountNumber: sourceAccount,
      payeeAccountNumber: payeeAccount,
      amount: Number(amount),
      startDate: startDate,
      frequency: frequency,
    };

    const payload = {
      srcAccount: sourceAccount,
      destAccount: payeeAccount,
      paymentFrequency: frequency,
      amount: Number(amount),
      startDate: startDate,
    };

    try {
      const url = `http://localhost:8080/accounts/editAutoPayment/${
        recurringPaymentToEdit!.id
      }`;
      await axios.post(url, payload, {
        headers: { Authorization: auth_token },
      });
      setRecurringPayments([
        ...recurringPayments.filter(
          (recurrence) => recurrence.id !== recurringPaymentToEdit!.id
        ),
        recurrence,
      ]);
    } catch (error: any) {
      isError = true;
      setTransactionError(true);
    }
    !isError && handleEditClose();
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setTransactionError(false);
    setSourceAccount(null);
    setPayeeAccount(null);
    setAmount(null);
    setStartDate(null);
    setFrequency(null);
    setValidDate(true);
    setValidPayee(true);
    setConfirmed(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isError = false;
    const recurrence = {
      srcAccount: sourceAccount,
      destAccount: payeeAccount,
      paymentFrequency: frequency,
      amount: Number(amount),
      startDate: startDate,
    };
    try {
      const url = `http://localhost:8080/accounts/newAutoPayment`;
      const response = await axios.post(url, recurrence, {
        headers: { Authorization: auth_token },
      });
      const new_recurrence: RecurringPaymentsInterface = {
        id: response.data.billPaymentId,
        sourceAccountNumber: sourceAccount,
        payeeAccountNumber: payeeAccount,
        amount: Number(amount),
        startDate: startDate,
        frequency: frequency,
      };
      setRecurringPayments([...recurringPayments, new_recurrence]);
    } catch (error) {
      isError = true;
      setTransactionError(true);
    }
    !isError && handleClose();
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

  const handleRecurrenceDelete = (id: number) => {
    const url = `http://localhost:8080/accounts/cancelAutoPayment/${id}`;
    console.log(url);
    try {
      axios
        .post(url, {}, { headers: { Authorization: auth_token } })
        .then((response: any) => {
          console.log(response);
        });
      setRecurringPayments(
        recurringPayments.filter((recurrence) => recurrence.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOpen = (id: number) => {
    const recurrence = recurringPayments.filter(
      (recurrence) => recurrence.id === id
    )[0];
    setRecurringPaymentToDelete(recurrence);
    setDeleteOpen(true);
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

  useEffect(() => {
    const url = `http://localhost:8080/accounts/allActivePaymentsByPerson/${personId["personId"]}`;
    try {
      axios
        .get(url, { headers: { Authorization: auth_token } })
        .then((response: any) => {
          response.data.map((recurring_payment: any) => {
            const newRecurringPayment: RecurringPaymentsInterface = {
              id: recurring_payment.billPaymentId,
              sourceAccountNumber: recurring_payment.srcAccount,
              payeeAccountNumber: recurring_payment.destAccount,
              amount: recurring_payment.amount,
              startDate: recurring_payment.startDate,
              frequency: recurring_payment.paymentFrequency,
            };
            setRecurringPayments((recurringPayments) => [
              ...recurringPayments,
              newRecurringPayment,
            ]);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const frequencies: string[] | null = [
    "Weekly",
    "Bi-weekly",
    "Monthly",
    "Yearly",
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "2px solid purple",
          borderRadius: "10px",
          mt: 2,
          mb: 2,
          p: 2,
        }}
      >
        <Typography variant="h3" component="h2">
          Recurring Payments
        </Typography>
        <Divider
          sx={{
            bgcolor: "primary.main",
          }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right">Source Account</TableCell>
                <TableCell align="right">Payee Account</TableCell>
                <TableCell align="right">Payment Amount</TableCell>
                <TableCell align="right">Payment Start Date</TableCell>
                <TableCell align="right">Payment Frequency</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recurringPayments.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="right">
                    {row.sourceAccountNumber}
                  </TableCell>
                  <TableCell align="right">{row.payeeAccountNumber}</TableCell>
                  <TableCell align="right">
                    {"$" + row.amount?.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {row.startDate
                      ? new Date(row.startDate).toISOString().split("T")[0]
                      : "N/A"}
                  </TableCell>
                  <TableCell align="right">{row.frequency}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => handleEditOpen(row.id)}
                    >
                      <Typography variant="button">Edit</Typography>
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteOpen(row.id)}
                    >
                      <Typography variant="button">Delete</Typography>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button variant="contained" size="large" onClick={() => setOpen(true)}>
          Add Recurring Payment?
        </Button>
      </Box>
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
                  gap: 4,
                }}
              >
                <Typography variant="h5">
                  Create New Recurring Payment
                </Typography>
                <TextField
                  select
                  label="Select Source Account"
                  onChange={(e) => setSourceAccount(e.target.value)}
                  value={sourceAccount}
                  id="source"
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
                  type="number"
                  defaultValue={payeeAccount}
                  onChange={(e) => {
                    const isValid = isValidPayee(e.target.value);
                    setValidPayee(isValid);
                    isValid && setPayeeAccount(e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyPress(e)}
                  error={!validPayee}
                  label="Payee Account Number"
                  id="payee"
                ></TextField>

                <TextField
                  id="amount"
                  label="Amount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  defaultValue={amount?.toFixed(2)}
                  onChange={handleChange}
                  onKeyDown={handleKeyPressAmount}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      step: 0.01,
                    },
                    startAdornment: "$",
                  }}
                />
                <FormControl>
                  <TextField
                    type="date"
                    inputProps={{ min: minDate }}
                    error={!validDate}
                    defaultValue={minDate}
                    helperText={!validDate ? "Invalid Date" : ""}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value + 'T00:00:00-08:00');
                      const isValid = validateDate(selectedDate);
                      setValidDate(isValid);
                      isValid &&
                        setStartDate(selectedDate.toISOString().split("T")[0]);
                    }}
                  />
                  <FormHelperText>Start Date</FormHelperText>
                </FormControl>

                <TextField
                  select
                  label="Select Payment Frequency"
                  onChange={(e) => setFrequency(e.target.value)}
                  value={frequency}
                  id="frequency"
                >
                  {frequencies.map((single_frequency) => (
                    <MenuItem value={single_frequency} key={single_frequency}>
                      {single_frequency}
                    </MenuItem>
                  ))}
                </TextField>

                {sourceAccount &&
                payeeAccount &&
                amount &&
                startDate &&
                frequency &&
                validDate &&
                validPayee &&
                sourceAccount.toString() !== payeeAccount.toString() ? (
                  <Button
                    variant={confirmed ? "outlined" : "contained"}
                    onClick={() => setConfirmed(true)}
                    disabled={
                      !sourceAccount ||
                      !payeeAccount ||
                      !amount ||
                      !startDate ||
                      !frequency ||
                      !validDate ||
                      !validPayee ||
                      sourceAccount.toString() === payeeAccount.toString()
                    }
                  >
                    Confirm?
                  </Button>
                ) : null}

                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    !sourceAccount ||
                    !payeeAccount ||
                    !amount ||
                    !startDate ||
                    !frequency ||
                    !confirmed ||
                    !validDate ||
                    !validPayee ||
                    sourceAccount.toString() === payeeAccount.toString()
                  }
                >
                  Submit
                </Button>
                {transactionError && (
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
      <Modal open={deleteOpen} onClose={handleDeleteClose}>
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
                handleDeleteSubmit(e)
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 3,
                  gap: 4,
                }}
              >
                <Typography variant="h4">Confirm Delete?</Typography>

                <Typography>
                  Source Account:{" "}
                  {recurringPaymentToDelete?.sourceAccountNumber}
                </Typography>
                <Divider sx={{ bgcolor: "primary.main" }} />
                <Typography>
                  Payee Account: {recurringPaymentToDelete?.payeeAccountNumber}
                </Typography>
                <Divider sx={{ bgcolor: "primary.main" }} />
                <Typography>
                  Amount: ${recurringPaymentToDelete?.amount?.toFixed(2)}
                </Typography>
                <Divider sx={{ bgcolor: "primary.main" }} />
                <Typography>
                  Start Date: {recurringPaymentToDelete?.startDate}
                </Typography>
                <Divider sx={{ bgcolor: "primary.main" }} />
                <Typography>
                  Frequency: {recurringPaymentToDelete?.frequency}
                </Typography>
                <Divider sx={{ bgcolor: "primary.main" }} />

                <Button variant="contained" type="submit">
                  Confirm
                </Button>
              </Box>
            </Box>
          </Container>
        </Paper>
      </Modal>
      <Modal open={editOpen} onClose={handleEditClose}>
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
                handleEditSubmit(e)
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 3,
                  gap: 4,
                }}
              >
                <Typography variant="h4">Edit Recurrence</Typography>

                <TextField
                  select
                  label="Select Source Account"
                  onChange={(e) => setSourceAccount(e.target.value)}
                  value={sourceAccount}
                  defaultValue={sourceAccount}
                  id="source"
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
                  type="number"
                  error={!validPayee}
                  onChange={(e) => {
                    const isValid = isValidPayee(e.target.value);
                    setValidPayee(isValid);
                    isValid && setPayeeAccount(e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyPress(e)}
                  defaultValue={payeeAccount}
                  label="Payee Account Number"
                  id="payee"
                ></TextField>

                <TextField
                  id="amount"
                  label="Amount"
                  variant="outlined"
                  defaultValue={amount?.toFixed(2)}
                  fullWidth
                  type="number"
                  onChange={handleChange}
                  onKeyDown={handleKeyPressAmount}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      step: 0.01,
                    },
                    startAdornment: "$",
                  }}
                />
                <FormControl>
                  <TextField
                    type="date"
                    defaultValue={recurringPaymentToEdit?.startDate}
                    inputProps={{ min: minDate }}
                    error={!validDate}
                    helperText={!validDate ? "Invalid Date" : ""}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value + 'T00:00:00-08:00');
                      const isValid = validateDate(selectedDate);
                      setValidDate(isValid);
                      isValid &&
                        setStartDate(selectedDate.toISOString().split("T")[0]);
                    }}
                  />
                  <FormHelperText>Start Date</FormHelperText>
                </FormControl>

                <TextField
                  select
                  label="Select Payment Frequency"
                  defaultValue={recurringPaymentToEdit?.frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  value={frequency}
                  id="frequency"
                >
                  {frequencies.map((single_frequency) => (
                    <MenuItem value={single_frequency} key={single_frequency}>
                      {single_frequency}
                    </MenuItem>
                  ))}
                </TextField>

                {sourceAccount &&
                payeeAccount &&
                amount &&
                startDate &&
                frequency &&
                validDate &&
                validPayee &&
                sourceAccount.toString() !== payeeAccount.toString() ? (
                  <Button
                    variant={confirmed ? "outlined" : "contained"}
                    onClick={() => setConfirmed(true)}
                    disabled={
                      !sourceAccount ||
                      !payeeAccount ||
                      !amount ||
                      !startDate ||
                      !frequency ||
                      !validDate ||
                      !validPayee ||
                      sourceAccount.toString() === payeeAccount.toString()
                    }
                  >
                    Confirm?
                  </Button>
                ) : null}

                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    !sourceAccount ||
                    !payeeAccount ||
                    !amount ||
                    !startDate ||
                    !frequency ||
                    !validDate ||
                    !validPayee ||
                    !confirmed ||
                    sourceAccount.toString() === payeeAccount.toString()
                  }
                >
                  Submit
                </Button>
                {transactionError && (
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
    </Container>
  );
};
export default RecurringPaymentCard;
