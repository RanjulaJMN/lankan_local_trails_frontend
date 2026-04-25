const users = [
  { id: 1, name: "Nadun", role: "USER" },
  { id: 2, name: "Admin", role: "ADMIN" },
];

export default function Users() {
  return (
    <div>

      <h1 className="text-xl font-bold mb-4">Users</h1>

      <div className="bg-white p-4 rounded-xl shadow">

        {users.map(u => (
          <div key={u.id} className="flex justify-between border-b p-2">
            <span>{u.name}</span>
            <span className="text-gray-500">{u.role}</span>
          </div>
        ))}

      </div>

    </div>
  );
}