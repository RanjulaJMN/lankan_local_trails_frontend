// src/pages/admin/Test.jsx
export default function Test() {
  console.log("Test page rendering");
  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-green-600">Test Page Works!</h1>
      <p className="mt-2">If you see this, routing is functioning correctly.</p>
    </div>
  );
}