import type { ScheduleType } from "@/types/type";

export const MockData: ScheduleType[] = [
  {
    id: "98HJDADH",
    date: "2025-08-15",
    time: "08:30 AM",
    locations: {
      departure_point: "Matina Crossing, Davao City",
      destination: "Bangkal, Davao City",
    },
    goods: {
      item: "Sand",
      weight_in_kgs: "200",
    },
    truck_number: "LHE 1234",
  },
  {
    id: "75ASIUFSD",
    date: "2025-08-20",
    time: "2:00 PM" ,
    locations: {
      departure_point: "Matina Aplaya, Davao City",
      destination: "Bangkal, Davao City",
    },
    goods: {
      item: "Metal",
      weight_in_kgs: "400",
    },
    truck_number: "YGV 4128",
  },
  {
    id: "12HBDAJI",
    date: "2025-08-25",
    time: "09:15 AM",
    locations: {
      departure_point: "Matina Aplaya, Davao City",
      destination: "Bangkal, Davao City",
    },
    goods: {
      item: "Gravel",
      weight_in_kgs: "100",
    },
    truck_number: "LHE 1234",
  },
];
