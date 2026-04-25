const plans = [
  { id: 1, user: "Nadun", places: 5 },
  { id: 2, user: "Kamal", places: 3 },
];

export default function VisitPlans() {
  return (
    <div>

      <h1 className="text-xl font-bold mb-4">Visit Plans</h1>

      <div className="space-y-3">

        {plans.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow">

            <p><b>User:</b> {p.user}</p>
            <p><b>Places:</b> {p.places}</p>

          </div>
        ))}

      </div>

    </div>
  );
}