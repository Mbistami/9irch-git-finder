import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

import { LinearProgress } from "@mui/material";
import { loadTotalYearDate, loadTotalDaysRange } from "../utils";

// const data = [
//   {
//     name: "Jan",
//     value: 45,
//   },
//   {
//     name: "Feb",
//     value: 65,
//   },
//   { name: "Mar", value: 60 },
//   { name: "Apr", value: 43 },
//   { name: "May", value: 55 },
// ];

const PerformanceChart = ({
  user,
  startDate,
  isFullYear,
  endDate,
  setTotalRange,
  setShowYearlyData,
}: {
  user: any;
  setStartDate?: any;
  handleChange?: any;
  startDate: Date;
  endDate: Date;
  isFullYear?: boolean;
  setTotalRange?: any;
  setShowYearlyData?: any;
}) => {
  const Authorization = user?.Authorization;
  const [data, setData] = React.useState<any>([]);

  React.useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000;

    if (isFullYear && user?.login && data.length === 0)
      loadTotalYearDate(user, setData, data, setShowYearlyData);
    else if (!isFullYear)
      loadTotalDaysRange(user, setData, data, startDate, endDate);
    if (
      Boolean(startDate?.toString()?.search("T")) &&
      Boolean(user?.login) &&
      Boolean(
        Math.round(
          Math.abs((startDate.getTime() - endDate.getTime()) / oneDay)
        ) <= 80
      )
    )
      fetch(
        `https://time-logger.1337.ma/api/log_times?start_date=${
          startDate?.toISOString()?.toString()?.split("T")[0]
        }&end_date=${
          endDate?.toISOString()?.toString()?.split("T")[0]
        }&username=${user?.login}`,
        {
          method: "GET",
          headers: {
            Authorization: `${process.env.API_KEY}`,
          },
        }
      ).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setTotalRange(data["hydra:member"][0]?.totalHours || 0);
            console.log(data["hydra:member"][0]?.totalHours);
            setShowYearlyData(true);
          });
        }
      });
    else setTotalRange(null);
  }, [startDate, user, endDate]);
  return (
    <ResponsiveContainer width="95%" height={300} className="pr-3">
      <LineChart data={data}>
        <XAxis
          dataKey={"name"}
          stroke="white"
          name="Time"
          style={{
            marginTop: "10px",
            fontSize: "14px",
            fontFamily: "Nunito ",
          }}
        />
        <YAxis />

        <CartesianGrid stroke="white" horizontal={false} strokeWidth={1} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#0278fe" name="Hours" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
