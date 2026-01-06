import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { Trash2, Filter } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import ConfirmationDialog from "../components/ConfirmationDialog";

const AdvanceHistory = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [selectedLabour, setSelectedLabour] = useState("");

  // Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [advanceToDelete, setAdvanceToDelete] = useState(null);

  // Filter States
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const defaultStart = new Date(today.setDate(diff))
    .toISOString()
    .split("T")[0];
  const defaultEnd = new Date(today.setDate(diff + 6))
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const { data: labours } = useQuery({
    queryKey: ["labours"],
    queryFn: async () => {
      const res = await api.get("/labours");
      return res.data;
    },
  });

  const { data: advances, isLoading } = useQuery({
    queryKey: ["advances", startDate, endDate, selectedLabour],
    queryFn: async () => {
      const params = { startDate, endDate };
      if (selectedLabour) {
        params.labourId = selectedLabour;
      }
      const res = await api.get("/advances", { params });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/advances/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["advances"]);
      toast.success(t("deleteSuccess") || "Record deleted successfully");
      closeDeleteDialog();
    },
    onError: () => {
      toast.error(t("deleteError") || "Failed to delete record");
      closeDeleteDialog();
    },
  });

  const openDeleteDialog = (advance) => {
    setAdvanceToDelete(advance);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setAdvanceToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (advanceToDelete) {
      deleteMutation.mutate(advanceToDelete.id);
    }
  };

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {t("historyTitle")}
        </h1>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Labour Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("filterLabour")}
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              value={selectedLabour}
              onChange={(e) => setSelectedLabour(e.target.value)}
            >
              <option value="">{t("allLabours")}</option>
              {labours?.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("dateRange")}
            </label>
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              <input
                type="date"
                className="bg-transparent outline-none text-gray-700 w-full px-2 py-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-gray-400 font-medium">-</span>
              <input
                type="date"
                className="bg-transparent outline-none text-gray-700 w-full px-2 py-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">{t("loading")}</div>
        ) : advances?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500">
            <p className="text-lg mb-1">{t("noRecords")}</p>
            <p className="text-sm">{t("adjustFilters")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <tr>
                    <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">
                      {t("date")}
                    </th>
                    <th className="p-3 sm:p-4 font-semibold whitespace-nowrap">
                      {t("labourMaster")}
                    </th>
                    <th className="p-3 sm:p-4 font-semibold text-right whitespace-nowrap">
                      {t("amount")}
                    </th>
                    <th className="p-3 sm:p-4 font-semibold min-w-[200px]">
                      {t("notes")}
                    </th>
                    <th className="p-3 sm:p-4 font-semibold text-center">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {advances?.map((adv) => (
                    <tr
                      key={adv.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 sm:p-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(adv.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 sm:p-4 font-medium text-gray-900 whitespace-nowrap">
                        {adv.labour?.name}
                      </td>
                      <td className="p-3 sm:p-4 text-right font-bold text-gray-800 whitespace-nowrap">
                        ₹{parseFloat(adv.amount).toFixed(2)}
                      </td>
                      <td className="p-3 sm:p-4 text-sm text-gray-500">
                        {adv.notes || "-"}
                      </td>
                      <td className="p-3 sm:p-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => openDeleteDialog(adv)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Advance"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title={t("deleteAdvance") || "Delete Advance"}
        message={
          advanceToDelete
            ? `${
                t("confirmDeleteMessage") ||
                "Are you sure you want to delete the advance for"
              } ${advanceToDelete.labour?.name} - ₹${advanceToDelete.amount}?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
        confirmText={t("delete") || "Delete"}
        cancelText={t("cancel") || "Cancel"}
        isDangerous={true}
      />
    </div>
  );
};

export default AdvanceHistory;
