"use client";

import { getUserData, updateUserProfile } from "@/api/usersApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { LuCheck, LuLock, LuMail, LuPhone, LuShieldCheck, LuUser } from "react-icons/lu";
import { toast } from "react-toastify";

const ProfileForm = ({ user, onUpdate, isPending }) => {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    onUpdate({ name, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="label">
          <span className="label-text font-medium text-xs">Full Name</span>
        </label>
        <div className="relative">
          <LuUser className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input input-bordered w-full pl-10 rounded-xl focus:border-main focus:outline-hidden"
          />
        </div>
      </div>

      <div>
        <label className="label">
          <span className="label-text font-medium text-xs">Email Address (Read-only)</span>
        </label>
        <div className="relative">
          <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="input input-bordered w-full pl-10 rounded-xl bg-base-200/60 cursor-not-allowed opacity-80"
          />
        </div>
        <span className="text-[11px] text-base-content/50 mt-1 block">
          Email is linked to your Firebase authentication account.
        </span>
      </div>

      <div>
        <label className="label">
          <span className="label-text font-medium text-xs">Phone Number</span>
        </label>
        <div className="relative">
          <LuPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input input-bordered w-full pl-10 rounded-xl focus:border-main focus:outline-hidden"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-main rounded-xl px-6 gap-2"
        >
          {isPending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <LuCheck className="size-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const ProfilePage = () => {
  const { newUser, setNewUser } = useContext(MyContext);
  const email = newUser?.user?.email;
  const queryClient = useQueryClient();

  const { data: userDataResp } = useQuery({
    queryKey: ["userData", email],
    queryFn: () => getUserData(email),
    enabled: !!email,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateUserProfile({ email, ...data }),
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userData", email] });
      if (setNewUser && data?.user) {
        const updated = {
          ...newUser,
          user: { ...newUser.user, ...data.user },
        };
        setNewUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const user = userDataResp?.user || newUser?.user || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
          <LuUser className="size-6 text-main" /> Profile & Security
        </h2>
        <p className="text-xs text-base-content/60 mt-1">
          Manage your personal information and contact preferences.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-base-200">
          <div className="w-16 h-16 rounded-full bg-main text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {(user.name?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-base-content">
              {user.name || "Pet Parent"}
            </h3>
            <p className="text-xs text-base-content/60">{user.email}</p>
            <span className="badge badge-sm bg-main/10 text-main border-0 mt-1 font-medium">
              <LuShieldCheck className="size-3 mr-1" /> Active Member
            </span>
          </div>
        </div>

        <ProfileForm
          key={user.email + (user.name || "") + (user.phone || "")}
          user={user}
          onUpdate={(data) => updateMutation.mutate(data)}
          isPending={updateMutation.isPending}
        />
      </div>

      {/* Account Security Info Box */}
      <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center shrink-0">
            <LuLock className="size-5 text-base-content/60" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-base-content">
              Authentication & Security
            </h4>
            <p className="text-xs text-base-content/60">
              Protected by Firebase Identity & Google Cloud Security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
