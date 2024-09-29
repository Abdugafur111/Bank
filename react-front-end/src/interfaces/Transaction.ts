
interface Transaction {
    transaction_id: number;
    transaction_type: string;
    transaction_date: string;
    transaction_amount: number;
    source_account_id: number;
    destination_account_id: number;
}

export default Transaction;