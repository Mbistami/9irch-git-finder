import { createContext, useContext } from "react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  console.log(typeof window);
  const [user, setUser] = useState();
  const { asPath, pathname } = useRouter();
  const [token, setToken] = useState(asPath?.split("?")[1]?.split("=")[1]);
  React.useEffect(() => {
    console.log(window);
    const url = token
      ? `https://timer-logger.herokuapp.com/auth?code=${token}`
      : "https://timer-logger.herokuapp.com/auth";
    if (window !== undefined) {
      fetch(`http://localhost:3001/auth?code=${token}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 200)
            res.json().then((data) => {
              console.log(data);
              setUser({ ...user, ...data });
            });
          else if (res.status === 401)
            window.open(
              "https://api.intra.42.fr/oauth/authorize?client_id=0f564e70b1cb711fe15d307d5512ee847fd8dc4a709c34ea29df9211359b1dad&redirect_uri=https%3A%2F%2F9irch-finder.tech%2F&response_type=code",
              "_self"
            );
        })
        .catch((err) => {
          console.log(err);
          window.open(
            "https://api.intra.42.fr/oauth/authorize?client_id=0f564e70b1cb711fe15d307d5512ee847fd8dc4a709c34ea29df9211359b1dad&redirect_uri=https%3A%2F%2F9irch-finder.tech%2F&response_type=code",
            "_self"
          );
        });
    }
  }, [token]);
  return (
    <AppContext.Provider value={[user, setUser]} setValue={setUser}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
