"use client";
import Sidebar2 from "@/app/Components/ui/sidebar2";
import { Sidebar } from "@/components/ui/sidebar";
import React, { useState, useEffect } from "react";

import * as XLSX from 'xlsx';

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
        const response = await fetch('');
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

  return (<div className="flex flex-row justify-s">
    <Sidebar2/>
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
    </div>
  );
};

export default MetaLeadsContent;