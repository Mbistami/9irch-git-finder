import React, { useState } from "react";
import Head from "next/head";
import styles from "../styles/Global.module.css";
import {
  LightMode,
  DarkMode,
  GpsFixed,
  Twitter,
  Link,
  Check,
} from "@mui/icons-material";
import { Button } from "../components/Button";
import { SearchBar } from "../components/SearchBar";
import { useRouter } from "next/router";
import UserCard from "../components/UserCard";
import ActivityHours from "../components/AcctivityHour";
import { useAppContext } from "../context/authentication";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { fetch_me } from "../utils";

export default function Home() {
  const [isDark, setIsDark] = React.useState(true);
  const toggleDarkMode = () => setTimeout(() => setIsDark(!isDark), 100);
  const [totalRange, setTotalRange] = React.useState(null);
  const [startDate, setStartDate] = React.useState(
    () => new Date(new Date().getFullYear(), 0, 1)
  );
  const [user, setUser] = useAppContext();
  const [endDate, setEndDate] = React.useState(new Date());
  const [searchValue, setSearchValue] = React.useState("");
  const [notFound, setNotFound] = React.useState("");
  const sharks = [42296438, 86249536, 55022462, 94942389];
  const { asPath, pathname } = useRouter();
  const handleChange = (newValue: any) => {
    console.log(newValue);
    setStartDate(newValue);
  };
  const handleChange_ = (newValue: any) => {
    setEndDate(newValue);
  };
  const [token, setToken] = useState(asPath?.split("?")[1]?.split("=")[1]);
  // console.log(asPath, asPath.split("?")[1].split("=")[1], token);
  const truncate = (str: string, len: number) =>
    str?.length > len ? str.slice?.(0, len) + "..." : str;
  const handleSearch = () => {
    const loaded_data = localStorage?.getItem("logtime_userdata")
      ? JSON.parse(localStorage?.getItem("logtime_userdata") || "{}")
      : null;
    try {
      fetch(`https://timer-logger.herokuapp.com/users/${searchValue}/${token}`, {
        method: "GET",
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setUser(data[0]);
            });
          } else {
            setUser(null);
            setNotFound(searchValue);
          }
        })
        .catch(() => {
          setUser(null);

          setNotFound(searchValue);
        });
    } catch (error) {
      setUser(null);

      setNotFound(searchValue);
    }
  };
  React.useEffect(() => {
    // if (typeof window !== "undefined") {
    //   if (token && !user?.Authorization) {
    //   } else if (!token)
    //     window.open(
    //       "https://api.intra.42.fr/oauth/authorize?client_id=0f564e70b1cb711fe15d307d5512ee847fd8dc4a709c34ea29df9211359b1dad&redirect_uri=https%3A%2F%2F9irch-finder.tech%2F&response_type=code",
    //       "_self"
    //     );
    // }
  }, [token]);
  React.useEffect(() => console.log(startDate), [startDate]);
  React.useEffect(() => console.log(endDate), [endDate]);
  return (
    <div className={styles.container}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.cardContainer}>
        <div className={styles.navbar}>
          <p className={styles.logo}>9irch-git-Finder</p>
          {isDark ? (
            <Button
              onClick={toggleDarkMode}
              text="light"
              icon={<LightMode />}
            />
          ) : (
            <Button onClick={toggleDarkMode} text="dark" icon={<DarkMode />} />
          )}
        </div>
        <SearchBar
          handleSearch={handleSearch}
          setSearchValue={setSearchValue}
        />
        <div className="w-full m-0">
          <div className={styles.bottomData}>
            {user != null ? (
              <>
                <UserCard
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  startDate={startDate}
                  endDate={endDate}
                  userData={user}
                  totalRange={totalRange}
                />
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  color: searchValue.length > 0 ? "yellowgreen" : "white",
                }}
              >
                <div style={{ width: "100%" }}>
                  {searchValue.length > 0 && notFound ? (
                    <p>
                      Username available <strong>{notFound}</strong>
                    </p>
                  ) : notFound ? (
                    <p>
                      Username available <strong>{notFound}</strong>
                    </p>
                  ) : (
                    `Search user!`
                  )}
                </div>
                {searchValue.length > 0 && <Check />}
              </div>
            )}
          </div>
        </div>
        <div className={styles.bottomData}>
          <div className="w-full flex flex-col mt-2">
            <div>
              <p className="text-center mb-10">Year activity</p>
              <ActivityHours
                endDate={endDate}
                setStartDate={setStartDate}
                startDate={startDate}
                handleChange={handleChange}
                user={user}
                setTotalRange={setTotalRange}
                isFullYear
              />
              <p className="text-center">Year activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
