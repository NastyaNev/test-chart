import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Content />
    </div>
  );
}

export default App;
