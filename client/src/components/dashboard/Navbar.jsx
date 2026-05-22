function Navbar() {
  return (
    <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-700">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/40"
          alt=""
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p className="font-semibold">Admin</p>
          <p className="text-sm text-gray-500">
            admin@smartstore.ai
          </p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;