import DashboardLayout from "../layouts/DashboardLayout";

function Products() {
  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-5">
          Products Page
        </h1>

        <p>All products will appear here.</p>
      </div>
    </DashboardLayout>
  );
}

export default Products;