import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getTimestamp } from "../utils/formatTimestamp";

const DownloadAllButtons = ({ csvDatasets, chartIds }) => {
  const handleSingleCSVDownload = () => {
    const timestamp = getTimestamp();
    let csvContent = "";

    csvDatasets.forEach(({ title, data }) => {
      csvContent += `${title}\n`;
      csvContent += Object.keys(data[0] || {}).join(",") + "\n";
      csvContent += data.map(row => Object.values(row).join(",")).join("\n");
      csvContent += "\n\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_${timestamp}.csv`;
    link.click();
  };

  const handleSinglePDFDownload = async () => {
    const timestamp = getTimestamp();
    const pdf = new jsPDF("landscape");

    for (let i = 0; i < chartIds.length; i++) {
      const chartEl = document.getElementById(chartIds[i]);
      if (!chartEl) continue;

      const canvas = await html2canvas(chartEl);
      const imgData = canvas.toDataURL("image/png");

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, 10, 280, 150);
    }

    pdf.save(`analytics_${timestamp}.pdf`);
  };

  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={handleSingleCSVDownload}
        className="bg-[#8a194e] hover:bg-[#8a194e]/50 hover:text-white/50 text-white px-4 py-2 rounded-md shadow"
      >
        Export All (CSV)
      </button>

      <button
        onClick={handleSinglePDFDownload}
        className="bg-[#8a194e] hover:bg-[#8a194e]/50 hover:text-white/50 text-white px-4 py-2 rounded-md shadow"
      >
        Export All (PDF)
      </button>
    </div>
  );
};

export default DownloadAllButtons;
