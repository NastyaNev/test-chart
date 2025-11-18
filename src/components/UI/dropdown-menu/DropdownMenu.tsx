import { MouseEvent } from "react";
import styles from "./DropdownMenu.module.scss";

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  color?: string;
  isSelected?: boolean;
  isCheckbox?: boolean;
}

interface DropdownMenuProps {
  items?: DropdownMenuItem[];
  showDots?: boolean;
  className?: string;
  selectedLabel?: string;
  multiSelect?: boolean;
}

function DropdownMenu({
  items = [],
  showDots = true,
  className,
  selectedLabel,
  multiSelect = false,
}: DropdownMenuProps) {
  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className={[styles["dropdown-menu"], className].filter(Boolean).join(" ")}
      onMouseDown={handleContainerClick}
    >
      {items?.map((item, index) => {
        const isSelected = multiSelect
          ? item.isSelected
          : selectedLabel && item.label === selectedLabel;
        return (
          <div
            key={index}
            className={[
              styles["dropdown-menu__item"],
              isSelected && styles["dropdown-menu__item--selected"],
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={item.onClick}
          >
            <div className={styles["dropdown-menu__content"]}>
              {showDots && item.color && (
                <span
                  className={styles["dropdown-menu__dot"]}
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className={styles["dropdown-menu__label"]}>
                {item.label}
              </span>
              {multiSelect && item.isCheckbox && (
                <div className={styles["dropdown-menu__checkbox-wrapper"]}>
                  <div
                    className={[
                      styles["dropdown-menu__checkbox"],
                      isSelected && styles["dropdown-menu__checkbox--checked"],
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isSelected && (
                      <div className={styles["dropdown-menu__checkbox__dot"]} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DropdownMenu;
