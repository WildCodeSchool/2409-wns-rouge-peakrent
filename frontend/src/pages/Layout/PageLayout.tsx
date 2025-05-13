import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Nav/NavBar";
import NavBarMobile from "@/components/Nav/NavBarMobile";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <>
      <NavBar />
      <main className="mb-24 md:mb-0 mx-auto min-h-[calc(100vh-240px)]">
        <Outlet />
      </main>
      <Footer />
      <NavBarMobile />
    </>
  );
};

export default PageLayout;
