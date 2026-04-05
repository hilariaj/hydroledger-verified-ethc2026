import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <section className="max-w-4xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
          Onchain Sustainability Verification
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          HydroLedger Verified
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          A decentralized verification layer for agricultural water usage reports,
          enabling tamper-proof records and public proof of authenticity onchain.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link
            href="/submit"
            className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Submit Report
          </Link>

          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-2xl bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-100 transition"
          >
            View Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-2">Submit</h3>
            <p className="text-slate-600">
              Farmers submit agricultural water usage reports through a simple web interface.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-2">Anchor</h3>
            <p className="text-slate-600">
              Each report is hashed and anchored onchain to ensure integrity and immutability.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-2">Verify</h3>
            <p className="text-slate-600">
              Anyone can verify the report proof publicly without exposing sensitive farm data.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}