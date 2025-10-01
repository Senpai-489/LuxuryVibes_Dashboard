"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../Components/ui/sidebar";
import {
  IconBrandGoogle,
  IconBrandMeta,
  IconBrandTabler,
  IconBrandWhatsapp,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { usePathname, useRouter } from "next/navigation";

import DashboardRooftop from "./DashboardRooftop";
import DashboardPinewood from "./DashboardPinewood";
import DashboardBistro from "./DashboardBistro";
import DashboardLuxury from "./DashboardLuxury";
import ReturnToLogin from "./ReturnToLogin";

export default function SidebarDemo() {
  const [cookies] = useCookies(["name", "role"]);
  const pathname = usePathname();
  const router = useRouter();

  const property = pathname?.split("/")[1] || "luxuryvibesstay";

  const links = [
    {
      label: "Dashboard",
      href: `/${property}/Dashboard`,
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Google Leads",
      href: `/${property}/GoogleLeads`,
      icon: <IconBrandGoogle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Meta Leads",
      href: `/${property}/MetaLeads`,
      icon: <IconBrandMeta className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "WhatsApp Leads",
      href: `/${property}/WhatsAppLeads`,
      icon: <IconBrandWhatsapp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "User Management",
      href: `/${property}/UserManagement`,
      icon: <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return cookies?.role || cookies.name ? (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo property={property} router={router} /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
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
        </SidebarBody>
      </Sidebar>

      {/* Render dashboards conditionally */}
      {property === "luxuryvibesstay" && <DashboardLuxury />}
      {property === "lakeviewbistro" && <DashboardBistro />}
      {property === "rooftop" && <DashboardRooftop />}
      {property === "pinewoodretreat" && <DashboardPinewood />}
    </div>
  ) : (
    <ReturnToLogin />
  );
}

export const Logo = ({ property, router }: { property: string; router: any }) => {
  function changeProperty(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/${e.target.value}/Dashboard`);
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
          value={property}
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
