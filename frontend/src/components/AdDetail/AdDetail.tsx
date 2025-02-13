import { Link, useParams } from "react-router-dom";
import styles from "./AdDetail.module.scss";
import Button from "../../UI/Button/Button";
import classNames from "classnames";
import Loading from "../Loading/Loading";
import { useQuery } from "@apollo/client";
import { GET_AD_BY_ID } from "../../GraphQL/ads";
import { Tag } from "../../types/types";

const AdDetail = () => {
  const params = useParams();
  const { data, loading, error } = useQuery(GET_AD_BY_ID, {
    variables: { param: params.id },
  });

  const ad = data?.getAdById;

  if (error) {
    console.log(error);
    return <div>Impossible de charger l'annonce.</div>;
  }

  return loading ? (
    <Loading />
  ) : (
    <article className={styles.adDetailContainer}>
      <div className={styles.adDetailHeader}>
        <div className={styles.adDetailTitle}>
          <p> {ad.title}</p>
          <p>{ad.author}</p>
        </div>
        <Link
          to={`/ads/${ad.id}/edit`}
          className={classNames(styles.linkButton, styles.deleteButton)}
        >
          <Button
            children={
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
            }
            design="SECONDARY"
          />
        </Link>
      </div>
      <div className={styles.adDetailsImageContainer}>
        <img className={styles.adDetailsImage} src={ad.picture} />
      </div>
      <div className={styles.tagsContainer}>
        {ad.tags.map((tag: Tag) => (
          <p className={styles.tag} key={tag.id}>
            {tag.name}
          </p>
        ))}
      </div>
      <div className={styles.adDetailText}>
        <p>{ad.description}</p>
      </div>
      <div className={styles.seller}>
        <p>
          {ad.owner} à {ad.location}
        </p>
        <p className={styles.adDetailPrice}>{(ad.price / 100).toFixed(2)} €</p>
      </div>
      <Button design="PRIMARY" children={"Ajouter au panier"} />
    </article>
  );
};

export default AdDetail;
