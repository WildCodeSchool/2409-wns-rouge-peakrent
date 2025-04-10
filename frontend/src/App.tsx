import { ApolloProvider, useQuery } from "@apollo/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Styles
import "./styles/App.scss";

// Components
import About from "./components/About/About";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import CategoryDetail from "./components/CategoryDetail/CategoryDetail";
import TagDetail from "./components/TagDetail/TagDetail";
import { WHOAMI } from "./GraphQL/whoami";
import AdEditForm from "./pages/AdEditForm/AdEditForm";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminCartsPage } from "./pages/Admin/Carts/AdminCartsPage";
import { AdminCategoriesPage } from "./pages/Admin/Categories/AdminCategoriesPage";
import { AdminOrdersPage } from "./pages/Admin/Orders/AdminOrdersPage";
import { AdminProductsPage } from "./pages/Admin/Products/AdminProductsPage";
import { AdminStoresPage } from "./pages/Admin/Stores/AdminStoresPage";
import { AdminUsersPage } from "./pages/Admin/Users/AdminUsersPage";
import { SignInPage } from "./pages/Auth/SignIn";
import { SignUpPage } from "./pages/Auth/SignUp";
import Form from "./pages/Form/Form";
import AdminLayout from "./pages/Layout/Admin/AdminLayout";
import { HomePage } from "./pages/Home/HomePage";
import PageLayout from "./pages/Layout/PageLayout";
import PageNotFound from "./pages/NotFound/PageNotFound";
import { UserProvider } from "./context/userContext";

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
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={PageLayout}>
            <Route index Component={HomePage} />
            <Route
              path="/signin"
              Component={checkAuth(SignInPage, [AuthStates.unauthenticated])}
            />
            <Route
              path="/signup"
              Component={checkAuth(SignUpPage, [AuthStates.unauthenticated])}
            />
            <Route path="about" Component={About} />
            <Route
              path="post-ad"
              Component={checkAuth(Form, [AuthStates.authenticated])}
            />
            <Route path="products/:id" Component={ProductDetail} />
            <Route path="ads/:id" Component={AdDetail} />
            <Route
              path="ads/:id/edit"
              Component={checkAuth(AdEditForm, [AuthStates.authenticated])}
            />
            <Route path="categories/:id" Component={CategoryDetail} />
            <Route path="tags/:id" Component={TagDetail} />
            <Route
              path="/admin"
              element={checkAuth(AdminLayout, [AuthStates.isAdmin])()}
            >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="stores" element={<AdminStoresPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="carts" element={<AdminCartsPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          </Route>
          <Route path="*" Component={PageNotFound} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
