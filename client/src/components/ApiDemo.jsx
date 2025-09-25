import React, { useEffect, useState } from "react";

export default function ApiDemo() {
  const [hello, setHello] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/hello")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setHello(data.message || data);
      })
      .catch((err) => {
        if (mounted) setHello(`Error: ${err.message}`);
      });

    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (mounted && Array.isArray(data)) setUsers(data);
      })
      .catch((err) => {
        if (mounted) setUsers([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-8 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-2">API Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        This calls the Vercel-style endpoints placed under <code>client/api/</code>.
      </p>
      <div className="space-y-2">
        <div>
          <strong>/api/hello:</strong>
          <div className="text-sm text-gray-800">{hello ?? "Loading..."}</div>
        </div>
        <div>
          <strong>/api/users:</strong>
          <div className="text-sm text-gray-800">
            {users.length ? (
              <ul>
                {users.map((u) => (
                  <li key={u.id}>{u.name}</li>
                ))}
              </ul>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
