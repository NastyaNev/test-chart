import styles from "./Dropdown.module.scss";

function Dropdown({className}) {
  return (
    <>
      <input
        className={[styles.dropdown, className].join(" ")}
        value="hello"
        onClick={() => {}}
        readOnly
        type="button"
        id="dropdown"
        name="dropdown"
      />
    </>
  );
}

export default Dropdown;
