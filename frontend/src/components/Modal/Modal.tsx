import { GoPlus } from "react-icons/go";
import Button from "../../UI/Button/Button";
import styles from "./Modal.module.scss";

type Props = {
  title: string;
  toCloseButton: (state: boolean) => void;
};

const Modal = ({ title, toCloseButton }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.modalContainer}>
        <p>
          L'annonce :<span>{title}</span>a bien été supprimé !
        </p>
        <Button onClick={() => toCloseButton(false)} design="QUATERNARY">
          <GoPlus size={27} style={{ transform: "rotate(-45deg)" }} />
        </Button>
      </div>
    </div>
  );
};

export default Modal;
