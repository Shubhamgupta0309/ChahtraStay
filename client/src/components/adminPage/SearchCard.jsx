import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import HostelSearch from "./HostelSearch";
import HostelTable from "./HostelTable";

const SearchCard = ({ hostels }) => {
  const [hostelSearchQuery, setHostelSearchQuery] = useState("");

  const filteredHostels = useMemo(() => {
    if (!hostelSearchQuery.trim()) return hostels; 

    const searchLower = hostelSearchQuery.toLowerCase();

    return hostels.filter((hostel) => {
      const hostelString = [
        hostel.name,
        hostel.location,
        hostel.food,
        hostel.type,
        hostel.price,
        hostel.rating,
        hostel.hostelId,
      ]
        .filter(Boolean) 
        .map(String)
        .join(" ") 

        .toLowerCase(); 

      return hostelString.includes(searchLower); 
    });
  }, [hostels, hostelSearchQuery]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Find Hostel</CardTitle>
      </CardHeader>
      <CardContent>
        <HostelSearch
          hostelSearchQuery={hostelSearchQuery}
          setHostelSearchQuery={setHostelSearchQuery}
        />
        <div className="mt-4">
          {hostelSearchQuery && (
            <Card>
              <CardContent className="p-4">
                <HostelTable
                  hostelSearchQuery={hostelSearchQuery}
                  filteredHostels={filteredHostels}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchCard;
