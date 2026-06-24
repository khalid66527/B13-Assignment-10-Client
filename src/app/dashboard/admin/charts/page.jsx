import React from 'react';
import ChartsDashboard from './ChartsDashboard';
import { getCompanyArts } from '@/lib/api/arts';
import { getAllPurchases } from '@/lib/api/purchases';
import { getAllSubscriptions } from '@/lib/api/subscriptions';

const ChartsPage = async () => {
    let artworks = [];
    let purchases = [];
    let subscriptions = [];
    let fetchError = false;

    try {
        const [artsData, purchasesData, subsData] = await Promise.all([
            getCompanyArts(),
            getAllPurchases(),
            getAllSubscriptions()
        ]);
        artworks = artsData || [];
        purchases = purchasesData || [];
        subscriptions = subsData || [];
    } catch (error) {
        console.error("Failed to load charts datasets:", error);
        fetchError = true;
    }

    // Format all sales entries (purchases + subscription upgrades)
    const sales = [
        ...purchases.map(p => ({
            amount: Number(p.price) || 0,
            date: p.purchaseDate || new Date()
        })),
        ...subscriptions.map(s => {
            let amount = 0;
            const plan = String(s.planId || "").toLowerCase();
            if (plan.includes("premium")) amount = 19.99;
            else if (plan.includes("pro")) amount = 9.99;

            return {
                amount: amount,
                date: s.createdAt || new Date()
            };
        })
    ];

    // Compute category counts
    const categoryCountsMap = artworks.reduce((acc, art) => {
        const cat = art.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const sortedCategoryCounts = Object.entries(categoryCountsMap)
        .sort((a, b) => b[1] - a[1]);

    return (
        <div className="space-y-8">
            <ChartsDashboard 
                sales={sales} 
                categoryCounts={sortedCategoryCounts} 
                totalArtworks={artworks.length} 
                fetchError={fetchError}
            />
        </div>
    );
};

export default ChartsPage;