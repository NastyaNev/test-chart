import { Plugin, Chart } from "chart.js";

interface CrosshairPluginOptions {
  line: {
    width: number;
    color: string;
  };
}

export const createCrosshairPlugin = (): Plugin<"line", CrosshairPluginOptions> => {
  let lastX: number | null = null;

  return {
    id: "crosshair",
    afterDatasetsDraw: (chart: Chart, args: any, options: CrosshairPluginOptions) => {
      // Update lastX if there's an active point
      if (chart.tooltip?._active?.length) {
        const activePoint = chart.tooltip._active[0];
        lastX = activePoint.element.x;
      }

      // Draw the line if tooltip is visible (even when cursor is over tooltip)
      const tooltipEl = document.getElementById("chartjs-tooltip");
      const isTooltipVisible =
        tooltipEl && parseFloat(tooltipEl.style.opacity) > 0;

      if (
        (chart.tooltip?._active?.length || isTooltipVisible) &&
        lastX !== null
      ) {
        const ctx = chart.ctx;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lastX, topY);
        ctx.lineTo(lastX, bottomY);
        ctx.lineWidth = options.line.width;
        ctx.strokeStyle = options.line.color;
        ctx.stroke();
        ctx.restore();
      }

      // Reset lastX when tooltip is completely hidden
      if (!isTooltipVisible && !chart.tooltip?._active?.length) {
        lastX = null;
      }
    },
  };
};
