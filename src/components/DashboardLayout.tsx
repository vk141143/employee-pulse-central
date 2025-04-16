
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarClock,
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  UserCircle,
  X,
} from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const isAdmin = user.role === "admin";
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top navigation */}
      <header className="bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Link to={isAdmin ? "/admin" : "/dashboard"} className="text-xl font-bold text-primary ml-2">
            Employee Pulse Central
          </Link>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-primary text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600" 
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (mobile) */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-200 ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeSidebar}
        ></div>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-slate-200 pt-16 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="lg:hidden absolute top-4 right-4">
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="py-4 px-4">
            <div className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase">
              Main
            </div>
            <nav className="space-y-1">
              {isAdmin ? (
                // Admin Navigation Links
                <>
                  <Link
                    to="/admin"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === "/admin"
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={closeSidebar}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/employees"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === "/admin/employees"
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={closeSidebar}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Employees
                  </Link>
                  <Link
                    to="/admin/leave-requests"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === "/admin/leave-requests"
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={closeSidebar}
                  >
                    <CalendarClock className="mr-3 h-5 w-5" />
                    Leave Requests
                  </Link>
                </>
              ) : (
                // Employee Navigation Links
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === "/dashboard"
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={closeSidebar}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/tasks"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === "/dashboard/tasks"
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={closeSidebar}
                  >
                    <CheckSquare className="mr-3 h-5 w-5" />
                    Tasks
                  </Link>
                  <Link
                    to="/dashboard/leave"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === "/dashboard/leave"
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={closeSidebar}
                  >
                    <CalendarClock className="mr-3 h-5 w-5" />
                    Leave Management
                  </Link>
                </>
              )}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
