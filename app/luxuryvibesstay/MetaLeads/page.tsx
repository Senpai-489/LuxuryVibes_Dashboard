"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../Components/ui/sidebar";
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
import * as XLSX from 'xlsx';

export default function Sidebar2(props:any) {
  
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
    <div className="flex h-screen w-full">
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
      <main className="flex-1">
        <MetaLeadsContent />
      </main>
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

const MetaLeadsContent = () => {
  const [tableData, setTableData] = useState<{ headers: string[]; data: string[][] } | null>(null);

  // Define the headers mapping
  const headerMapping = {
    'name': 'Name',
    'phone_number': 'Phone Number',
    'email': 'Email',
    'whats_your_budget_per_night?': 'Budget per Night',
    'how_many_guests_are_you_booking_for?': 'Number of Guests',
    'preferred_check-in_date?': 'Check-in Date',
    'preferred_check-out_date?': 'Check-out Date'
  };

  const desiredHeaders = Object.keys(headerMapping);
  const displayHeaders = Object.values(headerMapping);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch('/meta leads.xls');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

        // Get headers and their indices
        const headers = jsonData[0];
        const desiredIndices = desiredHeaders.map(header => 
          headers.findIndex(h => h.toLowerCase() === header.toLowerCase())
        ).filter(index => index !== -1);

        // Filter the data to only include desired columns
        const filteredData = jsonData.slice(1)
          .map(row => desiredIndices.map(index => row[index]))
          .filter(row => row.some(cell => cell)); // Remove empty rows

        setTableData({ 
          headers: displayHeaders,
          data: filteredData
        });
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    fetchExcel();
  }, []);

  return (
    <div className="h-screen w-full p-6">
      <div className="flex h-full flex-col space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meta Leads</h1>
          
        </div>

        {/* Table Section */}
        {tableData ? (
          <div className="relative flex-1 overflow-hidden justify-center rounded-lg border border-gray-200">
            <div className="absolute inset-0 overflow-y-auto overflow-x-clip">
              <table className=" border-collapse">
                <thead>
                  <tr className="sticky top-0 bg-gray-50">
                    {tableData.headers.map((header, index) => (
                      <th 
                        key={index} 
                        className="border-b border-gray-200 bg-gray-50 p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header} 
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.data.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className="hover:bg-gray-50"
                    >
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex} 
                          className="border-b border-gray-200 p-4 text-sm text-gray-500"
                        >
                          <div className="gap-4 flex flex-row max-w-xs truncate">
                            {cell || '-'}
                            {/* {cell==="Sagar.R"?<div className="text-red-500 rounded-full h-4 w-4">(new)</div>:null} */}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
};