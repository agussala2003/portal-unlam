import PropTypes from "prop-types";

const YearlyProgress = ({ progress }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Progreso por Año</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
                    <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-700">
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Año</th>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Total</th>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Completadas</th>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(progress).map((element) => {
                            const { total, completed, year } = progress[element];
                            const percentage = total > 0 ? (completed / total) * 100 : 0;

                            return (
                                <tr key={element} className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{(year)}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{total}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{completed}</td>
                                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                        {Math.round(percentage)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

YearlyProgress.propTypes = {
    progress: PropTypes.objectOf(
        PropTypes.shape({
            total: PropTypes.number.isRequired,
            completed: PropTypes.number.isRequired,
            year: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default YearlyProgress;
