"use client";

import { useState, useMemo } from "react";
import { PlusCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

export function EMICalculator() {
  const [principal, setPrincipal] = useState(29600000);
  const [rate, setRate] = useState(13.1);
  const [tenure, setTenure] = useState(5);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedYear, setExpandedYear] = useState<number | null>(new Date().getFullYear());
  const [visibleYearsCount, setVisibleYearsCount] = useState(5);

  const { emi, totalInterest, totalAmount, amortizationSchedule } = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate) / 12 / 100;
    const n = Number(tenure) * 12;

    let emiCalc = 0;
    if (r > 0 && n > 0) {
      emiCalc = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      emiCalc = p / n;
    }

    const totalAmt = emiCalc * n;
    const totalInt = totalAmt - p;

    // Amortization Schedule Calculation
    const schedule: { year: number; months: any[] }[] = [];
    let currentBalance = p;
    let currentYear = new Date().getFullYear();
    let currentMonthIdx = new Date().getMonth();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let currentYearData = { year: currentYear, months: [] as any[] };

    for (let i = 0; i < n; i++) {
      const interestForMonth = currentBalance * r;
      let principalForMonth = emiCalc - interestForMonth;
      
      // Prevent rounding issues on the final month
      if (i === n - 1) {
        principalForMonth = currentBalance;
      }
      
      currentBalance = currentBalance - principalForMonth;
      if (currentBalance < 0) currentBalance = 0;

      currentYearData.months.push({
        monthName: monthNames[currentMonthIdx],
        principalPaid: principalForMonth,
        interestCharged: interestForMonth,
        totalPayment: principalForMonth + interestForMonth,
        balance: currentBalance
      });

      currentMonthIdx++;
      if (currentMonthIdx > 11) {
        currentMonthIdx = 0;
        schedule.push(currentYearData);
        currentYear++;
        currentYearData = { year: currentYear, months: [] };
      }
    }
    
    // Push the final year if it has any months left
    if (currentYearData.months.length > 0) {
      schedule.push(currentYearData);
    }

    return {
      emi: Math.round(emiCalc),
      totalInterest: Math.round(totalInt),
      totalAmount: Math.round(totalAmt),
      amortizationSchedule: schedule
    };
  }, [principal, rate, tenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Donut chart calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const principalPercent = totalAmount > 0 ? principal / totalAmount : 1;
  const principalDash = principalPercent * circumference;

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-10 text-center">
          EMI Calculator
        </h2>
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.05)] p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left side: Sliders */}
            <div className="flex-1 space-y-12">
              
              {/* Principal Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[15px] font-medium text-gray-600">Loan amount</label>
                  <div className="bg-[#00D09C]/10 text-[#00D09C] px-4 py-1.5 rounded-sm font-bold text-lg">
                    ₹ {principal.toLocaleString('en-IN')}
                  </div>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="100000000"
                  step="100000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded-full outline-none"
                  style={{
                    background: `linear-gradient(to right, #00D09C ${(principal / 100000000) * 100}%, #e5e7eb ${(principal / 100000000) * 100}%)`,
                  }}
                />
                <style jsx>{`
                  input[type=range]::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  }
                `}</style>
              </div>

              {/* Rate Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[15px] font-medium text-gray-600">Rate of interest (p.a)</label>
                  <div className="bg-[#00D09C]/10 text-[#00D09C] px-4 py-1.5 rounded-sm font-bold text-lg">
                    {rate} %
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded-full outline-none"
                  style={{
                    background: `linear-gradient(to right, #00D09C ${(rate / 30) * 100}%, #e5e7eb ${(rate / 30) * 100}%)`,
                  }}
                />
              </div>

              {/* Tenure Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[15px] font-medium text-gray-600">Loan tenure</label>
                  <div className="bg-[#00D09C]/10 text-[#00D09C] px-4 py-1.5 rounded-sm font-bold text-lg">
                    {tenure} Yr
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded-full outline-none"
                  style={{
                    background: `linear-gradient(to right, #00D09C ${(tenure / 30) * 100}%, #e5e7eb ${(tenure / 30) * 100}%)`,
                  }}
                />
              </div>
            </div>

            {/* Right side: Chart */}
            <div className="flex-1 flex flex-col items-center justify-center pt-4 lg:pt-0">
              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 rounded-full bg-[#EAEBFE]"></div>
                  <span className="text-sm font-medium text-gray-500">Principal amount</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 rounded-full bg-[#5367FF]"></div>
                  <span className="text-sm font-medium text-gray-500">Interest amount</span>
                </div>
              </div>

              <div className="relative w-[220px] h-[220px]">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Interest (Background / Full circle) */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="#EAEBFE"
                    strokeWidth="35"
                  />
                  {/* Principal (Foreground) */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="#5367FF"
                    strokeWidth="35"
                    strokeDasharray={`${principalDash} ${circumference}`}
                    className="transition-all duration-500 ease-in-out"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="mt-16 space-y-6 max-w-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Monthly EMI</span>
              <span className="text-gray-800 font-semibold text-lg">{formatCurrency(emi)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Principal amount</span>
              <span className="text-gray-800 font-semibold text-lg">{formatCurrency(principal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total interest</span>
              <span className="text-gray-800 font-semibold text-lg">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total amount</span>
              <span className="text-gray-800 font-semibold text-lg">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="mt-16 text-center border-t border-gray-100 pt-8">
            <p className="text-gray-500 font-medium mb-4">Your Amortization Details (Yearly/Monthly)</p>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showDetails ? <XCircle className="w-8 h-8 mx-auto" /> : <PlusCircle className="w-8 h-8 mx-auto" />}
            </button>
          </div>

          {/* Amortization Schedule View */}
          {showDetails && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
              {amortizationSchedule.slice(0, visibleYearsCount).map((yearData) => (
                <div key={yearData.year} className="mb-2">
                  <button 
                    onClick={() => setExpandedYear(expandedYear === yearData.year ? null : yearData.year)}
                    className="w-full flex justify-between items-center py-5 border-b border-gray-100 text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {yearData.year}
                    {expandedYear === yearData.year ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  
                  {expandedYear === yearData.year && (
                    <div className="bg-[#eff9f4] rounded-lg mt-2 overflow-hidden shadow-inner">
                      {/* Table Header */}
                      <div className="grid grid-cols-5 text-[13px] font-medium text-gray-500 py-4 px-6 border-b border-white/60">
                        <div>Month</div>
                        <div className="text-right">Principal Paid</div>
                        <div className="text-right">Interest Charged</div>
                        <div className="text-right">Total Payment</div>
                        <div className="text-right">Balance</div>
                      </div>
                      
                      {/* Table Rows */}
                      {yearData.months.map((m, i) => (
                        <div key={i} className="grid grid-cols-5 text-[14px] text-gray-600 py-4 px-6 border-b border-white/60 last:border-0 hover:bg-[#e4f5ed] transition-colors">
                          <div className="font-medium text-gray-700">{m.monthName}</div>
                          <div className="text-right">{formatCurrency(Math.round(m.principalPaid))}</div>
                          <div className="text-right">{formatCurrency(Math.round(m.interestCharged))}</div>
                          <div className="text-right">{formatCurrency(Math.round(m.totalPayment))}</div>
                          <div className="text-right font-medium text-gray-800">{formatCurrency(Math.round(m.balance))}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {visibleYearsCount < amortizationSchedule.length && (
                <div className="text-center mt-10">
                  <button 
                    onClick={() => setVisibleYearsCount(prev => prev + 5)}
                    className="bg-[#00D09C] hover:bg-[#00c08b] text-white px-8 py-3 rounded-md font-medium transition-colors shadow-md"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
}
