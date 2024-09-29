import React from "react";
import Heading from "../components/Heading";
import OneTimePayment from "../components/OneTimePayment";
import RecurringPaymentCard from "../components/RecurringPaymentCard";

const RecurringPayments = () => {
  return (
    <div>
      <Heading headingName="Payments" />
      <OneTimePayment />
      <RecurringPaymentCard />
    </div>
  );
};

export default RecurringPayments;
