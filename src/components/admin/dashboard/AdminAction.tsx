"use client";

import AddAdminModal from "../modals/AddAdminModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";

export default function AdminActions() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <AddAdminModal />
      <ChangePasswordModal />
    </div>
  );
}