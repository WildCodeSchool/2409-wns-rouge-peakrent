import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";

const PageLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PageLayout;
