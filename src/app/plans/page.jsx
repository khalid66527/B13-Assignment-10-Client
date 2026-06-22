import React from 'react';
import { Icon } from '@iconify/react';

const SubscriptionOverviewPage = () => {
    // ইমেজের ডাটা স্ট্রাকচার
    const plan = [
        {
            name: 'Free ',
            id:'buynower_free',
            limit: '3 paintings',
            price: '$0',
            isCurrent: true
        },
        {
            name: 'Pro',
            id:'buynower_Pro',
            limit:'9 paintings',
            price: '$9.99',
            isCurrent: false
        },
        {
            name: 'Premium',
            id:'buynower_Premium',
            limit: 'Unlimited',
            price: '$19.99',
            isCurrent: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* 📋 সেকশন হেডার */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-5">
                    <div className="p-3 bg-[#161616] rounded-2xl border border-white/5 text-[#D4AF37]">
                        <Icon icon="solar:bill-list-linear" className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Subscription plan Overview</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Review and select your preferred artwork purchasing plan.</p>
                    </div>
                </div>

                {/* 📊 ১. প্রিমিয়াম কার্ড গ্রিড লেআউট */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plan.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-[2rem] p-6 border transition-all flex flex-col justify-between ${plan.isCurrent
                                ? 'bg-gradient-to-b from-[#1c1710] to-[#0F0F0F] border-[#D4AF37]/30 shadow-[0_4px_30px_rgba(212,175,55,0.05)]'
                                : 'bg-[#111111]/80 border-white/5 hover:border-white/10'
                                }`}
                        >
                            {/* কারেন্ট প্ল্যান ইন্ডিকেটর ব্যাজ */}
                            {plan.isCurrent && (
                                <div className="absolute top-3 right-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFE58F] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                                    Current Plan
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-white tracking-wide">{plan.name}</h3>
                                    <div className="mt-2 flex items-baseline text-white">
                                        <span className="text-3xl font-black tracking-tight text-[#D4AF37]">{plan.price}</span>
                                        {plan.price !== '$0' && <span className="ml-1 text-xs font-semibold text-gray-500">/month</span>}
                                    </div>
                                </div>

                                <div className="h-[1px] bg-white/5 my-2"></div>

                                <ul className="space-y-2.5 text-xs text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <Icon icon="solar:check-circle-bold" className="text-[#D4AF37] size-4 shrink-0" />
                                        <span>Max Purchases Allowed: <strong className="text-white">{plan.limit}</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Icon icon="solar:check-circle-bold" className="text-[#D4AF37] size-4 shrink-0" />
                                        <span>Full Digital Distribution Rights</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Icon icon="solar:check-circle-bold" className="text-[#D4AF37] size-4 shrink-0" />
                                        <span>Standard Support Access</span>
                                    </li>
                                </ul>
                            </div>

                            <form action="/api/checkout_sessions" method="POST">
                            <input type="hidden" name='plan_id' value={plan.id}/>
                                <section>
                                    <button type="submit" role="link"
                                        className={`w-full mt-8 py-3 rounded-xl font-extrabold tracking-wide text-xs transition-all ${plan.isCurrent
                                            ? 'bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black shadow-md'
                                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                            }`}
                                    >
                                        {plan.isCurrent ? 'Active Plan' : `Upgrade to ${plan.name.split(' ')[0]}`}
                                    </button>
                                </section>
                            </form>
                        </div>
                    ))}
                </div>

                {/* 📋 ২. ইমেজের মতো ক্লিন টেবিল ওভারভিউ সেকশন */}
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl mt-8">
                    <div className="p-5 bg-[#111111] border-b border-white/5 flex items-center gap-2">
                        <Icon icon="solar:tuning-square-linear" className="text-[#D4AF37] size-5" />
                        <h3 className="text-sm font-bold text-white">Compare Plan Metrics</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-[#161616]/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    <th className="py-4 px-6">Plan</th>
                                    <th className="py-4 px-6">Max Purchases Allowed</th>
                                    <th className="py-4 px-6 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                                {plan.map((plan, index) => (
                                    <tr key={index} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="py-4 px-6 font-bold text-white group-hover:text-[#FFE58F] transition-colors">
                                            {plan.name}
                                        </td>
                                        <td className="py-4 px-6 text-gray-400">
                                            {plan.limit}
                                        </td>
                                        <td className="py-4 px-6 text-right font-black text-[#D4AF37]">
                                            {plan.price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubscriptionOverviewPage;