import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import UserCardProps from "../interfaces/user_card_props";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Box, Button, Container, Divider, Grid, Icon, IconButton, TextField, Typography } from "@mui/material";
import { LineWeight } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [accounts, setAccounts] = useState<UserCardProps[]>([]);
  const [cookies, setCookie] = useCookies(["token"]);
  const [filteredAccounts, setFilteredAccounts] = useState<UserCardProps[]>([]);
  const [filter, setFilter] = useState<string>("");
  const navigate = useNavigate();

  const handleFilter = () => {
    if (filter === "") {
      setFilteredAccounts(accounts);
    } else {
      const filteredAccounts = accounts.filter((account) => {
        return (
          account.firstName.toLowerCase().includes(filter.toLowerCase()) ||
          account.lastName.toLowerCase().includes(filter.toLowerCase())
        );
      });
      setFilteredAccounts(filteredAccounts);
    }
  }

  useEffect(() => {
    handleFilter();
  }, [accounts, filter]);

  useEffect(() => {
    setAccounts([]);
    const url = "http://localhost:8080/people";
    try {
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((response) => {
          response.data.map((person: any) => {
            const account: UserCardProps = {
              personId: person.personID,
              firstName: person.firstName,
              lastName: person.lastName,
              email: person.email,
              phoneNumber: person.phone,
              address: person.address,
            };
            setAccounts((accounts) => [...accounts, account]);
          }).then(() => {
            setFilteredAccounts(accounts);
          }
          );
        });
    } catch (error) {
      console.log(error);
    }
    
  }, []);
  return (
    <>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="div"
          sx={{
            mt: 2,
          }}
        >
          Manager Dashboard
        </Typography>
        <Divider
          sx={{ bgcolor: "primary.main", mb: 3, borderBottomWidth: 2 }}
        />
        <TextField
          fullWidth
          label="Filter by Name"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          sx={{
            mb: 3,
          }}
        ></TextField>
        <Grid container spacing={2}>
          {filteredAccounts.map((account: UserCardProps) => {
            return (
              <>
                <Grid item xs={12} md={6} lg={4} key={account.personId}>
                  <UserCard {...account} />
                </Grid>
              </>
            );
          })}
        </Grid>
        <Box sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <Button
            variant="contained"
            color="primary"
            aria-label="menu"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ManagerDashboard;
