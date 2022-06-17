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
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function Home() {
  const [isDark, setIsDark] = React.useState(true);
  const toggleDarkMode = () => setTimeout(() => setIsDark(!isDark), 100);
  const [userData, setUserData] = React.useState(null);
  const [totalRange, setTotalRange] = React.useState(null);
  const [startDate, setStartDate] = React.useState(
    () => new Date(new Date().getFullYear(), 0, 1)
  );
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
      fetch(
        `https://api.intra.42.fr/v2/campus/21/users?filter[login]=${searchValue}`,
        {
          method: "GET",
          headers: { Authorization: loaded_data?.Authorization },
        }
      )
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setUserData(data[0]);
            });
          } else {
            setUserData(null);
            setNotFound(searchValue);
          }
        })
        .catch(() => {
          setUserData(null);

          setNotFound(searchValue);
        });
    } catch (error) {
      setUserData(null);

      setNotFound(searchValue);
    }
  };
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const loaded_data = localStorage?.getItem("logtime_userdata")
        ? JSON.parse(localStorage?.getItem("logtime_userdata") || "{}")
        : null;

      if (token && !loaded_data) {
        fetch(`http://localhost:3001/auth?code=${token}`, {
          method: "GET",
        })
          .then(
            (res: any) =>
              res.status === 200 &&
              res.json().then((data: any) => {
                fetch(`http://localhost:3001/me`, {
                  method: "GET",
                  headers: { Authorization: `Bearer ${data?.access_token}` },
                }).then((res: any) => {
                  if (res?.status === 200)
                    res.json().then((userData: any) => {
                      localStorage.setItem(
                        "logtime_userdata",
                        JSON.stringify({
                          Authorization: `Bearer ${data?.access_token}`,
                          ...userData,
                        })
                      );
                      setUserData({
                        Authorization: `Bearer ${data?.access_token}`,
                        ...userData,
                      });
                    });
                });
              })
          )
          .catch();
      } else if (loaded_data) {
        fetch(`https://api.intra.42.fr/v2/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${loaded_data?.Authorization}` },
        })
          .then((res) => {
            if (res.status !== 200) {
              // localStorage?.removeItem("logtime_userdata");
              // window.open(
              //   "https://api.intra.42.fr/oauth/authorize?client_id=0f564e70b1cb711fe15d307d5512ee847fd8dc4a709c34ea29df9211359b1dad&redirect_uri=https%3A%2F%2F9irch-finder.tech%2F&response_type=code",
              //   "_self"
              // );
              // console.log(res.status);
            }
          })
          .catch(() => {});
        setUserData(loaded_data);
      } else
        window.open(
          "https://api.intra.42.fr/oauth/authorize?client_id=0f564e70b1cb711fe15d307d5512ee847fd8dc4a709c34ea29df9211359b1dad&redirect_uri=https%3A%2F%2F9irch-finder.tech%2F&response_type=code",
          "_self"
        );
    }
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
            {userData != null ? (
              <>
                <UserCard
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  startDate={startDate}
                  endDate={endDate}
                  userData={userData}
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
                user={userData}
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
