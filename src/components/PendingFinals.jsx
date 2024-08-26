import PropTypes from "prop-types";

const PendingFinals = ({ grades }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Materias Pendientes de Final</h2>
            <ul className="space-y-4">
                {grades.map(grade => (
                    <li key={grade.subject_id} className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                {grade.subjectName}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                                <p>1er Parcial: {grade.first_term_grade}</p>
                                <p>2do Parcial: {grade.second_term_grade}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

PendingFinals.propTypes = {
    grades: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PendingFinals;
