import PropTypes from "prop-types";
import { useState, useMemo } from "react";

const BestGrades = ({ bestGrades }) => {
    // Número de elementos por página
    const itemsPerPage = 5; 
    
    // Estado de la página actual
    const [currentPage, setCurrentPage] = useState(1);

    // Calcula el total de páginas
    const totalPages = Math.ceil(bestGrades.length / itemsPerPage);

    // Calcula los índices de inicio y fin de los elementos a mostrar
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Usa useMemo para evitar recalcular la paginación en cada render
    const paginatedGrades = useMemo(() => {
        return bestGrades.slice(startIndex, endIndex);
    }, [bestGrades, startIndex, endIndex]);

    // Maneja el cambio de página
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Mejores Notas</h2>
            <ul>
                {paginatedGrades.map((grade) => (
                    <li key={grade.subject_id} className="mb-4">
                        <h3 className="text-lg font-semibold">{grade.subjectName}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Nota Promedio: {Math.round(grade.avg * 100) / 100}
                        </p>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center mt-6">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Anterior
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

BestGrades.propTypes = {
    bestGrades: PropTypes.arrayOf(
        PropTypes.shape({
            subject_id: PropTypes.number.isRequired,
            subjectName: PropTypes.string.isRequired,
            avg: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default BestGrades;
