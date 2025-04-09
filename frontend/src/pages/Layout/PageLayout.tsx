import Footer from "@/components/Footer/Footer";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";

const PageLayout = () => {
  return (
    <>
      <Header />
      <main className="mt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PageLayout;
