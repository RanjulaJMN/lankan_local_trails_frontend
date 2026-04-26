import { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";

export default function CategoryModal({ isOpen, onClose, onSubmit, category, mode = "create" }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    img_url: "",
    img_file: null
  });
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened with mode:", mode, "category:", category); // Debug
      if (category && mode !== "create") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: category.name || "",
          description: category.description || "",
          img_url: category.img_url || "",
          img_file: null
        });
        const imageUrl = category.img_url 
          ? (category.img_url.startsWith('http') ? category.img_url : `http://localhost:8080${category.img_url}`)
          : "";
        setPreviewImage(imageUrl);
      } else {
        setFormData({
          name: "",
          description: "",
          img_url: "",
          img_file: null
        });
        setPreviewImage("");
      }
      setErrors({});
    }
  }, [category, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, img_file: "Image must be less than 5MB" }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, img_file: "Only image files are allowed" }));
        return;
      }
      
      setFormData(prev => ({ ...prev, img_file: file, img_url: "" }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, img_file: "" }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, img_url: "", img_file: null }));
    setPreviewImage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (formData.name.length > 100) newErrors.name = "Name must be less than 100 characters";
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    if (formData.img_file) {
      submitData.append("image", formData.img_file);
    }
    if (!formData.img_file && formData.img_url && mode === "edit") {
      submitData.append("existing_image", formData.img_url);
    }

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Add Category" : mode === "edit" ? "Edit Category" : "View Category";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full z-10">
          <form onSubmit={handleSubmit}>
            <div className="px-6 pt-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } ${isViewMode ? "bg-gray-50" : ""}`}
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isViewMode}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } ${isViewMode ? "bg-gray-50" : ""}`}
                    placeholder="Enter category description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Image Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
                  </label>
                  
                  {previewImage && (
                    <div className="mb-3 relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      {!isViewMode && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {!isViewMode && (
                    <div>
                      <label className="block">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Choose Image</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
                    </div>
                  )}
                  
                  {errors.img_file && (
                    <p className="mt-1 text-xs text-red-500">{errors.img_file}</p>
                  )}

                  {isViewMode && !previewImage && (
                    <div className="text-sm text-gray-500 italic">No image available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
              {!isViewMode ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {mode === "create" ? "Create Category" : "Update Category"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}