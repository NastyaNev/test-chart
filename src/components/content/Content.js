import { useMemo, useState } from "react";
import Settings from "../settings/Settings";
import styles from "./Content.module.scss";
import Chart from "../chart/Chart";
import { data } from "../chart/data";
import { lineStyles } from "../../utils/constants/chartConstants";

function Content() {
  const variations = useMemo(() => {
    const allOption = {
      id: "all",
      name: "All variations selected",
    };
    const vars = data.variations.map((v) => ({
      ...v,
      id: v.id ?? 0,
    }));
    return [allOption, ...vars];
  }, []);

  const availableDates = useMemo(() => {
    return data.data.map((item) => item.date);
  }, []);

  const initState = {
    selectedVariations: [variations.find((v) => v.id === "all")],
    selectedLineStyle: lineStyles[0],
    dateRange:
      availableDates.length > 0
        ? {
            start: availableDates[0],
            end: availableDates[availableDates.length - 1],
          }
        : { start: null, end: null },
    isDropdownOpen: false,
    zoomLevel: 1,
  };

  const [settingsState, setSettingsState] = useState(initState);

  const props = { settingsState, setSettingsState, initState };

  return (
    <main className={styles.content}>
      <Settings
        {...props}
        variations={variations}
        availableDates={availableDates}
      />
      <Chart {...props} />
    </main>
  );
}

export default Content;
