import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Nav/NavBar";
import NavBarMobile from "@/components/Nav/NavBarMobile";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <>
      <NavBar />
      <main className="mt-20">
        <Outlet />
      </main>
      <Footer />
      <NavBarMobile />
    </>
  );
};

export default PageLayout;
