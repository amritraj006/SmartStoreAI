import { topProducts } from "../../data/dummyData";

function TopProducts() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold mb-5">
        Top Products
      </h2>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div
            key={index}
            className="flex justify-between border-b pb-2"
          >
            <p>{product.name}</p>

            <p className="font-semibold">
              {product.sales} Sales
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopProducts;