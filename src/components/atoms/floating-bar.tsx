import { FC, PropsWithChildren } from "react";
import styles from "./atoms.module.css";

export const FloatingBar: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.floatingBar}>{children}</div>;
};
