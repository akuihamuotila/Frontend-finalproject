import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeMaterial,
} from "ag-grid-community";
import { Customer } from "../types";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  resetDatabase,
} from "../api/customerapi";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (customer: Customer) => {
    try {
      await addCustomer(customer);
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (url: string, customer: Customer) => {
    try {
      await updateCustomer(url, customer);
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (url: string) => {
    if (window.confirm("Poistetaanko asiakas?")) {
      try {
        await deleteCustomer(url);
        fetchCustomers();
        setOpen(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleReset = async () => {
    if (window.confirm("Haluatko varmasti resetoida tietokannan?")) {
      try {
        await resetDatabase();
        await fetchCustomers();
        setOpen(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "firstname",
      "lastname",
      "streetaddress",
      "postcode",
      "city",
      "email",
      "phone",
    ];

    const rows = customers.map((c) =>
      headers.map((header) => c[header as keyof Customer])
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columnDefs: ColDef<Customer>[] = [
    {
      field: "firstname",
      headerName: "Etunimi",
      filter: true,
      sortable: true,
      width: 120,
    },
    {
      field: "lastname",
      headerName: "Sukunimi",
      filter: true,
      sortable: true,
      width: 130,
    },
    {
      field: "streetaddress",
      headerName: "Katuosoite",
      filter: true,
      sortable: true,
      width: 160,
    },
    {
      field: "postcode",
      headerName: "Postinro",
      filter: true,
      sortable: true,
      width: 120,
    },
    {
      field: "city",
      headerName: "Kaupunki",
      filter: true,
      sortable: true,
      width: 125,
    },
    {
      field: "email",
      headerName: "Sähköposti",
      filter: true,
      sortable: true,
      width: 170,
    },
    {
      field: "phone",
      headerName: "Puhelin",
      filter: true,
      sortable: true,
      width: 140,
    },
    {
      headerName: "Muokkaa",
      width: 140,
      cellRenderer: (params: { data: Customer }) => (
        <EditCustomer data={params.data} onSave={handleUpdate} />
      ),
    },
    {
      headerName: "Poista",
      width: 140,
      cellRenderer: (params: { data: Customer }) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() =>
            params.data._links?.customer?.href &&
            handleDelete(params.data._links.customer.href)
          }
        >
          Poista
        </Button>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <AddCustomer onSave={handleAdd} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportCSV}
          sx={{ mb: 2 }}
        >
          Export CSV
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleReset}
          sx={{ mb: 2 }}
        >
          Resetoi tietokanta
        </Button>
      </div>
      <div style={{ width: "100%", height: 600 }}>
        <AgGridReact
          rowData={customers}
          columnDefs={columnDefs}
          pagination
          paginationAutoPageSize
          theme={themeMaterial}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Toiminto suoritettu"
      />
    </>
  );
}
