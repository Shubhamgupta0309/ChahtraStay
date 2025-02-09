import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Shield, ShieldOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const UserSearch = ({ users, handleAdminRole }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const searchLower = searchQuery.toLowerCase();

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower)
    );
  }, [users, searchQuery]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Find User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-row justify-center space-x-2">
            <Input
              placeholder="Enter user name, email, contact number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {searchQuery && (
            <div className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Phone</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm">{user.name}</td>
                            <td className="px-4 py-2 text-sm">{user.email}</td>
                            <td className="px-4 py-2 text-sm">{user.phone}</td>
                            <td className="px-4 py-2 text-sm">{user.role}</td>
                            <td className="px-4 py-2 text-sm">
                              {user.role === "admin" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={() => handleAdminRole(user._id, false)}
                                >
                                  <ShieldOff className="w-4 h-4" />
                                  Remove Admin
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={() => handleAdminRole(user._id, true)}
                                >
                                  <Shield className="w-4 h-4" />
                                  Make Admin
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                      <p className="text-center py-4 text-gray-500">No users found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSearch;
