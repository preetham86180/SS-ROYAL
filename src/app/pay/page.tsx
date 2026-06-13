"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2 } from "lucide-react";

export default function PayPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Fetch assigned properties
      fetch("/api/user/assigned-properties")
        .then(res => res.json())
        .then(data => {
          setProperties(data.properties || []);
          if (data.properties?.length > 0) {
            setSelectedPropertyId(data.properties[0].id);
          }
        })
        .catch(err => console.error("Failed to fetch properties", err));
    }
  }, [status, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedPropertyId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please select a property and enter a valid amount");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: selectedPropertyId, amount }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy", 
        amount: data.amount,
        currency: "INR",
        name: "Lumina Estates",
        description: "Rent / Property Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentDbId: data.paymentId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.isOk) {
              alert("Payment successful! Receipt sent to your email.");
              router.push("/account");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#0f172a", // Brand color
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      // Handle failed payment event
      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment Failed! Reason: ${response.error.description}`);
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Loading secure checkout...</p>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8">
          <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">Make a Payment</h1>
          <p className="text-gray-500 mb-8">Pay your rent, pending amounts, or property fees securely.</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              {properties.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg text-sm mb-4 border border-yellow-200">
                  You don't have any assigned properties yet. Please wait for the admin to assign a property to your account before making a payment.
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Property
                  </label>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-gray-900 bg-white"
                    required
                  >
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        [{prop.propertyNumber}] {prop.title} - {prop.location}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-gray-900"
                placeholder="Enter amount to pay"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || properties.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-lg transition-colors shadow-md disabled:opacity-70 mt-4 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${amount || "0"}`
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
