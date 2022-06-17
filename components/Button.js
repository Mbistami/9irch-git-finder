import React from "react";
import styles from "../styles/Global.module.css";

export const Button = ({ text, icon, onClick }) => {
  return (
    <div className={styles.viewMode} onClick={onClick}>
      <p>{text}</p>
      {icon}
    </div>
  );
};
