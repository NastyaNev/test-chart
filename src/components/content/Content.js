import { useEffect, useMemo, useState } from "react";
import Settings from "../settings/Settings";
import styles from "./Content.module.scss";
import Chart from "../chart/Chart";
import { lineStyles } from "../../utils/constants/chartConstants";

function Content() {
  const [data, setData] = useState(null);
  const [settingsState, setSettingsState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://example.com/api/data");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (!jsonData?.variations || !jsonData?.data) {
          throw new Error("Invalid data structure received from API");
        }

        setData(jsonData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const variations = useMemo(() => {
    if (!data?.variations) return [];

    const allOption = {
      id: "all",
      name: "All variations selected",
    };
    const vars = data.variations.map((v) => ({
      ...v,
      id: v.id ?? 0,
    }));
    return [allOption, ...vars];
  }, [data]);

  const availableDates = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => item.date);
  }, [data]);

  const initState = useMemo(() => {
    if (variations.length === 0 || availableDates.length === 0) return null;

    return {
      selectedVariations: [variations[0]],
      selectedLineStyle: lineStyles[0],
      dateRange: {
        start: availableDates[0],
        end: availableDates[availableDates.length - 1],
      },
      isDropdownOpen: false,
      zoomLevel: 1,
    };
  }, [variations, availableDates]);

  useEffect(() => {
    if (initState && !settingsState) {
      setSettingsState(initState);
    }
  }, [initState, settingsState]);

  const props = { settingsState, setSettingsState, initState };

  if (loading) {
    return (
      <main className={styles.content}>
        <div className={styles.content__message}>Loading data...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.content}>
        <div className={styles.content__error}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </main>
    );
  }

  if (!data || !settingsState) return null;

  return (
    <main className={styles.content}>
      <Settings
        {...props}
        variations={variations}
        availableDates={availableDates}
      />
      <Chart {...props} data={data} />
    </main>
  );
}

export default Content;
