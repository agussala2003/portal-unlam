import PropTypes from "prop-types";

const CareerProgress = ({ progress }) => {
    const calculateOverallProgress = () => {
        const total = Object.values(progress).reduce((acc, career) => acc + career.total, 0);
        const completed = Object.values(progress).reduce((acc, career) => acc + career.completed, 0);
        return total === 0 ? 0 : (completed / total) * 100;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Progreso Total</h2>
            <div className="flex items-center mb-4">
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${calculateOverallProgress()}%` }}
                    ></div>
                </div>
                <p className="ml-4 text-gray-700 dark:text-gray-300">
                    {Math.round(calculateOverallProgress())}%
                </p>
            </div>
            <p className=" text-gray-700 dark:text-gray-300">
                    ({progress[1].completed}/{progress[1].total}) Materias Completadas
            </p>
        </div>
    );
};

CareerProgress.propTypes = {
    progress: PropTypes.object.isRequired,
};

export default CareerProgress;
