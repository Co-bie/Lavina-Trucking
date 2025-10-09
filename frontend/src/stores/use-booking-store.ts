import { create } from "zustand";

type BookingInfo = {
  name: string;
  contact: string;
  trips: number;
  departure: string;
  destination: string;
  date: string;
  truck: string;
  receipt?: string | null;
};

type BookingStore = {
  booking: BookingInfo | null;
  setBooking: (data: BookingInfo) => void;
  clearBooking: () => void;
};

export const useBookingStore = create<BookingStore>((set) => ({
  booking: null,
  setBooking: (data) => set({ booking: data }),
  clearBooking: () => set({ booking: null }),
}));
