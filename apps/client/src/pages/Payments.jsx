import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { CreditCard, Calendar, User, Search } from "lucide-react";

const Payments = () => {
  const queryClient = useQueryClient();
  const [labourId, setLabourId] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const { data: labours } = useQuery({
    queryKey: ["labours"],
    queryFn: async () => {
      const res = await api.get("/labours");
      return res.data || [];
    },
  });

  const { data: paymentHistory } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await api.get("/payments");
      return res.data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      return api.post("/payments", data);
    },
    onSuccess: () => {
      alert("Payment Recorded Successfully");
      queryClient.invalidateQueries(["payments"]);
      setAmount("");
      setRemarks("");
    },
    onError: (err) => {
      alert("Error: " + err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      labour_id: labourId,
      week_start: weekStart,
      week_end: weekEnd,
      total_amount: amount,
      remarks,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Form */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Record Payment
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Labour
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={labourId}
              onChange={(e) => setLabourId(e.target.value)}
            >
              <option value="">-- Choose Labour --</option>
              {labours?.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Week Start
              </label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Week End
              </label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Amount Paid (₹)
            </label>
            <input
              type="number"
              required
              step="0.01"
              className="w-full border border-gray-300 rounded-lg p-3 text-lg font-bold text-green-700 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Cash / Online"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          >
            {mutation.isLoading ? "Processing..." : "Confirm Payment"}
          </button>
        </form>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Payment History
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-h-[600px] overflow-y-auto">
          {paymentHistory?.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No payments recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paymentHistory?.map((pay) => (
                <div
                  key={pay.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800">
                      {pay.labour?.name}
                    </h4>
                    <span className="text-green-600 font-bold">
                      ₹{pay.total_amount}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                    <Calendar size={12} />
                    {new Date(pay.week_start).toLocaleDateString()} -{" "}
                    {new Date(pay.week_end).toLocaleDateString()}
                  </div>
                  {pay.remarks && (
                    <p className="text-sm text-gray-600 italic">
                      "{pay.remarks}"
                    </p>
                  )}
                  <div className="text-xs text-gray-400 mt-2 text-right">
                    Paid on: {new Date(pay.paid_on).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
