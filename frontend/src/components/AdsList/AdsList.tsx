import React from "react";
import AdCard from "../AdCard/AdCard";
import styles from "./AdsList.module.scss";
// import LazyLoading from "../LazyLoading/LazyLoading";
// import Pagination from "../Pagination/Pagination";
import { AdType } from "../../types/types";
import Button from "../../UI/Button/Button";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

type PropsType = {
  title: string;
  items: AdType[];
  itemsOnPage: number;
  setItemsOnPage: (newItemsOnPage: number) => void;
  pageIndex: number;
  setPageIndex: (newPageIndex: number) => void;
  maxPage: number;
};

const AdsList = ({
  title,
  items,
  itemsOnPage,
  setItemsOnPage,
  pageIndex,
  setPageIndex,
  maxPage,
}: PropsType) => {
  return (
    <>
      <div className={styles.titleContainer}>
        <h2>{title}</h2>
        <div className={styles.container}>
          <p className={styles.text}>Livres par pages :</p>
          <select
            name="itemsOnPage"
            onChange={(event) => setItemsOnPage(Number(event.target.value))}
            value={itemsOnPage}
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
        </div>
      </div>
      <section className={styles.ads}>
        {items.map((item) => (
          <AdCard key={item.id} ad={item} />
        ))}
      </section>
      <div className={styles.paginationContainer}>
        <Button
          design="QUATERNARY"
          onClick={() => pageIndex > 1 && setPageIndex(pageIndex - 1)}
          disabled={pageIndex <= 1}
        >
          <MdKeyboardArrowLeft size={20} />
        </Button>
        <span>
          {pageIndex} / {maxPage}
        </span>
        <Button
          design="QUATERNARY"
          onClick={() => pageIndex < maxPage && setPageIndex(pageIndex + 1)}
          disabled={pageIndex >= maxPage}
        >
          <MdKeyboardArrowRight size={20} />
        </Button>
      </div>
    </>
  );
};

export default AdsList;
