import { getUserRole } from "@/actions/user";
import React from "react";

export default async function Page() {
  const role = await getUserRole();
  if (role !== "ADMIN") {
    return <div>Access Denied</div>;
  }
  return <div>Adminpage</div>;
}
