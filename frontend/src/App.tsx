import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
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
import AdminPage from "./pages/Admin/AdminPage";
import { SignInPage } from "./pages/Auth/SignIn";
import { SignUpPage } from "./pages/Auth/SignUp";
import Form from "./pages/Form/Form";
import PageLayout from "./pages/Layout/PageLayout";
import PageNotFound from "./pages/NotFound/PageNotFound";

const client = new ApolloClient({
  // uri: "http://localhost:5050/",
  uri: "/api",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

enum AuthStates {
  authenticated,
  unauthenticated,
}

const checkAuth = (
  Component: React.FC,
  authStates: AuthStates[],
  redirectTo: string = "/"
) => {
  return function renderComponent() {
    const { data: whoamiData } = useQuery(WHOAMI);
    const me = whoamiData?.whoami;

    if (me === undefined) {
      return null;
    }
    if (
      (me === null && authStates.includes(AuthStates.unauthenticated)) ||
      (me && authStates.includes(AuthStates.authenticated))
    ) {
      return <Component />;
    }
    return <Navigate to={redirectTo} replace />;
  };
};

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={PageLayout}>
            <Route index Component={RecentAds} />
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
            <Route path="ads/:id" Component={AdDetail} />
            <Route
              path="ads/:id/edit"
              Component={checkAuth(AdEditForm, [AuthStates.authenticated])}
            />
            <Route path="categories/:id" Component={CategoryDetail} />
            <Route path="tags/:id" Component={TagDetail} />
            <Route
              path="admin"
              Component={checkAuth(AdminPage, [AuthStates.authenticated])}
            />
          </Route>
          <Route path="*" Component={PageNotFound} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
