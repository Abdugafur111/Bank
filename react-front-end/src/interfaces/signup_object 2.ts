interface signup_object {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    phone_number: string;
    ssn?: string;
    dob: Date;
    account_type: string;
}
export default signup_object;