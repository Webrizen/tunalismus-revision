"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  Users,
  Book,
  School,
  Wallet,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        router.push("/login");
        return;
      }
      setIsAuthorized(true);
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!isAuthorized) {
    // You can return a loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 text-white bg-gray-800">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="mt-8">
          <ul>
            <li className="mb-4">
              <Link href="/admin/dashboard" className="flex items-center">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/users" className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Users
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/courses" className="flex items-center">
                <Book className="w-5 h-5 mr-2" />
                Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/batches" className="flex items-center">
                <School className="w-5 h-5 mr-2" />
                Batches
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/payments" className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Payments
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4">
          <button onClick={handleLogout} className="flex items-center">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}
