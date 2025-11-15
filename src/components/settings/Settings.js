import Button from "../UI/button/Button";
import Dropdown from "../UI/dropdown/Dropdown";
import styles from "./Settings.module.scss";
import * as svg from "../UI/Icons";

function Settings() {
  return (
    <div className={styles.settings}>
      <menu className={styles.settings__data_chart}>
        <li>
          <Dropdown
            type="button"
            id="dropdown-variations"
            className={styles.settings__data_chart__drd_vars}
          />
        </li>
        <li>
          <Dropdown type="date" id="dropdown-date" />
        </li>
      </menu>
      <menu className={styles.settings__tools}>
        <li>
          <Dropdown id="dropdown-line" />
        </li>
        <li>
          <Button icon={<svg.Select />} />
        </li>
        <li className={styles.settings__tools__zoom}>
          <Button icon={<svg.Minus />} />
          <Button icon={<svg.Plus />} />
        </li>
        <li className={styles.settings__tools__refresh}>
          <Button icon={<svg.Refresh />} />
        </li>
      </menu>
    </div>
  );
}

export default Settings;
