"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

function getStatusLabel(status: bigint | number | undefined) {
  if (status === undefined || status === null) return "Unknown";

  const s = Number(status);

  if (s === 0) return "Submitted";
  if (s === 1) return "Compliant";
  if (s === 2) return "Needs Review";

  return "Unknown";
}

function getStatusClasses(status: bigint | number | undefined) {
  const s = Number(status);

  if (s === 1) {
    return "bg-green-100 text-green-700 border border-green-200";
  }

  if (s === 2) {
    return "bg-red-100 text-red-700 border border-red-200";
  }

  return "bg-yellow-100 text-yellow-700 border border-yellow-200";
}

function formatTimestamp(timestamp: bigint | number | undefined) {
  if (timestamp === undefined || timestamp === null) return "-";

  const date = new Date(Number(timestamp) * 1000);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
}

export default function VerifyPage() {
  const params = useParams();
  const rawId = params?.id;

  const reportId =
    typeof rawId === "string"
      ? BigInt(rawId)
      : Array.isArray(rawId) && rawId[0]
        ? BigInt(rawId[0])
        : undefined;

  const { data: report, isLoading } = useScaffoldReadContract({
    contractName: "HydroLedgerRegistry",
    functionName: "getReport",
    args: reportId !== undefined ? [reportId] : undefined,
  });

  if (reportId === undefined) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Invalid Report ID</h1>
            <p className="text-slate-600 mb-6">
              The requested report ID is invalid or missing.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-5 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <p className="text-slate-600">Loading report...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Report not found</h1>
            <p className="text-slate-600 mb-6">
              We could not find the requested report onchain.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-5 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const reportData = report as {
    id: bigint;
    farm: string;
    reportHash: string;
    timestamp: bigint;
    status: bigint | number;
    farmName: string;
    region: string;
    cropType: string;
    reportingPeriod: string;
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 font-medium hover:text-blue-700 transition"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            Public Verification
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Verify Report
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl">
            This report proof is anchored onchain and can be independently verified
            without exposing sensitive operational farm data.
          </p>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-green-100 text-green-800 border border-green-200 font-medium">
           This report is cryptographically secured and verifiable onchain
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Report #{reportData.id?.toString()}
            </h2>

            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium w-fit ${getStatusClasses(reportData.status)}`}
            >
              {getStatusLabel(reportData.status)}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-5 pt-2">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Farm Name</p>
              <p className="font-semibold text-slate-900">{reportData.farmName}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Region</p>
              <p className="font-semibold text-slate-900">{reportData.region}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Crop Type</p>
              <p className="font-semibold text-slate-900">{reportData.cropType}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Reporting Period</p>
              <p className="font-semibold text-slate-900">{reportData.reportingPeriod}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 md:col-span-2">
              <p className="text-sm text-slate-500 mb-1">Farm Address</p>
              <p className="font-semibold text-slate-900 break-all">{reportData.farm}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 md:col-span-2">
              <p className="text-sm text-slate-500 mb-1">Report Hash</p>
              <p className="font-semibold text-slate-900 break-all">{reportData.reportHash}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 md:col-span-2">
              <p className="text-sm text-slate-500 mb-1">Timestamp</p>
              <p className="font-semibold text-slate-900">
                {formatTimestamp(reportData.timestamp)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}