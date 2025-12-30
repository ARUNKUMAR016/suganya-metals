import React, { useState } from "react"; // Consolidated import
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { Plus, Edit2, Trash2 } from "lucide-react";

const RoleMaster = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ role_name: "", rate_per_kg: "" });

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get("/roles");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newRole) => {
      if (editingRole) {
        return api.put(`/roles/${editingRole.id}`, newRole);
      }
      return api.post("/roles", newRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      closeModal();
    },
  });

  const openModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({ role_name: role.role_name, rate_per_kg: role.rate_per_kg });
    } else {
      setEditingRole(null);
      setFormData({ role_name: "", rate_per_kg: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ role_name: "", rate_per_kg: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleToggleActive = async (role) => {
    await api.put(`/roles/${role.id}`, { ...role, active: !role.active });
    queryClient.invalidateQueries(["roles"]);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Role Master</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Role
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Role Name</th>
              <th className="p-4">Rate / KG (₹)</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles?.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500">#{role.id}</td>
                <td className="p-4 font-medium text-gray-900">
                  {role.role_name}
                </td>
                <td className="p-4 font-medium text-green-600">
                  ₹{role.rate_per_kg}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleActive(role)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      role.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {role.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openModal(role)}
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
              {editingRole ? "Edit Role" : "Add New Role"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.role_name}
                  onChange={(e) =>
                    setFormData({ ...formData, role_name: e.target.value })
                  }
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate per KG (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.rate_per_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, rate_per_kg: e.target.value })
                  }
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
                  {mutation.isLoading ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleMaster;
