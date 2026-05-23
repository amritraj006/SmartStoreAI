import { FaStar, FaFire, FaArrowUp } from "react-icons/fa";

function TopProducts({ products = [] }) {
  const getRankIcon = (index) => {
    if (index === 0) return <FaFire className="text-orange-500" />;
    if (index === 1) return <FaArrowUp className="text-blue-500" />;
    return <FaStar className="text-yellow-500" />;
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="p-6 border-b border-slate-800/80">
        <h2 className="text-xl font-bold text-white">Top Selling Products</h2>
        <p className="text-sm text-slate-400 mt-1">Best performing items this month</p>
      </div>
      
      <div className="divide-y divide-slate-800/80">
        {products.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No sales logged yet. Add products and generate orders to view top sellers.
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={index}
              className="p-6 hover:bg-slate-800/35 transition-colors group"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 text-slate-500 font-medium">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRankIcon(index)}
                      <span className="text-xs text-slate-400">
                        {index === 0 ? "Best Seller" : index === 1 ? "Trending" : "Popular"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {product.sales}
                    </p>
                    <p className="text-xs text-slate-400">units sold</p>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 ml-12">
                <div className="w-full bg-slate-950 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(product.sales / Math.max(1, products[0]?.sales || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TopProducts;