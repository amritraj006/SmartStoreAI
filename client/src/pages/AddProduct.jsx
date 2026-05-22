import DashboardLayout from "../layouts/DashboardLayout";

function AddProduct() {
  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-5">
          Add Product
        </h1>

        <form className="grid gap-4">
          <input
            type="text"
            placeholder="Product Title"
            className="border p-3 rounded-lg"
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
          />

          <button className="bg-blue-600 text-white py-3 rounded-lg">
            Generate AI Content
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AddProduct;