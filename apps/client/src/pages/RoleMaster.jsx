import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { Plus, Edit2, Search } from "lucide-react";

const RoleMaster = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ role_name: "", rate_per_kg: "" });
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredRoles = roles?.filter(
    (role) =>
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(role.id).includes(searchTerm)
  );

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Role Master</h1>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search roles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} /> Add Role
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-sm font-semibold">
            <tr>
              <th className="p-4 w-24">ID</th>
              <th className="p-4">Role Name</th>
              <th className="p-4">Rate / KG (₹)</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRoles?.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500 align-middle">#{role.id}</td>
                <td className="p-4 font-medium text-gray-900 align-middle">
                  {role.role_name}
                </td>
                <td className="p-4 font-medium text-green-600 align-middle">
                  ₹{role.rate_per_kg}
                </td>
                <td className="p-4 align-middle">
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
                <td className="p-4 text-right align-middle">
                  <button
                    onClick={() => openModal(role)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRoles?.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No roles found matching "{searchTerm}"
                </td>
              </tr>
            )}
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
