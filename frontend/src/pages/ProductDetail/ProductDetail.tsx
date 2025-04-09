import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loading from "../../components/Loading/Loading";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../../GraphQL/products";
import { useState } from "react";

const ProductDetail = () => {
  const params = useParams();
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { param: params.id },
  });

  const product = data?.getProductById;
  console.log(selectedVariants);

  if (error) {
    console.log(error);
    return <div>Impossible de charger l&apos;annonce.</div>;
  }

  return loading ? (
    <Loading />
  ) : (
    <article className="space-y-6 p-4 md:p-6 bg-[rgba(107,114,128,0.1)]">
      <div className="flex flex-row items-center justify-between">
        <div className="mt-[15px] text-lg">
          <p className="text-xl font-semibold">{product.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white py-5">
        <img
          src={product.urlImage}
          alt={product.name}
          className="w-1/3 object-contain"
        />
      </div>

      <div className="flex flex-wrap items-center justify-start text-center gap-2 my-2">
        {product.categories.map((category: any) => (
          <p
            className="px-2 py-1 text-white bg-primary border border-black rounded text-sm"
            key={category.id}
          >
            {category.name}
          </p>
        ))}
      </div>

      <div>
        <p className="text-base leading-relaxed">{product.description}</p>
      </div>

      <div className="flex gap-4">
        {product.variants.map((variant: any) => (
          <div key={variant.id}>
            <label
              htmlFor={variant.id}
              className="flex items-center gap-4 border rounded-2xl p-4 shadow hover:shadow-md transition duration-200 cursor-pointer"
            >
              <input
                type="checkbox"
                name="variant"
                value={variant.id}
                checked={selectedVariants.includes(variant.id)}
                onChange={() =>
                  setSelectedVariants((prev) =>
                    prev.includes(variant.id)
                      ? prev.filter((item) => item !== variant.id)
                      : [...prev, variant.id]
                  )
                }
                id={variant.id}
                className="accent-primary w-5 h-5"
              />

              <div className="flex flex-col gap-2">
                <p>Taille :{variant.size}</p>
                <p>Couleur :{variant.color}</p>
                <p className="px-2 py-1 text-white bg-primary border border-black rounded text-sm w-fit justify-self-end">
                  {(Number(variant.pricePerHour) / 100).toFixed(2)} €/J
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        className="px-4 mx-auto block mt-6 rounded-lg w-full max-w-[600px]"
        onClick={() =>
          console.log({
            productId: product.id,
            productName: product.name,
            variants: selectedVariants,
          })
        }
      >
        Ajouter au panier
      </Button>
    </article>
  );
};

export default ProductDetail;
