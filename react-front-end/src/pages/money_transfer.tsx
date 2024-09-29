import React from "react";
import Heading from "../components/Heading";
import TransferCard from "../components/TransferCard";
import { Container, Grid } from "@mui/material";

const Money_Transfer = () => {
  return (
    <>
      <Heading headingName="Funds" />
      <Container>
        <Grid
          container
          spacing={2}
          sx={{
            mt: 4,
            mb: 4,
          }}
        >
          <Grid item xs={12}>
            <TransferCard transferName="Withdraw" cardType="withdraw" />
          </Grid>
          <Grid item xs={12}>
            <TransferCard transferName="Deposit" cardType="deposit" />
          </Grid>
          <Grid item xs={12}>
            <TransferCard transferName="Transfer" cardType="transfer" />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Money_Transfer;
