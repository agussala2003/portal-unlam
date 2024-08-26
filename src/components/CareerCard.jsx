import { FaBook, FaCheckCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const CareerCard = ({ career, progress }) => {
  // Accede al progreso de la carrera
  const careerProgress = progress[career.id] || { total: 0, completed: 0 };

  const totalSubjects = careerProgress.total; // Número total de materias
  const completedPercentage = totalSubjects ? (careerProgress.completed / totalSubjects) * 100 : 0; // Porcentaje completado

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="p-6">
        <div className="flex items-center mb-2">
          <FaBook className="text-green-500 mr-2" />
          <h3 className="text-xl font-semibold">{career.name}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {career.category}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {totalSubjects} materias en total
        </p>
        <div className="flex items-center mb-2">
          <FaCheckCircle className="text-blue-500 mr-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedPercentage.toFixed(0)}% completado
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
};

CareerCard.propTypes = {
  career: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.object.isRequired,
};

export default CareerCard;
