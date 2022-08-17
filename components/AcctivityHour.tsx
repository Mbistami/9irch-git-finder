import React, { useEffect } from "react";
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
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
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
          new Date(startDate.getTime() + Math.abs(startDate.getTimezoneOffset()*60000))?.toISOString()?.toString()?.split("T")[0]
        }&end_date=${
          new Date(endDate.getTime() + Math.abs(endDate.getTimezoneOffset()*60000))?.toISOString()?.toString()?.split("T")[0]
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
            setShowYearlyData(true);
            setLoading(false);
          });
        }
      }).catch(()=>setLoading(false));
    else if (!Boolean(
      Math.round(
        Math.abs((startDate.getTime() - endDate.getTime()) / oneDay)
      ) <= 80
    )) {
      setError(Boolean(
        Math.round(
          Math.abs((startDate.getTime() - endDate.getTime()) / oneDay)
        ) <= 80
      ) ? "" : "Error: range bigger than 80 days");
      setTotalRange(null);
      setLoading(false);
    } 
    setLoading(false);
  }, [startDate, user, endDate]);
  useEffect(()=>{
    if (error.length > 0)
    setTimeout(()=>setError(""), 2000);
  }, [error])

  return (
    <>
    {loading && <LinearProgress className="absolute w-full top-0 left-0" />}
    <ResponsiveContainer width="95%" height={300} className="pr-3 relative font-mono">
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
{error.length > 0 && <p className="text-center text-sm mt-7 opacity-70 transition-all text-red-600 font-thin">{error}</p>}
    </>
  );
};

export default PerformanceChart;
