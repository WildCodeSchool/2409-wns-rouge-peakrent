import { gql, useQuery } from "@apollo/client";
import { Navigate, Route, Routes, ScrollRestoration } from "react-router-dom";

// Components
import { ProductForm } from "./components/forms/ProductForm";
import { UserProvider } from "./context/userProvider";
import { WHOAMI } from "./graphQL/whoami";
import ActivitiesPage from "./pages/ActivitiesPage/ActivitiesPage";
import ActivityDetail from "./pages/ActivityDetail/ActivityDetail";
import { AdminActivitiesPage } from "./pages/Admin/Activities/AdminActivitiesPage";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminCartsPage } from "./pages/Admin/Carts/AdminCartsPage";
import { AdminCategoriesPage } from "./pages/Admin/Categories/AdminCategoriesPage";
import { AdminOrdersPage } from "./pages/Admin/Orders/AdminOrdersPage";
import { NewOrderPage } from "./pages/Admin/Orders/New/NewOrderPage";
import AdminOrderByIdPage from "./pages/Admin/Orders/ref/AdminOrderByRefPage";
import { AdminProductsPage } from "./pages/Admin/Products/AdminProductsPage";
import { AdminStoresPage } from "./pages/Admin/Stores/AdminStoresPage";
import { AdminUsersPage } from "./pages/Admin/Users/AdminUsersPage";
import { AdminVouchersPage } from "./pages/Admin/Vouchers/AdminVouchersPage";
import { ConfirmEmailPage } from "./pages/Auth/ConfirmEmail";
import { ConfirmNewEmailPage } from "./pages/Auth/ConfirmNewEmail";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPassword";
import { RecoverPasswordPage } from "./pages/Auth/RecoverPassword";
import { SignInPage } from "./pages/Auth/SignIn";
import { SignUpPage } from "./pages/Auth/SignUp";
import { CartCheckout } from "./pages/Cart/CartCheckout";
import { CartPage } from "./pages/Cart/CartPage";
import { CartPayment } from "./pages/Cart/CartPayment";
import { CartRecap } from "./pages/Cart/CartRecap";
import { HomePage } from "./pages/Home/HomePage";
import AdminLayout from "./pages/Layout/Admin/AdminLayout";
import CartLayout from "./pages/Layout/Cart/CartLayout";
import StripeLayout from "./pages/Layout/Cart/StripeLayout";
import PageLayout from "./pages/Layout/PageLayout";
import PageNotFound from "./pages/NotFound/PageNotFound";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import OrderDetailsPage from "./pages/Profile/OrderDetailsPage";
import ProfileDashboard from "./pages/Profile/ProfileDashboard";
import ProfileEditPage from "./pages/Profile/ProfileEditPage";

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
      <ScrollRestoration />
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
          <Route
            path="/forgot-password"
            element={checkAuth(ForgotPasswordPage, [
              AuthStates.unauthenticated,
            ])()}
          />
          <Route
            path="/reset-password"
            element={checkAuth(RecoverPasswordPage, [
              AuthStates.unauthenticated,
            ])()}
          />
          <Route
            path="/validate-email"
            element={checkAuth(ConfirmEmailPage, [
              AuthStates.unauthenticated,
            ])()}
          />
          <Route path="/confirm-new-email" element={<ConfirmNewEmailPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route
            path="activities/:normalizedName"
            element={<ActivityDetail />}
          />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products" element={<ProductsPage />} />

          {/* User Connected Routes */}
          <Route
            path="/cart"
            element={checkAuth(CartLayout, [AuthStates.authenticated])()}
          >
            <Route index element={<CartPage />} />
            <Route path="checkout" element={<CartCheckout />} />
            <Route element={<StripeLayout />}>
              <Route path="checkout/payment" element={<CartPayment />} />
            </Route>
            <Route path="recap/:ref" element={<CartRecap />} />
          </Route>

          <Route
            path="profile"
            element={checkAuth(ProfileDashboard, [AuthStates.authenticated])()}
          />
          <Route
            path="profile/edit"
            element={checkAuth(ProfileEditPage, [AuthStates.authenticated])()}
          />
          <Route
            path="profile/order/:ref"
            element={checkAuth(OrderDetailsPage, [AuthStates.authenticated])()}
          />
          <Route path="*" element={<PageNotFound />} />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={checkAuth(AdminLayout, [AuthStates.isAdmin])()}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="activities" element={<AdminActivitiesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/new" element={<NewOrderPage />} />
            <Route path="orders/:ref" element={<AdminOrderByIdPage />} />
            <Route path="stores" element={<AdminStoresPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="products/create" element={<ProductForm />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="vouchers" element={<AdminVouchersPage />} />
            <Route path="carts" element={<AdminCartsPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
