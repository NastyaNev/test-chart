import styles from "./Dropdown.module.scss";
import * as svg from "@/components/UI/Icons";

interface DropdownProps {
  className?: string;
  type?: string;
  id?: string;
  value: string;
  onClick?: () => void;
  disabled?: boolean;
  isOpen?: boolean;
}

function Dropdown({
  className,
  type,
  id,
  value,
  onClick,
  disabled = false,
  isOpen = false,
}: DropdownProps) {
  return (
    <div
      className={[
        styles.dropdown,
        className,
        disabled && styles["dropdown--disabled"],
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={disabled ? undefined : onClick || (() => {})}
    >
      <input
        className={styles.dropdown__input}
        value={value}
        readOnly
        type={type ?? "button"}
        id={id}
        name={id}
        disabled={disabled}
        tabIndex={-1}
      />
      <span
        className={[
          styles.dropdown__icon,
          isOpen && styles["dropdown__icon--open"],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <svg.Chevron />
      </span>
    </div>
  );
}

export default Dropdown;
