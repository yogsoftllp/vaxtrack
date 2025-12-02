import { useEffect, useState } from "react";
import { SkeletonList } from "../components/skeleton";

export default function VaccinationRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState("");
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/children").then((r) => r.json()),
      fetch("/api/vaccination-records").then((r) => r.json()),
    ]).then(([childrenData, recordsData]) => {
      setChildren(Array.isArray(childrenData) ? childrenData : []);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
      if (childrenData.length > 0) setSelectedChild(childrenData[0].id);
      setLoading(false);
    });
  }, []);

  const handleExportPDF = async () => {
    try {
      const res = await fetch("/api/vaccination-records/export?format=pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId: selectedChild, records: filteredRecords }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "vaccination-records.pdf";
        a.click();
      }
    } catch (error) {
      alert("Failed to export PDF");
    }
  };

  const handleShare = async () => {
    const child = children.find((c) => c.id === selectedChild);
    const text = `Check out my vaccination records for ${child?.firstName} on VaxTrack: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: "Vaccination Records", text });
    } else {
      alert(text);
    }
  };

  const filteredRecords = selectedChild ? records.filter((r) => r.childId === selectedChild) : [];

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Vaccination Records</h1>
          <SkeletonList count={5} />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Vaccination Records</h1>

        {/* Child Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block mb-2 font-semibold" htmlFor="child-select" data-testid="label-child-select">
            Select Child
          </label>
          <select
            id="child-select"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="w-full p-2 border rounded"
            data-testid="select-child"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Records List */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Records</h2>
          {filteredRecords.length === 0 ? (
            <p className="text-gray-600">No vaccination records</p>
          ) : (
            <ul className="space-y-3">
              {filteredRecords.map((record) => (
                <li key={record.id} className="p-4 bg-gray-50 rounded border-l-4 border-blue-500" data-testid={`record-${record.id}`}>
                  <div className="font-semibold">{record.vaccineName}</div>
                  <div className="text-sm text-gray-600">
                    Dose {record.doseNumber} • {record.status === "completed" ? "✅ Completed" : `📅 ${new Date(record.scheduledDate).toLocaleDateString()}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleExportPDF}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
            data-testid="button-export-pdf"
          >
            📥 Export as PDF
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
            data-testid="button-share"
          >
            📤 Share Records
          </button>
        </div>
      </div>
    </div>
  );
}
