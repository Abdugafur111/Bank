import {Card, CardContent, Typography, CardHeader, Avatar} from "@mui/material";

export interface AccountCardProps {
    account_number: number;
    balance: number;
    interest_rate: number;
    account_type: string;
}

export interface AccountCardPropsStatus{
    account_number: number;
    balance: number;
    apy: number;
    account_type: string;
    status: string;
}


const AccountCard = (props: AccountCardProps) => {
    return (
        <Card variant="outlined" sx={{
            borderRadius: "10px",
            border: "2px solid purple"}}>
            <CardContent>
                <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                        {props.account_type === "Checking" ? "C" : "S"}
                    </Avatar>
                }
                title="Account Number" subheader={props.account_number}/>
                
                <Typography variant="h5" component="div" gutterBottom>
                    Balance: ${props.balance.toFixed(2)} USD
                </Typography>
                <Typography variant="h6" component="div">
                    Interest Rate: {props.interest_rate}% APR
                </Typography>
            </CardContent>
        </Card>
    );
}
export default AccountCard;