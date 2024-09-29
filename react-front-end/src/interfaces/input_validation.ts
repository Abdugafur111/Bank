export const validateState = (state: string) => {
  const re = /^[a-zA-Z\s]+$/;
  return re.test(state);
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const validateName = (name: string) => {
  const re = /^[a-zA-Z]+$/;
  return re.test(name);
};

export const validatePhoneNumber = (phoneNumber: string) => {
  const re = /^\(?([0-9]{3})\)?([0-9]{3})([0-9]{4})$/;
  return re.test(phoneNumber);
};

export const validateZip = (zip: string) => {
  const re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return re.test(zip);
};

export const validateSSN = (ssn: string) => {
  const re = /^\(?([0-9]{3})\)?([0-9]{2})([0-9]{4})$/;
  return re.test(ssn);
};

export const validateCity = (city: string) => {
  const re = /^[a-zA-Z\s]+$/;
  return re.test(city);
};
