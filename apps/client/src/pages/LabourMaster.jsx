import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { Plus, Edit2, User, Phone, Trash2, Search } from "lucide-react";

const LabourMaster = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role_id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

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

  /* Delete Confirmation State */
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    labourId: null,
    labourName: "",
  });

  /* Toast State */
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/labours/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["labours"]);
      showToast("Labour deleted successfully", "success");
      setDeleteConfirmation({ isOpen: false, labourId: null, labourName: "" });
    },
    onError: (error) => {
      showToast(
        error.response?.data?.error || "Failed to delete labour",
        "error"
      );
      setDeleteConfirmation({ isOpen: false, labourId: null, labourName: "" });
    },
  });

  const handleDeleteClick = (labour) => {
    setDeleteConfirmation({
      isOpen: true,
      labourId: labour.id,
      labourName: labour.name,
    });
  };

  const calculateTotalAdvance = (labourId) => {
    // This is a placeholder as advance logic isn't fully visible in this snippet.
    // Assuming handled by backend validation mostly.
    return 0;
  };

  const filteredLabours = labours?.filter(
    (labour) =>
      labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (labour.phone && labour.phone.includes(searchTerm)) ||
      (labour.role?.role_name &&
        labour.role.role_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ... (previous helper functions: openModal, closeModal, handleSubmit, handleToggleActive)

  if (isLaboursLoading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 animate-fadeIn ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scaleIn border border-red-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Labour?
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  "{deleteConfirmation.labourName}"
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() =>
                    setDeleteConfirmation({
                      isOpen: false,
                      labourId: null,
                      labourName: "",
                    })
                  }
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    deleteMutation.mutate(deleteConfirmation.labourId)
                  }
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Labour Master</h1>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search labours..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
          >
            <Plus size={20} /> Add Labour
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLabours?.map((labour) => (
          <div
            key={labour.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-200 group relative overflow-hidden"
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
              <div className="flex gap-1">
                <button
                  onClick={() => openModal(labour)}
                  className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(labour)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
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
          animation: fadeIn 0.15s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default LabourMaster;
