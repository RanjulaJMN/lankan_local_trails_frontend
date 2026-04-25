const places = [
  { id: 1, name: "Galle Fort", category: "Heritage" },
  { id: 2, name: "Sigiriya", category: "Nature" },
];

export default function Places() {
  return (
    <div>

      <h1 className="text-xl font-bold mb-4">Places</h1>

      <div className="grid gap-4">

        {places.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow">

            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-500">{p.category}</p>

            <div className="mt-2">
              <button className="text-blue-600 mr-3">Edit</button>
              <button className="text-red-600">Delete</button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}