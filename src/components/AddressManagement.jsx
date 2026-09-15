'use client';
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';
import { getUserAddresses } from '@/lib/api/address';
import { addUserAddress, updateUserAddress, setDefaultAddress, deleteUserAddress } from '@/lib/actions/address';
import { BANGLADESH_DIVISIONS, BD_DISTRICTS, BD_THANAS } from '@/lib/data/locations';

export default function AddressManagement({ user }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        division: 'Dhaka',
        district: 'Dhaka City',
        thana: 'Dhanmondi',
        street: '',
        landmark: '',
        address: '',
        label: 'Home',
        isDefault: true,
    });

    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
    };

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const userAddrs = await getUserAddresses(user?.email, user?.id);
            setAddresses(Array.isArray(userAddrs) ? userAddrs : []);
        } catch (err) {
            console.error('Failed to load user addresses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [user?.email, user?.id]);

    const cleanDivKey = (formData.division || "Dhaka").split(" ")[0];
    const availableDistricts = BD_DISTRICTS[cleanDivKey] || BD_DISTRICTS[formData.division] || BD_DISTRICTS["Dhaka"] || [];
    const cleanDistKey = formData.district || availableDistricts[0] || "Dhaka City";
    const availableThanas = BD_THANAS[cleanDistKey] || BD_THANAS[cleanDistKey.split(" ")[0]] || ["Sadar", "Other"];

    const handleDivisionChange = (newDivision) => {
        const key = (newDivision || "Dhaka").split(" ")[0];
        const newDistricts = BD_DISTRICTS[key] || BD_DISTRICTS[newDivision] || BD_DISTRICTS["Dhaka"] || [];
        const firstDistrict = newDistricts[0] || "";
        const distKey = (firstDistrict || "").split(" ")[0];
        const newThanas = BD_THANAS[firstDistrict] || BD_THANAS[distKey] || ["Sadar", "Other"];
        setFormData((prev) => ({ ...prev, division: newDivision, district: firstDistrict, thana: newThanas[0] || "" }));
    };

    const handleDistrictChange = (newDistrict) => {
        const key = (newDistrict || "").split(" ")[0];
        const newThanas = BD_THANAS[newDistrict] || BD_THANAS[key] || ["Sadar", "Other"];
        setFormData((prev) => ({ ...prev, district: newDistrict, thana: newThanas[0] || "" }));
    };

    const handleOpenAddModal = () => {
        setEditingAddress(null);
        setFormData({
            fullName: user?.name || '',
            phone: '',
            division: 'Dhaka',
            district: 'Dhaka City',
            thana: 'Dhanmondi',
            street: '',
            landmark: '',
            address: '',
            label: 'Home',
            isDefault: addresses.length === 0,
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (addr) => {
        setEditingAddress(addr);
        setFormData({
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            division: addr.division || addr.state || 'Dhaka',
            district: addr.district || addr.city || 'Dhaka City',
            thana: addr.thana || 'Dhanmondi',
            street: addr.street || '',
            landmark: addr.landmark || '',
            address: addr.address || addr.street || '',
            label: addr.label || 'Home',
            isDefault: addr.isDefault === true,
        });
        setIsModalOpen(true);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.division || !formData.district || !formData.street) {
            showNotification('Please fill in Full Name, Phone, Region, City, and Street Address.', 'error');
            return;
        }
        try {
            setSubmitting(true);
            const payload = {
                ...formData,
                city: formData.district,
                state: formData.division,
                country: 'Bangladesh',
                zipCode: '',
                userEmail: user?.email || '',
                userId: user?.id || '',
            };
            if (editingAddress?._id) {
                await updateUserAddress(editingAddress._id, payload);
                showNotification('Address updated successfully!');
            } else {
                await addUserAddress(payload);
                showNotification('New address saved successfully!');
            }
            setIsModalOpen(false);
            await fetchAddresses();
        } catch (err) {
            console.error('Error saving address:', err);
            showNotification('Failed to save address. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSetDefault = async (addrId) => {
        try {
            await setDefaultAddress(addrId, user?.email, user?.id);
            showNotification('Default address updated!');
            await fetchAddresses();
        } catch (err) {
            console.error('Error setting default address:', err);
            showNotification('Failed to set default address.', 'error');
        }
    };

    const handleDeleteAddress = async (addrId) => {
        if (typeof window !== "undefined" && !window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await deleteUserAddress(addrId);
            showNotification('Address deleted successfully!');
            await fetchAddresses();
        } catch (err) {
            console.error('Error deleting address:', err);
            showNotification('Failed to delete address.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border transition-all duration-300 ${toast.type === 'error' ? 'bg-[#1c1111] border-red-500/40 text-red-200' : 'bg-[#161616] border-[#D4AF37]/30 text-white'}`}>
                    <div className={`p-1 rounded-lg ${toast.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
                        <Icon icon={toast.type === 'error' ? 'solar:danger-circle-bold' : 'solar:check-circle-bold'} className="size-5" />
                    </div>
                    <div className="text-sm font-semibold">{toast.message}</div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Icon icon="solar:map-point-wave-bold-duotone" className="size-5 text-[#D4AF37]" />
                        Saved Addresses ({addresses.length})
                    </h3>
                    <p className="text-xs text-gray-400">Manage your delivery addresses for seamless checkout</p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                    <Icon icon="solar:add-circle-bold" className="size-4" />
                    Add New Address
                </button>
            </div>

            {/* Address List */}
            {loading ? (
                <div className="py-8 flex flex-col items-center gap-2 text-gray-400 text-xs">
                    <Icon icon="eos-icons:loading" className="size-6 text-[#D4AF37] animate-spin" />
                    <span>Loading saved addresses...</span>
                </div>
            ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr._id}
                            className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                                addr.isDefault
                                    ? 'bg-gradient-to-br from-[#1c1d18] to-[#141512] border-[#D4AF37]/40 shadow-lg'
                                    : 'bg-[#141414] border-white/5 hover:border-white/15'
                            }`}
                        >
                            {addr.isDefault && (
                                <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                                    Default
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap pr-12">
                                    <span className="font-bold text-white text-base">{addr.fullName}</span>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/10 text-gray-300">
                                        {addr.label || "Home"}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                    {addr.street}{addr.landmark ? ` (${addr.landmark})` : ''}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {addr.thana ? `${addr.thana}, ` : ''}
                                    {addr.district || addr.city}, {addr.division || addr.state}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-300 pt-1">
                                    <Icon icon="solar:phone-calling-rounded-bold" className="size-3.5 text-[#D4AF37]" />
                                    <span>{addr.phone}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                                {!addr.isDefault ? (
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(addr._id)}
                                        className="text-[11px] text-[#D4AF37] hover:underline font-semibold cursor-pointer"
                                    >
                                        Set as Default
                                    </button>
                                ) : (
                                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                                        <Icon icon="solar:check-circle-bold" className="size-3.5" /> Selected Default
                                    </span>
                                )}

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEditModal(addr)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <Icon icon="solar:pen-linear" className="size-3.5 text-[#D4AF37]" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAddress(addr._id)}
                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <Icon icon="solar:trash-bin-trash-linear" className="size-3.5" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 text-center space-y-3">
                    <div className="size-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto">
                        <Icon icon="solar:map-point-remove-bold" className="size-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">No Saved Addresses</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">Add your delivery address to quickly checkout your favorite artworks.</p>
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c49d2f] text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                        <Icon icon="solar:add-circle-bold" className="size-4" /> Add Address
                    </button>
                </div>
            )}

            {/* ADD / EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl bg-[#141414] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border border-white/10">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h3 className="text-base font-bold text-white">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <Icon icon="solar:close-circle-bold" className="size-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAddress} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* LEFT COLUMN */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Enter your first and last name"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Please enter your phone number"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">House No / Street *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            placeholder="Building / House / Street Address"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Landmark / Suburb</label>
                                        <input
                                            type="text"
                                            value={formData.landmark}
                                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                            placeholder="Nearby landmark or suburb"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Region / Division *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.division}
                                                onChange={(e) => handleDivisionChange(e.target.value)}
                                                className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                                            >
                                                {BANGLADESH_DIVISIONS.map((div) => (
                                                    <option key={div} value={div} className="bg-[#1a1a1a] text-white">{div}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">City / District *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.district}
                                                onChange={(e) => handleDistrictChange(e.target.value)}
                                                className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                                            >
                                                {availableDistricts.map((dist) => (
                                                    <option key={dist} value={dist} className="bg-[#1a1a1a] text-white">{dist}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Area / Thana *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.thana}
                                                onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                                                className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                                            >
                                                {availableThanas.map((th) => (
                                                    <option key={th} value={th} className="bg-[#1a1a1a] text-white">{th}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Detailed Address</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="e.g. Flat 4B, House 12, Road 5"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Label Selection */}
                            <div className="space-y-2.5">
                                <label className="text-xs font-semibold text-gray-300">Address Label:</label>
                                <div className="flex items-center gap-3">
                                    {['Office', 'Home', 'Studio'].map((lbl) => (
                                        <button
                                            key={lbl}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label: lbl })}
                                            className={`flex items-center gap-2 px-5 py-2 rounded-lg border-2 text-xs font-bold transition-all cursor-pointer ${
                                                formData.label === lbl
                                                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10'
                                                    : 'border-white/15 text-gray-400 hover:border-white/30'
                                            }`}
                                        >
                                            <Icon icon={lbl === 'Office' ? 'solar:case-bold' : lbl === 'Studio' ? 'solar:palette-bold' : 'solar:home-smile-bold'} className="size-4" />
                                            {lbl.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="rounded border-white/20 text-[#D4AF37] cursor-pointer"
                                    />
                                    <span>Set as default shipping address</span>
                                </label>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-colors cursor-pointer"
                                >
                                    CANCEL
                                </button>
                                <Button
                                    type="submit"
                                    isLoading={submitting}
                                    className="px-8 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49d2f] text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                                >
                                    SAVE ADDRESS
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
