import { create } from 'zustand';

const useStore = create((set, get) => ({
  phoneNumber: '',
  otp: '',
  otpTimestamp: null,
  currentStep: 0,
  steps: [
    { id: 0, title: 'Login', completed: false },
    { id: 1, title: 'Location', completed: false },
    { id: 2, title: 'Address', completed: false },
    { id: 3, title: 'Samples', completed: false },
  ],
  location: null,
  selectedSamples: [],
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setOtp: (otp) => set({ otp, otpTimestamp: Date.now() }),
  clearOtp: () => set({ otp: '', otpTimestamp: null }),
  isOtpValid: () => {
    const { otp, otpTimestamp } = get();
    if (!otp || !otpTimestamp) return false;
    const currentTime = Date.now();
    const oneHour = 3600 * 1000;
    return currentTime - otpTimestamp <= oneHour;
  },
  setLocation: (location) => set({ location }),
  selectSample: (sample) => set((state) => ({
    selectedSamples: [...state.selectedSamples, sample],
  })),
  unselectSample: (sampleId) => set((state) => ({
    selectedSamples: state.selectedSamples.filter((s) => s.id !== sampleId),
  })),
  clearSamples: () => set({ selectedSamples: [] }),
  completeStep: (stepId) => set((state) => ({
    steps: state.steps.map((step) =>
      step.id === stepId ? { ...step, completed: true } : step
    ),
    currentStep: stepId + 1,
  })),
}));

export default useStore;