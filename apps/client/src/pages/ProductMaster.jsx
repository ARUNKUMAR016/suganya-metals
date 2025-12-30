import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { Plus, Edit2, Package } from "lucide-react";

const ProductMaster = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newProduct) => {
      if (editingProduct) {
        return api.put(`/products/${editingProduct.id}`, newProduct);
      }
      return api.post("/products", newProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      closeModal();
    },
  });

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductName(product.product_name);
    } else {
      setEditingProduct(null);
      setProductName("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setProductName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ product_name: productName });
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Item Master</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Item Name (தயாரிப்பு பெயர்)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products?.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-gray-500 font-mono">
                  #{String(product.id).padStart(2, "0")}
                </td>
                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                  <Package size={16} className="text-blue-400" />
                  {product.product_name}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openModal(product)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name (தயாரிப்பு பெயர்)
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="எ.கா: எஃகு பானை"
                  lang="ta"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {mutation.isLoading ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMaster;
