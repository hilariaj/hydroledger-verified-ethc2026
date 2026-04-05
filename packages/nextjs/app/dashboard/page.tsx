"use client";

import { useMemo } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

function getStatusLabel(status: bigint | number | undefined) {
  if (status === undefined || status === null) return "Unknown";

  const normalizedStatus = Number(status);

  if (normalizedStatus === 0) return "Submitted";
  if (normalizedStatus === 1) return "Compliant";
  if (normalizedStatus === 2) return "Needs Review";

  return "Unknown";
}

function formatTimestamp(timestamp: bigint | number | undefined) {
  if (timestamp === undefined || timestamp === null) return "-";

  const date = new Date(Number(timestamp) * 1000);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
}

type ReportCardProps = {
  reportId: number;
};

function ReportCard({ reportId }: ReportCardProps) {
  const { data: report, isLoading } = useScaffoldReadContract({
    contractName: "HydroLedgerRegistry",
    functionName: "reports",
    args: [BigInt(reportId)],
  });

  if (isLoading) {
    return (
      <div className="border rounded-2xl p-5 shadow-sm bg-white">
        <p>Loading report #{reportId}...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="border rounded-2xl p-5 shadow-sm bg-white">
        <p>Could not load report #{reportId}</p>
      </div>
    );
  }

  const [
    id,
    farm,
    reportHash,
    timestamp,
    status,
    farmName,
    region,
    cropType,
    reportingPeriod,
  ] = report;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition">
      <h2 className="text-xl font-bold">Report #{id?.toString()}</h2>

      <div>
        <span className="font-semibold">Farm Name:</span> {farmName}
      </div>

      <div>
        <span className="font-semibold">Farm Address:</span> {farm}
      </div>

      <div>
        <span className="font-semibold">Region:</span> {region}
      </div>

      <div>
        <span className="font-semibold">Crop Type:</span> {cropType}
      </div>

      <div>
        <span className="font-semibold">Reporting Period:</span> {reportingPeriod}
      </div>

      <div className="break-all">
        <span className="font-semibold">Report Hash:</span> {reportHash}
      </div>

      <div>
        <span className="font-semibold">Timestamp:</span> {formatTimestamp(timestamp)}
      </div>

      <div>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            Number(status) === 1
              ? "bg-green-100 text-green-700"
              : Number(status) === 2
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          Status:</span>{getStatusLabel(status)} 
      </div>

      <a href={`/verify/${id?.toString()}`} className="inline-block mt-4 px-5 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
        Verify Report
      </a>
    </div>
  );
}

export default function DashboardPage() {
  const { data: reportCount, isLoading } = useScaffoldReadContract({
    contractName: "HydroLedgerRegistry",
    functionName: "reportCount",
  });

  const reportIds = useMemo(() => {
    const count = Number(reportCount || 0n);
    return Array.from({ length: count }, (_, index) => index + 1).reverse();
  }, [reportCount]);

  return (
    <main className="min-h-screen bg-slate-50 max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">HydroLedger Dashboard</h1>
        <p className="text-gray-600">View all submitted water usage reports anchored onchain.</p>
      </div>

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="font-semibold text-slate-700">Total Reports:</span>
          <span className="text-blue-600 font-bold">{reportCount ? reportCount.toString() : "0"}</span>
        </div>
      </div>

      {isLoading ? (
        <p>Loading dashboard...</p>
      ) : reportIds.length === 0 ? (
        <div className="border rounded-2xl p-8 bg-white">
          <p className="text-lg font-medium">No reports submitted yet.</p>
          <p className="text-gray-600 mt-2">Go to the submit page and create your first report.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reportIds.map(reportId => (
            <ReportCard key={reportId} reportId={reportId} />
          ))}
        </div>
      )}
    </main>
  );
}