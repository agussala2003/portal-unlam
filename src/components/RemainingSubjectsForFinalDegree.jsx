import PropTypes from "prop-types";
const RemainingSubjectsForFinalDegree = ({ finalSubjects }) => {

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Materias Restantes para el Título Final</h2>
            <p>{finalSubjects}</p>
        </div>
    );
};

RemainingSubjectsForFinalDegree.propTypes = {
    finalSubjects: PropTypes.number.isRequired
};

export default RemainingSubjectsForFinalDegree;
