import React from "react";
import styles from "../styles/Global.module.css";
import { Avatar, Chip, Stack } from "@mui/material";
import { DashCard } from "./DashCard.tsx";
import ActivityHours from "./AcctivityHour.tsx";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useAppContext } from "../context/authentication";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";

const UserCard = ({
  userData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  totalRange,
}) => {
  const colors = {
    easy: "green",
    medium: "orange",
    hard: "red",
  };
  const [hardest, setHardest] = React.useState(null);
  const [user, setUser] = useAppContext();
  const handleChange = (newValue) => {
    setStartDate(newValue);
  };
  const handleChange_ = (newValue) => {
    setEndDate(newValue);
  };
  React.useEffect(() => {
    const tiers = ["easy", "medium", "hard"];
    for (let i = tiers.length; i > -1; i--) {
      const tier = tiers[i];
      const achievement = userData?.achievements?.find((a) => a.tier === tier);
      setHardest(achievement);
      if (achievement) break;
    }
    tiers.map((tier) => userData?.achievements?.find((a) => a.tier === "hard"));
    console.log(userData);
  }, [userData]);

  return (
    <>
      <div
        className={styles.image}
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          className={styles.imageC}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <img
            src={userData?.image_url}
            width={80}
            height={80}
            style={{ borderRadius: "50%" }}
          />
        </div>
        <div className="pt-5 flex flex-col gap-2">
          <div className="absolute bg-[#141c2f] relative w-full h-fit rounded-xl overflow-hidden">
            <div
              className="absolute bg-white h-full opacity-30 "
              style={{
                width: `${
                  user?.cursus_users
                    .find((a) => a.end_at === null)
                    ?.level.toString()
                    .split(".")[1]
                }%`,
              }}
            />
            <p className="text-xs opacity-90 tracking-widest">
              Cursus level{" "}
              <span className="text-white ">
                {user?.cursus_users
                  .find((a) => a.end_at === null)
                  ?.level.toString()
                  .replace(".", " - ")}
                %
              </span>
            </p>
          </div>
          <p style={{ fontSize: "12px", opacity: 0.7 }}>
            Highest achievement tier
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              flexDirection: "column",

              gap: 10,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "13px",
                  opacity: 0.6,
                  color: colors[hardest?.tier],
                  margin: 0,
                  marginBottom: "4px",
                }}
              >
                {hardest?.name || "-"}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  opacity: 0.6,
                  margin: 0,
                }}
              >
                {hardest?.description || "-"}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: "9px",
                }}
              >
                {hardest?.image && (
                  <Avatar src={`https://api.intra.42.fr/${hardest?.image}`} />
                )}
              </div>
              <Chip
                label={`${hardest?.tier} tier`}
                sx={{ color: "white" }}
                className="px-2 py-1 mt-2 font-primary"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.username_joindate}>
          <p>{userData?.login || "Loading.."}</p>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>
            {new Date(userData?.created_at)
              .toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                day: "numeric",
                month: "long",
              })
              .split(",")
              .join("")}
          </p>
        </div>
        {/* <p style={{ color: userData?.coalition.color, fontSize: "14px" }}>
          {userData?.coalition.name}
        </p> */}

        <div className={styles.moreData}>
          <div>
            <p
              style={{
                fontSize: "10px",
                opacity: 0.6,
                marginBottom: "5px",
                paddingTop: "5px",
              }}
            >
              Location
            </p>
            <p>{userData?.location || "-"}</p>
          </div>

          <div>
            <p
              style={{
                fontSize: "10px",
                opacity: 0.6,
                marginBottom: "5px",
                paddingTop: "5px",
              }}
            >
              Wallet
            </p>
            <p>{userData?.wallet}₳</p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                opacity: 0.6,
                marginBottom: "5px",
                paddingTop: "5px",
              }}
            >
              achievements
            </p>
            <p>{userData?.achievements?.length || "-"}</p>
          </div>
          {totalRange !== null && (
            <div>
              <p
                style={{
                  fontSize: "10px",
                  opacity: 0.6,
                  marginBottom: "5px",
                  paddingTop: "5px",
                }}
              >
                Total hours
              </p>
               <p>{totalRange}</p>
            </div>
          )}
        </div>
        <br />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2} direction="row">
            <DesktopDatePicker
              label="Start date"
              inputFormat="yyyy-MM-dd"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              size="small"
              renderInput={(params) => (
                <TextField
                  sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    svg: { color: "white" },
                    width: "50%",
                  }}
                  size="small"
                  className="text-white"
                  value={startDate}
                  {...params}
                />
              )}
            />
            <DesktopDatePicker
              label="End date"
              inputFormat="yyyy-MM-dd"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              size="small"
              renderInput={(params) => (
                <TextField
                  sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    svg: { color: "white" },
                    width: "50%",
                  }}
                  size="small"
                  className="text-white"
                  {...params}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
      </div>
    </>
  );
};
export default UserCard;
