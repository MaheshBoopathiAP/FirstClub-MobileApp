export default {
  sendOtp: async (phoneNumber) => {
    console.log(`Mock: OTP sent to ${phoneNumber}`);
    return new Promise(resolve => setTimeout(resolve, 1000));
  },
  
  verifyOtp: async (phoneNumber, otp) => {
    console.log(`Mock: Verifying OTP ${otp} for ${phoneNumber}`);
    return new Promise(resolve => setTimeout(() => {
      resolve({ success: otp === '123456' }); // Mock valid OTP
    }, 1000));
  },
  
  getSamples: async () => {
    return new Promise(resolve => setTimeout(() => {
      resolve([
        { id: 1, name: 'Sample 1', description: 'Premium skincare trial kit' },
        { id: 2, name: 'Sample 2', description: 'Organic shampoo and conditioner' },
        { id: 3, name: 'Sample 3', description: 'Energy supplement pack' },
      ]);
    }, 500));
  }
};