import Settings from "../settings/Settings";
import styles from "./Content.module.scss";
import Chart from "../chart/Chart";

function Content() {
  return (
    <main className={styles.content}>
      <Settings />
      <Chart />
    </main>
  );
}

export default Content;
