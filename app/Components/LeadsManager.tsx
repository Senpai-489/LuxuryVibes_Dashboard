"use client";

import { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { IconBrandWhatsappFilled, IconMail, IconPhoneCall, IconPlus, IconTrash } from "@tabler/icons-react";
import * as XLSX from "xlsx";

type LeadsManagerProps = {
  companyName: string; // e.g., luxuryGoogle | luxuryMeta | luxuryWhatsApp
};

const API_BASE = "https://serverdash-1.onrender.com/api";

// Header mappings per company (only applied when present)
// Keys are data keys in your rows; values are friendly header labels.
const HEADER_MAPPING: Record<string, Record<string, string>> = {
  luxuryMeta: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
  pinewoodMeta: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
  rooftopMeta: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
  bistroMeta: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
  luxuryWhatsApp: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
  pinewoodWhatsApp: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
  rooftopWhatsApp: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
  bistroWhatsApp: {
    state: "State",
    name: "Name",
    phone_number: "Phone Number",
    email: "Email",
    "whats_your_budget_per_night?": "Budget per Night",
    "how_many_guests_are_you_booking_for?": "Number of Guests",
    "preferred_check-in_date?": "Check-in Date",
    "preferred_check-out_date?": "Check-out Date",
  },
};

export default function LeadsManager({ companyName }: LeadsManagerProps) {
  const [cookies] = useCookies(["name", "role"]);

  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [addSheetMenuOpen, setAddSheetMenuOpen] = useState(false);
  const [addLeadMenuOpen, setAddLeadMenuOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState("");
  const [newSheetName, setNewSheetName] = useState("");

  const [sheets, setSheets] = useState<any[]>([]);
  const [currentSheet, setCurrentSheet] = useState<any | null>(null);
  const [fetchedData, setFetchedData] = useState<any[] | null>(null);

  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);

  // Fetch sheets list
  const fetchSheets = async () => {
    try {
      const res = await fetch(`${API_BASE}/sheets/${companyName}`);
      const data = await res.json();
      setSheets(data);

      if (Array.isArray(data) && data.length > 0 && !currentSheet) {
        setCurrentSheet(data[0]);
        setFetchedData(data[0].data);
      }
    } catch (e) {
      console.error("Error fetching sheets:", e);
    }
  };

  // Fetch current sheet data
  const fetchData = async () => {
    if (!currentSheet) return;
    try {
      const res = await fetch(`${API_BASE}/sheet/${currentSheet.sheetId}`);
      const data = await res.json();
      setFetchedData(data);
    } catch (e) {
      console.error("Error fetching sheet data:", e);
    }
  };

  useEffect(() => {
    fetchSheets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName]);

  useEffect(() => {
    if (currentSheet) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSheet?.sheetId]);

  const onCloseUpload = () => {
    setUploadMenuOpen(false);
    setFile(null);
    setSheetUrl("");
  };

  // Create sheet
  const createNewSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSheetName.trim()) {
      alert("Please enter a sheet name");
      return;
    }

    try {
      let jsonData: any[] = [];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const bin = ev.target?.result as string;
          const wb = XLSX.read(bin, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(ws);
          await sendCreateSheet(jsonData, "file");
        };
        reader.readAsBinaryString(file);
      } else if (sheetUrl) {
        const resp = await fetch(`${API_BASE}/fetchSheetData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: sheetUrl })
        });
        if (!resp.ok) throw new Error("Failed to fetch sheet data");
        jsonData = await resp.json();
        await sendCreateSheet(jsonData, "url", sheetUrl);
      } else {
        await sendCreateSheet([], "file");
      }
    } catch (e) {
      console.error("Error creating sheet:", e);
      alert("Error creating sheet. Please try again.");
    }
  };

  const sendCreateSheet = async (
    jsonData: any,
    sourceType: "file" | "url" = "file",
    sourceUrl: string | null = null
  ) => {
    try {
      const resp = await fetch(`${API_BASE}/createSheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          name: newSheetName,
          data: jsonData,
          uploadedBy: cookies.name,
          sourceType,
          sourceUrl: sourceUrl || undefined
        })
      });

      if (resp.ok) {
        const result = await resp.json();
        alert("Sheet created successfully!");
        setAddSheetMenuOpen(false);
        setNewSheetName("");
        setFile(null);
        setSheetUrl("");
        await fetchSheets();
        setCurrentSheet(result.sheet);
      } else {
        const err = await resp.json();
        throw new Error(err.message);
      }
    } catch (e) {
      throw e;
    }
  };

  // Upload to existing sheet
  const uploadData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSheet) {
      alert("Please select a sheet first");
      return;
    }
    try {
      let jsonData: any[] = [];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const bin = ev.target?.result as string;
          const wb = XLSX.read(bin, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(ws);
          await sendDataToServer(jsonData, "file");
        };
        reader.readAsBinaryString(file);
      } else if (sheetUrl) {
        const resp = await fetch(`${API_BASE}/fetchSheetData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: sheetUrl })
        });
        if (!resp.ok) throw new Error("Failed to fetch sheet data");
        jsonData = await resp.json();
        await sendDataToServer(jsonData, "url", sheetUrl);
      } else {
        alert("Please provide either a file or sheet URL");
        return;
      }
    } catch (e) {
      console.error("Error uploading data:", e);
      alert("Error uploading data. Please try again.");
    }
  };

  const sendDataToServer = async (
    jsonData: any,
    sourceType: "file" | "url" = "file",
    sourceUrl: string | null = null
  ) => {
    try {
      const resp = await fetch(`${API_BASE}/uploadExcel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetId: currentSheet.sheetId,
          data: jsonData,
          uploadedBy: cookies.name,
          sourceType,
          sourceUrl: sourceUrl || undefined
        })
      });
      if (resp.ok) {
        alert("Data uploaded successfully!");
        onCloseUpload();
        fetchData();
      } else {
        const err = await resp.json();
        throw new Error(err.message);
      }
    } catch (e) {
      throw e;
    }
  };

  // Delete sheet
  const deleteCurrentSheet = async () => {
    if (!currentSheet) return alert("No sheet selected");
    if (!confirm(`Delete "${currentSheet.name}"? This cannot be undone.`)) return;
    try {
      const resp = await fetch(`${API_BASE}/deleteSheet/${currentSheet.sheetId}`, {
        method: "DELETE"
      });
      if (resp.ok) {
        alert("Sheet deleted successfully!");
        setCurrentSheet(null);
        setFetchedData(null);
        fetchSheets();
      } else {
        const err = await resp.json();
        throw new Error(err.message);
      }
    } catch (e) {
      console.error("Error deleting sheet:", e);
      alert("Error deleting sheet. Please try again.");
    }
  };

  // Lead ops
  const addNewLead = async (leadData: any) => {
    if (!currentSheet) return alert("No sheet selected");
    try {
      const resp = await fetch(`${API_BASE}/addLead/${currentSheet.sheetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData)
      });
      if (resp.ok) {
        alert("Lead added successfully!");
        setAddLeadMenuOpen(false);
        fetchData();
      } else {
        const err = await resp.json();
        throw new Error(err.message);
      }
    } catch (e) {
      console.error("Error adding lead:", e);
      alert("Failed to add lead. Please try again.");
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!currentSheet) return;
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const resp = await fetch(`${API_BASE}/deleteLead/${currentSheet.sheetId}/${leadId}`, {
        method: "DELETE"
      });
      if (resp.ok) {
        alert("Lead deleted successfully!");
        fetchData();
      } else {
        const err = await resp.json();
        throw new Error(err.message);
      }
    } catch (e) {
      console.error("Error deleting lead:", e);
      alert("Failed to delete lead. Please try again.");
    }
  };

  const updateLeadState = async (leadId: string, newState: string) => {
    if (!currentSheet) return;
    try {
      const resp = await fetch(`${API_BASE}/updateLeadState/${currentSheet.sheetId}/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: newState })
      });
      if (resp.ok) {
        fetchData();
      } else {
        const err = await resp.json();
        throw new Error(err.message);
      }
    } catch (e) {
      console.error("Error updating lead state:", e);
      alert("Failed to update lead state. Please try again.");
    }
  };

  const openContactMenu = (row: any) => {
    setSelectedContact(row);
    setContactMenuOpen(true);
  };
  const closeContactMenu = () => {
    setSelectedContact(null);
    setContactMenuOpen(false);
  };

  const internalKeys = useMemo(() => new Set(["_id", "createdAt", "updatedAt"]), []);
  const activeMapping = useMemo<Record<string, string> | null>(
    () => HEADER_MAPPING[companyName] ?? null,
    [companyName]
  );

  // Dynamic headers (fallback when no mapping present)
  const computedHeaders: string[] = useMemo(() => {
    if (!Array.isArray(fetchedData) || fetchedData.length === 0) return [];
    const all = new Set<string>();
    for (const row of fetchedData) {
      Object.keys(row || {}).forEach((k) => {
        if (!internalKeys.has(k)) all.add(k);
      });
    }
    // Ensure state appears first if it exists
    const headers = Array.from(all);
    const stateIndex = headers.indexOf('state');
    if (stateIndex > -1) {
      headers.splice(stateIndex, 1);
      headers.unshift('state');
    }
    return headers;
  }, [fetchedData, internalKeys]);

  // Final headers for table: keys used to extract values, labels for thead
  const tableHeaderKeys: string[] = useMemo(
    () => (activeMapping ? Object.keys(activeMapping) : computedHeaders),
    [activeMapping, computedHeaders]
  );
  const tableHeaderLabels: string[] = useMemo(
    () =>
      activeMapping
        ? Object.values(activeMapping)
        : tableHeaderKeys,
    [activeMapping, tableHeaderKeys]
  );

  const canEdit = cookies.role === 1 || cookies.role === "1";

  return (
    <div className="w-full mx-auto p-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select
          value={currentSheet?.sheetId || ""}
          onChange={(e) => {
            const next = sheets.find((s) => s.sheetId === e.target.value) || null;
            setCurrentSheet(next);
          }}
          className="px-4 py-2 border border-gray-300 rounded bg-white"
        >
          <option value="">Select a sheet</option>
          {sheets.map((s) => (
            <option key={s.sheetId} value={s.sheetId}>
              {s.name} ({s.data?.length ?? 0} leads)
            </option>
          ))}
        </select>

        {canEdit && (
          <>
            <button
              onClick={() => setAddSheetMenuOpen(true)}
              className="bg-green-600 text-sm text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 flex items-center gap-2"
            >
              <IconPlus size={16} /> New Sheet
            </button>

            {currentSheet && (
              <>
                <button
                  onClick={() => setUploadMenuOpen(true)}
                  className="bg-blue-600 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Upload to Sheet
                </button>
                <button
                  onClick={() => setAddLeadMenuOpen(true)}
                  className="bg-gray-800 text-sm text-white px-4 py-2 rounded hover:bg-black transition duration-300"
                >
                  Add Lead
                </button>
                <button
                  onClick={deleteCurrentSheet}
                  className="bg-red-700 text-sm text-white px-4 py-2 rounded hover:bg-red-800 transition duration-300 flex items-center gap-2"
                >
                  <IconTrash size={16} /> Delete Sheet
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Sheet meta */}
      {currentSheet && (
        <div className="border-b mt-2 border-gray-200 py-2">
          <h2 className="text-lg font-semibold">{currentSheet.name}</h2>
          <p className="text-sm text-gray-500">
            {(fetchedData?.length ?? 0)} leads • Created {new Date(currentSheet.createdAt).toLocaleDateString()} • Updated {new Date(currentSheet.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Modals */}
      {contactMenuOpen && selectedContact && (
        <ContactForm contact={selectedContact} onClose={closeContactMenu} />
      )}

      {addLeadMenuOpen && (
        <AddLeadForm onSubmit={addNewLead} onClose={() => setAddLeadMenuOpen(false)} />
      )}

      {addSheetMenuOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Create New Sheet</h3>
            <form onSubmit={createNewSheet} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Sheet Name</label>
                <input
                  type="text"
                  value={newSheetName}
                  onChange={(e) => setNewSheetName(e.target.value)}
                  placeholder="e.g., January 2026 Leads"
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2"
                  required
                />
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Optionally add initial data</p>
                <label className="block mb-2 text-sm font-medium text-gray-700">Upload file</label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                      setSheetUrl("");
                    }
                  }}
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2"
                />
                <p className="text-center my-2 text-gray-500">OR</p>
                <input
                  type="text"
                  placeholder="Enter Google Sheet/CSV URL"
                  value={sheetUrl}
                  onChange={(e) => {
                    setSheetUrl(e.target.value);
                    setFile(null);
                  }}
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddSheetMenuOpen(false);
                    setNewSheetName("");
                    setFile(null);
                    setSheetUrl("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {uploadMenuOpen && currentSheet && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Upload to "{currentSheet.name}"</h3>
            <form onSubmit={uploadData} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Choose an Excel file</label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                      setSheetUrl("");
                    }
                  }}
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2"
                />
              </div>
              <p className="text-center text-gray-500">OR</p>
              <div>
                <input
                  type="text"
                  placeholder="Enter Google Sheet/CSV URL"
                  value={sheetUrl}
                  onChange={(e) => {
                    setSheetUrl(e.target.value);
                    setFile(null);
                  }}
                  className="w-full text-sm bg-gray-100 border border-gray-300 rounded p-2"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Upload
                </button>
                <button type="button" onClick={onCloseUpload} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data table */}
      {Array.isArray(fetchedData) && fetchedData.length > 0 ? (
        <div className="mt-4 w-[95%] h-[75vh] overflow-auto max-w-full">
          <table className="w-full bg-white border border-gray-300">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                {tableHeaderLabels.map((label) => (
                  <th
                    key={label}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchedData.map((row: any, idx: number) => (
                <tr key={row._id || idx} className="hover:bg-gray-50">
                  {tableHeaderKeys.map((key) => {
                    // Special handling for state column
                    if (key === 'state') {
                      return (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={row?.state || 'New'}
                            onChange={(e) => {
                              if (row?._id) {
                                updateLeadState(row._id, e.target.value);
                              }
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="New">New</option>
                            <option value="In Conversation">In Conversation</option>
                            <option value="Converted">Converted</option>
                            <option value="Dead Lead">Dead Lead</option>
                          </select>
                        </td>
                      );
                    }
                    // Regular columns
                    return (
                      <td
                        key={key}
                        onClick={() => openContactMenu(row)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer"
                      >
                        {row?.[key] ?? "-"}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (row?._id) deleteLead(row._id);
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
        <div className="mt-6 text-center text-gray-500">
          <p>No data in this sheet yet.</p>
          {canEdit && (
            <button
              onClick={() => setAddLeadMenuOpen(true)}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
            >
              Add First Lead
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 text-center text-gray-500">
          <p>Select a sheet or create a new one to get started.</p>
        </div>
      )}
    </div>
  );
}

function ContactForm({ contact, onClose }: { contact: any; onClose: () => void }) {
  const name = contact?.name || "N/A";
  const email = contact?.email || "";
  const phone = contact?.phone_number || "";
  return (
    <div className="fixed w-96 rounded-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-xl p-6">
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
            <p className="text-lg">{email || "N/A"}</p>
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
            <p className="text-lg">{phone || "N/A"}</p>
            {phone && (
              <div className="flex gap-2">
                <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-800">
                  <IconPhoneCall size={20} />
                </a>
                <a
                  href={`https://wa.me/${String(phone).replace(/[^0-9]/g, "")}`}
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
}

function AddLeadForm({ onSubmit, onClose }: { onSubmit: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<any>({ state: 'New' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ state: 'New' });
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto border border-gray-300 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "phone_number", label: "Phone Number", type: "text", required: true },
            { key: "email", label: "Email", type: "email" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={formData[f.key] || ""}
                onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                className="w-full border border-gray-300 rounded p-2"
                required={!!f.required}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={formData.state || 'New'}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="New">New</option>
              <option value="In Conversation">In Conversation</option>
              <option value="Converted">Converted</option>
              <option value="Dead Lead">Dead Lead</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add Lead
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
