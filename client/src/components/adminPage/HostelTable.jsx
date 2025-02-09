import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import api from "@/api";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const HostelTable = ({ filteredHostels, hostelSearchQuery }) => {
  const { toast } = useToast();
  const [hostels, setHostels] = useState(filteredHostels);
  const [deleteId, setDeleteId] = useState(null); 

  if (!hostelSearchQuery) return null;

  const handleDelete = async () => {
    if (!deleteId) return;

    setHostels((prev) => prev.filter((hostel) => hostel.hostelId !== deleteId));

    try {
      await api.delete(`/api/hostel/${deleteId}`);
      toast({
        title: "Deleted",
        description: `Hostel ${deleteId} deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hostel. Please try again.",
        variant: "destructive",
      });
      setHostels(filteredHostels);
    }

    setDeleteId(null);
  };
  

  return (
    <div className="overflow-x-auto">
      <Toaster />
      <table className="w-full border-collapse shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            {["Hostel ID", "Name", "Location", "Price", "Type", "Food", "Rating", "Actions"].map((heading) => (
              <th key={heading} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {hostels.length > 0 ? (
            hostels.map((hostel) => (
              <tr key={hostel._id} className="hover:bg-gray-50 transition-all">
                <td className="px-4 py-3 text-sm">{hostel.hostelId}</td>
                <td className="px-4 py-3 text-sm">{hostel.name}</td>
                <td className="px-4 py-3 text-sm">{hostel.location}</td>
                <td className="px-4 py-3 text-sm">₹{hostel.price}</td>
                <td className="px-4 py-3 text-sm">{hostel.type}</td>
                <td className="px-4 py-3 text-sm">{hostel.food}</td>
                <td className="px-4 py-3 text-sm">{hostel.rating}</td>
                <td className="px-4 py-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        onClick={() => setDeleteId(hostel.hostelId)}
                        variant="destructive"
                        className="flex items-center gap-1 px-3 py-2 text-sm"
                      >
                        <Trash className="w-4 h-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>{hostel.name}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                        <Button onClick={handleDelete} variant="destructive">
                          Yes, Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No hostels found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HostelTable;
