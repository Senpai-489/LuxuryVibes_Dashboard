"use client";

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ReturnToLogin from "@/app/Components/ReturnToLogin";
import Sidebar2 from "@/app/Components/ui/sidebar2";

interface User {
  id: string;
  name: string;
  email: string;
  role: number;
}

const UserManagement: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [addMenu, setAddMenu] = useState(false);
  const [editMenu, setEditMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [cookies] = useCookies(["name", "role"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/userManagement");
        const users: User[] = await res.json();
        setData(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = (e.currentTarget.form as HTMLFormElement) || null;
    if (!form) return;

    const name = (form[0] as HTMLInputElement).value;
    const email = (form[1] as HTMLInputElement).value;
    const password = (form[2] as HTMLInputElement).value;
    const role = (form[3] as HTMLSelectElement).value;

    try {
      const res = await fetch("http://localhost:5000/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const deleteUser = async (email: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/deleteUser/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setData((prev) => prev.filter((user) => user.email !== email));
        alert("User deleted successfully");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete user: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again.");
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditMenu(true);
  };

  const editUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      newEmail: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLSelectElement).value,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/editUser/${selectedUser.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setData((prev) =>
          prev.map((user) =>
            user.email === selectedUser.email ? updatedUser.user : user
          )
        );
        setEditMenu(false);
        setSelectedUser(null);
        alert("User updated successfully");
      } else {
        const errorData = await response.json();
        alert(`Failed to update user: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again.");
    }
  };

  if (!cookies.name || !cookies.role) {
    return <ReturnToLogin />;
  }

  return (
    <div className="flex flex-row justify-start">
      <Sidebar2 />
      <div className="w-full mx-auto p-4 text-4xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role === 1 ? "Manager" : "Employee"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cookies.role === 1 ? (
                    <>
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ml-4 text-red-600 hover:text-red-900"
                        onClick={() => deleteUser(user.email)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cookies.role === 1 && (
          <button
            type="button"
            className="mt-4 px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-black duration-150"
            onClick={() => setAddMenu(!addMenu)}
          >
            Add User
          </button>
        )}

        {/* Add User Modal */}
        {addMenu && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent">
            <div className="bg-white w-92 p-8 rounded-lg shadow-xl">
              <div className="flex justify-between">
                <p className="text-lg">Add New User</p>
                <button
                  type="button"
                  className="text-red-600 text-lg hover:text-red-900"
                  onClick={() => setAddMenu(false)}
                >
                  X
                </button>
              </div>
              <form className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="1">Manager</option>
                    <option value="0">Employee</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 text-lg bg-gray-700 text-white rounded-md hover:bg-black duration-150"
                    onClick={addUser}
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editMenu && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
            <div className="bg-white w-92 p-8 rounded-lg shadow-xl">
              <div className="flex justify-between">
                <p className="text-lg">Edit User</p>
                <button
                  type="button"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={selectedUser.name}
                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={selectedUser.email}
                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
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
    </div>
  );
};

export default UserManagement;
