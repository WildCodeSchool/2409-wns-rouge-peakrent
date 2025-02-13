import { Link } from "react-router-dom";
import { AdType } from "../../types/types";
import styles from "./AdCard.module.scss";
import Button from "../../UI/Button/Button";

type Props = {
  ad: AdType;
};

const Ad = ({ ad }: Props) => {
  return (
    <article className={styles.adCardContainer}>
      <Link
        to={`/ads/${ad.id}`}
        state={ad}
        className={styles.adCardLink}
        key={ad.id}
      >
        <img className={styles.adCardImage} src={ad.picture} />
        <div className={styles.adCardText}>
          <div className={styles.adCardTitle}>{ad.title}</div>
          <div className={styles.adCardPrice}>
            {(ad.price / 100).toFixed(2)} €
          </div>
        </div>
      </Link>
      <Button children={"Ajouter au panier"} design="PRIMARY" />
    </article>
  );
};

export default Ad;
