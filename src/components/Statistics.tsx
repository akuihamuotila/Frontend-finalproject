import { useEffect, useState } from "react";
import { getTrainings } from "../api/trainingapi";
import { Training } from "../types";
import { groupBy, sumBy } from "lodash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Statistics() {
  const [data, setData] = useState<{ activity: string; duration: number }[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainings: Training[] = await getTrainings();
        const grouped = groupBy(trainings, "activity");
        const summarized = Object.keys(grouped).map((activity) => ({
          activity,
          duration: sumBy(grouped[activity], "duration"),
        }));
        setData(summarized);
      } catch (error) {
        console.error("Virhe tilastojen haussa:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ width: "90%", height: "500px", margin: "auto" }}>
      <h2>Harjoitustyyppien kestot (minuutteina)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="activity" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="duration" fill="#8884d8" name="Kesto (min)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
