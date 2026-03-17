import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getMyPrescriptions } from "../../api/prescriptions";
import { formatDateTime } from "../../lib/utils";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await getMyPrescriptions();
        setPrescriptions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="My Prescriptions">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Prescriptions" subtitle="View all your prescriptions">
      <div className="space-y-4">
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-16 text-center">
            <FileText size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm">No prescriptions yet</p>
          </div>
        ) : (
          prescriptions.map((presc) => (
            <div key={presc.id} className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{presc.diagnosis}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Dr. {presc.doctor?.name} — {presc.doctor?.specialization}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(presc.createdAt)}</p>
                </div>
              </div>

              {presc.notes && (
                <p className="text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">{presc.notes}</p>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Medicines</p>
                {presc.medicines?.map((med) => (
                  <div key={med.id} className="bg-slate-50 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-800">{med.name}</span>
                      <span className="text-xs text-slate-500">{med.dosage}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-xs text-slate-500">{med.frequency}</span>
                      <span className="text-xs text-slate-500">{med.duration}</span>
                      {med.instructions && (
                        <span className="text-xs text-slate-400 italic">{med.instructions}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}