import styles from "./Switcher.module.scss";

interface SwitcherProps {
  isChecked: boolean;
  toggle: () => void;
}

function Switcher({ isChecked, toggle }: SwitcherProps) {
  return (
    <label className={styles.switcher}>
      <input type="checkbox" checked={isChecked} onChange={toggle} />
      <span className={styles.switcher__slider} />
    </label>
  );
}

export default Switcher;
