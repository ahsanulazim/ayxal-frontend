"use client";

import { addPet, deletePet, getUserData } from "@/api/usersApi";
import AddPetModal from "@/components/account/AddPetModal";
import PetCard from "@/components/account/PetCard";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { FaPaw } from "react-icons/fa6";
import { LuPlus, LuSparkles } from "react-icons/lu";
import { toast } from "react-toastify";

const PetsPage = () => {
  const { newUser } = useContext(MyContext);
  const email = newUser?.user?.email;
  const queryClient = useQueryClient();

  const addPetRef = useRef();

  const { data: userDataResp, isLoading } = useQuery({
    queryKey: ["userData", email],
    queryFn: () => getUserData(email),
    enabled: !!email,
  });

  const addPetMutation = useMutation({
    mutationFn: (petData) => addPet({ email, ...petData }),
    onSuccess: (data) => {
      toast.success(data?.message || "Pet profile saved!");
      queryClient.invalidateQueries({ queryKey: ["userData", email] });
      addPetRef.current?.close();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add pet");
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: (petId) => deletePet(email, petId),
    onSuccess: () => {
      toast.success("Pet profile removed");
      queryClient.invalidateQueries({ queryKey: ["userData", email] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete pet");
    },
  });

  const pets = userDataResp?.user?.pets || newUser?.user?.pets || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <FaPaw className="size-6 text-main" /> My Pets
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Manage your pet family&apos;s profiles for tailored nutrition and
            birthday perks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => addPetRef.current?.showModal()}
          className="btn btn-main btn-sm rounded-xl gap-1.5 self-start sm:self-auto"
        >
          <LuPlus className="size-4" /> Add Pet
        </button>
      </div>

      {/* Pet Perks Banner */}
      <div className="bg-linear-to-r from-main/10 via-base-100 to-amber-500/10 rounded-3xl p-5 border border-main/20 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-main text-white flex items-center justify-center shrink-0">
          <LuSparkles className="size-5" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-base-content">
            Pet Parent Perks Activated
          </h4>
          <p className="text-base-content/70 mt-0.5">
            Having pet profiles unlocks automatic weight-appropriate toy
            suggestions and allergy-safe food filtering in the store!
          </p>
        </div>
      </div>

      {/* Pets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-48 bg-base-100 rounded-2xl border border-base-200 animate-pulse"
            />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-main/10 text-main flex items-center justify-center mx-auto">
            <FaPaw className="size-8" />
          </div>
          <h3 className="font-bold text-lg text-base-content">
            No pets added yet
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Tell us about your furry, feathered, or scaled companions to receive
            special birthday discounts and custom care tips.
          </p>
          <button
            type="button"
            onClick={() => addPetRef.current?.showModal()}
            className="btn btn-main btn-sm rounded-xl px-6 mt-2 gap-1.5"
          >
            <LuPlus className="size-4" /> Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onDelete={(id) => {
                if (confirm(`Remove ${pet.name}'s profile?`)) {
                  deletePetMutation.mutate(id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Add Pet Modal */}
      <AddPetModal
        onAddPet={(data) => addPetMutation.mutate(data)}
        isLoading={addPetMutation.isPending}
        ref={addPetRef}
      />
    </div>
  );
};

export default PetsPage;
