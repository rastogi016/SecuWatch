import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ExportButtons = ({ chartId, csvData, csvFilename }) => {
  const handlePdfExport = async () => {
    const chart = document.getElementById(chartId);
    if (!chart) return;

    const canvas = await html2canvas(chart);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
    pdf.save(`${chartId}.pdf`);
  };

  return (
    <div className="flex gap-4 mt-2">
      <CSVLink
        data={csvData}
        filename={csvFilename}
        className="bg-[#6B21A8] text-white px-3 py-1 rounded hover:bg-[#6B21A8]/80 hover:text-white/80"
      >
        Export CSV
      </CSVLink>

      <button
        onClick={handlePdfExport}
        className="bg-[#6B21A8] text-white px-3 py-1 rounded hover:bg-[#6B21A8]/80 hover:text-white/80"
      >
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
