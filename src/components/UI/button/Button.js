import styles from "./Button.module.scss";

function Button({ icon, onClick, disabled }) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}

export default Button;
