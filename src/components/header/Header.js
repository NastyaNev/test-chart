import styles from "./Header.module.scss";
import Switcher from "@/components/UI/switcher/Switcher";
import { useTheme } from "@/hooks/useTheme";

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
      <header className={styles.header}>
        <Switcher isChecked={theme === "dark"} toggle={toggleTheme} />
      </header>
  );
}

export default Header;
