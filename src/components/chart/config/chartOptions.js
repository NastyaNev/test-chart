import { hexToRGBA } from "@/utils/functions/functions";

export const createChartOptions = (theme, customTooltipConfig) => {
  return {
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      crosshair: {
        line: {
          color:
            theme === "light"
              ? hexToRGBA("#C7C5D0", 0.7)
              : hexToRGBA("#414163", 0.7),
          width: 1,
        },
      },
      legend: {
        display: false,
      },
      tooltip: customTooltipConfig,
    },
    scales: {
      x: {
        position: "bottom",
        border: {
          display: true,
          color: theme == "light" ? "#C7C5D0" : "#414163",
          width: 1,
        },
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
        },
      },
      xTop: {
        position: "top",
        border: {
          display: true,
          color: theme == "light" ? "#C7C5D0" : "#414163",
          width: 1,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        position: "left",
        border: {
          display: true,
          color: theme == "light" ? "#C7C5D0" : "#414163",
          width: 1,
        },
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
      yRight: {
        position: "right",
        border: {
          display: true,
          color: theme == "light" ? "#C7C5D0" : "#414163",
          width: 1,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  };
};
