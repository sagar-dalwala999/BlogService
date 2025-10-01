import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Validations = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^91\d{10}$/,
  panCard: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  gstNumber: /^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-8]{1}|[9]{1}[7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[Zz1-9A-Ja-j-J]{1}[0-9a-zA-Z]{1})+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d#@$!%*?&_]{8,15}$/,
  code: /^.{1,20}$/,
  vehicleNo: /^[A-Za-z]{2}[0-9]{1,2}[A-Za-z]{1,3}[0-9]{1,4}$/,
  address: /^.{1,255}$/,
  name: /^[A-Za-z\s'-]{1,50}$/,
  amount: /^\d{1,10}(\.\d{1,4})?$/,
  invoiceNo: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
  details: /^.{1,150}$/,
  phoneWithoutPrefix: /^[6-9]\d{9}$/,
  longText: /^$|^.{1,500}$/, 
  license : /^[A-Za-z]{2}-\d{2}-\d{4}-\d{7}$/,
}

export const Operaters = [
  {
    label: "Addition(+)",
    value: '+',
  },
  {
    label: "Subtraction(-)",
    value: '-',
  }
]
