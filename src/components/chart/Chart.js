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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "../../hooks/useTheme";
import { hexToRGBA } from "../../utils/functions/functions";
import { data } from "./data";

function Chart() {
  const { theme } = useTheme();

  const labels = data.data.map((i) => {
    return i.date;
  });

  const variations = data.variations.map((i) => {
    return { id: Boolean(i.id) ? i.id : 0, name: i.name };
  });

  const colors = (id) => {
    const gallery = ["#FF8346", "#3838E7", "#5E5D67", "#ff46beff"];

    const varIds = variations.map((v) => {
      return v.id;
    });

    const index = varIds.indexOf(Number(id));

    return gallery[index];
  };

  const formattedData = data.data.map((d) => {
    return {
      date: d.date,
      info: Object.entries(d.visits).map(([key, value]) => {
        return {
          id: Number(key),
          visits: Number(value),
          conversions: Number(d.conversions[key]),
        };
      }),
    };
  });

  //   console.log("formattetData", formattedData);

  const datasets = variations.map((v) => {
    return {
      label: v.name,
      data: labels.map((l) => {
        const item = formattedData
          .find((f) => f.date === l)
          .info.find((i) => i.id === v.id);

        if (!item || !item?.visits || !item?.conversions) return 0;

        return Number((item.conversions / item.visits) * 100).toFixed(2);
      }),
      lineTension: 0.5,
      clip: false,
      spanGaps: true,
      borderColor: colors(v?.id),
      borderWidth: 2,
      pointStyle: false,
    };
  });

  // console.log("d", d);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );

  const chartOptions = {
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        caretPadding: 5,
        caretSize: 0,
        backgroundColor: theme == "light" ? "#ffffff" : "#000027",
        padding: 14,
        cornerRadius: 12,
        bodyColor: theme == "light" ? "#1B1B23" : "#ffffff",
        titleColor: theme == "light" ? "#414163" : "#C7C5D0",
        borderColor: theme == "light" ? "#C7C5D0" : "#414163",
        borderWidth: 1,
        titleFont: {
          weight: "normal",
        },
        bodyFont: {
          size: 12,
          weight: "normal",
          family: "'Roboto'",
        },
        callbacks: {
          labelColor: function (context) {
            return {
              backgroundColor: context.dataset.borderColor,
              borderWidth: 0,
              borderColor: hexToRGBA("#C7C5D0", 0),
              borderRadius: 5,
            };
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value, index) {
            const currentDate = new Date(this.getLabelForValue(value));
            const currentMonth = currentDate.getMonth();

            if (index === 0) {
              return currentDate.toLocaleDateString("en-Us", {
                month: "short",
              });
            }

            const prevDate = new Date(this.getLabelForValue(value - 1));
            const prevMonth = prevDate.getMonth();

            if (currentMonth !== prevMonth) {
              return currentDate.toLocaleDateString("en-Us", {
                month: "short",
              });
            }

            return "";
          },
          color: theme == "light" ? "#414163" : "#C7C5D0",
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          padding: 10,
          maxRotation: 0,
          autoSkip: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme == "light" ? "#414163" : "#C7C5D0",
          stepSize: 10,
          autoSkip: false,
          callback: function (value, index, ticks) {
            return value + "%";
          },
          crossAlign: "far",
        },
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className={styles.chart}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}

export default Chart;
