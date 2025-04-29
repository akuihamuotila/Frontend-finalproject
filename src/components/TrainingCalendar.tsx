import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Training } from "../types";
import { getTrainings } from "../api/trainingapi";
import dayjs from "dayjs";

export default function TrainingCalendar() {
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const data = await getTrainings();
      setTrainings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const events = trainings.map((training) => ({
    title: `${training.activity} - ${
      training.customer
        ? `${training.customer.firstname} ${training.customer.lastname}`
        : "Tuntematon"
    }`,
    start: dayjs(training.date).toISOString(),
  }));

  return (
    <div style={{ width: "90%", margin: "auto", marginTop: "2rem" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height={650}
      />
    </div>
  );
}
