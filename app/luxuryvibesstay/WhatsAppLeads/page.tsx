"use client"

import ReturnToLogin from "@/app/Components/ReturnToLogin";
import Sidebar2 from "@/app/Components/ui/sidebar2";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import * as XLSX from "xlsx";

const WhatsAppLeadsContent = () => {
  const [cookies] = useCookies(['name','role']);
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [fetchedData, setFetchedData] = useState<any[] | null>(null);

  const uploadData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let jsonData;

      if (file) {
        // Handle file upload
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
          await sendDataToServer(jsonData, 'file');
        };
        reader.readAsBinaryString(file);
      } else if (sheetUrl) {
        // Handle Google Sheets URL
        const response = await fetch(`https://serverdash-1.onrender.com/api/fetchSheetData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: sheetUrl }),
        });
        
        if (!response.ok) throw new Error('Failed to fetch sheet data');
  jsonData = await response.json();
  await sendDataToServer(jsonData, 'url', sheetUrl);
      } else {
        alert("Please provide either a file or sheet URL");
        return;
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Error uploading data. Please try again.');
    }
  };

  const sendDataToServer = async (jsonData: any, sourceType: 'file' | 'url' = 'file', sourceUrl: string | null = null) => {
    try {
      const response = await fetch('https://serverdash-1.onrender.com/api/uploadExcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetName: 'luxuryWhatsApp',
          data: jsonData,
          uploadedBy: cookies.name,
          sourceType: sourceType,
          sourceUrl: sourceUrl || undefined
        }),
      });

      if (response.ok) {
        alert('Data uploaded successfully!');
        setUploadMenuOpen(false);
        setFile(null);
        setSheetUrl('');
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://serverdash-1.onrender.com/api/getExcelData/luxuryWhatsApp');
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (cookies.name || cookies.role ? 
    <div className="flex flex-row justify-s">
      <Sidebar2/>
      <div className="w-full mx-auto p-4">   
        {cookies.role === 1 && <button 
          onClick={() => setUploadMenuOpen(!uploadMenuOpen)} 
          className="bg-gray-800 text-sm float-right text-white px-4 py-2 rounded hover:bg-black transition duration-300"
        >
          Upload Data
        </button>}

        {uploadMenuOpen && (
          <div className="absolute top-16 right-4 bg-white border border-gray-300 rounded shadow-lg p-4 z-10">
            <h3 className="text-lg font-semibold mb-2">Upload Data</h3>
            <form onSubmit={uploadData} className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700">Choose an Excel file:</label>
              <input 
                type="file" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    setSheetUrl(''); // Clear URL when file is selected
                  }
                }} 
                className="mb-2 text-sm bg-gray-100 border border-gray-300 rounded p-2" 
              />
              <h1 className="text-lg text-center">OR</h1>
              <input 
                type="text" 
                placeholder="Enter Sheet URL" 
                value={sheetUrl}
                onChange={(e) => {
                  setSheetUrl(e.target.value);
                  setFile(null); // Clear file when URL is entered
                }}
                className="mb-2 text-sm bg-gray-100 border border-gray-300 rounded p-2" 
              />
              <button 
                type="submit" 
                className="bg-gray-800 text-sm text-white px-4 py-2 rounded hover:bg-black transition duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {fetchedData ? (
          <div className="mt-16 w-[95%] h-screen overflow-scroll max-w-full">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(fetchedData[0] || {}).map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(fetchedData) && fetchedData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {Object.values(row).map((cell: any, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cell || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 text-center text-gray-500">No data available</div>
        )}
      </div>
    </div> 
    : <ReturnToLogin/>
  );
};

export default WhatsAppLeadsContent;