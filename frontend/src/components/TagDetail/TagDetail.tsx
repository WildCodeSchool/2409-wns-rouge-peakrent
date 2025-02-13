import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdsList from "../AdsList/AdsList";
import Loading from "../Loading/Loading";
import { useQuery } from "@apollo/client";
import { GET_ALL_ADS_THAT_HAVE_TAG } from "../../GraphQL/tags";

const TagDetail = () => {
  const [itemsOnPage, setItemsOnPage] = useState(15);
  const [pageIndex, setPageIndex] = useState(1);
  const [maxPage, setMaxPage] = useState<number>();
  const params = useParams<{ id: string }>();

  const { data, loading, error } = useQuery(GET_ALL_ADS_THAT_HAVE_TAG, {
    variables: { param: params.id, onPage: itemsOnPage, page: pageIndex },
  });

  const tag = data?.getTagById.tag;
  const ads = data?.getTagById.ads;

  useEffect(() => {
    if (data?.getTagById.pagination.totalPages) {
      setMaxPage(data.getTagById.pagination.totalPages);
    }
  }, [data]);

  if (error) {
    console.log(error);
    return <div>Impossible de charger les annonces.</div>;
  }

  return loading ? (
    <Loading />
  ) : (
    maxPage && tag && (
      <AdsList
        title={tag.name}
        items={ads}
        itemsOnPage={itemsOnPage}
        setItemsOnPage={setItemsOnPage}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        maxPage={maxPage}
      />
    )
  );
};

export default TagDetail;
