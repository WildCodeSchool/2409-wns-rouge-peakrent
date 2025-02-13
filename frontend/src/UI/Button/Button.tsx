import classNames from "classnames";
import styles from "./Button.module.scss";
import { MouseEvent, ReactNode } from "react";

type Props = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  design?: "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY" | "DEFAULT";
  disabled?: boolean;
};

const Button = ({ onClick, children, design = "DEFAULT", disabled }: Props) => {
  return (
    <button
      className={classNames(
        styles.DEFAULT,
        styles[design],
        disabled && styles.disabled
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
