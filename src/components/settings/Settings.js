import { useState, useEffect, useMemo } from "react";
import Button from "../UI/button/Button";
import Dropdown from "../UI/dropdown/Dropdown";
import DropdownMenu from "../UI/dropdown-menu/DropdownMenu";
import DateRangePicker from "../UI/date-range-picker/DateRangePicker";
import styles from "./Settings.module.scss";
import * as svg from "../UI/Icons";
import { LINE_STYLES, COLOR_PALETTE } from "../../utils/constants/chartConstants";
import { data } from "../chart/data";

function Settings() {
  const variations = useMemo(() => {
    const allOption = {
      id: "all",
      name: "All variations selected",
    };
    const processedVariations = data.variations.map(v => ({
      ...v,
      id: v.id ?? 0
    }));
    return [allOption, ...processedVariations];
  }, []);

  // Extract available dates from data
  const availableDates = useMemo(() => {
    return data.data.map(item => item.date);
  }, []);

  // Initialize with first and last date
  const [dateRange, setDateRange] = useState(() => {
    if (availableDates.length > 0) {
      return {
        start: availableDates[0],
        end: availableDates[availableDates.length - 1]
      };
    }
    return { start: null, end: null };
  });

  const [selectedVariation, setSelectedVariation] = useState(variations[0]);
  const [selectedLineStyle, setSelectedLineStyle] = useState(LINE_STYLES[0]);
  const [showVariationsMenu, setShowVariationsMenu] = useState(false);
  const [showLineStyleMenu, setShowLineStyleMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let needsUpdate = false;

    const variationId = params.get("filter[variation]");
    if (variationId) {
      const variation = variations.find(v => String(v.id) === variationId);
      if (variation) setSelectedVariation(variation);
    } else {
      params.set("filter[variation]", variations[0].id);
      needsUpdate = true;
    }

    const styleId = params.get("filter[style]");
    if (styleId) {
      const style = LINE_STYLES.find(s => String(s.id) === styleId);
      if (style) setSelectedLineStyle(style);
    } else {
      params.set("filter[style]", LINE_STYLES[0].id);
      needsUpdate = true;
    }

    const dateStart = params.get("filter[dateStart]");
    const dateEnd = params.get("filter[dateEnd]");
    if (dateStart && dateEnd) {
      setDateRange({ start: dateStart, end: dateEnd });
    } else if (dateRange.start && dateRange.end) {
      params.set("filter[dateStart]", dateRange.start);
      params.set("filter[dateEnd]", dateRange.end);
      needsUpdate = true;
    }

    if (needsUpdate) {
      const url = new URL(window.location);
      url.search = params.toString();
      window.history.replaceState({}, "", url);
    }
  }, [variations, dateRange]);

  const updateURLParam = (key, value) => {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
  };

  const handleVariationSelect = (variation) => {
    setSelectedVariation(variation);
    setShowVariationsMenu(false);
    updateURLParam("filter[variation]", variation.id);
  };

  const handleLineStyleSelect = (style) => {
    setSelectedLineStyle(style);
    setShowLineStyleMenu(false);
    updateURLParam("filter[style]", style.id);
  };

  const handleDateRangeSelect = (start, end) => {
    setDateRange({ start, end });
    setShowDatePicker(false);
    updateURLParam("filter[dateStart]", start);
    updateURLParam("filter[dateEnd]", end);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.2, 3); // Max zoom 3x
    setZoomLevel(newZoom);
    updateURLParam("zoom", newZoom.toFixed(1));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.2, 0.5); // Min zoom 0.5x
    setZoomLevel(newZoom);
    updateURLParam("zoom", newZoom.toFixed(1));
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Format date range display
  const dateRangeDisplay = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return "Select date range";
    return `${formatDate(dateRange.start)}-${formatDate(dateRange.end)}`;
  }, [dateRange]);

  // Check if single date is selected
  const isSingleDate = useMemo(() => {
    return dateRange.start && dateRange.end && dateRange.start === dateRange.end;
  }, [dateRange]);

  const variationMenuItems = variations.map((variation, index) => ({
    label: variation.name,
    color: variation.id === "all" ? null : COLOR_PALETTE[index - 1],
    onClick: () => handleVariationSelect(variation),
  }));

  const lineStyleMenuItems = LINE_STYLES.map((style) => ({
    label: style.name,
    onClick: () => handleLineStyleSelect(style),
  }));

  return (
    <div className={styles.settings}>
      <menu className={styles.settings__data_chart}>
        <li style={{ position: "relative" }}>
          <Dropdown
            type="button"
            id="dropdown-variations"
            className={styles.settings__data_chart__drd_vars}
            value={selectedVariation.name}
            onClick={() => setShowVariationsMenu(!showVariationsMenu)}
          />
          {showVariationsMenu && (
            <DropdownMenu
              items={variationMenuItems}
              showDots={true}
              className={styles.dropdownMenuVariations}
            />
          )}
        </li>
        <li style={{ position: "relative" }}>
          <Dropdown
            type="button"
            id="dropdown-date"
            value={dateRangeDisplay}
            onClick={() => setShowDatePicker(!showDatePicker)}
          />
          {showDatePicker && (
            <DateRangePicker
              availableDates={availableDates}
              onRangeSelect={handleDateRangeSelect}
              className={styles.dropdownMenuDate}
            />
          )}
        </li>
      </menu>
      <menu className={styles.settings__tools}>
        <li style={{ position: "relative" }}>
          <Dropdown
            id="dropdown-line"
            value={`Style: ${selectedLineStyle.name.toLowerCase()}`}
            onClick={() => setShowLineStyleMenu(!showLineStyleMenu)}
            disabled={isSingleDate}
          />
          {showLineStyleMenu && !isSingleDate && (
            <DropdownMenu
              items={lineStyleMenuItems}
              showDots={false}
              className={styles.dropdownMenuLineStyle}
            />
          )}
        </li>
        <li>
          <Button icon={<svg.Select />} />
        </li>
        <li className={styles.settings__tools__zoom}>
          <Button icon={<svg.Minus />} onClick={handleZoomOut} />
          <Button icon={<svg.Plus />} onClick={handleZoomIn} />
        </li>
        <li className={styles.settings__tools__refresh}>
          <Button icon={<svg.Refresh />} />
        </li>
      </menu>
    </div>
  );
}

export default Settings;
