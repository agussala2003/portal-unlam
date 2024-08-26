import { FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="relative w-fit mb-10">
      <select
        value={selectedCategory}
        onChange={onCategoryChange}
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
  );
};

CategoryFilter.propTypes = {
    categories: PropTypes.array.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
};  

export default CategoryFilter;
