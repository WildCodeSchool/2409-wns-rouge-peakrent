import { useQuery } from "@apollo/client";
import classNames from "classnames";
import { debounce } from "lodash";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { GET_PRODUCTS_AND_CATEGORIES } from "../../GraphQL/search";
import { AdType, Category } from "../../types/types";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const handleSearchTermChange = debounce((term: string) => {
    setDebouncedSearchTerm(term);
  }, 200);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
    handleSearchTermChange(event.target.value);
  };

  const { data } = useQuery(GET_PRODUCTS_AND_CATEGORIES, {
    variables: { searchTerm },
    skip: debouncedSearchTerm === "",
  });

  const searchResults = data?.getProductsAndCategories;

  return (
    <>
      <form className="flex justify-center md:justify-normal grow-1">
        <div className="w-50 md:w-80">
          <input
            aria-label="Search for a book or tag"
            type="search"
            value={searchTerm}
            onChange={(event) => {
              onInputChange(event);
            }}
            className="p-2 border-1 rounded-s border-black text-xs font-inherit w-50 md:w-80"
          />
          {searchTerm && searchResults && (
            <ul
              className={classNames(
                "w-full absolute top-6 right-0 max-h-[400px] bg-white border-2 rounded-b-lg overflow-y-auto p-0",
                {
                  hidden: !searchResults,
                }
              )}
            >
              {searchResults?.products.map((product: AdType) => (
                <li key={product.id}>
                  <Link to={`/products/${product.id}`}>{product.title}</Link>
                </li>
              ))}
              {searchResults?.categories.map((categorie: Category) => (
                <li key={categorie.id}>
                  <Link to={`/categories/${categorie.id}`}>
                    {categorie.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-1 border-black text-xs font-inherit border-l-0">
          <CiSearch size={30} />
        </div>
      </form>
    </>
  );
};

export default SearchBar;
