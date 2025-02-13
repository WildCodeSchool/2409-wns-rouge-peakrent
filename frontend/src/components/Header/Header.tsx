import classNames from "classnames";
import styles from "./Header.module.scss";
import { Category } from "../../types/types";
import { Link } from "react-router-dom";
import Button from "../../UI/Button/Button";
import SearchBar from "../SearchBar/SearchBar";
import { CiShoppingCart, CiLogin, CiLogout } from "react-icons/ci";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "../../GraphQL/categories";
import Loading from "../Loading/Loading";
import { WHOAMI } from "../../GraphQL/whoami";
import { SIGNOUT } from "../../GraphQL/signout";

const Header = () => {
  const {
    loading,
    data: categoryData,
    error,
  } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES);
  const categories = categoryData?.getCategories;

  const { data: whoamiData } = useQuery(WHOAMI);
  const me = whoamiData?.whoami;

  const [doSignout] = useMutation(SIGNOUT, { refetchQueries: [WHOAMI] });

  const onSignout = async () => {
    doSignout();
  };

  if (error) {
    console.log(error);
    return <div>Impossible de charger les catégories.</div>;
  }

  if (loading) return <Loading />;

  console.log("me =>", me);

  return (
    <header className={styles.header}>
      <div className={styles.mainMenu}>
        <Link
          to={"/"}
          className={classNames(styles.button, styles.logo, styles.linkButton)}
          aria-label={"Navigate to home page"}
        >
          <h1 className={styles.label}>PeakRent</h1>
        </Link>
        <SearchBar />
        <Link
          to={"/cart"}
          className={styles.linkButton}
          aria-label={"Navigate to cart page"}
        >
          <Button design="QUATERNARY">
            <CiShoppingCart size={30} />
          </Button>
        </Link>

        {me ? (
          <>
            <Link
              to={"/post-ad"}
              className={styles.linkButton}
              aria-label={"Navigate to create an ad page"}
            >
              <Button children={"Publier"} />
            </Link>
            <Button design="SECONDARY" onClick={onSignout}>
              <CiLogout size={20} />
            </Button>
          </>
        ) : (
          <Link
            to={"/signin"}
            className={styles.linkButton}
            aria-label={"Navigate to admin page"}
          >
            <Button design="SECONDARY">
              <CiLogin size={20} />
            </Button>
          </Link>
        )}

        {/* <Link
          to={"/admin"}
          className={styles.linkButton}
          aria-label={"Navigate to admin page"}
        >
          <Button design="SECONDARY">
            <LuCrown size={20} />
          </Button>
        </Link> */}
      </div>
      <nav className={styles.categoriesNavigation}>
        {categories &&
          categories.map((category) => (
            <Link
              to={`categories/${category.id}`}
              className={styles.categoryNavigationLink}
              key={category.id}
              aria-label={`Navigate to ${category.name}`}
            >
              <span>{category.name}</span>
            </Link>
          ))}
      </nav>
    </header>
  );
};

export default Header;
