import Dropdown from "../UI/dropdown/Dropdown";
import styles from "./Content.module.scss";

function Content() {
  return (
    <main className={styles.content}>
      <Dropdown />
    </main>
  );
}

export default Content;
