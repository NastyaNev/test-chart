import { useMemo } from "react";
import styles from "./Chart.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "../../hooks/useTheme";
import { data } from "./data";
import { hexToRGBA } from "../../utils/functions/functions";
import { colorPalette } from "../../utils/constants/chartConstants";
import { createCrosshairPlugin } from "./config/crosshairPlugin";
import { createCustomTooltipConfig } from "./config/customTooltip";
import { createChartOptions } from "./config/chartOptions";

function Chart(props) {
  const { settingsState } = props;

  const {
    selectedVariations,
    selectedLineStyle: { value: selectedStyle },
    dateRange,
    zoomLevel,
  } = settingsState;

  const selectedVariationIds = selectedVariations.map((v) => {
    return v.id;
  });

  const { theme } = useTheme();

  const { labels, variations, dataMap } = useMemo(() => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let filteredData = [...data.data];

    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    let labelsList = [];

    if (dateRange.start && dateRange.end && dateRange.start === dateRange.end) {
      const selectedDate = new Date(dateRange.start);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        labelsList.push(dateStr);
      }

      const nextMonthDate = new Date(year, month + 1, 1);
      labelsList.push(formatDate(nextMonthDate));
    } else {
      labelsList = filteredData.map((i) => i.date);

      if (labelsList.length > 0) {
        const lastDate = new Date(labelsList[labelsList.length - 1]);
        const nextMonthDate = new Date(lastDate);
        nextMonthDate.setDate(1);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const nextMonthLabel = nextMonthDate.toISOString().split("T")[0];
        labelsList.push(nextMonthLabel);
      }
    }

    let variationsList = data.variations.map((i, index) => ({
      id: i.id ?? 0,
      name: i.name,
      originalIndex: index,
    }));

    if (!selectedVariationIds.includes("all")) {
      variationsList = variationsList.filter((v) =>
        selectedVariationIds.includes(v.id)
      );
    }

    const map = new Map();
    data.data.forEach((d) => {
      const varData = {};
      Object.entries(d.visits).forEach(([id, visits]) => {
        varData[id] = {
          visits: Number(visits),
          conversions: Number(d.conversions[id]),
        };
      });
      map.set(d.date, varData);
    });

    return { labels: labelsList, variations: variationsList, dataMap: map };
  }, [selectedVariationIds, dateRange]);

  const datasets = useMemo(() => {
    const result = [];

    const isSingleDate =
      dateRange.start && dateRange.end && dateRange.start === dateRange.end;

    variations.forEach((variation) => {
      const colorIndex = variation.originalIndex;
      const chartData = labels.map((date, index) => {
        if (isSingleDate && date !== dateRange.start) {
          return null;
        }

        let dayData = dataMap.get(date);

        if (!dayData && index === labels.length - 1 && index > 0) {
          const prevDate = labels[index - 1];
          dayData = dataMap.get(prevDate);
        }

        if (!dayData) return null;

        const varData = dayData[variation.id];

        if (!varData?.visits || !varData?.conversions) return 0;

        return Number((varData.conversions / varData.visits) * 100).toFixed(2);
      });

      if (selectedStyle === "highlight-line" && !isSingleDate) {
        result.push({
          label: variation.name + "_highlight",
          data: chartData,
          tension: 0.4,
          clip: false,
          spanGaps: true,
          borderColor: hexToRGBA(colorPalette[colorIndex], 0.3),
          borderWidth: 8,
          pointStyle: false,
          fill: false,
          order: 2,
        });
      }

      result.push({
        label: variation.name,
        data: chartData,
        tension: selectedStyle === "zigzag-line" ? 0 : 0.4,
        clip: false,
        spanGaps: true,
        borderColor: colorPalette[colorIndex],
        borderWidth: 2,
        showLine: !isSingleDate,
        pointStyle: isSingleDate ? "circle" : false,
        pointRadius: isSingleDate ? 6 : 0,
        pointHoverRadius: isSingleDate ? 8 : 0,
        pointBackgroundColor: isSingleDate
          ? hexToRGBA(colorPalette[colorIndex], 0.5)
          : colorPalette[colorIndex],
        pointBorderColor: colorPalette[colorIndex],
        pointBorderWidth: isSingleDate ? 1 : 2,
        fill: selectedStyle === "area" && !isSingleDate,
        backgroundColor: hexToRGBA(colorPalette[colorIndex], 0.5),
        order: selectedStyle === "highlight-line" ? 1 : undefined,
      });
    });

    return result;
  }, [labels, variations, dataMap, selectedStyle, dateRange]);

  const crosshairPlugin = useMemo(() => createCrosshairPlugin(), []);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Filler,
    crosshairPlugin
  );

  const chartOptions = useMemo(() => {
    const customTooltipConfig = createCustomTooltipConfig(theme, dataMap);
    return createChartOptions(theme, customTooltipConfig);
  }, [theme, dataMap]);

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className={styles.chart}>
      <div
        style={{
          width: `${zoomLevel * 100}%`,
        }}
        className={styles["chart__chart-wrapper"]}
      >
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
}

export default Chart;
