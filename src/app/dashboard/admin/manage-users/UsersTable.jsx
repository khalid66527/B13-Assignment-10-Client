"use client";

import React, { useState, useMemo } from 'react';
import { Table, Avatar, Chip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { updateUserRole } from '@/lib/actions/alluser';

const UsersTable = ({ initialUsers = [], fetchError = false }) => {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [updatingId, setUpdatingId] = useState(null);
    const [toast, setToast] = useState(null);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        try {
            const response = await updateUserRole(userId, newRole);
            
            if (response) {
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        (user._id === userId || user.id === userId) 
                            ? { ...user, role: newRole } 
                            : user
                    )
                );
                showToast(`Role updated to ${newRole} successfully!`, "success");
            } else {
                showToast("Failed to update role. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error updating user role:", error);
            showToast("An error occurred while updating the role.", "error");
        } finally {
            setUpdatingId(null);
        }
    };

   
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const name = (user.name || "").toLowerCase();
            const email = (user.email || "").toLowerCase();
            const matchesSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    
    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            const col = sortDescriptor.column;
            const first = String(a[col] || "");
            const second = String(b[col] || "");
            
            let cmp = first.localeCompare(second);
            if (sortDescriptor.direction === "descending") cmp *= -1;
            return cmp;
        });
    }, [filteredUsers, sortDescriptor]);

    return (
        <div className="space-y-6">         
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#121212] rounded-xl border border-white/[0.06] text-white">
                        <Icon icon="solar:users-group-two-rounded-bold-duotone" className="size-5 text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Manage Users</h1>
                        <p className="text-xs text-gray-500 mt-1">View all registered users and change their system roles.</p>
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
                        <h4 className="font-bold text-sm text-red-200">Server Connection Failed (http://localhost:5000)</h4>
                        <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
                            Could not fetch registered users from the backend database. Please ensure your backend server (<code className="bg-red-950 px-1.5 py-0.5 rounded text-red-300 font-mono">b13-assingment-10-server</code>) is running and listening on port 5000 (e.g. by running <code className="bg-red-950 px-1.5 py-0.5 rounded text-red-300 font-mono">npm run dev</code> or <code className="bg-red-950 px-1.5 py-0.5 rounded text-red-300 font-mono">npm start</code> in the server folder).
                        </p>
                    </div>
                </div>
            )}

           
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
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
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full bg-[#121212] border border-white/[0.06] focus:border-[#D4AF37]/50 rounded-xl pl-4 pr-10 py-2.5 text-sm text-gray-300 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="buyer">User</option>
                        <option value="artist">Artist</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                        <Icon icon="solar:alt-arrow-down-linear" className="size-4" />
                    </div>
                </div>
            </div>

            {/* 📊 ইউজার টেবিল */}
            {sortedUsers.length > 0 ? (
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content
                                aria-label="Manage Users Table"
                                className="min-w-[900px]"
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                            >
                                <Table.Header>
                                    <Table.Column allowsSorting id="name">Name</Table.Column>
                                    <Table.Column allowsSorting id="email">Email</Table.Column>
                                    <Table.Column allowsSorting id="role">Role</Table.Column>
                                    <Table.Column className="text-end">Actions</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {sortedUsers.map((user) => {
                                        const userId = user._id || user.id;
                                        const isUpdating = updatingId === userId;
                                        
                                        return (
                                            <Table.Row key={userId} id={userId}>
                                                {/* নাম ও অবতার */}
                                                <Table.Cell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar size="sm" className="rounded-full border border-white/10 shrink-0">
                                                            <Avatar.Image src={user.image} />
                                                            <Avatar.Fallback>
                                                                <Icon icon="solar:user-bold" className="size-4 text-gray-400" />
                                                            </Avatar.Fallback>
                                                        </Avatar>
                                                        <span className="text-sm font-semibold text-white">
                                                            {user.name || "N/A"}
                                                        </span>
                                                    </div>
                                                </Table.Cell>

                                                {/* ইমেইল */}
                                                <Table.Cell className="text-gray-400 text-sm">
                                                    {user.email}
                                                </Table.Cell>

                                                {/* রোল চিপ */}
                                                <Table.Cell>
                                                    {user.role === 'admin' && (
                                                        <Chip color="danger" size="sm" variant="flat" className="font-bold uppercase tracking-wider text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                                                            Admin
                                                        </Chip>
                                                    )}
                                                    {user.role === 'artist' && (
                                                        <Chip color="warning" size="sm" variant="flat" className="font-bold uppercase tracking-wider text-xs bg-[#D4AF37]/10 text-[#FFE58F] border border-[#D4AF37]/20">
                                                            Artist
                                                        </Chip>
                                                    )}
                                                    {user.role !== 'admin' && user.role !== 'artist' && (
                                                        <Chip color="default" size="sm" variant="flat" className="font-bold uppercase tracking-wider text-xs bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                                                            User
                                                        </Chip>
                                                    )}
                                                </Table.Cell>

                                                {/* অ্যাকশন (রোল পরিবর্তন) */}
                                                <Table.Cell>
                                                    <div className="flex items-center justify-end gap-3">
                                                        {isUpdating && (
                                                            <Icon icon="eos-icons:loading" className="size-4 text-[#D4AF37] animate-spin" />
                                                        )}
                                                        <div className="relative w-36">
                                                            <select
                                                                value={user.role || 'buyer'}
                                                                disabled={isUpdating}
                                                                onChange={(e) => handleRoleChange(userId, e.target.value)}
                                                                className="w-full bg-[#1A1A1A] border border-white/10 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <option value="buyer" className="bg-[#121212] text-gray-300">User</option>
                                                                <option value="artist" className="bg-[#121212] text-gray-300">Artist</option>
                                                                <option value="admin" className="bg-[#121212] text-gray-300">Admin</option>
                                                            </select>
                                                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                                                                <Icon icon="solar:alt-arrow-down-linear" className="size-3.5" />
                                                            </div>
                                                        </div>
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
                
                <div className="text-center py-20 bg-[#121212] border border-white/[0.06] rounded-2xl">
                    <Icon icon="solar:users-group-two-rounded-linear" className="size-10 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-sm font-semibold text-white">No Users Found</h3>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or role filter.</p>
                </div>
            )}
        </div>
    );
};

export default UsersTable;