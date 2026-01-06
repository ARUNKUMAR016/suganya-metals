import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { Banknote, Calendar, User, Plus, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const LabourAdvance = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedLabour, setSelectedLabour] = useState("");
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: labours } = useQuery({
    queryKey: ["labours"],
    queryFn: async () => {
      const res = await api.get("/labours");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return api.post("/advances", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["advances"]);
      setAmount("");
      setNotes("");
      setError("");
      setSuccess(t("successAdd"));
      setTimeout(() => setSuccess(""), 3000);
      // Optional: Navigate to history or stay here? User probably wants to add multiple.
    },
    onError: (err) => {
      setError(err.response?.data?.error || "Failed to create advance");
      setSuccess("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLabour || !amount || !entryDate) {
      setError(t("fillRequired"));
      return;
    }
    createMutation.mutate({
      labour_id: selectedLabour,
      amount: parseFloat(amount),
      date: entryDate,
      notes,
    });
  };

  return (
    <div className="pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{t("newAdvance")}</h1>
        <button
          onClick={() => navigate("/advances/history")}
          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          {t("viewHistory")} &rarr;
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Plus size={20} className="text-blue-600" />
            {t("entryDetails")}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("selectLabour")}
              </label>
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base bg-white"
                  value={selectedLabour}
                  onChange={(e) => setSelectedLabour(e.target.value)}
                >
                  <option value="">{t("selectLabourPlaceholder")}</option>
                  {labours?.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("date")}
              </label>
              <div className="relative">
                <Calendar
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base bg-white"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("amount")} (₹)
              </label>
              <div className="relative">
                <Banknote
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("notes")}
              </label>
              <textarea
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-base"
                placeholder={t("reasonPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-base active:scale-[0.98] transform duration-100 mt-4"
            >
              {createMutation.isPending ? t("adding") : t("saveAdvance")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LabourAdvance;
