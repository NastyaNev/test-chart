import { ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}

function Button({ icon, onClick, disabled, title }: ButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon}
    </button>
  );
}

export default Button;
