import styles from "./DropdownMenu.module.scss";

function DropdownMenu({ items = [], showDots = true, className, selectedLabel }) {
  // Prevent click events from bubbling up to document
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={[styles.dropdownMenu, className].filter(Boolean).join(" ")}
      onMouseDown={handleContainerClick}
    >
      {items.map((item, index) => {
        const isSelected = selectedLabel && item.label === selectedLabel;
        return (
          <div
            key={index}
            className={[
              styles.dropdownMenu__item,
              isSelected && styles.dropdownMenu__item_selected
            ].filter(Boolean).join(" ")}
            onClick={item.onClick}
          >
            <div className={styles.dropdownMenu__content}>
              {showDots && item.color && (
                <span
                  className={styles.dropdownMenu__dot}
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className={styles.dropdownMenu__label}>{item.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DropdownMenu;
