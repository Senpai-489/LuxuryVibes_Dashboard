"use client";
import React, { useState } from "react";
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

export default function SidebarDemo(props:any) {
  
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
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
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
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Amit Singh",
                href: "/Profile",
                icon: (
                  <img
                    src="https://avatars.githubusercontent.com/u/15045081?v=4"
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
      <Dashboard />
    </div>
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
          <option value="rooftop">Rooftop</option>
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

const Dashboard = () => {
  const cards = [
    {
      title: "Total Leads",
      value: 25024,
    },
    {
      title: "Today's Leads",
      value: 2330,
    },
    {
      title: "Bot Leads",
      value: 1025,
    },
    {
      title: "Webform Leads",
      value: 1230,
    },
    {
      title: "Conversion Rate",
      value: 60,
    }
  ]
  const cards2 =[
    { title: "Meta Leads",
      value: 5690,
    },
    { title: "Google Leads",
      value: 2330,
    },
    { title: "WhatsApp Leads",
      value: 1025,
    },
  ]
  let [menuItem, setMenuItem] = useState("Overview");
  function changeMenu(e:any){
    setMenuItem(e.target.innerText)
  }
  return (
    <div className="flex flex-1 overflow-y-scroll h-full">
      <div className="flex h-[200vh] w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="text-3xl font-bold font-family-serif">Welcome to the Dashboard!</div>
      <select className="w-48 p-2 border border-gray-300 rounded-lg mb-4">
  <option>All time</option>
  <option>Last 7 Days</option>
  <option>Last 30 Days</option>
  <option>Last 90 Days</option>
  
</select>
        
        <div className="flex justify-between gap-4">
          {cards.map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className=" w-full h-38 rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <h1 className="text-lg p-2 font-medium text-[494949]">{i.title}</h1>
              <h1 className="text-3xl text-green-300 p-2 font-bold ">{i.value}</h1>
              <div className="bg-gray-900 h-4 m-2 w-[90%] mx-auto rounded-full">
                <div className={`bg-green-400 h-4 rounded-full w-[60%]`}></div>
                <div className="text-right">20%</div>
              </div>
            </div>
          ))}
        </div>
          <div className="flex justify-between gap-4">
          {cards2.map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className=" w-full h-38 rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <h1 className="text-lg p-2 font-medium text-[494949]">{i.title}</h1>
              <h1 className="text-3xl text-green-300 p-2 font-bold ">{i.value}</h1>
              <div className="bg-gray-900 h-4 m-2 w-[90%] mx-auto rounded-full">
                <div className={`bg-green-400 h-4 rounded-full w-[60%]`}></div>
                <div className="text-right">20%</div>
              </div>
            </div>
          ))}
        </div>
        <div id="tabs" className="flex gap-8 p-2 border-2 h-12 items-center rounded-lg">
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Overview</button>
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Sources</button>
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Timeline</button>
        </div>
        {menuItem === "Overview" ? <Overview/> : menuItem === "Sources" ? <Sources/> : <Timeline/>}
       
      </div>
    </div>
  );
};

const Overview = () => {
  return (<div>
     <div className="flex gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-92 w-full rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex  gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-92 w-full rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        </div>
  );
}

const Sources = () => {
  return (<div>
     <div className="flex gap-2">
      Sources 
      </div>
        </div>
  );
}

const Timeline = () => {
  return (<div>
     <div className="flex gap-2">
      Timeline
      </div>
        </div>
  );
}