import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { Plus, Edit2, User, Phone } from "lucide-react";

const LabourMaster = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role_id: "",
  });

  // Fetch Labours
  const { data: labours, isLoading: isLaboursLoading } = useQuery({
    queryKey: ["labours"],
    queryFn: async () => {
      const res = await api.get("/labours");
      return res.data;
    },
  });

  // Fetch Roles for Dropdown
  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get("/roles");
      return res.data?.filter((r) => r.active) || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (newLabour) => {
      if (editingLabour) {
        return api.put(`/labours/${editingLabour.id}`, newLabour);
      }
      return api.post("/labours", newLabour);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["labours"]);
      closeModal();
    },
  });

  const openModal = (labour = null) => {
    if (labour) {
      setEditingLabour(labour);
      setFormData({
        name: labour.name,
        phone: labour.phone || "",
        role_id: labour.role_id,
      });
    } else {
      setEditingLabour(null);
      setFormData({ name: "", phone: "", role_id: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLabour(null);
    setFormData({ name: "", phone: "", role_id: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleToggleActive = async (labour) => {
    await api.put(`/labours/${labour.id}`, {
      ...labour,
      active: !labour.active,
    });
    queryClient.invalidateQueries(["labours"]);
  };

  if (isLaboursLoading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Labour Master</h1>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={20} /> Add Labour
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labours?.map((labour) => (
          <div
            key={labour.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {labour.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {labour.role?.role_name || "No Role"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openModal(labour)}
                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
              >
                <Edit2 size={18} />
              </button>
            </div>

            {labour.phone && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg mb-3">
                <Phone size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600 font-medium">
                  {labour.phone}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="text-xs text-gray-400">ID: #{labour.id}</div>
              <button
                onClick={() => handleToggleActive(labour)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  labour.active
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {labour.active ? "Active" : "Inactive"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {editingLabour ? "Edit Labour" : "Add New Labour"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Labour Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Enter labour name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    className="w-full pl-11 pr-4 border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  required
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  value={formData.role_id}
                  onChange={(e) =>
                    setFormData({ ...formData, role_id: e.target.value })
                  }
                >
                  <option value="">Select Role</option>
                  {roles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role_name} (₹{role.rate_per_kg}/kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {mutation.isLoading ? "Saving..." : "Save Labour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LabourMaster;
