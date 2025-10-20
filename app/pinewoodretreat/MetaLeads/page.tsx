"use client"

import ReturnToLogin from "@/app/Components/ReturnToLogin";
import Sidebar2 from "@/app/Components/ui/sidebar2";
import { IconBrandWhatsappFilled, IconMail, IconPhoneCall, IconTrash, IconPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import * as XLSX from "xlsx";

const MetaLeadsContent = () => {
  const [cookies] = useCookies(['name','role']);
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [addSheetMenuOpen, setAddSheetMenuOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [newSheetName, setNewSheetName] = useState('');
  const [sheets, setSheets] = useState<any[]>([]);
  const [currentSheet, setCurrentSheet] = useState<any | null>(null);
  const [fetchedData, setFetchedData] = useState<any[] | null>(null);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [addLeadMenuOpen, setAddLeadMenuOpen] = useState(false);

  const companyName = 'pinewoodMeta';

  // Fetch all sheets for this company
  const fetchSheets = async () => {
    try {
      const response = await fetch(`https://serverdash-1.onrender.com/api/sheets/${companyName}`);
      const data = await response.json();
      setSheets(data);
      
      // Set the first sheet as current if none selected
      if (data.length > 0 && !currentSheet) {
        setCurrentSheet(data[0]);
        setFetchedData(data[0].data);
      }
    } catch (error) {
      console.error('Error fetching sheets:', error);
    }
  };

  // Fetch data for current sheet
  const fetchData = async () => {
    if (!currentSheet) return;
    
    try {
      const response = await fetch(`https://serverdash-1.onrender.com/api/sheet/${currentSheet.sheetId}`);
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  useEffect(() => {
    if (currentSheet) {
      fetchData();
    }
  }, [currentSheet]);

  // Create new sheet
  const createNewSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSheetName.trim()) {
      alert('Please enter a sheet name');
      return;
    }

    try {
      let jsonData = [];

      if (file) {
        // Parse file
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
          await sendCreateSheet(jsonData, 'file');
        };
        reader.readAsBinaryString(file);
      } else if (sheetUrl) {
        // Fetch from URL
        const response = await fetch(`https://serverdash-1.onrender.com/api/fetchSheetData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: sheetUrl }),
        });
        
        if (!response.ok) throw new Error('Failed to fetch sheet data');
        jsonData = await response.json();
        await sendCreateSheet(jsonData, 'url', sheetUrl);
      } else {
        // Create empty sheet
        await sendCreateSheet([], 'file');
      }
    } catch (error) {
      console.error('Error creating sheet:', error);
      alert('Error creating sheet. Please try again.');
    }
  };

  const sendCreateSheet = async (jsonData: any, sourceType: 'file' | 'url' = 'file', sourceUrl: string | null = null) => {
    try {
      const response = await fetch('https://serverdash-1.onrender.com/api/createSheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          name: newSheetName,
          data: jsonData,
          uploadedBy: cookies.name,
          sourceType,
          sourceUrl: sourceUrl || undefined
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Sheet created successfully!');
        setAddSheetMenuOpen(false);
        setNewSheetName('');
        setFile(null);
        setSheetUrl('');
        fetchSheets();
        setCurrentSheet(result.sheet);
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      throw error;
    }
  };

  // Upload data to current sheet
  const uploadData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSheet) {
      alert('Please select a sheet first');
      return;
    }

    try {
      let jsonData;

      if (file) {
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
        const response = await fetch(`https://serverdash-1.onrender.com/api/fetchSheetData`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetId: currentSheet.sheetId,
          data: jsonData,
          uploadedBy: cookies.name,
          sourceType,
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

  // Delete current sheet
  const deleteCurrentSheet = async () => {
    if (!currentSheet) {
      alert('No sheet selected');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${currentSheet.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`https://serverdash-1.onrender.com/api/deleteSheet/${currentSheet.sheetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Sheet deleted successfully!');
        setCurrentSheet(null);
        setFetchedData(null);
        fetchSheets();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error deleting sheet:', error);
      alert('Error deleting sheet. Please try again.');
    }
  };

  // Add new lead
  const addNewLead = async (leadData: any) => {
    if (!currentSheet) {
      alert('No sheet selected');
      return;
    }

    try {
      const response = await fetch(`https://serverdash-1.onrender.com/api/addLead/${currentSheet.sheetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        alert('Lead added successfully!');
        setAddLeadMenuOpen(false);
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Error adding lead. Please try again.');
    }
  };

  // Delete lead
  const deleteLead = async (leadId: string) => {
    if (!currentSheet) return;

    if (!confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      const response = await fetch(`https://serverdash-1.onrender.com/api/deleteLead/${currentSheet.sheetId}/${leadId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Lead deleted successfully!');
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead. Please try again.');
    }
  };

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
    <div className="flex overflow-x-clip overflow-y-clip flex-row justify-s">
      <Sidebar2/>
      <div className="w-full mx-auto p-4">  
        {/* Sheet selector and action buttons */}
        <div className="flex flex-row gap-4 mb-4 items-center">
          <select 
            value={currentSheet?.sheetId || ''} 
            onChange={(e) => {
              const sheet = sheets.find(s => s.sheetId === e.target.value);
              setCurrentSheet(sheet);
            }}
            className="px-4 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="">Select a sheet</option>
            {sheets.map((sheet) => (
              <option key={sheet.sheetId} value={sheet.sheetId}>
                {sheet.name} ({sheet.data?.length || 0} leads)
              </option>
            ))}
          </select>

          {cookies.role === 1 && (
            <>
              <button 
                onClick={() => setAddSheetMenuOpen(!addSheetMenuOpen)} 
                className="bg-green-600 text-sm text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 flex items-center gap-2"
              >
                <IconPlus size={16} /> Add New Sheet
              </button>
              
              {currentSheet && (
                <>
                  <button 
                    onClick={() => setUploadMenuOpen(!uploadMenuOpen)} 
                    className="bg-blue-600 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                  >
                    Upload to Sheet
                  </button>
                  
                  <button 
                    onClick={() => setAddLeadMenuOpen(!addLeadMenuOpen)} 
                    className="bg-gray-800 text-sm text-white px-4 py-2 rounded hover:bg-black transition duration-300"
                  >
                    Add Lead
                  </button>

                  <button 
                    onClick={deleteCurrentSheet} 
                    className="bg-red-800 text-sm text-white px-4 py-2 rounded hover:bg-red-900 transition duration-300 flex items-center gap-2"
                  >
                    <IconTrash size={16} /> Delete Sheet
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Current sheet info */}
        {currentSheet && (
          <div className="border-b mt-4 border-gray-300 py-2">
            <h2 className="text-lg font-semibold">{currentSheet.name}</h2>
            <p className="text-sm text-gray-500">
              {fetchedData?.length || 0} leads • 
              Created {new Date(currentSheet.createdAt).toLocaleDateString()} • 
              Updated {new Date(currentSheet.updatedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Contact popup */}
        {contactMenuOpen && selectedContact && (
          <ContactForm contact={selectedContact} onClose={closeContactMenu} />
        )}

        {/* Add lead form */}
        {addLeadMenuOpen && (
          <AddLeadForm 
            onSubmit={addNewLead} 
            onClose={() => setAddLeadMenuOpen(false)}
            headerMapping={headerMapping}
          />
        )}

        {/* Add sheet menu */}
        {addSheetMenuOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-6 z-50 w-96">
            <h3 className="text-xl font-semibold mb-4">Create New Sheet</h3>
            <form onSubmit={createNewSheet} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Sheet Name:</label>
                <input 
                  type="text" 
                  value={newSheetName}
                  onChange={(e) => setNewSheetName(e.target.value)}
                  placeholder="e.g., January 2025 Leads"
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2" 
                  required
                />
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Optionally add initial data:</p>
                <label className="block mb-2 text-sm font-medium text-gray-700">Upload file:</label>
                <input 
                  type="file" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                      setSheetUrl('');
                    }
                  }} 
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2" 
                />
                
                <p className="text-center my-2 text-gray-500">OR</p>
                
                <input 
                  type="text" 
                  placeholder="Enter Sheet URL" 
                  value={sheetUrl}
                  onChange={(e) => {
                    setSheetUrl(e.target.value);
                    setFile(null);
                  }}
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2" 
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-green-600 text-sm text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                >
                  Create Sheet
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setAddSheetMenuOpen(false);
                    setNewSheetName('');
                    setFile(null);
                    setSheetUrl('');
                  }}
                  className="flex-1 bg-gray-300 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Upload menu */}
        {uploadMenuOpen && currentSheet && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-6 z-50 w-96">
            <h3 className="text-lg font-semibold mb-4">Upload Data to "{currentSheet.name}"</h3>
            <form onSubmit={uploadData} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Choose an Excel file:</label>
                <input 
                  type="file" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                      setSheetUrl('');
                    }
                  }} 
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2" 
                />
              </div>
              
              <p className="text-center text-gray-500">OR</p>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Enter Sheet URL" 
                  value={sheetUrl}
                  onChange={(e) => {
                    setSheetUrl(e.target.value);
                    setFile(null);
                  }}
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2" 
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Upload
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setUploadMenuOpen(false);
                    setFile(null);
                    setSheetUrl('');
                  }}
                  className="flex-1 bg-gray-300 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data table */}
        {fetchedData && fetchedData.length > 0 ? (
          <div className="mt-4 w-[95%] h-[75vh] overflow-scroll max-w-full">
            <table className="w-full bg-white border border-gray-300">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  {displayHeaders.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.filter(row => !row._id?.startsWith('internal_')).map((row, rowIndex) => (
                  <tr key={row._id || rowIndex} className="hover:bg-gray-50">
                    {desiredHeaders.map((header, cellIndex) => (
                      <td 
                        key={cellIndex} 
                        onClick={() => openContactMenu(row)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                      >
                        {row[header] || '-'}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLead(row._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <IconTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : currentSheet ? (
          <div className="mt-4 text-center text-gray-500">
            <p>No data in this sheet yet.</p>
            <button 
              onClick={() => setAddLeadMenuOpen(true)}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition duration-300"
            >
              Add First Lead
            </button>
          </div>
        ) : (
          <div className="mt-4 text-center text-gray-500">
            <p>Select a sheet or create a new one to get started.</p>
          </div>
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

  return (
    <div className="fixed w-96 rounded-xl top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-xl p-6">
      <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700 text-xl">✕</button>
      <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Name</h4>
          <p className="text-lg">{name}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500">Email</h4>
          <div className="flex items-center gap-2">
            <p className="text-lg">{email || 'N/A'}</p>
            {email && (
              <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">
                <IconMail size={20} />
              </a>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500">Phone</h4>
          <div className="flex items-center gap-2">
            <p className="text-lg">{phone || 'N/A'}</p>
            {phone && (
              <div className="flex gap-2">
                <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-800">
                  <IconPhoneCall size={20} />
                </a>
                <a 
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800"
                >
                  <IconBrandWhatsappFilled size={20} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddLeadForm = ({ onSubmit, onClose, headerMapping }: any) => {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-6 z-50 w-[500px] max-h-[80vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Add New Lead</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {Object.entries(headerMapping).map(([key, label]) => (
          <div key={key}>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label as string}:</label>
            <input
              type={key === 'email' ? 'email' : 'text'}
              value={formData[key] || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2"
              required={key === 'name' || key === 'phone_number'}
            />
          </div>
        ))}

        <div className="flex gap-2 mt-4">
          <button 
            type="submit" 
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition duration-300"
          >
            Add Lead
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
    
export default MetaLeadsContent;