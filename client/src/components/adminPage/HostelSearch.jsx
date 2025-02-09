import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const HostelSearch = ({ hostelSearchQuery, setHostelSearchQuery }) => {
  const handleHostelSearch = (e) => {
    setHostelSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-row justify-center space-x-2">
      <Input
        type="text"
        placeholder="Enter hostel name, location, price..."
        value={hostelSearchQuery}
        onChange={handleHostelSearch}
        className="flex flex-row justify-center space-x-2"
      />
      <Button type="submit" variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default HostelSearch;
