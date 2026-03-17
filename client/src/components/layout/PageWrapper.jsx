import Sidebar from "./Sidebar";

export default function PageWrapper({ children, title, subtitle, action }) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-sm text-slate-400 mt-0.5 font-normal">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
}