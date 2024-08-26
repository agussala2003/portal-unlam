import { FaExclamationTriangle } from "react-icons/fa";
import PropTypes from "prop-types";

const ErrorMessage = ({error}) => {
    return (
        <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 p-4 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-600 transition-transform transform hover:scale-105 hover:shadow-xl" role="alert">
          <FaExclamationTriangle size={32} />
          <div className="text-xl">
            <span>{error}</span>
          </div>
        </div>
      </div>
    )
}

ErrorMessage.propTypes = {
    error: PropTypes.string.isRequired,
}

export default ErrorMessage;