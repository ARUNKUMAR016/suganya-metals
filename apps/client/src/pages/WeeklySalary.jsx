import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import * as XLSX from "xlsx";
import {
  FileText,
  Calendar,
  Filter,
  CheckCircle,
  Download,
  Printer,
} from "lucide-react";

const WeeklySalary = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff)).toISOString().split("T")[0];
  const sunday = new Date(today.setDate(diff + 6)).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(monday);
  const [endDate, setEndDate] = useState(sunday);
  const [selectedLabour, setSelectedLabour] = useState("");

  const { data: salaryReport, isLoading } = useQuery({
    queryKey: ["salary", startDate, endDate, selectedLabour],
    queryFn: async () => {
      const params = { startOfWeek: startDate, endOfWeek: endDate };
      if (selectedLabour) params.labourId = selectedLabour;
      const res = await api.get("/salary", { params });
      return res.data;
    },
  });

  const { data: labours } = useQuery({
    queryKey: ["labours"],
    queryFn: async () => {
      const res = await api.get("/labours");
      return res.data || [];
    },
  });

  const totalPayout =
    salaryReport?.reduce((sum, item) => sum + item.total_amount, 0) || 0;

  const exportToExcel = () => {
    if (!salaryReport || salaryReport.length === 0) {
      alert("No data to export");
      return;
    }

    const data = salaryReport.map((item) => ({
      "Labour Name": item.labour_name,
      "Days Worked": item.days_worked,
      "Total KG": item.total_kg.toFixed(2),
      "Total Amount (₹)": item.total_amount.toFixed(2),
      Status: item.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary Report");

    // Add styling to header row
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "4472C4" } },
      };
    }

    const fileName = `Salary_Report_${startDate}_to_${endDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
        <h1 className="text-2xl font-bold text-gray-800">
          Weekly Salary Report
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export Buttons */}
          <button
            onClick={exportToExcel}
            disabled={!salaryReport || salaryReport.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={18} />
            Export Excel
          </button>
          <button
            onClick={handlePrint}
            disabled={!salaryReport || salaryReport.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 no-print">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
            value={selectedLabour}
            onChange={(e) => setSelectedLabour(e.target.value)}
          >
            <option value="">All Labours</option>
            {labours?.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="print-only mb-6">
        <div className="text-center mb-4 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold">SUGANYA METALS</h1>
          <p className="text-lg mt-1">Weekly Salary Report</p>
          <p className="text-sm text-gray-600 mt-2">
            Period: {startDate} to {endDate}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg">
          <p className="text-blue-100 text-sm font-medium">
            Total Salary Payable
          </p>
          <p className="text-2xl font-bold mt-1">₹{totalPayout.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
          <p className="text-gray-500 text-sm font-medium">Total KG Produced</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {salaryReport
              ?.reduce((sum, item) => sum + item.total_kg, 0)
              .toFixed(2)}{" "}
            kg
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
          <p className="text-gray-500 text-sm font-medium">Active Labours</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {salaryReport?.length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading salary data...
          </div>
        ) : salaryReport?.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No records found for this period.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4">Labour Name</th>
                <th className="p-4 text-center">Days Worked</th>
                <th className="p-4 text-right">Total KG</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salaryReport.map((item) => (
                <tr
                  key={item.labour_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {item.labour_name}
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    {item.days_worked}
                  </td>
                  <td className="p-4 text-right font-mono text-gray-700">
                    {item.total_kg.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-bold text-green-600">
                    ₹{item.total_amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    {item.status === "Paid" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle size={12} /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td
                  colSpan="3"
                  className="p-4 text-right font-bold text-gray-800"
                >
                  TOTAL PAYABLE:
                </td>
                <td className="p-4 text-right font-bold text-green-600 text-lg">
                  ₹{totalPayout.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          /* Show only the report content */
          div:has(> table),
          div:has(> table) *,
          .print-only,
          .print-only * {
            visibility: visible;
          }
          
          /* Position the printable content at the top */
          div:has(> table) {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          /* Remove colors for better black & white printing */
          table {
            border-collapse: collapse;
            width: 100%;
          }
          
          th, td {
            border: 1px solid #000;
            padding: 8px;
          }
          
          thead {
            background-color: #f0f0f0 !important;
          }
          
          /* Page margins */
          @page {
            margin: 2cm;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default WeeklySalary;
