import { useState } from "react";
import Settings from "../settings/Settings";
import styles from "./Content.module.scss";
import Chart from "../chart/Chart";

function Content() {
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <main className={styles.content}>
      <Settings zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      <Chart zoomLevel={zoomLevel} />
    </main>
  );
}

export default Content;
