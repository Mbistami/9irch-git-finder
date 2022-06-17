export const loadTotalYearDate = async (user: any, setData: any, data: any) => {
  const now = new Date();
  const startYear = now.getFullYear() - 1;
  const savedData: any = [];
  let startDate_ = new Date(startYear, 11, 27);
  let endDate_ = new Date(startYear + 1, 0, 27);
  while (startDate_?.getMonth() !== now.getMonth() + 1) {
    await fetch(
      `https://time-logger.1337.ma/api/log_times?start_date=${
        startDate_?.toISOString()?.toString()?.split("T")[0]
      }&end_date=${
        endDate_?.toISOString()?.toString()?.split("T")[0]
      }&username=${user?.login}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "4d76967b4c5b69c49fe0f57ffd9865ed9ca9638e85daefdfdb82ba0209a0402e",
        },
      }
    ).then((res) => {
      if (res.status === 200)
        res.json().then((data_) => {
          console.log({
            name: startDate_?.toLocaleDateString("en-US", { month: "short" }),
            value: data_,
            link: `https://time-logger.1337.ma/api/log_times?start_date=${
              startDate_?.toISOString()?.toString()?.split("T")[0]
            }&end_date=${
              endDate_?.toISOString()?.toString()?.split("T")[0]
            }&username=${user?.login}`,
          });
          savedData.push({
            name: startDate_?.toLocaleDateString("en-US", { month: "short" }),
            value: data_["hydra:member"][0]?.totalHours || 0,
          });
        });
    });
    startDate_ = endDate_;
    endDate_ = new Date(endDate_?.getFullYear(), endDate_?.getMonth() + 1, 27);
  }
  setData([...savedData]);
};

export const loadTotalDaysRange = async (
  user: any,
  setData: any,
  data: any,
  startDate: Date,
  endDate: Date
) => {
  const now = new Date();
  let startDateRange = startDate;
  let endDateRange = endDate;
  const savedData: any = [];
  console.log(
    "loadedTotalDaysRange",
    startDateRange.toISOString(),
    endDateRange.toISOString()
  );
  while (
    startDateRange.getMonth() !== endDateRange.getMonth() ||
    startDateRange.getDay() !== endDateRange.getDay()
  ) {
    await fetch(
      `https://time-logger.1337.ma/api/log_times?start_date=${
        startDateRange?.toISOString()?.toString()?.split("T")[0]
      }&end_date=${
        endDateRange?.toISOString()?.toString()?.split("T")[0]
      }&username=${user?.login}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "4d76967b4c5b69c49fe0f57ffd9865ed9ca9638e85daefdfdb82ba0209a0402e",
        },
      }
    )
      .then(
        (res: any) =>
          res.status === 200 &&
          res.json().then((data_: any) => {
            console.log({
              name: startDateRange?.toLocaleDateString("en-US", {
                month: "short",
              }),
              value: data_["hydra:member"][0]?.totalHours,
            });
            savedData.push({
              name: startDateRange?.toLocaleDateString("en-US", {
                month: "short",
              }),
              value: data_["hydra:member"][0]?.totalHours,
            });
          })
      )
      .catch(() => {});
    startDateRange = endDateRange;
    endDateRange.setDate(endDateRange.getDate() + 1);
  }
  console.log("savedData", savedData);
  setData([...savedData]);
};