import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { FaBook, FaCheckCircle, FaChevronDown } from "react-icons/fa";

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCareers = async () => {
      const { data, error } = await supabase.from("careers").select("*");
      if (error) console.error("Error fetching careers:", error);
      else {
        setCareers(data);
        const uniqueCategories = [
          ...new Set(data.map((career) => career.category)),
        ];
        setCategories(uniqueCategories);
        filterByCategory(data);
      }
      setLoading(false);
    };

    fetchCareers();
  }, []);

  const filterByCategory = (careers) => {
    const categories = {};
    careers.forEach((career) => {
      if (!categories[career.category]) {
        categories[career.category] = [];
      }
      categories[career.category].push(career);
    });
    setFilteredCareers(categories);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-green-500"></div>
        <p className="ml-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      {/* Dropdown de Filtros */}
      <div className="relative w-fit">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 w-full border rounded-md focus:outline-none dark:bg-gray-700 dark:text-white appearance-none"
        >
          <option value="">Todas las Categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaChevronDown className="text-gray-500 dark:text-gray-300" />
        </div>
      </div>

      {Object.keys(filteredCareers)
        .filter(
          (category) => !selectedCategory || category === selectedCategory
        )
        .map((category) => (
          <div key={category} className="mb-10 mt-5">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers[category].map((career) => {
                const totalSubjects = getRandomNumber(30, 50); // Número aleatorio de materias
                const completedPercentage = getRandomNumber(0, 100); // Porcentaje aleatorio de completado

                return (
                  <div
                    key={career.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <FaBook className="text-green-500 mr-2" />
                        <h3 className="text-xl font-semibold">{career.name}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {career.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {totalSubjects} materias en total
                      </p>
                      <div className="flex items-center mb-2">
                        <FaCheckCircle className="text-blue-500 mr-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {completedPercentage}% completado
                        </p>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${completedPercentage}%` }}
                        ></div>
                      </div>

                      <a href={`/carreras/${career.id}`}>
                        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg">
                          Ver detalles
                        </button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Careers;
