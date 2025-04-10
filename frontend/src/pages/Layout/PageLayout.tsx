import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Nav/NavBar";
import NavBarMobile from "@/components/Nav/NavBarMobile";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";

const PageLayout = () => {
  return (
    <>
      <NavBar />
      <main className="mb-10 mx-auto min-h-[calc(100vh-240px)]">
        <Outlet />
      </main>
      <Footer />
      <NavBarMobile />
    </>
  );
};

export default PageLayout;
