import styles from "./DropdownMenu.module.scss";

function DropdownMenu({ items = [], showDots = true, className }) {
  return (
    <div className={[styles.dropdownMenu, className].filter(Boolean).join(" ")}>
      {items.map((item, index) => (
        <div
          key={index}
          className={styles.dropdownMenu__item}
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
      ))}
    </div>
  );
}

export default DropdownMenu;
