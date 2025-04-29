import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Customer } from "../types";

type Props = {
  data: Customer;
  onSave: (url: string, customer: Customer) => void;
};

export default function EditCustomer({ data, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (customer._links?.customer?.href) {
      onSave(customer._links.customer.href, customer);
    }
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
        Muokkaa
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Muokkaa asiakasta</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Etunimi"
            name="firstname"
            value={customer.firstname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Sukunimi"
            name="lastname"
            value={customer.lastname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Katuosoite"
            name="streetaddress"
            value={customer.streetaddress}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Postinumero"
            name="postcode"
            value={customer.postcode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Kaupunki"
            name="city"
            value={customer.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Sähköposti"
            name="email"
            value={customer.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Puhelin"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Peruuta</Button>
          <Button variant="contained" onClick={handleSave}>
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
