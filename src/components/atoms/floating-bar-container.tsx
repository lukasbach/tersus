import { FC, PropsWithChildren } from "react";
import styles from "./atoms.module.css";

export const FloatingBarContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.floatingBarContainer}>{children}</div>;
};
