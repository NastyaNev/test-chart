import { TooltipModel, TooltipItem, Chart } from "chart.js";

interface CustomTooltipElement extends HTMLDivElement {
  isHovered?: boolean;
}

export const createCustomTooltipConfig = (theme: string, dataMap: Map<string, any>) => {
  return {
    enabled: false,
    mode: "index" as const,
    intersect: false,
    filter: function (tooltipItem: TooltipItem<"line">) {
      // Hide tooltip for highlight datasets
      if (tooltipItem.dataset.label?.endsWith("_highlight")) {
        return false;
      }
      // Hide tooltip for the last data point (next month label with no real data)
      const lastIndex = tooltipItem.chart.data.labels!.length - 1;
      if (tooltipItem.dataIndex === lastIndex) {
        const date = tooltipItem.chart.data.labels![lastIndex];
        const hasRealData = dataMap.has(date as string);
        if (!hasRealData) {
          return false;
        }
      }
      return true;
    },
    callbacks: {
      beforeBody: function (tooltipItems: TooltipItem<"line">[]) {
        // Check if this is the last data point without real data
        if (tooltipItems && tooltipItems.length > 0) {
          const dataIndex = tooltipItems[0].dataIndex;
          const chartLabels = tooltipItems[0].chart.data.labels!;
          const lastIndex = chartLabels.length - 1;

          if (dataIndex === lastIndex) {
            const lastLabel = chartLabels[lastIndex];
            if (!dataMap.has(lastLabel as string)) {
              // Return empty to prevent tooltip display
              return [];
            }
          }
        }
      },
      labelColor: function (context: TooltipItem<"line">) {
        return {
          borderColor: context.dataset.borderColor as string,
          backgroundColor: context.dataset.borderColor as string,
          borderWidth: 0,
        };
      },
      label: function (context: TooltipItem<"line">) {
        let label = context.dataset.label || "";
        if (context.parsed.y !== null) {
          label += " " + context.parsed.y + "%";
        }
        return label;
      },
    },
    external: function (context: { chart: Chart; tooltip: TooltipModel<"line"> }) {
      let tooltipEl = document.getElementById("chartjs-tooltip") as CustomTooltipElement | null;

      if (!tooltipEl) {
        tooltipEl = document.createElement("div") as CustomTooltipElement;
        tooltipEl.id = "chartjs-tooltip";
        tooltipEl.style.position = "absolute";
        tooltipEl.style.pointerEvents = "none";
        tooltipEl.style.transition = "all .1s ease";
        tooltipEl.isHovered = false;

        tooltipEl.addEventListener("mouseenter", function () {
          (this as CustomTooltipElement).isHovered = true;
        });

        tooltipEl.addEventListener("mouseleave", function () {
          (this as CustomTooltipElement).isHovered = false;
          this.style.opacity = "0";
        });

        document.body.appendChild(tooltipEl);

        if (!document.getElementById("tooltip-scrollbar-styles")) {
          const style = document.createElement("style");
          style.id = "tooltip-scrollbar-styles";
          style.innerHTML = `
            .tooltip-scrollable::-webkit-scrollbar {
              width: 6px;
            }
            .tooltip-scrollable::-webkit-scrollbar-track {
              background: transparent;
            }
            .tooltip-scrollable::-webkit-scrollbar-thumb {
              background: rgba(128, 128, 128, 0.5);
              border-radius: 3px;
            }
            .tooltip-scrollable::-webkit-scrollbar-thumb:hover {
              background: rgba(128, 128, 128, 0.7);
            }
            .tooltip-scrollable {
              scrollbar-width: thin;
              scrollbar-color: rgba(128, 128, 128, 0.5) transparent;
            }
          `;
          document.head.appendChild(style);
        }
      }

      const tooltipModel = context.tooltip;

      // Check if this is the last data point without real data
      if (tooltipModel.dataPoints && tooltipModel.dataPoints.length > 0) {
        const dataIndex = tooltipModel.dataPoints[0].dataIndex;
        const chartLabels = context.chart.data.labels!;
        const lastIndex = chartLabels.length - 1;

        // If hovering over the last point and it has no real data, hide tooltip
        if (dataIndex === lastIndex) {
          const lastLabel = chartLabels[lastIndex];
          if (!dataMap.has(lastLabel as string)) {
            tooltipEl.style.opacity = "0";
            tooltipEl.style.pointerEvents = "none";
            return;
          }
        }
      }

      // Check if cursor is over date picker or dropdown menu
      const datePickerOpen = document.querySelector(
        '[class*="dateRangePicker"]'
      );
      const dropdownMenuOpen = document.querySelector(
        '[class*="dropdownMenu"]'
      );

      // Hide tooltip if date picker or dropdown menu is open
      if (datePickerOpen || dropdownMenuOpen) {
        tooltipEl.style.opacity = "0";
        tooltipEl.style.pointerEvents = "none";
        return;
      }

      if (tooltipModel.opacity === 0 && !tooltipEl.isHovered) {
        tooltipEl.style.opacity = "0";
        tooltipEl.style.pointerEvents = "none";
        return;
      }

      // Check if body is empty (all items filtered out)
      if (!tooltipModel.body || tooltipModel.body.length === 0) {
        tooltipEl.style.opacity = "0";
        tooltipEl.style.pointerEvents = "none";
        return;
      }

      // Enable pointer events when tooltip is visible
      tooltipEl.style.pointerEvents = "auto";

      tooltipEl.classList.remove("above", "below", "no-transform");
      if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
      } else {
        tooltipEl.classList.add("no-transform");
      }

      function getBody(bodyItem: { lines: string[] | string }): string[] | string {
        return bodyItem.lines;
      }

      function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(getBody);

        let innerHtml = "";

        const titleColor = theme === "light" ? "#414163" : "#C7C5D0";
        const borderColor = theme === "light" ? "#C7C5D0" : "#414163";
        innerHtml +=
          '<div style="display: flex; align-items: center; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid ' +
          borderColor +
          "; color: " +
          titleColor +
          '; font-weight: normal;">';
        innerHtml +=
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px; flex-shrink: 0;"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2H12V0H13V2H15.5C15.7764 2 16 2.22388 16 2.5V15.5C16 15.7761 15.7764 16 15.5 16H0.5C0.223633 16 0 15.7761 0 15.5V2.5C0 2.22388 0.223633 2 0.5 2H3V0H4V2ZM13 8V7H3V8H13ZM6 12V11H10V12H6ZM13 5H12V3H4V5H3V3H1.25C1.1123 3 1 3.11182 1 3.25V14.75C1 14.8882 1.1123 15 1.25 15H14.75C14.8877 15 15 14.8882 15 14.75V3.25C15 3.11182 14.8877 3 14.75 3H13V5Z" fill="' +
          titleColor +
          '"/></svg>';
        titleLines.forEach(function (title) {
          innerHtml += formatDate(title);
        });
        innerHtml += "</div>";

        interface SortableItem {
          body: string[] | string;
          colors: { borderColor: string; backgroundColor: string };
          numericValue: number;
        }

        const items: SortableItem[] = bodyLines.map(function (body, i) {
          const bodyText = String(body);
          const parts = bodyText.split(" ");
          const value = parts[parts.length - 1];
          const numericValue = parseFloat(value.replace("%", ""));

          return {
            body: bodyText,
            colors: tooltipModel.labelColors![i] as { borderColor: string; backgroundColor: string },
            numericValue: numericValue,
          };
        });

        items.sort(function (a, b) {
          return b.numericValue - a.numericValue;
        });

        innerHtml +=
          '<div class="tooltip-scrollable" style="max-height: 75px; overflow-y: auto; overflow-x: hidden; padding-right: 8px;">';
        items.forEach(function (item, i) {
          const markerColor =
            item.colors.borderColor || item.colors.backgroundColor;
          const style =
            'display: flex; align-items: center; justify-content: space-between; gap: 30px; margin-bottom: 6px; font-size: 12px; font-family: "Roboto"; color: ' +
            (theme === "light" ? "#1B1B23" : "#ffffff") +
            ";";
          const span =
            '<span style="display: inline-block; width: 12px; height: 12px; margin-right: 8px; background-color: ' +
            markerColor +
            '; border-radius: 5px;"></span>';

          const parts = String(item.body).split(" ");
          const name = parts.slice(0, -1).join(" ");
          const value = parts[parts.length - 1];

          const bestIcon =
            i === 0 && items.length > 1
              ? '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 6px; flex-shrink: 0;"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.375 2.25V0H13.5V2.25H16.875V3.375C16.875 4.26132 16.7003 5.13913 16.3608 5.95816C16.0225 6.77719 15.5248 7.52124 14.8975 8.14801C14.6931 8.35208 14.4767 8.54242 14.2493 8.71793C13.9351 8.96017 13.6011 9.17441 13.2495 9.35815C12.6365 11.1149 10.9655 12.375 9 12.375V14.6596C9.83606 14.7632 10.6172 15.0955 11.2214 15.6135C11.6125 15.9491 11.9136 16.3482 12.1091 16.7822C12.1948 16.972 12.2607 17.1686 12.3047 17.3694L12.3278 17.482L12.3475 17.6042L12.3585 17.6992C12.3695 17.799 12.375 17.8992 12.375 18H4.5C4.5 17.1049 4.91528 16.2466 5.65356 15.6135C6.25781 15.0955 7.03894 14.7632 7.875 14.6596V12.375C5.90955 12.375 4.23853 11.1149 3.62549 9.35815C3.01904 9.04147 2.46313 8.63361 1.97754 8.14801C1.35022 7.52124 0.852539 6.77719 0.51416 5.95816C0.174683 5.13913 0 4.26132 0 3.375V2.25H3.375ZM9.04395 4.65272L8.54449 3.11634C8.5108 3.01271 8.3642 3.01271 8.33051 3.11634L7.83105 4.65272C7.81599 4.69906 7.77279 4.73044 7.72406 4.73044H6.10862C5.99963 4.73044 5.95432 4.86991 6.0425 4.93396L7.34963 5.88347C7.38907 5.91212 7.40557 5.96291 7.3905 6.00927L6.89109 7.5457C6.8574 7.64935 6.97603 7.73555 7.0642 7.6715L8.37138 6.72195C8.41081 6.69331 8.46419 6.69331 8.50362 6.72195L9.8108 7.6715C9.89897 7.73555 10.0176 7.64935 9.98391 7.5457L9.4845 6.00927C9.46943 5.96291 9.48593 5.91212 9.52537 5.88347L10.8325 4.93396C10.9207 4.86991 10.8754 4.73044 10.7664 4.73044H9.15094C9.1022 4.73044 9.05901 4.69906 9.04395 4.65272ZM3.375 3.375H1.1283C1.1283 3.65213 1.14917 3.92844 1.18982 4.20145C1.25684 4.65546 1.37988 5.1004 1.55566 5.5264C1.83911 6.20837 2.2533 6.82828 2.77515 7.35013C2.96301 7.53799 3.16296 7.71625 3.375 7.875V3.375ZM13.5 7.875V3.375H15.7467C15.7467 3.50217 15.7423 3.62933 15.7335 3.75595C15.7236 3.90509 15.7072 4.05368 15.6852 4.20145C15.6182 4.65546 15.4951 5.1004 15.3193 5.5264C15.0359 6.20837 14.6217 6.82828 14.0999 7.35013C13.912 7.53799 13.712 7.71625 13.5 7.875ZM8.4375 11.25C6.26331 11.25 4.5 9.48724 4.5 7.3125V1.125H12.375V7.3125C12.375 9.48724 10.6117 11.25 8.4375 11.25ZM10.8007 16.8753C10.8007 16.8753 10.1272 15.7503 8.4386 15.7503C6.7511 15.7503 6.07544 16.8753 6.07544 16.8753H10.8007Z" fill="' +
                titleColor +
                '"/></svg>'
              : "";

          innerHtml +=
            '<div style="' +
            style +
            '"><div style="display: flex; align-items: center;">' +
            span +
            name +
            bestIcon +
            '</div><span style="font-weight: bold; color: ' +
            titleColor +
            ';">' +
            value +
            "</span></div>";
        });
        innerHtml += "</div>";

        tooltipEl.innerHTML = innerHtml;
      }

      const position = context.chart.canvas.getBoundingClientRect();

      tooltipEl.style.opacity = "1";
      tooltipEl.style.backgroundColor =
        theme === "light" ? "#ffffff" : "#000027";
      tooltipEl.style.borderRadius = "12px";
      tooltipEl.style.padding = "14px";
      tooltipEl.style.boxShadow =
        theme === "light"
          ? "0 0 15px rgba(0, 0, 0, 0.2)"
          : "0 0 15px rgba(255, 255, 255, 0.2)";
      tooltipEl.style.zIndex = "1000";
      tooltipEl.style.fontFamily = '"Roboto", sans-serif';
      tooltipEl.style.fontSize = "12px";

      let left = position.left + window.pageXOffset + tooltipModel.caretX;
      let top = position.top + window.pageYOffset + tooltipModel.caretY;

      const tooltipWidth = tooltipEl.offsetWidth;
      const tooltipHeight = tooltipEl.offsetHeight;
      const chartLeft = position.left + window.pageXOffset;
      const chartRight = chartLeft + position.width;
      const chartTop = position.top + window.pageYOffset;
      const chartBottom = chartTop + position.height;

      if (left + tooltipWidth > chartRight) {
        left = chartRight - tooltipWidth;
      }

      if (left < chartLeft) {
        left = chartLeft;
      }

      if (top < chartTop) {
        top = chartTop;
      }

      if (top + tooltipHeight > chartBottom) {
        top = chartBottom - tooltipHeight;
      }

      tooltipEl.style.left = left + "px";
      tooltipEl.style.top = top + "px";
    },
  };
};
