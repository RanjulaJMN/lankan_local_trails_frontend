export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
        </p>
        <p className="text-sm text-gray-600">
          Developed by{" "}
          <a 
            href="https://github.com/RanjulaJMN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ranjula JMN
          </a>
        </p>
      </div>
    </footer>
  );
}