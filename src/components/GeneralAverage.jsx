import PropTypes from "prop-types";

const GeneralAverage = ({ grades }) => {
    const calculateGeneralAverage = () => {
        const totalGrades = grades.reduce((acc, grade) => acc + grade.avg, 0);
        return grades.length ? (totalGrades / grades.length).toFixed(2) : 0;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Promedio General</h2>
            <p className="text-gray-700 dark:text-gray-300">
                {calculateGeneralAverage()}
            </p>
        </div>
    );
};

GeneralAverage.propTypes = {
    grades: PropTypes.arrayOf(
        PropTypes.shape({
            avg: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default GeneralAverage;
