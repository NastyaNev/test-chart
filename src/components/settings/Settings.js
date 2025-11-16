import { useState, useEffect, useMemo, useRef } from "react";
import Button from "../UI/button/Button";
import Dropdown from "../UI/dropdown/Dropdown";
import DropdownMenu from "../UI/dropdown-menu/DropdownMenu";
import DateRangePicker from "../UI/date-range-picker/DateRangePicker";
import styles from "./Settings.module.scss";
import * as svg from "../UI/Icons";
import {
  LINE_STYLES,
  COLOR_PALETTE,
} from "../../utils/constants/chartConstants";
import { data } from "../chart/data";

function Settings({ zoomLevel, setZoomLevel }) {
  const variations = useMemo(() => {
    const allOption = {
      id: "all",
      name: "All variations selected",
    };
    const processedVariations = data.variations.map((v) => ({
      ...v,
      id: v.id ?? 0,
    }));
    return [allOption, ...processedVariations];
  }, []);

  // Extract available dates from data
  const availableDates = useMemo(() => {
    return data.data.map((item) => item.date);
  }, []);

  // Initialize with first and last date
  const [dateRange, setDateRange] = useState(() => {
    if (availableDates.length > 0) {
      return {
        start: availableDates[0],
        end: availableDates[availableDates.length - 1],
      };
    }
    return { start: null, end: null };
  });

  const [selectedVariations, setSelectedVariations] = useState([variations[0]]);
  const [selectedLineStyle, setSelectedLineStyle] = useState(LINE_STYLES[0]);
  const [showVariationsMenu, setShowVariationsMenu] = useState(false);
  const [showLineStyleMenu, setShowLineStyleMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Refs for click outside detection
  const variationsRef = useRef(null);
  const datePickerRef = useRef(null);
  const lineStyleRef = useRef(null);

  // Initialize state from URL params only once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let needsUpdate = false;

    const variationIds = params.get("filter[variation]");
    if (variationIds) {
      const ids = variationIds.split(',');
      const selectedVars = variations.filter((v) => ids.includes(String(v.id)));
      if (selectedVars.length > 0) {
        setSelectedVariations(selectedVars);
      } else {
        setSelectedVariations([variations[0]]);
        params.set("filter[variation]", variations[0].id);
        needsUpdate = true;
      }
    } else {
      params.set("filter[variation]", variations[0].id);
      needsUpdate = true;
    }

    const styleId = params.get("filter[style]");
    if (styleId) {
      const style = LINE_STYLES.find((s) => String(s.id) === styleId);
      if (style) setSelectedLineStyle(style);
    } else {
      params.set("filter[style]", LINE_STYLES[0].id);
      needsUpdate = true;
    }

    const dateStart = params.get("filter[dateStart]");
    const dateEnd = params.get("filter[dateEnd]");
    if (dateStart && dateEnd) {
      setDateRange({ start: dateStart, end: dateEnd });
    } else if (availableDates.length > 0) {
      params.set("filter[dateStart]", availableDates[0]);
      params.set("filter[dateEnd]", availableDates[availableDates.length - 1]);
      needsUpdate = true;
    }

    // Zoom is not stored in URL anymore - will reset on page refresh

    if (needsUpdate) {
      const url = new URL(window.location);
      url.search = params.toString();
      window.history.replaceState({}, "", url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle click outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check variations menu
      if (
        showVariationsMenu &&
        variationsRef.current &&
        !variationsRef.current.contains(event.target)
      ) {
        setShowVariationsMenu(false);
      }

      // Check date picker
      if (
        showDatePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }

      // Check line style menu
      if (
        showLineStyleMenu &&
        lineStyleRef.current &&
        !lineStyleRef.current.contains(event.target)
      ) {
        setShowLineStyleMenu(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVariationsMenu, showDatePicker, showLineStyleMenu]);

  const updateURLParam = (key, value) => {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
  };

  const handleVariationSelect = (variation) => {
    let newSelectedVariations;

    if (variation.id === "all") {
      // If "All variations" is selected, select only it
      newSelectedVariations = [variation];
      setShowVariationsMenu(false);
    } else {
      // Check if this variation is already selected
      const isAlreadySelected = selectedVariations.some(v => v.id === variation.id);

      if (isAlreadySelected) {
        // Deselect this variation
        newSelectedVariations = selectedVariations.filter(v => v.id !== variation.id);

        // If nothing is selected, default to "All variations"
        if (newSelectedVariations.length === 0) {
          newSelectedVariations = [variations[0]]; // "All variations"
          setShowVariationsMenu(false);
        }
      } else {
        // Add this variation to selection
        // Remove "All variations" if it's currently selected
        const withoutAll = selectedVariations.filter(v => v.id !== "all");
        newSelectedVariations = [...withoutAll, variation];
      }
    }

    setSelectedVariations(newSelectedVariations);
    const variationIds = newSelectedVariations.map(v => v.id).join(',');
    updateURLParam("filter[variation]", variationIds);
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
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.2, 0.5); // Min zoom 0.5x
    setZoomLevel(newZoom);
  };

  const handleZoomReset = () => {
    setZoomLevel(1); // Reset to default zoom
  };

  const handleRefresh = () => {
    // Reset all filters to default values
    setSelectedVariations([variations[0]]); // "All variations selected"
    setSelectedLineStyle(LINE_STYLES[0]); // First line style
    setZoomLevel(1); // Default zoom

    // Reset date range to full range
    if (availableDates.length > 0) {
      setDateRange({
        start: availableDates[0],
        end: availableDates[availableDates.length - 1],
      });
    }

    // Update all URL parameters
    const url = new URL(window.location);
    url.searchParams.set("filter[variation]", variations[0].id);
    url.searchParams.set("filter[style]", LINE_STYLES[0].id);
    url.searchParams.set("filter[dateStart]", availableDates[0]);
    url.searchParams.set(
      "filter[dateEnd]",
      availableDates[availableDates.length - 1]
    );
    window.history.pushState({}, "", url);
  };

  const handleDownload = () => {
    // Find the canvas element of the chart
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      console.error("Chart canvas not found");
      return;
    }

    // Convert canvas to data URL (PNG format)
    const url = canvas.toDataURL("image/png");

    // Create a temporary link element
    const link = document.createElement("a");

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
    link.download = `chart_${dateStr}_${timeStr}.png`;

    // Set the URL and trigger download
    link.href = url;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  // Format date from YYYY-MM-DD to DD/MM/YY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  // Format date range display
  const dateRangeDisplay = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return "Select date range";
    return `${formatDate(dateRange.start)}-${formatDate(dateRange.end)}`;
  }, [dateRange]);

  // Check if single date is selected
  const isSingleDate = useMemo(() => {
    return (
      dateRange.start && dateRange.end && dateRange.start === dateRange.end
    );
  }, [dateRange]);

  // Get display value for variations dropdown
  const variationsDisplayValue = useMemo(() => {
    if (selectedVariations.length === 1 && selectedVariations[0].id === "all") {
      return selectedVariations[0].name;
    }
    if (selectedVariations.length === 1) {
      return selectedVariations[0].name;
    }
    return `${selectedVariations.length} variations selected`;
  }, [selectedVariations]);

  const variationMenuItems = variations.map((variation, index) => ({
    label: variation.name,
    color: variation.id === "all" ? null : COLOR_PALETTE[index - 1],
    onClick: () => handleVariationSelect(variation),
    isSelected: selectedVariations.some(v => v.id === variation.id),
    isCheckbox: variation.id !== "all",
  }));

  const lineStyleMenuItems = LINE_STYLES.map((style) => ({
    label: style.name,
    onClick: () => handleLineStyleSelect(style),
  }));

  return (
    <div className={styles.settings}>
      <menu className={styles.settings__data_chart}>
        <li ref={variationsRef} style={{ position: "relative" }}>
          <Dropdown
            type="button"
            id="dropdown-variations"
            className={styles.settings__data_chart__drd_vars}
            value={variationsDisplayValue}
            onClick={() => setShowVariationsMenu(!showVariationsMenu)}
            isOpen={showVariationsMenu}
          />
          {showVariationsMenu && (
            <DropdownMenu
              items={variationMenuItems}
              showDots={true}
              className={styles.dropdownMenuVariations}
              multiSelect={true}
            />
          )}
        </li>
        <li ref={datePickerRef} style={{ position: "relative" }}>
          <Dropdown
            type="button"
            id="dropdown-date"
            value={dateRangeDisplay}
            onClick={() => setShowDatePicker(!showDatePicker)}
            isOpen={showDatePicker}
          />
          {showDatePicker && (
            <DateRangePicker
              availableDates={availableDates}
              onRangeSelect={handleDateRangeSelect}
              className={styles.dropdownMenuDate}
              selectedStartDate={dateRange.start}
              selectedEndDate={dateRange.end}
            />
          )}
        </li>
      </menu>
      <menu className={styles.settings__tools}>
        <li ref={lineStyleRef} style={{ position: "relative" }}>
          <Dropdown
            id="dropdown-line"
            value={`Style: ${selectedLineStyle.name.toLowerCase()}`}
            onClick={() => setShowLineStyleMenu(!showLineStyleMenu)}
            disabled={isSingleDate}
            isOpen={showLineStyleMenu}
          />
          {showLineStyleMenu && !isSingleDate && (
            <DropdownMenu
              items={lineStyleMenuItems}
              showDots={false}
              className={styles.dropdownMenuLineStyle}
              selectedLabel={selectedLineStyle.name}
            />
          )}
        </li>
        <div className={styles.settings__tools__buttons}>
          <li>
            <Button icon={<svg.Select />} onClick={handleZoomReset} title="Reset Zoom" disabled={zoomLevel === 1} />
          </li>
          <li className={styles.settings__tools__zoom}>
            <Button icon={<svg.Minus />} onClick={handleZoomOut} title="Zoom In" />
            <Button icon={<svg.Plus />} onClick={handleZoomIn} title="Zoom Out" />
          </li>
          <li className={styles.settings__tools__no_frame_btn}>
            <Button icon={<svg.Refresh />} onClick={handleRefresh} title="Refresh" />
          </li>
          <li className={styles.settings__tools__no_frame_btn}>
            <Button icon={<svg.Download />} onClick={handleDownload} title="Download PNG" />
          </li>
        </div>
      </menu>
    </div>
  );
}

export default Settings;
