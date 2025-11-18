import { LineStyle } from "@/utils/constants/chartConstants";

export interface Variation {
  id: number | string;
  name: string;
}

export interface DataItem {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface APIData {
  variations: Variation[];
  data: DataItem[];
}

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface SettingsState {
  selectedVariations: Variation[];
  selectedLineStyle: LineStyle;
  dateRange: DateRange;
  isDropdownOpen: number | false;
  zoomLevel: number;
}

export interface SettingsProps {
  settingsState: SettingsState;
  setSettingsState: React.Dispatch<React.SetStateAction<SettingsState>>;
  initState: SettingsState;
}
