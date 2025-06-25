export const validatePhoneNumber = (phone) => {
  const regex = /^[0-9]{10,15}$/;
  return regex.test(phone);
};

export const validateOTP = (otp) => {
  return otp.length === 6 && /^\d+$/.test(otp);
};

export const validateAddress = (address) => {
  return address.length >= 10;
};

export const validateName = (name) => {
  return name.length >= 2;
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};