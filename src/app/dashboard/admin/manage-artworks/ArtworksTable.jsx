"use client";

import React, { useState, useMemo } from 'react';
import { Table, Avatar, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { deleteArt } from '@/lib/api/arts';

const ArtworksTable = ({ initialArtworks = [], fetchError = false }) => {
    const [artworks, setArtworks] = useState(initialArtworks);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState(null);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "title",
        direction: "ascending",
    });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async (artId, artTitle) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${artTitle}"?`)) {
            return;
        }

        setDeletingId(artId);
        try {
            const response = await deleteArt(artId);
            
            if (response) {
                setArtworks(prev => prev.filter(art => (art._id !== artId && art.id !== artId)));
                showToast(`"${artTitle}" has been successfully deleted.`, "success");
            } else {
                showToast("Failed to delete artwork. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error deleting artwork:", error);
            showToast("An error occurred while deleting the artwork.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    // Filter logic
    const filteredArtworks = useMemo(() => {
        return artworks.filter(art => {
            const title = (art.title || "").toLowerCase();
            const artistName = (art.artistName || "").toLowerCase();
            const artistEmail = (art.artistEmail || "").toLowerCase();
            const category = (art.category || "").toLowerCase();
            const query = searchQuery.toLowerCase();

            return title.includes(query) || 
                   artistName.includes(query) || 
                   artistEmail.includes(query) ||
                   category.includes(query);
        });
    }, [artworks, searchQuery]);

    // Sorting logic
    const sortedArtworks = useMemo(() => {
        return [...filteredArtworks].sort((a, b) => {
            const col = sortDescriptor.column;
            let first = a[col];
            let second = b[col];

            if (col === 'price') {
                first = Number(first) || 0;
                second = Number(second) || 0;
                return sortDescriptor.direction === "ascending" ? first - second : second - first;
            }

            const firstStr = String(first || "").toLowerCase();
            const secondStr = String(second || "").toLowerCase();
            
            let cmp = firstStr.localeCompare(secondStr);
            if (sortDescriptor.direction === "descending") cmp *= -1;
            return cmp;
        });
    }, [filteredArtworks, sortDescriptor]);

    return (
        <div className="space-y-6">
            {/* 🏷️ Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#121212] rounded-xl border border-white/[0.06] text-white">
                        <Icon icon="solar:gallery-wide-bold-duotone" className="size-5 text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Manage Artworks</h1>
                        <p className="text-xs text-gray-500 mt-1">View, search, and manage all posted artworks in the system.</p>
                    </div>
                </div>

                {toast && (
                    <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl border flex items-center gap-2 shadow-2xl transition-all animate-bounce ${
                        toast.type === "success" 
                            ? "bg-green-950/80 border-green-500/30 text-green-400" 
                            : "bg-red-950/80 border-red-500/30 text-red-400"
                    }`}>
                        <Icon icon={toast.type === "success" ? "solar:check-circle-bold" : "solar:danger-bold"} className="size-5" />
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                )}
            </div>

            {fetchError && (
                <div className="bg-red-950/40 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-start gap-4">
                    <Icon icon="solar:danger-bold" className="size-6 shrink-0 text-red-500 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm text-red-200">Server Connection Failed</h4>
                        <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
                            Could not fetch artworks from the backend. Please check that the server is running on port 5000.
                        </p>
                    </div>
                </div>
            )}

            {/* 🔍 Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by title, artist, email, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#121212] border border-white/[0.06] focus:border-[#D4AF37]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    />
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500">
                        <Icon icon="solar:magnifer-linear" className="size-4" />
                    </div>
                </div>
            </div>

            {/* 📊 Artworks Table */}
            {sortedArtworks.length > 0 ? (
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content
                                aria-label="Manage Artworks Table"
                                className="min-w-[900px]"
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                            >
                                <Table.Header>
                                    <Table.Column allowsSorting id="title">Artwork</Table.Column>
                                    <Table.Column id="category">Category</Table.Column>
                                    <Table.Column allowsSorting id="artistName">Artist</Table.Column>
                                    <Table.Column allowsSorting id="price">Price</Table.Column>
                                    <Table.Column className="text-end">Actions</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {sortedArtworks.map((art) => {
                                        const artId = art._id || art.id;
                                        const isDeleting = deletingId === artId;

                                        return (
                                            <Table.Row key={artId} id={artId}>
                                                {/* Image & Title */}
                                                <Table.Cell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar size="md" className="rounded-xl border border-white/10 shrink-0">
                                                            <Avatar.Image src={art.image} />
                                                            <Avatar.Fallback>
                                                                <Icon icon="solar:gallery-bold" className="size-5 text-gray-400" />
                                                            </Avatar.Fallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-200">
                                                               Title:  {art.title || "Untitled"}
                                                            </span>
                                                            <span className="text-xs text-gray-500 font-mono">
                                                                ID: {artId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Table.Cell>

                                                {/* Category */}
                                                <Table.Cell className="text-gray-400 text-sm">
                                                    {art.category || "N/A"}
                                                </Table.Cell>

                                                {/* Artist Details */}
                                                <Table.Cell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-white">
                                                            {art.artistName || "Unknown"}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {art.artistEmail || "No Email"}
                                                        </span>
                                                    </div>
                                                </Table.Cell>

                                                {/* Price */}
                                                <Table.Cell className="font-bold text-[#e2b025] text-sm">
                                                    ${Number(art.price || 0).toLocaleString()}
                                                </Table.Cell>

                                                {/* Actions */}
                                                <Table.Cell>
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Button 
                                                            isIconOnly
                                                            size="sm" 
                                                            variant="light" 
                                                            color="danger"
                                                            disabled={isDeleting}
                                                            onClick={() => handleDelete(artId, art.title)}
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 min-w-8 w-8 h-8 rounded-lg"
                                                        >
                                                            {isDeleting ? (
                                                                <Icon icon="eos-icons:loading" className="size-4 animate-spin text-red-500" />
                                                            ) : (
                                                                <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-20 bg-[#121212] border border-white/[0.06] rounded-2xl">
                    <Icon icon="solar:gallery-linear" className="size-10 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-sm font-semibold text-white">No Artworks Found</h3>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
};

export default ArtworksTable;
