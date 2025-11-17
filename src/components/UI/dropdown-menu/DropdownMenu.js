import styles from "./DropdownMenu.module.scss";

function DropdownMenu({
  items = [],
  showDots = true,
  className,
  selectedLabel,
  multiSelect = false,
}) {
  const handleContainerClick = (e) => {
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
