"use client"

import ReturnToLogin from "@/app/Components/ReturnToLogin";
import Sidebar2 from "@/app/Components/ui/sidebar2";
import { IconBrandWhatsappFilled, IconMail, IconPhoneCall } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import * as XLSX from "xlsx";

const MetaLeadsContent = () => {
  const [cookies] = useCookies(['name','role']);
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [fetchedData, setFetchedData] = useState<any[] | null>(null);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

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
          sheetName: 'luxuryMeta',
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
      const response = await fetch('https://serverdash-1.onrender.com/api/getExcelData/luxuryMeta');
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  let [contactMenuOpen, setContactMenuOpen] = useState(false);
  const openContactMenu = (row: any) => {
    setSelectedContact(row);
    setContactMenuOpen(true);
  };
  const closeContactMenu = () => {
    setContactMenuOpen(false);
    setSelectedContact(null);
  };
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
  return (cookies.name || cookies.role ? 
    <div className="flex overflow-x-scroll flex-row justify-s">
      <Sidebar2/>
      <div className="w-full mx-auto p-4">   
        {cookies.role === 1 && <button 
          onClick={() => setUploadMenuOpen(!uploadMenuOpen)} 
          className="bg-gray-800 fixed  text-sm float-right text-white px-4 py-2 rounded hover:bg-black transition duration-300"
        >
          Upload Data
        </button>}
          {contactMenuOpen && selectedContact ? <ContactForm contact={selectedContact} onClose={closeContactMenu} /> : null}
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
            <table className="w-92 bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {displayHeaders.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
<tbody>
  {Array.isArray(fetchedData) && fetchedData.map((row, rowIndex) => (
    <tr onClick={() => openContactMenu(row)} key={rowIndex} className="hover:bg-gray-50 cursor-pointer">
      {desiredHeaders.map((header, cellIndex) => (
        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {row[header] || '-'}
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

const ContactForm = ({ contact, onClose }: { contact: any; onClose: () => void }) => {
  const name = contact?.name || 'N/A';
  const email = contact?.email || '';
  const phone = contact?.phone_number || '';

  return <div className="fixed w-72 rounded-xl top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50">
    <div>
      <div className="bg-white border border-gray-300 rounded shadow-lg p-4 z-10">
            <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">✕</button>
            <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
            <div className="mt-4 p-4.">
              <h1 className="text-lg font-medium text-gray-700" >Name</h1>
              <h1 className="text-sm text-gray-700">{name}</h1>
            </div>
            <div className="mt-4 p-4.">
              <h1 className="text-lg font-medium text-gray-700" >Email</h1>
              <h1 className="text-sm text-gray-700 flex row items-center">
                <span className="mr-8">{email || 'N/A'}</span>
                {email && <a href={`mailto:${email}`} className="hover:text-blue-600"><IconMail/></a>}
              </h1>
            </div>
            <div className="mt-4 p-4.">
              <h1 className="text-lg font-medium text-gray-700" >Contact Number</h1>
              <h1 className="text-sm text-gray-700 flex flex-row gap-4 items-center">
                {phone || 'N/A'}
                {phone && (
                  <span className="flex flex-row gap-4">
                    <a href={`tel:${phone.slice(5)}`} className="hover:text-blue-600"><IconPhoneCall/></a>
                    <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600"><IconBrandWhatsappFilled/></a>
                  </span>
                )}
              </h1>
            </div>
            <div className="mt-4 p-4.">
              <h1 className="text-lg font-medium text-gray-700" >Status</h1>
              <h1 className="text-sm text-gray-700">Active/Closed etc. (to be implemented)</h1>
            </div>
            </div>
    </div>
     </div>
}
    
export default MetaLeadsContent;