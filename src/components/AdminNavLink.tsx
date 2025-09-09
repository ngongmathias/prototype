import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminNavLink = () => {
  return (
    <Link
      to="/sign-in"
      className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-roboto font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
    >
      <Shield className="w-4 h-4" />
      <span>Admin</span>
    </Link>
  );
};