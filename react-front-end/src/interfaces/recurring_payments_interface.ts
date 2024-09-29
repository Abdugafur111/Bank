interface RecurringPaymentsInterface {
    id: number;
    sourceAccountNumber: string | null;
    payeeAccountNumber: string | null;
    amount: number | null;
    startDate: string | null;
    frequency: string | null;
}
export default RecurringPaymentsInterface