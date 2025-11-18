export interface LineStyle {
  id: number;
  name: string;
  value: string;
}

export const colorPalette: string[] = ["#FF8346", "#3838E7", "#5E5D67", "#ff46beff"];

export const lineStyles: LineStyle[] = [
  {
    id: 1,
    name: "Curve line",
    value: "curve-line",
  },
  {
    id: 2,
    name: "Zigzag line",
    value: "zigzag-line",
  },
  {
    id: 3,
    name: "Highlight line",
    value: "highlight-line",
  },
  {
    id: 4,
    name: "Area",
    value: "area",
  },
];
