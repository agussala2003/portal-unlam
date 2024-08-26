import PropTypes from "prop-types";
const AvailableSubjects = ({ availableSubjects }) => {
    const filteredAvailableSubjects = availableSubjects.filter((item) => {
        return item.available &&
               item.grades.first_term_grade === null &&
               item.grades.second_term_grade === null &&
               item.grades.final_grade === null;
    });
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">¿En que puedo anotarme?</h2>
            <ul>
                {filteredAvailableSubjects.map((subject) => (
                    <li key={subject.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{subject.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Descripción: {subject.description}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

AvailableSubjects.propTypes = {
    availableSubjects: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default AvailableSubjects;
