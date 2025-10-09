import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentState = {
  paymentMethod: string | null;
  receipt: string | null;
  setPaymentMethod: (method: string) => void;
  setReceipt: (image: string | null) => void;
  resetPayment: () => void;
};

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      paymentMethod: null,
      receipt: null,
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setReceipt: (image) => set({ receipt: image }),
      resetPayment: () => set({ paymentMethod: null, receipt: null }),
    }),
    { name: "payment-store" }
  )
);
