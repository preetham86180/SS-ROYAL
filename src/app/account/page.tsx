"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, CreditCard, Clock, CheckCircle2, Loader2 } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("/api/payments/history")
        .then(res => res.json())
        .then(data => {
          setPayments(data.payments || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your account details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-100">
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900">My Account</h1>
              <p className="text-gray-500 mt-1">Welcome back, {session?.user?.name || session?.user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pay"
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <CreditCard size={18} />
                Make Payment
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold font-display text-gray-900">Payment History</h2>
            <p className="text-gray-500 mt-1">View your past and pending payments</p>
          </div>
          
          {payments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <CreditCard className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No payments yet</h3>
              <p className="text-gray-500 mb-4">You haven't made any payments yet.</p>
              <Link href="/pay" className="text-brand-600 font-medium hover:underline">
                Make your first payment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Property</th>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {payment.property?.title || "Unknown Property"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        {payment.razorpayPaymentId || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {payment.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                            <Clock size={14} /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
