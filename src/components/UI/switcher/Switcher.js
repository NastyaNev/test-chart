import styles from "./Switcher.module.scss";

function Switcher(props) {
  const { isChecked, toggle } = props;

  return (
    <label className={styles.switcher}>
      <input type="checkbox" checked={isChecked} onChange={toggle} />
      <span className={styles.switcher__slider} />
    </label>
  );
}

export default Switcher;
