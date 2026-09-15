"use client";

import { addAddress, deleteAddress, getUserData, setDefaultAddress } from "@/api/usersApi";
import AddAddressModal from "@/components/account/AddAddressModal";
import AddressCard from "@/components/account/AddressCard";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { LuMapPin, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";

const AddressesPage = () => {
  const { newUser } = useContext(MyContext);
  const email = newUser?.user?.email;
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: userDataResp, isLoading } = useQuery({
    queryKey: ["userData", email],
    queryFn: () => getUserData(email),
    enabled: !!email,
  });

  const addAddressMutation = useMutation({
    mutationFn: (addressData) => addAddress({ email, ...addressData }),
    onSuccess: (data) => {
      toast.success(data?.message || "Address saved successfully");
      queryClient.invalidateQueries({ queryKey: ["userData", email] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to save address");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) => deleteAddress(email, addressId),
    onSuccess: () => {
      toast.success("Address removed");
      queryClient.invalidateQueries({ queryKey: ["userData", email] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete address");
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (addressId) => setDefaultAddress(email, addressId),
    onSuccess: () => {
      toast.success("Default shipping address updated");
      queryClient.invalidateQueries({ queryKey: ["userData", email] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update default address");
    },
  });

  const addresses =
    userDataResp?.user?.addresses || newUser?.user?.addresses || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <LuMapPin className="size-6 text-main" /> Saved Addresses
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Manage your delivery locations for fast 1-click pet food checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-main btn-sm rounded-xl gap-1.5 self-start sm:self-auto"
        >
          <LuPlus className="size-4" /> Add Address
        </button>
      </div>

      {/* Addresses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-44 bg-base-100 rounded-2xl border border-base-200 animate-pulse"
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-main/10 text-main flex items-center justify-center mx-auto">
            <LuMapPin className="size-8" />
          </div>
          <h3 className="font-bold text-lg text-base-content">No addresses saved</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Save your home or office address now to make future pet supply deliveries smooth and hassle-free.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-main btn-sm rounded-xl px-6 mt-2 gap-1.5"
          >
            <LuPlus className="size-4" /> Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onSetDefault={(id) => setDefaultMutation.mutate(id)}
              onDelete={(id) => {
                if (confirm("Are you sure you want to delete this address?")) {
                  deleteAddressMutation.mutate(id);
                }
              }}
              isSettingDefault={setDefaultMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAddress={(data) => addAddressMutation.mutate(data)}
        isLoading={addAddressMutation.isPending}
      />
    </div>
  );
};

export default AddressesPage;
