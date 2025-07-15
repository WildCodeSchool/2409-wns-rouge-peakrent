import Footer from "@/components/footer/Footer";
import NavBar from "@/components/nav/NavBar";
import NavBarMobile from "@/components/nav/NavBarMobile";
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
