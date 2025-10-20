"use client";

import ReturnToLogin from "@/app/Components/ReturnToLogin";
import Sidebar2 from "@/app/Components/ui/sidebar2";
import LeadsManager from "@/app/Components/LeadsManager";
import { useCookies } from "react-cookie";

export default function MetaLeadsPage() {
  const [cookies] = useCookies(["name", "role"]);
  if (!(cookies.name || cookies.role)) return <ReturnToLogin />;
  return (
    <div className="flex overflow-x-clip overflow-y-clip flex-row justify-s">
      <Sidebar2 />
      <LeadsManager companyName="luxuryMeta" />
    </div>
  );
}