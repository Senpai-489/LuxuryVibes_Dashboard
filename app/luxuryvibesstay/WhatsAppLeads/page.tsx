"use client";

import ReturnToLogin from "@/app/Components/ReturnToLogin";
import Sidebar2 from "@/app/Components/ui/sidebar2";
import { useCookies } from "react-cookie";
const WhatsappLeadsContent = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['name','role']);
  return (cookies.name&&cookies.role?<div className="flex flex-row justify-s">
    <Sidebar2/>
    <div className="w-full  mx-auto p-4 text-4xl">   
    WhatsApp Leads will be here </div>
  </div>:<ReturnToLogin/>
  );
}
export default WhatsappLeadsContent