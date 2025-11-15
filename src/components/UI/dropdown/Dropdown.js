import styles from "./Dropdown.module.scss";
import * as svg from "../Icons";

function Dropdown({ className, type, id, value }) {
  return (
    <div className={[styles.dropdown, className].join(" ")}>
      <input
        className={styles.dropdown__input}
        value={value ?? "hello"}
        onClick={() => {}}
        readOnly
        type={type ?? "button"}
        id={id}
        name={id}
      />
      <span className={styles.dropdown__icon}>
        <svg.Chevron />
      </span>
    </div>
  );
}

export default Dropdown;
