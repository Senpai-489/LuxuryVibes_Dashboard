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
    <div
      className={cn(
        "mx-auto flex w-screen  flex-1 flex-col rounded-md border border-neutral-200 bg-gray-300 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
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
    <UserManagement/>
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

const UserManagement = () => {
    const [data, setData] = useState<any[]>([]);
    const [addMenu, addUserMenu] = useState(false);
    const [editMenu, setEditMenu] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
     fetch('http://localhost:5000/api/userManagement')
       .then(res => res.json())
       .then(data => setData(data));
   }, []);
const addUser = (e:any) => {
    e.preventDefault();
    const form = e.target.form;
    const name = form[0].value;
    const email = form[1].value;
    const password = form[2].value;
    const role = form[3].value;
    fetch('http://localhost:5000/api/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
    }).then(res => res.json())
    .then(() => {
        window.location.reload();
    });
    
    
        }

const deleteUser = async (email: string) => {
        // Add confirmation dialog
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/deleteUser/${encodeURIComponent(email)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Update the UI immediately after successful deletion
                setData(data.filter(user => user.email !== email));
                alert('User deleted successfully');
            } else {
                const errorData = await response.json();
                alert(`Failed to delete user: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        }
    }

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setEditMenu(true);
    };

    const editUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            newEmail: (form.elements.namedItem('email') as HTMLInputElement).value,
            password: (form.elements.namedItem('password') as HTMLInputElement).value,
            role: (form.elements.namedItem('role') as HTMLSelectElement).value
        };

        try {
            const response = await fetch(`http://localhost:5000/api/editUser/${selectedUser.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setData(data.map(user => 
                    user.email === selectedUser.email ? updatedUser.user : user
                ));
                setEditMenu(false);
                alert('User updated successfully');
            } else {
                const errorData = await response.json();
                alert(`Failed to update user: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user. Please try again.');
        }
    };

  return (
    <div className="w-full mx-auto p-4 text-4xl">   
    <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user: any) => (
                <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role===1?"Manager":"Employee"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                            className="text-indigo-600 hover:text-indigo-900" 
                            onClick={() => handleEditClick(user)}
                        >
                            Edit
                        </button>
                        <button className="ml-4 text-red-600 hover:text-red-900" onClick={() => deleteUser(user.email)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    <button className="mt-4 px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-black duration-150" onClick={() => addUserMenu(!addMenu)}>Add User</button>
    {addMenu && (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent">
      <div className="bg-white w-92 p-8 rounded-lg shadow-xl">
        <div className="flex justify-between">
        <p className="text-lg">Add New User</p>
        <button className="text-red-600 text-lg hover:text-red-900" onClick={() => addUserMenu(!addMenu)}>X</button>
        </div>
        <div>
            <form className="space-y-4 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label> 
                    <input type="text" className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label> 
                    <input type="email" className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label> 
                    <input type="password" className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label> 
                    <select className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-2">
                        <option value="1">Manager</option>
                        <option value="0">Employee</option>
                    </select>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="px-4 py-2 text-lg bg-gray-700 text-white rounded-md hover:bg-black duration-150" onClick={addUser}>Add User</button>
                </div>
            </form>
        </div>
      </div>
    </div>
    )}
  {editMenu && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
                    <div className="bg-white w-92 p-8 rounded-lg shadow-xl">
                        <div className="flex justify-between">
                            <p className="text-lg">Edit User</p>
                            <button 
                                className="text-red-600 text-lg hover:text-red-900" 
                                onClick={() => {
                                    setEditMenu(false);
                                    setSelectedUser(null);
                                }}
                            >
                                X
                            </button>
                        </div>
                        <form onSubmit={editUser} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label> 
                                <input 
                                    name="name"
                                    type="text" 
                                    defaultValue={selectedUser.name}
                                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label> 
                                <input 
                                    name="email"
                                    type="email" 
                                    defaultValue={selectedUser.email}
                                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label> 
                                <input 
                                    name="password"
                                    type="password" 
                                    placeholder="Leave blank to keep current password"
                                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label> 
                                <select 
                                    name="role"
                                    defaultValue={selectedUser.role}
                                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="1">Manager</option>
                                    <option value="0">Employee</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button 
                                    type="button"
                                    className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    onClick={() => {
                                        setEditMenu(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-black"
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    </div>
  );
}
