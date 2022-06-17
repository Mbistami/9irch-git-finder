import React from "react";
import styles from "../styles/Global.module.css";
import { Search } from "@mui/icons-material";

export const SearchBar = ({ setSearchValue, handleSearch }) => {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchGroup}>
        <div>
          <Search />
        </div>
        <input
          onKeyDown={(e) => e?.code === "Enter" && handleSearch()}
          onChange={(e) => setSearchValue(e?.target?.value)}
          type="text"
          placeholder="Search Github Username..."
        />
      </div>
      <div onClick={handleSearch} className={styles.buttonSearch}>
        <p>Search</p>
      </div>
    </div>
  );
};
