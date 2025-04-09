// 3G = 2.1min
import { useEffect, useState } from "react";
import AdsList from "../AdsList/AdsList";
import Loading from "../Loading/Loading";
import { useQuery } from "@apollo/client";
import { GET_MINIMAL_PRODUCTS_WITH_PAGING } from "../../GraphQL/products";
import { useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";

const RecentAds = () => {
  const location = useLocation();

  const [itemsOnPage, setItemsOnPage] = useState(15);
  const [pageIndex, setPageIndex] = useState(1);
  const [maxPage, setMaxPage] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_MINIMAL_PRODUCTS_WITH_PAGING, {
    variables: { onPage: itemsOnPage, page: pageIndex },
  });

  useEffect(() => {
    if (location.state?.title) {
      setIsModalOpen(true);
      console.log(location.state.title);
    }
    if (data?.getProducts.pagination.totalPages) {
      setMaxPage(data.getProducts.pagination.totalPages);
    }
  }, [data, location.state?.title]);

  if (error) {
    console.log(error);
    return <div>Impossible de charger les annonces récentes.</div>;
  }
  console.log(data?.getProducts);

  return loading ? (
    <Loading />
  ) : (
    maxPage && (
      <>
        {isModalOpen === true && (
          <Modal title={location.state.title} toCloseButton={setIsModalOpen} />
        )}
        <AdsList
          title="Annonce Récentes"
          items={data?.getProducts.products}
          itemsOnPage={itemsOnPage}
          setItemsOnPage={setItemsOnPage}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          maxPage={maxPage}
        />
      </>
    )
  );
};

export default RecentAds;
