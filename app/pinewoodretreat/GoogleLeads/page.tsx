"use client";
import Sidebar2 from "@/app/Components/ui/sidebar2";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useCookies } from "react-cookie";
import ReturnToLogin from "@/app/Components/ReturnToLogin";
const GoogleLeadsContent = () => {
  const [tableData, setTableData] = useState<{ headers: string[]; data: string[][] } | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['name','role']);
  // Define the headers mapping
  const headerMapping = {
    'name': 'Name',
    'contact': 'Phone Number',
    'email': 'Email',
    
    'Date (from)': 'Check-in Date',
    'Date (to)': 'Check-out Date',
    'Source': 'Source',
  };

  const desiredHeaders = Object.keys(headerMapping);
  const displayHeaders = Object.values(headerMapping);
  function excelSerialToJSDate(serial: number): string {
  // Excel’s day 1 is 1900-01-01
  const utc_days = Math.floor(serial - 25569); // offset to Unix epoch
  const utc_value = utc_days * 86400;          // seconds
  const date = new Date(utc_value * 1000);
  return date.toISOString().split('T')[0];     // "YYYY-MM-DD"
}
  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const sheetId = '19cPc-1jf1c3lqu9AyCAW2n-vMSQ86MJKGRB8qqUb04U';
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        console.log(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

        // Get headers and their indices
        const headers = jsonData[0];
        const desiredIndices = desiredHeaders.map(header => 
          headers.findIndex(h => h.toLowerCase() === header.toLowerCase())
        ).filter(index => index !== -1);

        // Filter the data to only include desired columns
        const filteredData = jsonData.slice(1).map(row =>
  desiredIndices.map((index, i) => {
    let cell = row[index];
    // check if this header is a date column and cell is a number
    const header = headers[index]?.toLowerCase();
    if (cell && typeof cell === 'number' &&
        (header.includes('date') || header.includes('check'))) {
      cell = excelSerialToJSDate(cell);
    }
    return cell;
  })
).filter(row => row.some(cell => cell)); // Remove empty rows

        
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

  return ( cookies.name || cookies.role? <div className="flex flex-row justify-s">
    <Sidebar2/>
    <div className="h-screen flex overflow-scroll justify-between w-full p-6">
      <div className="flex h-full w-full gap-4 flex-col space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Google Leads</h1>
          
        </div>

        {/* Table Section */}
        {tableData ? (
          <div className="relative flex-1   rounded-lg border border-gray-200">
            <div className="relative flex-1 overflow-auto rounded-lg border border-gray-200">
              <table className=" w-full table-auto border-collapse">
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
                <tbody className="bg-white overflow-y-scroll overflow-x-auto">
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
    </div>:<ReturnToLogin/>
  );
};

export default GoogleLeadsContent;