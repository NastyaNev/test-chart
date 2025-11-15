import styles from "./Button.module.scss";

function Button({ icon }) {
  return <button className={styles.button}>{icon}</button>;
}

export default Button;
