import { useQuery } from "@apollo/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Styles
import "./styles/App.scss";

// Components
import About from "./components/About/About";
import AdDetail from "./components/AdDetail/AdDetail";
import CategoryDetail from "./components/CategoryDetail/CategoryDetail";
import RecentAds from "./components/RecentAds/RecentAds";
import TagDetail from "./components/TagDetail/TagDetail";
import { WHOAMI } from "./GraphQL/whoami";
import AdEditForm from "./pages/AdEditForm/AdEditForm";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminCategoriesPage } from "./pages/Admin/Categories/AdminCategoriesPage";
import { AdminOrdersPage } from "./pages/Admin/Orders/AdminOrdersPage";
import { AdminProductsPage } from "./pages/Admin/Products/AdminProductsPage";
import { AdminStoresPage } from "./pages/Admin/Stores/AdminStoresPage";
import { SignInPage } from "./pages/Auth/SignIn";
import { SignUpPage } from "./pages/Auth/SignUp";
import Form from "./pages/Form/Form";
import AdminLayout from "./pages/Layout/Admin/AdminLayout";
import PageLayout from "./pages/Layout/PageLayout";
import PageNotFound from "./pages/NotFound/PageNotFound";

enum AuthStates {
  authenticated,
  unauthenticated,
  isAdmin,
}

const checkAuth = (
  Component: React.FC,
  authStates: AuthStates[],
  redirectTo: string = "/"
) => {
  return function renderComponent() {
    const { data: whoamiData, loading } = useQuery(WHOAMI);
    const me = whoamiData?.whoami;

    if (loading) {
      return null;
    }

    const isAdmin = me?.role === "admin";
    const isSuperAdmin = me?.role === "superadmin";
    const isAuthenticated = !!me;

    const hasRequiredAuth = authStates.some((state) => {
      switch (state) {
        case AuthStates.authenticated:
          return isAuthenticated;
        case AuthStates.unauthenticated:
          return !isAuthenticated;
        case AuthStates.isAdmin:
          return isAdmin || isSuperAdmin;
        default:
          return false;
      }
    });

    if (hasRequiredAuth) {
      return <Component />;
    }

    return <Navigate to={redirectTo} replace />;
  };
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<RecentAds />} />
          <Route path="about" element={<About />} />
          <Route
            path="post-ad"
            element={checkAuth(Form, [AuthStates.authenticated])()}
          />
          <Route path="ads/:id" element={<AdDetail />} />
          <Route
            path="ads/:id/edit"
            element={checkAuth(AdEditForm, [AuthStates.authenticated])()}
          />
          <Route path="categories/:id" element={<CategoryDetail />} />
          <Route path="tags/:id" element={<TagDetail />} />
          <Route
            path="/signin"
            element={checkAuth(SignInPage, [AuthStates.unauthenticated])()}
          />
          <Route
            path="/signup"
            element={checkAuth(SignUpPage, [AuthStates.unauthenticated])()}
          />
          <Route
            path="/admin"
            element={checkAuth(AdminLayout, [AuthStates.isAdmin])()}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="stores" element={<AdminStoresPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
