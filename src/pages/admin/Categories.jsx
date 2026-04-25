import { useEffect, useState } from "react";
import { getCategories } from "../../api/categoryApi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      
      // Ensure data is an array
      const categoriesArray = Array.isArray(data) ? data : [];
      setCategories(categoriesArray);
      
      console.log("Loaded categories:", categoriesArray); // Debug
    } catch (error) {
      console.error("Error loading categories", error);
      setError(error.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-4">Categories</h1>
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-4">Categories</h1>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={fetchCategories}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Categories</h1>
      <div className="bg-white p-4 rounded-xl shadow">
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b">
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}