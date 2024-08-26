import PropTypes from "prop-types";

const RemainingSubjectsForIntermediateDegree = ({ intermediateSubjects }) => {

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Materias Restantes para el Título Intermedio</h2>
            <p>{intermediateSubjects}</p>
        </div>
    );
};

RemainingSubjectsForIntermediateDegree.propTypes = {
    intermediateSubjects: PropTypes.number.isRequired,
};

export default RemainingSubjectsForIntermediateDegree;
