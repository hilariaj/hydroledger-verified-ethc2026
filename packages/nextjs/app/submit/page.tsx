"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { keccak256, toHex } from "viem";
import { usePublicClient } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function SubmitPage() {
  const router = useRouter();
  const publicClient = usePublicClient();

  const [farmName, setFarmName] = useState("");
  const [region, setRegion] = useState("");
  const [cropType, setCropType] = useState("");
  const [reportingPeriod, setReportingPeriod] = useState("");
  const [waterUsage, setWaterUsage] = useState("");
  const [irrigatedArea, setIrrigatedArea] = useState("");

  const [generatedHash, setGeneratedHash] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { writeContractAsync, isMining } = useScaffoldWriteContract("HydroLedgerRegistry");

  const handleSubmit = async () => {
    try {
      setSuccessMessage("");
      setErrorMessage("");

      if (
        !farmName.trim() ||
        !region.trim() ||
        !cropType.trim() ||
        !reportingPeriod.trim() ||
        !waterUsage.trim() ||
        !irrigatedArea.trim()
      ) {
        setErrorMessage("Please fill in all fields.");
        return;
      }

      const payload = JSON.stringify({
        farmName,
        region,
        cropType,
        reportingPeriod,
        waterUsage,
        irrigatedArea,
      });

      const reportHash = keccak256(toHex(payload));
      setGeneratedHash(reportHash);

      const txHash = await writeContractAsync({
        functionName: "submitReport",
        args: [reportHash, farmName, region, cropType, reportingPeriod],
      });

      if (!publicClient) {
        throw new Error("Public client not available.");
      }

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      setSuccessMessage("Report successfully submitted onchain.");

      setFarmName("");
      setRegion("");
      setCropType("");
      setReportingPeriod("");
      setWaterUsage("");
      setIrrigatedArea("");

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to submit report. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Submit Water Usage Report</h1>
          <p className="text-slate-600">
            Create a new agricultural water usage record and anchor its proof onchain.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-5">
          <input
            className="w-full border border-slate-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Farm Name"
            value={farmName}
            onChange={e => setFarmName(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Region"
            value={region}
            onChange={e => setRegion(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Crop Type"
            value={cropType}
            onChange={e => setCropType(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Reporting Period"
            value={reportingPeriod}
            onChange={e => setReportingPeriod(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Water Usage (liters)"
            value={waterUsage}
            onChange={e => setWaterUsage(e.target.value)}
          />

          <input
            className="w-full border border-slate-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Irrigated Area (hectares)"
            value={irrigatedArea}
            onChange={e => setIrrigatedArea(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={isMining}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isMining ? "Submitting..." : "Submit Report"}
          </button>

          {generatedHash && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900 mb-2">Generated Report Hash:</p>
              <p className="break-all text-sm text-slate-700">{generatedHash}</p>
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-green-200 bg-green-100 p-4 text-green-800">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-100 p-4 text-red-700">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}