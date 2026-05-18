"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth, CustomerInfo } from "@/app/context/AuthContext";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    address1: string;
    address2: string;
    city: string;
    province: string;
    zoneCode: string;
    zip: string;
    country: string;
    territoryCode: string;
  };
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerInfo;
}

const countryToCode: Record<string, string> = {
  "United Kingdom": "GB",
  "United States": "US",
  Canada: "CA",
  Australia: "AU",
  Ireland: "IE",
};

function initialForm(customer: CustomerInfo): ProfileFormData {
  // Clamp country to one of the known dropdown options so the select always
  // reflects state. Stored values outside this list (e.g. legacy "France")
  // would otherwise leave the form in a state where countryToCode lookup at
  // submit time returns undefined.
  const storedCountry = customer.defaultAddress?.country ?? "United Kingdom";
  const country = storedCountry in countryToCode ? storedCountry : "United Kingdom";
  return {
    firstName: customer.firstName ?? "",
    lastName: customer.lastName ?? "",
    phone: customer.phone ?? "",
    address: {
      address1: customer.defaultAddress?.address1 ?? "",
      address2: customer.defaultAddress?.address2 ?? "",
      city: customer.defaultAddress?.city ?? "",
      province: customer.defaultAddress?.province ?? "",
      zoneCode: customer.defaultAddress?.zoneCode ?? "",
      zip: customer.defaultAddress?.zip ?? "",
      country,
      territoryCode: countryToCode[country],
    },
  };
}

export function EditProfileModal({ isOpen, onClose, customer }: EditProfileModalProps) {
  const { checkSession } = useAuth();
  const [form, setForm] = useState<ProfileFormData>(() => initialForm(customer));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form state only when the modal opens (false → true). Keying on
  // `customer` identity would wipe in-progress edits if AuthContext refreshes
  // the customer object mid-edit (e.g. a background `checkSession`).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setForm(initialForm(customer));
      setError(null);
      setSuccess(false);
    }
    wasOpen.current = isOpen;
  }, [isOpen, customer]);

  const handleChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const key = field.replace("address.", "");
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
          // Country drives territoryCode; province/zoneCode are country-specific
          // and must be reset to avoid sending e.g. a US zoneCode with country=UK.
          ...(key === "country"
            ? { territoryCode: countryToCode[value] || value, province: "", zoneCode: "" }
            : {}),
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    // Phone, when present, must be E.164 (Shopify's requirement). Validate
    // client-side to avoid a confusing Shopify userError and to keep silent
    // legacy non-E.164 values from silently round-tripping back unchanged.
    if (form.phone && !/^\+[1-9]\d{1,14}$/.test(form.phone)) {
      setError("Use international format for your phone, e.g. +447123456789.");
      setSaving(false);
      return;
    }

    // Always derive territoryCode from the current country selection. initialForm
    // clamps country to a known dropdown value, so the lookup is guaranteed.
    const payload = {
      ...form,
      address: {
        ...form.address,
        territoryCode: countryToCode[form.address.country],
      },
    };

    try {
      const res = await fetch("/api/auth/customer/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
        await checkSession();
        setTimeout(() => onClose(), 1500);
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Failed to update profile");
      }
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative bg-white border border-black/12 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
          <h3 className="font-semibold text-black" style={{ letterSpacing: "-0.02em" }}>
            Edit profile
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[#f5f5f5] transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {success && (
            <div className="mb-4 p-3 border border-black/12 bg-[#f5f5f5] text-black text-sm">
              Profile updated.
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50/50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                First name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                Last name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                Email
              </label>
              <input
                type="email"
                value={customer.email ?? ""}
                readOnly
                className="w-full px-3 py-2 border border-black/12 bg-[#f5f5f5] text-black/50 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-black/50 mt-1">
                Email is managed by Shopify and cannot be changed here.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
                placeholder="+447123456789"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                Address line 1
              </label>
              <input
                type="text"
                value={form.address.address1}
                onChange={(e) => handleChange("address.address1", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                Address line 2
              </label>
              <input
                type="text"
                value={form.address.address2}
                onChange={(e) => handleChange("address.address2", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                City
              </label>
              <input
                type="text"
                value={form.address.city}
                onChange={(e) => handleChange("address.city", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={form.address.zip}
                onChange={(e) => handleChange("address.zip", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-1">
                Country
              </label>
              <select
                value={form.address.country}
                onChange={(e) => handleChange("address.country", e.target.value)}
                className="w-full px-3 py-2 border border-black/12 bg-white text-black text-sm focus:outline-none focus:border-[#1B2757]"
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="Ireland">Ireland</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-black/8 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold border border-black/12 hover:border-black/40 text-black transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-semibold bg-[#1B2757] text-white hover:opacity-90 disabled:opacity-50 transition-opacity min-h-[44px]"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
