import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "../cards/ProductCard";
import { Button } from "../ui/button";
import { Title } from "../ui/title";

type PropsType = {
  title: string;
  items: any[];
  itemsOnPage: number;
  setItemsOnPage: (newItemsOnPage: number) => void;
  pageIndex: number;
  setPageIndex: (newPageIndex: number) => void;
  maxPage: number;
};

const ProductsList = ({
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
      <div className="flex flex-row items-center justify-between md:mt-4">
        <Title text={title} className="mb-4" />
        <div className="flex flex-row items-center justify-center gap-2.5">
          <p className="text-center text-[15px]">Produits par pages :</p>
          <select
            aria-label="Nombre de produits par page"
            name="itemsOnPage"
            onChange={(event) => {
              const next = Number(event.target.value);
              setItemsOnPage(next);
              setPageIndex(1);
            }}
            value={itemsOnPage}
            className="border-none text-[16px] px-[10px] pl-[5px] text-primary"
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
        </div>
      </div>

      <section
        className="
    grid gap-4 auto-rows-min items-start
    grid-cols-1 justify-items-center
    sm:[grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]
  "
        aria-label="Liste des produits"
      >
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </section>

      <div className="flex justify-center items-center gap-5 pt-8">
        <Button
          onClick={() => pageIndex > 1 && setPageIndex(pageIndex - 1)}
          disabled={pageIndex <= 1}
          aria-label="Page précédente"
        >
          <ArrowLeft size={20} />
        </Button>
        <span>
          {pageIndex} / {maxPage}
        </span>
        <Button
          onClick={() => pageIndex < maxPage && setPageIndex(pageIndex + 1)}
          disabled={pageIndex >= maxPage}
          aria-label="Page suivante"
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </>
  );
};

export default ProductsList;
