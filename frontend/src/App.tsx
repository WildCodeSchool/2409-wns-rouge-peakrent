import { gql, useQuery } from "@apollo/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Components
import { ProductForm } from "./components/forms/ProductForm";
import { UserProvider } from "./context/userProvider";
import { WHOAMI } from "./GraphQL/whoami";
import { AdminActivitiesPage } from "./pages/Admin/Activities/AdminActivitiesPage";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminCartsPage } from "./pages/Admin/Carts/AdminCartsPage";
import { AdminCategoriesPage } from "./pages/Admin/Categories/AdminCategoriesPage";
import { AdminOrdersPage } from "./pages/Admin/Orders/AdminOrdersPage";
import { AdminProductsPage } from "./pages/Admin/Products/AdminProductsPage";
import { AdminStoresPage } from "./pages/Admin/Stores/AdminStoresPage";
import { AdminUsersPage } from "./pages/Admin/Users/AdminUsersPage";
import { SignInPage } from "./pages/Auth/SignIn";
import { SignUpPage } from "./pages/Auth/SignUp";
import { CartCheckout } from "./pages/Cart/CartCheckout";
import { CartPage } from "./pages/Cart/CartPage";
import { HomePage } from "./pages/Home/HomePage";
import AdminLayout from "./pages/Layout/Admin/AdminLayout";
import PageLayout from "./pages/Layout/PageLayout";
import PageNotFound from "./pages/NotFound/PageNotFound";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import ProductsPage from "./pages/ProductsPage/ProductsPage";

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
    const { data: whoamiData, loading } = useQuery(gql(WHOAMI));
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
          <Route path="/" element={<PageLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="/signin"
              element={checkAuth(SignInPage, [AuthStates.unauthenticated])()}
            />
            <Route
              path="/signup"
              element={checkAuth(SignUpPage, [AuthStates.unauthenticated])()}
            />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="products" element={<ProductsPage />} />

            {/* User Connected Routes */}
            <Route path="cart" element={<CartPage />} />
            <Route path="cart/checkout" element={<CartCheckout />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={checkAuth(AdminLayout, [AuthStates.isAdmin])()}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="activities" element={<AdminActivitiesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="stores" element={<AdminStoresPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="products/create" element={<ProductForm />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="carts" element={<AdminCartsPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
