import { Link, useParams } from "react-router-dom";
import styles from "./AdDetail.module.scss";
import Button from "../../UI/Button/Button";
import classNames from "classnames";
import Loading from "../Loading/Loading";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../../GraphQL/products";
import { Tag } from "../../types/types";

const ProductDetail = () => {
  const params = useParams();
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { param: params.id },
  });

  const product = data?.getProductById;
  console.log(product);
  // query GetProductById($param: String!) {
  //   getProductById(param: $param) {
  //     name
  //     description
  //     urlImage
  //     isPublished
  //     sku
  //     categories {
  //       name
  //       urlImage
  //       parentCategory {
  //         name
  //         urlImage
  //         parentCategory {
  //           name
  //           urlImage
  //           children {
  //             name
  //             urlImage
  //           }
  //         }
  //       }
  //       children {
  //         name
  //         urlImage
  //         children {
  //           name
  //           urlImage
  //         }
  //       }
  //     }
  //     variants {
  //       id
  //       size
  //       color
  //       pricePerHour
  //     }
  //   }
  // }

  if (error) {
    console.log(error);
    return <div>Impossible de charger l&apos;annonce.</div>;
  }

  return loading ? (
    <Loading />
  ) : (
    <article className={styles.adDetailContainer}>
      <div className={styles.adDetailHeader}>
        <div className={styles.adDetailTitle}>
          <p> {product.name}</p>
        </div>
        <Link
          to={`/products/${product.id}/edit`}
          className={classNames(styles.linkButton, styles.deleteButton)}
        >
          <Button design="SECONDARY">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </Button>
        </Link>
      </div>
      <div className={styles.adDetailsImageContainer}>
        <img className={styles.adDetailsImage} src={product.picture} />
      </div>
      <div className={styles.tagsContainer}>
        {product.variants.map((variant: Tag) => (
          <p className={styles.tag} key={variant.id}>
            {variant.name}
          </p>
        ))}
      </div>
      <div className={styles.adDetailText}>
        <p>{product.description}</p>
      </div>
      <div className={styles.seller}>
        <p>
          {product.owner} {product.location}
        </p>
        <p className={styles.adDetailPrice}>
          {(product.price / 100).toFixed(2)} €
        </p>
      </div>
      <Button design="PRIMARY">Ajouter au panier</Button>
    </article>
  );
};

export default ProductDetail;
