'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useSession } from "@/lib/auth-client";
import { Icon } from '@iconify/react';
import { getUserAddresses } from '@/lib/api/address';
import { addUserAddress, updateUserAddress, setDefaultAddress, deleteUserAddress } from '@/lib/actions/address';
import { BANGLADESH_DIVISIONS, BD_DISTRICTS, BD_THANAS, BD_POSTCODES } from '@/lib/data/locations';

export default function UserAddressesPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form fields for Bangladesh Doorstep Delivery
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    altPhone: '',
    country: 'Bangladesh',
    division: 'Dhaka',
    district: 'Dhaka City',
    thana: 'Dhanmondi',
    zipCode: '1205 - Dhanmondi',
    street: '',
    apartment: '',
    landmark: '',
    deliveryNotes: '',
    label: 'Home',
    isDefault: false,
  });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Location Dropdown computations for Bangladesh
  const cleanDivKey = (formData.division || "Dhaka").split(" ")[0];
  const availableDistricts = BD_DISTRICTS[cleanDivKey] || BD_DISTRICTS[formData.division] || BD_DISTRICTS["Dhaka"] || [];
  const currentDistrict = formData.district || availableDistricts[0] || "";
  const availableThanas = BD_THANAS[currentDistrict] || BD_THANAS[currentDistrict.split(" ")[0]] || ["Sadar", "Area 1", "Area 2", "Other"];

  const handleDivisionChange = (newDivision) => {
    const key = (newDivision || "Dhaka").split(" ")[0];
    const newDistricts = BD_DISTRICTS[key] || BD_DISTRICTS[newDivision] || BD_DISTRICTS["Dhaka"] || [];
    const firstDistrict = newDistricts[0] || "";
    const distKey = (firstDistrict || "").split(" ")[0];
    const newThanas = BD_THANAS[firstDistrict] || BD_THANAS[distKey] || ["Sadar", "Other"];
    const firstThana = newThanas[0] || "";
    const newPostcodes = BD_POSTCODES[firstDistrict] || BD_POSTCODES[distKey] || ["1000 - General Post Office"];
    const firstPostcode = newPostcodes[0] || "";

    setFormData((prev) => ({
      ...prev,
      division: newDivision,
      district: firstDistrict,
      thana: firstThana,
      zipCode: firstPostcode,
    }));
  };

  const handleDistrictChange = (newDistrict) => {
    const key = (newDistrict || "").split(" ")[0];
    const newThanas = BD_THANAS[newDistrict] || BD_THANAS[key] || ["Sadar", "Other"];
    const firstThana = newThanas[0] || "";
    const newPostcodes = BD_POSTCODES[newDistrict] || BD_POSTCODES[key] || ["1000 - General Post Office"];
    const firstPostcode = newPostcodes[0] || "";

    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
      thana: firstThana,
      zipCode: firstPostcode,
    }));
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses(user?.email, user?.id);
      const list = Array.isArray(data) ? data : [];
      setAddresses(list);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
      showNotification('Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isPending) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getUserAddresses(user?.email, user?.id);
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setAddresses(list);
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user?.email, user?.id, isPending]);

  const resetForm = () => {
    setEditingAddress(null);
    setFormData({
      fullName: user?.name || '',
      phone: '',
      altPhone: '',
      country: 'Bangladesh',
      division: 'Dhaka',
      district: 'Dhaka City',
      thana: 'Dhanmondi',
      zipCode: '1205 - Dhanmondi',
      street: '',
      apartment: '',
      landmark: '',
      deliveryNotes: '',
      label: 'Home',
      isDefault: addresses.length === 0,
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      altPhone: addr.altPhone || '',
      country: 'Bangladesh',
      division: addr.division || addr.state || 'Dhaka',
      district: addr.district || addr.city || 'Dhaka City',
      thana: addr.thana || 'Dhanmondi',
      zipCode: addr.zipCode || '1205 - Dhanmondi',
      street: addr.street || '',
      apartment: addr.apartment || '',
      landmark: addr.landmark || '',
      deliveryNotes: addr.deliveryNotes || '',
      label: addr.label || 'Home',
      isDefault: addr.isDefault === true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.street || !formData.division || !formData.district) {
      showNotification('Please fill in required fields (Name, Mobile, Division, District, Street/House).', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        city: formData.district,
        state: formData.division,
        country: 'Bangladesh',
        userEmail: user?.email || '',
        userId: user?.id || '',
        userName: user?.name || formData.fullName,
        userImage: user?.image || '',
      };

      if (editingAddress?._id) {
        const res = await updateUserAddress(editingAddress._id, payload);
        if (res?.error) {
          showNotification(`Failed: ${res.error}`, 'error');
          return;
        }
        showNotification('Delivery address updated successfully!');
      } else {
        const res = await addUserAddress(payload);
        if (res?.error) {
          showNotification(`Failed: ${res.error}`, 'error');
          return;
        }
        showNotification('New doorstep delivery address saved!');
      }

      setIsModalOpen(false);
      setEditingAddress(null);
      await fetchAddresses();
    } catch (err) {
      console.error('Error saving address:', err);
      showNotification('Failed to save address. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (addrId) => {
    try {
      setSettingDefaultId(addrId);
      await setDefaultAddress(addrId, user?.email, user?.id);
      showNotification('Default delivery address updated!');
      await fetchAddresses();
    } catch (err) {
      console.error('Error setting default:', err);
      showNotification('Failed to update default address', 'error');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (addr) => {
    setAddressToDelete(addr);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete?._id) return;
    try {
      setDeletingId(addressToDelete._id);
      await deleteUserAddress(addressToDelete._id);
      showNotification('Address removed successfully');
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
      await fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
      showNotification('Failed to delete address', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#D4AF37]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Access Denied</h2>
        <p className="text-gray-400 mb-6">You must be signed in to view and manage your addresses.</p>
        <Button
          onClick={() => router.push('/auth/signin')}
          className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-[#1c1111] border-red-500/40 text-red-200'
              : 'bg-[#161616] border-[#D4AF37]/30 text-white shadow-[0_10px_30px_rgba(212,175,55,0.15)]'
          }`}
        >
          <div className={`p-1 rounded-lg ${toast.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
            <Icon icon={toast.type === 'error' ? 'solar:danger-circle-bold' : 'solar:check-circle-bold'} className="size-5" />
          </div>
          <div className="text-sm font-semibold tracking-wide">
            {toast.message}
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-[2rem] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl text-[#D4AF37] shrink-0">
              <Icon icon="solar:map-point-wave-bold-duotone" className="size-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Delivery Addresses (Bangladesh 🇧🇩)</h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Manage your home & office addresses for doorstep delivery of authentic physical artworks.
              </p>
            </div>
          </div>

          <Button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs shrink-0 cursor-pointer"
          >
            <Icon icon="solar:add-circle-bold" className="size-5" />
            Add New Address
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-500">
          <Icon icon="eos-icons:loading" className="size-8 text-[#D4AF37] animate-spin" />
          <span className="text-xs">Loading addresses...</span>
        </div>
      ) : addresses.length === 0 ? (
        /* INLINE FORM WHEN NO ADDRESS EXISTS */
        <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Icon icon="solar:pen-new-square-bold-duotone" className="size-6 text-[#D4AF37]" />
              Add Your Shipping Address
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Please fill in your delivery details for user <span className="text-[#D4AF37] font-semibold">{user?.email}</span>
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter recipient full name"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 01700000000"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Building / House No / Street *</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="House / Flat / Street address"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Landmark / Suburb</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="Nearby landmark (optional)"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
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
                      className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
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
                      className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
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
                      className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                    >
                      {availableThanas.map((th) => (
                        <option key={th} value={th} className="bg-[#1a1a1a] text-white">{th}</option>
                      ))}
                    </select>
                    <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Detailed Address (Apartment / Flat)</label>
                  <input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    placeholder="e.g. Flat 4B, Road 5, Block C"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                  />
                </div>
              </div>
            </div>

            {/* Address Label */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-semibold text-gray-300">Address Category Label:</label>
              <div className="flex items-center gap-3 flex-wrap">
                {['Home', 'Office', 'Studio'].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setFormData({ ...formData, label: lbl })}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
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

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
              >
                SAVE ADDRESS TO DATABASE
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* SAVED ADDRESS CARDS GRID (When addresses exist) */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Icon icon="solar:cardholder-bold-duotone" className="size-5 text-[#D4AF37]" />
              Saved Address Cards ({addresses.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`relative bg-gradient-to-b from-[#181818] to-[#121212] border rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 ${
                  addr.isDefault
                    ? 'border-[#D4AF37]/60 shadow-[0_0_25px_rgba(212,175,55,0.08)]'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                {addr.isDefault && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black shadow-md">
                      Default Address
                    </span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-base truncate">{addr.fullName}</span>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 shrink-0">
                      {addr.label || "Home"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-200 leading-relaxed font-medium">
                    {addr.street}
                    {addr.apartment ? `, ${addr.apartment}` : ''}
                  </p>

                  <p className="text-xs text-gray-400">
                    {addr.thana ? `${addr.thana}, ` : ''}{addr.district || addr.city}, {addr.division || addr.state} {addr.zipCode}
                    <br />
                    <span className="text-[#D4AF37] font-semibold">Bangladesh 🇧🇩</span>
                  </p>

                  {addr.landmark && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-0.5">
                      <Icon icon="solar:pin-bold" className="size-3 text-[#D4AF37]" />
                      <span>Landmark: {addr.landmark}</span>
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400 pt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Icon icon="solar:phone-calling-rounded-bold" className="size-4 text-[#D4AF37]" />
                      <span>{addr.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between gap-2">
                  <div>
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        disabled={settingDefaultId === addr._id}
                        className="text-xs text-gray-400 hover:text-[#D4AF37] font-medium transition-colors underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                      >
                        {settingDefaultId === addr._id ? (
                          <Icon icon="eos-icons:loading" className="size-3.5 animate-spin" />
                        ) : (
                          <Icon icon="solar:star-linear" className="size-3.5 text-[#D4AF37]" />
                        )}
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Icon icon="solar:check-circle-bold" className="size-3.5" />
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* EDIT BUTTON -> OPENS EDIT MODAL */}
                    <button
                      onClick={() => handleOpenEditModal(addr)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 text-gray-300 hover:text-[#D4AF37] border border-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
                      title="Edit Address"
                    >
                      <Icon icon="solar:pen-linear" className="size-4" />
                      <span>Edit</span>
                    </button>

                    {/* DELETE BUTTON -> OPENS CONFIRMATION MODAL */}
                    <button
                      onClick={() => handleOpenDeleteModal(addr)}
                      disabled={deletingId === addr._id}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-xs flex items-center gap-1 cursor-pointer"
                      title="Delete Address"
                    >
                      <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT / ADD MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#141414] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Icon icon="solar:pen-new-square-bold-duotone" className="size-5 text-[#D4AF37]" />
                {editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingAddress(null); }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <Icon icon="solar:close-circle-bold" className="size-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
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
                      placeholder="Enter recipient full name"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Please enter phone number"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Building / House No / Street *</label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      placeholder="House / Street address"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Landmark / Suburb</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="Nearby landmark"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
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
                        className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
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
                        className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
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
                        className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                      >
                        {availableThanas.map((th) => (
                          <option key={th} value={th} className="bg-[#1a1a1a] text-white">{th}</option>
                        ))}
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Detailed Address (Apartment / Flat)</label>
                    <input
                      type="text"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="e.g. House# 123, Flat# 4B"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Category Label */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-gray-300">Select address label:</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {['Home', 'Office', 'Studio'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormData({ ...formData, label: lbl })}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
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
                  onClick={() => { setIsModalOpen(false); setEditingAddress(null); }}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="px-8 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49d2f] text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                >
                  {editingAddress ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#1C1414] to-[#121212] rounded-3xl shadow-2xl border border-red-500/30 overflow-hidden p-6 sm:p-7 text-center space-y-5">
            <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Delete Delivery Address?</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                Are you sure you want to permanently delete this address? This action cannot be undone.
              </p>
            </div>

            {/* Address summary preview */}
            <div className="p-3.5 rounded-2xl bg-[#181818] border border-white/5 text-left text-xs text-gray-300 space-y-1">
              <div className="flex items-center justify-between font-bold text-white">
                <span>{addressToDelete.fullName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 uppercase tracking-wider text-gray-400">
                  {addressToDelete.label || 'Home'}
                </span>
              </div>
              <p className="text-gray-400 text-[11px] truncate">
                {addressToDelete.street}{addressToDelete.apartment ? `, ${addressToDelete.apartment}` : ''}
              </p>
              <p className="text-gray-500 text-[11px]">
                {addressToDelete.thana ? `${addressToDelete.thana}, ` : ''}{addressToDelete.district || addressToDelete.city}, {addressToDelete.division || addressToDelete.state}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setIsDeleteModalOpen(false); setAddressToDelete(null); }}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                isLoading={deletingId === addressToDelete._id}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-extrabold text-xs shadow-[0_4px_20px_rgba(239,68,68,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                Delete Address
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}