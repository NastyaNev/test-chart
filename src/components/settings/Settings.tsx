import { useEffect, useMemo, useRef } from "react";
import Button from "@/components/UI/button/Button";
import Dropdown from "@/components/UI/dropdown/Dropdown";
import DropdownMenu, { DropdownMenuItem } from "@/components/UI/dropdown-menu/DropdownMenu";
import DateRangePicker from "@/components/UI/date-range-picker/DateRangePicker";
import styles from "./Settings.module.scss";
import * as svg from "@/components/UI/Icons";
import { lineStyles, colorPalette, LineStyle } from "@/utils/constants/chartConstants";
import { Variation, SettingsProps } from "@/types";

interface SettingsComponentProps extends SettingsProps {
  variations: Variation[];
  availableDates: string[];
}

function Settings({ variations, availableDates, ...props }: SettingsComponentProps) {
  const { settingsState, setSettingsState, initState } = props;

  const { selectedVariations, selectedLineStyle, dateRange, zoomLevel } =
    settingsState;

  const dropdownMenuIds = {
    vars: 1,
    date: 2,
    line: 3,
  };

  useEffect(() => {
    if (variations.length === 0 || availableDates.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    let needsUpdate = false;

    const variationIds = params.get("filter[variation]");
    if (variationIds) {
      const ids = variationIds.split(",");
      const selectedVars = variations.filter((v) => ids.includes(String(v.id)));
      if (selectedVars.length > 0) {
        setSettingsState((s) => ({ ...s, selectedVariations: selectedVars }));
      } else {
        setSettingsState((s) => ({
          ...s,
          selectedVariations: [variations[0]],
        }));
        params.set("filter[variation]", String(variations[0].id));
        needsUpdate = true;
      }
    } else {
      params.set("filter[variation]", String(variations[0].id));
      needsUpdate = true;
    }

    const styleId = params.get("filter[style]");
    if (styleId) {
      const style = lineStyles.find((s) => String(s.id) === styleId);
      if (style) setSettingsState((s) => ({ ...s, selectedLineStyle: style }));
    } else {
      params.set("filter[style]", String(lineStyles[0].id));
      needsUpdate = true;
    }

    const dateStart = params.get("filter[dateStart]");
    const dateEnd = params.get("filter[dateEnd]");
    if (dateStart && dateEnd) {
      setSettingsState((s) => ({
        ...s,
        dateRange: { start: dateStart, end: dateEnd },
      }));
    } else if (availableDates.length > 0) {
      params.set("filter[dateStart]", availableDates[0]);
      params.set("filter[dateEnd]", availableDates[availableDates.length - 1]);
      needsUpdate = true;
    }

    if (needsUpdate) {
      const url = new URL(window.location.href);
      url.search = params.toString();
      window.history.replaceState({}, "", url.toString());
    }
  }, [variations, availableDates]);

  const dropdownRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!settingsState.isDropdownOpen) return;

      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node)
      );

      if (isOutside) {
        setSettingsState((s) => ({ ...s, isDropdownOpen: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsState.isDropdownOpen]);

  const updateURLParam = (key: string, value: string | number) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, String(value));
    window.history.pushState({}, "", url.toString());
  };

  const handleVariationSelect = (variation: Variation) => {
    let newSelectedVariations: Variation[];

    if (variation.id === "all") {
      newSelectedVariations = [variation];
      setSettingsState((s) => ({ ...s, isDropdownOpen: dropdownMenuIds.vars }));
    } else {
      const isAlreadySelected = selectedVariations.some(
        (v) => v.id === variation.id
      );

      if (isAlreadySelected) {
        newSelectedVariations = selectedVariations.filter(
          (v) => v.id !== variation.id
        );

        if (newSelectedVariations.length === 0) {
          newSelectedVariations = [variations[0]];
          setSettingsState((s) => ({ ...s, isDropdownOpen: false }));
        }
      } else {
        const withoutAll = selectedVariations.filter((v) => v.id !== "all");
        newSelectedVariations = [...withoutAll, variation];
      }
    }

    setSettingsState((s) => ({
      ...s,
      selectedVariations: newSelectedVariations,
    }));
    const variationIds = newSelectedVariations.map((v) => v.id).join(",");
    updateURLParam("filter[variation]", variationIds);
  };

  const handleLineStyleSelect = (style: LineStyle) => {
    setSettingsState((s) => ({
      ...s,
      selectedLineStyle: style,
      isDropdownOpen: false,
    }));
    updateURLParam("filter[style]", style.id);
  };

  const handleDateRangeSelect = (start: string, end: string) => {
    setSettingsState((s) => ({
      ...s,
      dateRange: { start, end },
      isDropdownOpen: false,
    }));
    updateURLParam("filter[dateStart]", start);
    updateURLParam("filter[dateEnd]", end);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 0.2, 3);
    setSettingsState((s) => ({ ...s, zoomLevel: newZoom }));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.2, 1);
    setSettingsState((s) => ({ ...s, zoomLevel: newZoom }));
  };

  const handleZoomReset = () => {
    setSettingsState((s) => ({ ...s, zoomLevel: initState.zoomLevel }));
  };

  const handleRefresh = () => {
    setSettingsState(initState);

    const url = new URL(window.location.href);
    url.searchParams.set("filter[variation]", String(variations[0].id));
    url.searchParams.set("filter[style]", String(lineStyles[0].id));
    url.searchParams.set("filter[dateStart]", availableDates[0]);
    url.searchParams.set(
      "filter[dateEnd]",
      availableDates[availableDates.length - 1]
    );
    window.history.pushState({}, "", url.toString());
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      console.error("Chart canvas not found");
      return;
    }

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    link.download = `chart_${dateStr}_${timeStr}.png`;

    link.href = url;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const dateRangeDisplay = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return "Select date range";
    return `${formatDate(dateRange.start)}-${formatDate(dateRange.end)}`;
  }, [dateRange]);

  const isSingleDate = useMemo(() => {
    return (
      dateRange.start && dateRange.end && dateRange.start === dateRange.end
    );
  }, [dateRange]);

  const variationsDisplayValue = useMemo(() => {
    if (selectedVariations.length === 1 && selectedVariations[0].id === "all") {
      return selectedVariations[0].name;
    }
    if (selectedVariations.length === 1) {
      return selectedVariations[0].name;
    }
    return `${selectedVariations.length} variations selected`;
  }, [selectedVariations]);

  const variationMenuItems: DropdownMenuItem[] = variations.map((variation, index) => ({
    label: variation.name,
    color: variation.id === "all" ? undefined : colorPalette[index - 1],
    onClick: () => handleVariationSelect(variation),
    isSelected: selectedVariations.some((v) => v.id === variation.id),
    isCheckbox: variation.id !== "all",
  }));

  const lineStyleMenuItems: DropdownMenuItem[] = lineStyles.map((style) => ({
    label: style.name,
    onClick: () => handleLineStyleSelect(style),
  }));

  return (
    <div className={styles.settings}>
      <menu className={styles["settings__data-chart"]}>
        <li ref={(el) => (dropdownRefs.current.vars = el)}>
          <Dropdown
            type="button"
            id="dropdown-variations"
            className={styles["settings__data-chart__drd-vars"]}
            value={variationsDisplayValue}
            onClick={() =>
              setSettingsState((s) => ({
                ...s,
                isDropdownOpen: s.isDropdownOpen ? false : dropdownMenuIds.vars,
              }))
            }
            isOpen={settingsState.isDropdownOpen === dropdownMenuIds.vars}
          />
          {settingsState.isDropdownOpen === dropdownMenuIds.vars && (
            <DropdownMenu
              items={variationMenuItems}
              showDots={true}
              className={styles["settings__data-chart__drd-menu"]}
              multiSelect={true}
            />
          )}
        </li>
        <li ref={(el) => (dropdownRefs.current.date = el)}>
          <Dropdown
            type="button"
            id="dropdown-date"
            value={dateRangeDisplay}
            onClick={() =>
              setSettingsState((s) => ({
                ...s,
                isDropdownOpen: s.isDropdownOpen ? false : dropdownMenuIds.date,
              }))
            }
            isOpen={settingsState.isDropdownOpen === dropdownMenuIds.date}
          />
          {settingsState.isDropdownOpen === dropdownMenuIds.date && (
            <DateRangePicker
              availableDates={availableDates}
              onRangeSelect={handleDateRangeSelect}
              className={styles["settings__data-chart__drd-menu"]}
              selectedStartDate={dateRange.start}
              selectedEndDate={dateRange.end}
            />
          )}
        </li>
      </menu>
      <menu className={styles.settings__tools}>
        <li ref={(el) => (dropdownRefs.current.line = el)}>
          <Dropdown
            id="dropdown-line"
            value={`Style: ${selectedLineStyle.name.toLowerCase()}`}
            onClick={() =>
              setSettingsState((s) => ({
                ...s,
                isDropdownOpen: s.isDropdownOpen ? false : dropdownMenuIds.line,
              }))
            }
            disabled={isSingleDate}
            isOpen={settingsState.isDropdownOpen === dropdownMenuIds.line}
          />
          {settingsState.isDropdownOpen === dropdownMenuIds.line &&
            !isSingleDate && (
              <DropdownMenu
                items={lineStyleMenuItems}
                showDots={false}
                className={styles["settings__data-chart__drd-menu"]}
                selectedLabel={selectedLineStyle.name}
              />
            )}
        </li>
        <div className={styles.settings__tools__buttons}>
          <li>
            <Button
              icon={<svg.Select />}
              onClick={handleZoomReset}
              title="Reset Zoom"
              disabled={zoomLevel === initState.zoomLevel}
            />
          </li>
          <li className={styles.settings__tools__zoom}>
            <Button
              icon={<svg.Minus />}
              onClick={handleZoomOut}
              title="Zoom In"
            />
            <Button
              icon={<svg.Plus />}
              onClick={handleZoomIn}
              title="Zoom Out"
            />
          </li>
          <li className={styles["settings__tools__no-frame-btn"]}>
            <Button
              icon={<svg.Refresh />}
              onClick={handleRefresh}
              title="Refresh"
            />
          </li>
          <li className={styles["settings__tools__no-frame-btn"]}>
            <Button
              icon={<svg.Download />}
              onClick={handleDownload}
              title="Download PNG"
            />
          </li>
        </div>
      </menu>
    </div>
  );
}

export default Settings;
