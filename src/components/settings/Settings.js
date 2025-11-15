import { useState, useEffect, useMemo } from "react";
import Button from "../UI/button/Button";
import Dropdown from "../UI/dropdown/Dropdown";
import DropdownMenu from "../UI/dropdown-menu/DropdownMenu";
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

  const [selectedVariation, setSelectedVariation] = useState(variations[0]);
  const [selectedLineStyle, setSelectedLineStyle] = useState(LINE_STYLES[0]);
  const [showVariationsMenu, setShowVariationsMenu] = useState(false);
  const [showLineStyleMenu, setShowLineStyleMenu] = useState(false);

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

    if (needsUpdate) {
      const url = new URL(window.location);
      url.search = params.toString();
      window.history.replaceState({}, "", url);
    }
  }, [variations]);

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
        <li>
          <Dropdown type="date" id="dropdown-date" />
        </li>
      </menu>
      <menu className={styles.settings__tools}>
        <li style={{ position: "relative" }}>
          <Dropdown
            id="dropdown-line"
            value={`Style: ${selectedLineStyle.name.toLowerCase()}`}
            onClick={() => setShowLineStyleMenu(!showLineStyleMenu)}
          />
          {showLineStyleMenu && (
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
          <Button icon={<svg.Minus />} />
          <Button icon={<svg.Plus />} />
        </li>
        <li className={styles.settings__tools__refresh}>
          <Button icon={<svg.Refresh />} />
        </li>
      </menu>
    </div>
  );
}

export default Settings;
