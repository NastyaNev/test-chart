import styles from "./Button.module.scss";

function Button({ icon, onClick, disabled, title }) {
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
