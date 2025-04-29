import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeMaterial,
} from "ag-grid-community";
import { Training } from "../types";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddTraining from "./AddTraining";
import { getTrainings, addTraining, deleteTraining } from "../api/trainingapi";
import dayjs from "dayjs";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const trainingsData = await getTrainings();
      setTrainings(trainingsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (training: {
    date: string;
    activity: string;
    duration: number;
    customer: string;
  }) => {
    try {
      await addTraining(training);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (url: string) => {
    if (window.confirm("Poistetaanko harjoitus?")) {
      try {
        await deleteTraining(url);
        fetchData();
        setOpen(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const columnDefs: ColDef<Training>[] = [
    {
      field: "date",
      headerName: "Päivämäärä",
      filter: true,
      sortable: true,
      valueFormatter: (params) =>
        dayjs(params.value).format("DD.MM.YYYY HH:mm"),
      width: 200,
    },
    {
      field: "activity",
      headerName: "Harjoitus",
      filter: true,
      sortable: true,
      width: 160,
    },
    {
      field: "duration",
      headerName: "Kesto (min)",
      filter: true,
      sortable: true,
      width: 130,
    },
    {
      headerName: "Asiakas",
      valueGetter: (params) =>
        params.data?.customer
          ? `${params.data.customer.firstname} ${params.data.customer.lastname}`
          : "Tuntematon",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Poista",
      width: 140,
      cellRenderer: (params: { data: Training }) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => {
            const href = `https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${params.data.id}`;
            handleDelete(href);
          }}
        >
          Poista
        </Button>
      ),
    },
  ];

  return (
    <>
      <AddTraining onSave={handleAdd} />
      <div style={{ width: "100%", height: 600 }}>
        <AgGridReact
          rowData={trainings}
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
        message="Harjoitus poistettu"
      />
    </>
  );
}
