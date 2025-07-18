import { Category, Product } from "@/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GET_PRODUCTS_AND_CATEGORIES } from "../../graphQL/search";

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

  const { data } = useQuery(gql(GET_PRODUCTS_AND_CATEGORIES), {
    variables: { searchTerm },
    skip: debouncedSearchTerm === "",
  });

  const searchResults = data?.getProductsAndCategories;

  return (
    <>
      <form className="flex justify-center md:justify-normal grow-1 m-1">
        <div className="relative w-50 md:w-80">
          <input
            aria-label="Search for a book or tag"
            type="search"
            value={searchTerm}
            onChange={(event) => {
              onInputChange(event);
            }}
            className="h-10 p-5 border-1 rounded-s border-black font-inherit w-50 md:w-80 border-r-0"
          />
          {searchTerm && searchResults && (
            <ul
              className={classNames(
                "w-full absolute left-0 top-full mt-1 bg-white border-2 overflow-y-auto p-3 z-10 text-sm",
                {
                  hidden: !searchResults,
                }
              )}
            >
              {searchResults?.products.map((product: Product) => (
                <li key={product.id} className="hover:text-primary">
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </li>
              ))}
              {searchResults?.categories.map((categorie: Category) => (
                <li key={categorie.id} className="hover:text-primary">
                  <Link to={`/categories/${categorie.id}`}>
                    {categorie.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-1 border-black text-xs font-inherit border-l-0 h-10 flex justify-center items-center py-5 w-8 rounded-r-md">
          <Search size={20} />
        </div>
      </form>
    </>
  );
};

export default SearchBar;
