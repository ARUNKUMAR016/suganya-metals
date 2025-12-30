import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import SearchableSelect from "../components/SearchableSelect";
import { Plus, Trash2, Save, Calendar, User, Info } from "lucide-react";

const ProductionEntry = () => {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [selectedLabour, setSelectedLabour] = useState("");
  const [items, setItems] = useState([
    { product_id: "", pcs: "", quantity_kg: "" },
  ]);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Labours
  const { data: labours } = useQuery({
    queryKey: ["labours"],
    queryFn: async () => {
      const res = await api.get("/labours");
      // Only active labours can have production entered
      return res.data?.filter((l) => l.active) || [];
    },
  });

  // Fetch Products
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data || [];
    },
  });

  // Get selected labour details for rate display
  const currentLabourDetails = labours?.find(
    (l) => l.id === parseInt(selectedLabour)
  );

  const addItem = () => {
    setItems([...items, { product_id: "", pcs: "", quantity_kg: "" }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      return api.post("/production", data);
    },
    onSuccess: () => {
      setSuccessMessage("Entry Saved Successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      // Reset form partly
      setItems([{ product_id: "", pcs: "", quantity_kg: "" }]);
    },
    onError: (error) => {
      alert(
        "Failed to save entry: " + error.response?.data?.error || error.message
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!selectedLabour) return alert("Select a Labour");
    if (items.some((i) => !i.product_id || !i.quantity_kg))
      return alert("Fill all item details");

    const payload = {
      date: new Date(date),
      labour_id: selectedLabour,
      items: items.map((i) => ({
        product_id: parseInt(i.product_id),
        pcs: parseInt(i.pcs) || 0,
        quantity_kg: parseFloat(i.quantity_kg),
      })),
    };

    mutation.mutate(payload);
  };

  // Calculate approx total amount for preview
  const rate = currentLabourDetails?.role?.rate_per_kg || 0;
  const totalKg = items.reduce(
    (sum, item) => sum + (parseFloat(item.quantity_kg) || 0),
    0
  );
  const totalAmount = (totalKg * rate).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Daily Production Entry
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Date
            </label>
            <input
              type="date"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <User size={16} /> Select Labour
            </label>
            <SearchableSelect
              options={labours || []}
              value={selectedLabour}
              onChange={(value) => setSelectedLabour(value)}
              placeholder="Search labour by ID or name..."
              getOptionLabel={(labour) => labour.name}
              getOptionValue={(labour) => labour.id}
              renderOption={(labour) => (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {labour.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {labour.role?.role_name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    #{labour.id}
                  </span>
                </div>
              )}
            />
          </div>
        </div>

        {/* Labour Rate Info */}
        {currentLabourDetails && (
          <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center gap-2 text-blue-800 text-sm">
            <Info size={16} />
            <span>
              Role: <strong>{currentLabourDetails.role?.role_name}</strong>
              <span className="mx-2">|</span>
              Rate:{" "}
              <strong>₹{currentLabourDetails.role?.rate_per_kg} / kg</strong>
            </span>
          </div>
        )}

        {/* Items Section */}
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Items Produced</h3>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <div className="w-full md:flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Item
                  </label>
                  <SearchableSelect
                    options={products || []}
                    value={item.product_id}
                    onChange={(value) => updateItem(index, "product_id", value)}
                    placeholder="Search item by ID or name..."
                    getOptionLabel={(product) => product.product_name}
                    getOptionValue={(product) => product.id}
                    renderOption={(product) => (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {product.product_name}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          #{String(product.id).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  />
                </div>
                <div className="w-full md:w-24">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Pcs (Opt)
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    placeholder="0"
                    value={item.pcs}
                    onChange={(e) => updateItem(index, "pcs", e.target.value)}
                  />
                </div>
                <div className="w-full md:w-32">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Weight (KG)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded p-2 text-sm font-bold text-gray-800"
                    placeholder="0.00"
                    value={item.quantity_kg}
                    onChange={(e) =>
                      updateItem(index, "quantity_kg", e.target.value)
                    }
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline"
          >
            <Plus size={16} /> Add Another Item
          </button>
        </div>

        {/* Footer / Total */}
        <div className="bg-gray-100 p-6 flex items-center justify-between border-t border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Total Weight</p>
            <p className="text-xl font-bold text-gray-800">
              {totalKg.toFixed(2)} kg
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Estimated Amount</p>
            <p className="text-2xl font-bold text-green-600">₹{totalAmount}</p>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Save size={20} />
            {mutation.isLoading ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ProductionEntry;
