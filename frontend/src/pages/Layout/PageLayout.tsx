import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";

import styles from "./PageLayout.module.scss";

const PageLayout = () => {
  return (
    <>
      <Header />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </>
  );
};

export default PageLayout;
