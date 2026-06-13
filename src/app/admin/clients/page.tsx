import { prisma } from "@/lib/prisma";
import { User, Mail, Calendar, CreditCard, CheckCircle2, Clock, KeySquare, Link as LinkIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  // Fetch users excluding the default admin (if needed) and include their payments with property info
  const clients = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN" // Or just remove this if you want to see all users
      }
    },
    include: {
      payments: {
        include: {
          property: {
            select: {
              title: true,
              location: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      assignedProperties: {
        select: {
          id: true,
          propertyNumber: true,
          title: true,
          location: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
            Clients & Payments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor registered clients and their payment history
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {clients.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <User className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No clients yet</h3>
            <p className="text-gray-500">When customers register, they will appear here.</p>
          </div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Client Header Info */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-display font-bold text-lg shrink-0">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Mail size={14} /> {client.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar size={14} /> Joined {new Date(client.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                  <div className="text-sm text-gray-500">Total Payments: <span className="font-bold text-gray-900">{client.payments.length}</span></div>
                  <div className="text-sm text-gray-500">Properties Assigned: <span className="font-bold text-gray-900">{client.assignedProperties.length}</span></div>
                </div>
              </div>

              {/* Assignments & Actions Section */}
              <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Currently Assigned */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <KeySquare size={16} className="text-brand-600" /> Assigned Properties
                  </h4>
                  {client.assignedProperties.length === 0 ? (
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      No properties assigned yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {client.assignedProperties.map(prop => (
                        <div key={prop.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{prop.title}</p>
                            <p className="text-xs text-gray-500">{prop.location}</p>
                          </div>
                          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded">
                            {prop.propertyNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assignment Form */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <LinkIcon size={16} className="text-brand-600" /> Assign New Property
                  </h4>
                  <form action={async (formData) => {
                    "use server";
                    const { assignProperty } = await import("./actions");
                    await assignProperty(client.id, formData);
                  }} className="flex gap-2">
                    <input 
                      type="text" 
                      name="propertyNumber" 
                      placeholder="e.g. SS-123456" 
                      required
                      className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
                    />
                    <button type="submit" className="text-white bg-brand-600 hover:bg-brand-700 font-medium rounded-lg text-sm px-4 py-2 transition-colors">
                      Assign
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">Enter the unique property number to assign it to this client.</p>
                </div>
              </div>

              {/* Payments List */}
              <div className="p-0">
                {client.payments.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                    <CreditCard size={16} /> No payments recorded for this client.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Property</th>
                          <th className="px-6 py-3 font-medium">Amount</th>
                          <th className="px-6 py-3 font-medium">Transaction ID</th>
                          <th className="px-6 py-3 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {client.payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {payment.property.title}
                              <span className="block text-xs text-gray-500 font-normal">{payment.property.location}</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              ₹{payment.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                              {payment.razorpayPaymentId || payment.id}
                            </td>
                            <td className="px-6 py-4 text-sm text-right">
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
          ))
        )}
      </div>
    </div>
  );
}
