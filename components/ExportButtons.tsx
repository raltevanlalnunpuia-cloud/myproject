
import React from 'react';
import { FileDown, Table as TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project } from '../types';

interface Props {
  projects: Project[];
  sectorName: string;
}

const ExportButtons: React.FC<Props> = ({ projects, sectorName }) => {
  const exportToExcel = () => {
    const wsData = projects.map(p => ({
      'Sl.No': p.slNo,
      'Project Name': p.name,
      'ULB': p.ulb,
      'Approved Cost (Lakhs)': p.approvedCost,
      'Received Amount (Lakhs)': p.receivedAmount,
      'Start Date': p.commencementDate,
      'Target Completion': p.targetCompletionDate,
      'Physical Progress (%)': p.physicalProgress,
      'Financial Progress (Lakhs)': p.financialProgress,
      'Status': p.status,
      'Remarks': p.remarks
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, `AMRUT2.0_${sectorName}_Export.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text(`AMRUT 2.0 Project Monitoring - ${sectorName}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableData = projects.map(p => [
      p.slNo,
      p.name,
      p.ulb,
      p.approvedCost,
      p.receivedAmount,
      p.commencementDate,
      p.targetCompletionDate,
      `${p.physicalProgress}%`,
      p.status
    ]);

    autoTable(doc, {
      head: [['Sl', 'Name', 'ULB', 'Cost', 'Rec', 'Start', 'End', 'Phy%', 'Status']],
      body: tableData,
      startY: 25,
      styles: { fontSize: 7, font: 'helvetica' },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`AMRUT2.0_${sectorName}_Report.pdf`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md"
      >
        <FileDown className="w-4 h-4" />
        <span className="hidden sm:inline">Export PDF</span>
      </button>
      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md"
      >
        <TableIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Export Excel</span>
      </button>
    </div>
  );
};

export default ExportButtons;
