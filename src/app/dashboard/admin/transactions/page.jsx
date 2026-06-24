import React from 'react';
import TransactionsTable from './TransactionsTable';
import { getAllSubscriptions } from '@/lib/api/subscriptions';
import { getAllPurchases } from '@/lib/api/purchases';

const TransactionsPage = async () => {
    let subscriptions = [];
    let purchases = [];
    let fetchError = false;

    try {
        const [subsData, purchData] = await Promise.all([
            getAllSubscriptions(),
            getAllPurchases()
        ]);
        subscriptions = subsData || [];
        purchases = purchData || [];
    } catch (error) {
        console.error("Failed to fetch transactions from backend:", error);
        fetchError = true;
    }

    // Process and merge transactions
    const formattedPurchases = purchases.map(p => ({
        id: p._id || p.id,
        type: 'purchase',
        userEmail: p.userEmail,
        userName: p.userName,
        artistEmail: p.artistEmail,
        artistName: p.artistName,
        amount: Number(p.price) || 0,
        date: p.purchaseDate || new Date()
    }));

    const formattedSubscriptions = subscriptions.map(s => {
        let amount = 0;
        const plan = String(s.planId || "").toLowerCase();
        if (plan.includes("premium")) {
            amount = 19.99;
        } else if (plan.includes("pro")) {
            amount = 9.99;
        }

        return {
            id: s._id || s.id,
            type: 'subscription',
            userEmail: s.email,
            planId: s.planId,
            amount: amount,
            date: s.createdAt || new Date()
        };
    });

    const allTransactions = [...formattedPurchases, ...formattedSubscriptions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order
    });

    return (
        <div className="space-y-8">
            <TransactionsTable initialTransactions={allTransactions} fetchError={fetchError} />
        </div>
    );
};

export default TransactionsPage;