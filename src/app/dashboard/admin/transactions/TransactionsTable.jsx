"use client";

import React, { useState, useMemo } from 'react';
import { Table, Chip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

const TransactionsTable = ({ initialTransactions = [], fetchError = false }) => {
    const [transactions] = useState(initialTransactions);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "date",
        direction: "descending",
    });

    // Filtering logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const id = (tx.id || "").toLowerCase();
            const userEmail = (tx.userEmail || "").toLowerCase();
            const artistEmail = (tx.artistEmail || "").toLowerCase();
            const planId = (tx.planId || "").toLowerCase();
            const query = searchQuery.toLowerCase();

            const matchesSearch = id.includes(query) || 
                                 userEmail.includes(query) || 
                                 artistEmail.includes(query) ||
                                 planId.includes(query);

            const matchesType = typeFilter === "all" || tx.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [transactions, searchQuery, typeFilter]);

    // Sorting logic
    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            const col = sortDescriptor.column;
            let first = a[col];
            let second = b[col];

            if (col === 'amount') {
                first = Number(first) || 0;
                second = Number(second) || 0;
                return sortDescriptor.direction === "ascending" ? first - second : second - first;
            }

            if (col === 'date') {
                const dateA = new Date(first).getTime() || 0;
                const dateB = new Date(second).getTime() || 0;
                return sortDescriptor.direction === "ascending" ? dateA - dateB : dateB - dateA;
            }

            const firstStr = String(first || "").toLowerCase();
            const secondStr = String(second || "").toLowerCase();
            
            let cmp = firstStr.localeCompare(secondStr);
            if (sortDescriptor.direction === "descending") cmp *= -1;
            return cmp;
        });
    }, [filteredTransactions, sortDescriptor]);

    return (
        <div className="space-y-6">
            {/* 🏷️ Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#121212] rounded-xl border border-white/[0.06] text-white">
                        <Icon icon="solar:card-transfer-bold-duotone" className="size-5 text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">View All Transactions</h1>
                        <p className="text-xs text-gray-500 mt-1">Monitor all digital art purchases and premium creator subscriptions.</p>
                    </div>
                </div>
            </div>

            {fetchError && (
                <div className="bg-red-950/40 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-start gap-4">
                    <Icon icon="solar:danger-bold" className="size-6 shrink-0 text-red-500 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm text-red-200">Server Connection Failed</h4>
                        <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
                            Could not fetch transactions from the backend server. Please verify the API is running correctly.
                        </p>
                    </div>
                </div>
            )}

            {/* 🔍 Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by Transaction ID, email, or plan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#121212] border border-white/[0.06] focus:border-[#D4AF37]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    />
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500">
                        <Icon icon="solar:magnifer-linear" className="size-4" />
                    </div>
                </div>

                <div className="relative w-full sm:w-48">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full bg-[#121212] border border-white/[0.06] focus:border-[#D4AF37]/50 rounded-xl pl-4 pr-10 py-2.5 text-sm text-gray-300 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        <option value="purchase">Purchase</option>
                        <option value="subscription">Subscription</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                        <Icon icon="solar:alt-arrow-down-linear" className="size-4" />
                    </div>
                </div>
            </div>

            {/* 📊 Transactions Table */}
            {sortedTransactions.length > 0 ? (
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content
                                aria-label="Transactions History Table"
                                className="min-w-[1000px]"
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                            >
                                <Table.Header>
                                    <Table.Column allowsSorting id="id">Transaction ID</Table.Column>
                                    <Table.Column id="type">Type</Table.Column>
                                    <Table.Column id="emails">User / Artist Email</Table.Column>
                                    <Table.Column allowsSorting id="amount">Amount</Table.Column>
                                    <Table.Column allowsSorting id="date">Date</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {sortedTransactions.map((tx) => (
                                        <Table.Row key={tx.id} id={tx.id}>
                                            {/* Transaction ID */}
                                            <Table.Cell className="font-mono text-xs text-gray-600">
                                                {tx.id}
                                            </Table.Cell>

                                            {/* Type Badge */}
                                            <Table.Cell>
                                                {tx.type === 'purchase' ? (
                                                    <Chip 
                                                        size="sm" 
                                                        variant="flat" 
                                                        className="font-bold uppercase tracking-wider text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    >
                                                        Purchase
                                                    </Chip>
                                                ) : (
                                                    <Chip 
                                                        size="sm" 
                                                        variant="flat" 
                                                        className="font-bold uppercase tracking-wider text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                    >
                                                        Subscription
                                                    </Chip>
                                                )}
                                            </Table.Cell>

                                            {/* Email Fields */}
                                            <Table.Cell>
                                                <div className="flex flex-col gap-0.5">
                                                    {tx.type === 'purchase' ? (
                                                        <>
                                                            <div className="text-xs text-gray-600">
                                                                <span className="text-gray-700 font-semibold uppercase tracking-wider text-[9px] mr-1">Buyer:</span>
                                                                {tx.userEmail} {tx.userName && `(${tx.userName})`}
                                                            </div>
                                                            <div className="text-[11px] text-gray-600">
                                                                <span className="text-gray-500 font-semibold uppercase tracking-wider text-[9px] mr-1">Artist:</span>
                                                                {tx.artistEmail} {tx.artistName && `(${tx.artistName})`}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-xs text-gray-600">
                                                            <span className="text-gray-500 font-semibold uppercase tracking-wider text-[9px] mr-1">User:</span>
                                                            {tx.userEmail}
                                                            {tx.planId && (
                                                                <span className="ml-2 text-[10px] text-white bg-purple-500 border border-purple-800/30 px-1.5 py-0.5 rounded font-mono">
                                                                    {tx.planId.replace('buynower_', '')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </Table.Cell>

                                            {/* Amount */}
                                            <Table.Cell className="font-bold text-gray-600 text-sm">
                                                ${Number(tx.amount || 0).toFixed(2)}
                                            </Table.Cell>

                                            {/* Date */}
                                            <Table.Cell className="text-xs text-gray-400">
                                                {new Date(tx.date).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-20 bg-[#121212] border border-white/[0.06] rounded-2xl">
                    <Icon icon="solar:bill-list-linear" className="size-10 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-sm font-semibold text-white">No Transactions Found</h3>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or filters.</p>
                </div>
            )}
        </div>
    );
};

export default TransactionsTable;
