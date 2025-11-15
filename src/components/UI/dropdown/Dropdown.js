import styles from "./Dropdown.module.scss";
import * as svg from "../Icons";

function Dropdown({ className, type, id, value, onClick, disabled = false }) {
  return (
    <div className={[styles.dropdown, className, disabled && styles.dropdown_disabled].filter(Boolean).join(" ")}>
      <input
        className={styles.dropdown__input}
        value={value ?? "hello"}
        onClick={disabled ? undefined : (onClick || (() => {}))}
        readOnly
        type={type ?? "button"}
        id={id}
        name={id}
        disabled={disabled}
      />
      <span className={styles.dropdown__icon}>
        <svg.Chevron />
      </span>
    </div>
  );
}

export default Dropdown;
