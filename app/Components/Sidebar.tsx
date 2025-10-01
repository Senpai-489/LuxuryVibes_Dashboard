"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../Components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandGoogle,
  IconBrandMeta,
  IconBrandTabler,
  IconBrandWhatsapp,
  IconSettings,
  IconUser,
  IconUserBolt,
} from "@tabler/icons-react";
import { getValueAsType, motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { title } from "process";
import { validateHeaderName } from "http";
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart, PieChart } from "@mui/x-charts";
import SimpleLineChart from "./ui/Line";
import { useCookies } from 'react-cookie';
import DashboardRooftop from "./DashboardRooftop";
import DashboardPinewood from "./DashboardPinewood";
import DashboardBistro from "./DashboardBistro";
import DashboardLuxury from "./DashboardLuxury";
import ReturnToLogin from "./ReturnToLogin";
export default function SidebarDemo(props:any) {
 
  const [cookies, setCookie, removeCookie] = useCookies(['name','role']);
  const router = useRouter();

 

  const links = [
    {
      label: "Dashboard",
      href: `/${window.location.pathname.split('/')[1] || 'luxuryvibesstay'}/Dashboard`,
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Google Leads",
      href: `/${window.location.pathname.split('/')[1] || 'luxuryvibesstay'}/GoogleLeads`,
      icon: (
        <IconBrandGoogle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Meta Leads",
      href: `/${window.location.pathname.split('/')[1] || 'luxuryvibesstay'}/MetaLeads`,
      icon: (
        <IconBrandMeta className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "WhatsApp Leads",
      href: `/${window.location.pathname.split('/')[1] || 'luxuryvibesstay'}/WhatsAppLeads`,
      icon: (
        <IconBrandWhatsapp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "User Management",
      href: `/${window.location.pathname.split('/')[1] || 'luxuryvibesstay'}/UserManagement`,
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
   
  ];
  const [open, setOpen] = useState(false);
  return ( cookies?.role && cookies?.role ?
    <div
      className={cn(
        "mx-auto flex w-full  flex-1 flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1  flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link}  />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: cookies?.name || "User",
                href: "/Profile",
                
                icon: (
                  <img
                    src="/user.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            
            
        
          </div>
        </SidebarBody>
      </Sidebar>
        { (window.location.pathname.split('/')[1] || 'luxuryvibesstay')==='luxuryvibesstay' && <DashboardLuxury/>}
        
        { (window.location.pathname.split('/')[1] || 'luxuryvibesstay')==='lakeviewbistro' && <DashboardBistro/>}
        { (window.location.pathname.split('/')[1] || 'luxuryvibesstay')==='rooftop' && <DashboardRooftop/>}
        { (window.location.pathname.split('/')[1] || 'luxuryvibesstay')==='pinewoodretreat' && <DashboardPinewood/>}
    </div>:<ReturnToLogin/>
  );
}
export const Logo = () => {
  function changeProperty(e:any){

    window.location.href=`/${e.target.value}/Dashboard`
  }
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        alt="Logo"
        src="/logo.png"
        width={30}
        height={30}
        className="rounded-full"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
       
        <select 
          onChange={changeProperty} 
          className="bg-gray-200 border-none p-2 rounded-lg"
          value={window.location.pathname.split('/')[1] || 'luxuryvibesstay'}
        >
          <option value="luxuryvibesstay">Luxury Vibes Stay</option>
          <option value="lakeviewbistro">Lakeview Bistro</option>
          <option value="rooftop">The Village Rooftop</option>
          <option value="pinewoodretreat">Pinewood Retreat</option>
        </select>
   
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      
      <Image
        alt="Logo"
        src="/logo.png"
        width={30}
        height={30}
        className="rounded-full"
      />
      </a>
  );
};

