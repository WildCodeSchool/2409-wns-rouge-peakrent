import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { ProductCard } from "../cards/ProductCard";
import { Button } from "../ui/button";

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
      <div className="flex flex-row items-center justify-between">
        <h2>{title}</h2>
        <div className="flex flex-row items-center justify-center gap-2.5">
          <p className="text-center text-[15px]">Produits par pages :</p>
          <select
            name="itemsOnPage"
            onChange={(event) => setItemsOnPage(Number(event.target.value))}
            value={itemsOnPage}
            className="border-none text-[16px] px-[10px] pl-[5px] text-primary"
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
        </div>
      </div>

      <section className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 auto-rows-min items-start">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </section>

      <div className="flex justify-center items-center gap-5 pt-8">
        <Button
          onClick={() => pageIndex > 1 && setPageIndex(pageIndex - 1)}
          disabled={pageIndex <= 1}
        >
          <MdKeyboardArrowLeft size={20} />
        </Button>
        <span>
          {pageIndex} / {maxPage}
        </span>
        <Button
          onClick={() => pageIndex < maxPage && setPageIndex(pageIndex + 1)}
          disabled={pageIndex >= maxPage}
        >
          <MdKeyboardArrowRight size={20} />
        </Button>
      </div>
    </>
  );
};

export default ProductsList;
