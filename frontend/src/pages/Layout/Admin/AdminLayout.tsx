import ButtonBackToLastUrl from "@/components/buttons/ButtonBackToLastUrl";
import BreadcrumbSection from "@/components/section/BreadcrumbSection";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

export default function AdminLayout() {
  return (
    <div className="max-h-[calc(100vh-64px)]  flex">
      <AdminSidebar />
      <main className="admin-layout w-full flex-1 overflow-y-auto p-6">
        <nav className="mb-4 flex items-center gap-4">
          <ButtonBackToLastUrl />
          <BreadcrumbSection homePath="/admin" />
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
