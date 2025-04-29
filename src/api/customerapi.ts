import { Customer } from "../types";

const API_URL =
  "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers";
const RESET_URL =
  "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset";

const fetchJson = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Virhe: ${response.status} ${response.statusText}`);
  }
  if (response.status !== 204) {
    return response.json();
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  const data = await fetchJson(API_URL);
  return data._embedded.customers;
};

export const addCustomer = async (customer: Customer): Promise<void> => {
  await fetchJson(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
};

export const updateCustomer = async (
  url: string,
  customer: Customer
): Promise<void> => {
  await fetchJson(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
};

export const deleteCustomer = async (url: string): Promise<void> => {
  await fetchJson(url, { method: "DELETE" });
};

export const resetDatabase = async (): Promise<void> => {
  await fetchJson(RESET_URL, { method: "POST" });
};
