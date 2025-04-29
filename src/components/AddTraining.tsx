import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Customer } from "../types";
import { getCustomers } from "../api/customerapi";

type Props = {
  onSave: (training: {
    date: string;
    activity: string;
    duration: number;
    customer: string;
  }) => Promise<void>;
};

export default function AddTraining({ onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [customerLink, setCustomerLink] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

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

  const handleSave = async () => {
    if (!date || !activity || !duration || !customerLink) return;

    await onSave({
      date: date.toISOString(),
      activity,
      duration: Number(duration),
      customer: customerLink,
    });

    setOpen(false);
    setActivity("");
    setDuration("");
    setDate(dayjs());
    setCustomerLink("");
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Lisää harjoitus
      </Button>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Uusi harjoitus</DialogTitle>
          <DialogContent>
            <DateTimePicker
              label="Päivämäärä ja aika"
              value={date}
              onChange={(value) => setDate(value)}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
            <TextField
              label="Harjoitus"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Kesto (min)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="customer-label">Asiakas</InputLabel>
              <Select
                labelId="customer-label"
                value={customerLink}
                onChange={(e) => setCustomerLink(e.target.value)}
                label="Asiakas"
              >
                {customers.map((customer) => (
                  <MenuItem
                    key={customer._links?.self.href}
                    value={customer._links?.self.href}
                  >
                    {customer.firstname} {customer.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Peruuta</Button>
            <Button variant="contained" onClick={handleSave}>
              Tallenna
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </>
  );
}
