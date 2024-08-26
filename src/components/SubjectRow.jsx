import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const getStatusBadge = (status) => {
  let color;
  switch (status) {
    case "Promocionada":
      color =
        "bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300";
      break;
    case "Aprobada":
      color =
        "bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300";
      break;
    case "Cursada":
      color =
        "bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300";
      break;
    default:
      color =
        "bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300";
      break;
  }
  return <span className={`${color}`}>{status}</span>;
};

const getStatus = (grades) => {
  const { first_term_grade, second_term_grade, final_grade } = grades;
  if (first_term_grade >= 7 && second_term_grade >= 7) return "Promocionada";
  if (first_term_grade >= 4 && second_term_grade >= 4) {
    if (final_grade !== null && final_grade >= 4) return "Aprobada";
    return "Cursada";
  }
  return "Pendiente";
};

const SubjectRow = ({ subject, setSubjects, available }) => {
  const [grades, setGrades] = useState(subject.grades);
  const status = getStatus(grades);

  const handleGradeChange = (field, value) => {
    if (value === "") {
      const newGrades = { ...grades, [field]: null };
  
      setGrades(newGrades);
  
      setSubjects((prevSubjects) => {
        const updatedSubjects = prevSubjects.map((subj) => {
          if (subj.id === subject.id) {
            return { ...subj, grades: newGrades };
          }
          return subj;
        });
        return updatedSubjects;
      });
    } else {
      const parsedValue = parseFloat(value);
  
      // Validar que el valor es un número entre 0 y 10
      if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 10) {
        return;
      }
  
      const newGrades = { ...grades, [field]: parsedValue };
  
      setGrades(newGrades);
  
      setSubjects((prevSubjects) => {
        const updatedSubjects = prevSubjects.map((subj) => {
          if (subj.id === subject.id) {
            return { ...subj, grades: newGrades };
          }
          return subj;
        });
        return updatedSubjects;
      });
    }
  };  

  const inputClassName = (disabled) =>
    `block w-full p-2 border rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500 ${
      disabled
        ? "text-gray-400 bg-gray-200 border-gray-200 cursor-not-allowed dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-500"
        : "text-gray-900 bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    }`;

  return (
    <tr
      className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 ${
        available
          ? "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
      }`}
    >
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <Link
          to={`/subjects/${subject.id}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {subject.name} ({subject.id})
        </Link>
      </td>
      <td className="px-6 py-4">{subject.category}</td>
      <td className="px-6 py-4">{subject.prerequisites}</td>
      <td className="px-6 py-4">
      <input
        type="number"
        min="0"
        max="10"
        step="1"
        className={inputClassName(!available)}
        value={grades.first_term_grade || ""}
        onChange={(e) => handleGradeChange("first_term_grade", e.target.value)}
        disabled={!available}
        placeholder="Nota"
      />

      </td>
      <td className="px-6 py-4">
        <input
          type="number"
          min="0"
          max="10"
          step="1"
          className={inputClassName(!available)}
          value={grades.second_term_grade || ""}
          onChange={(e) =>
            handleGradeChange("second_term_grade", e.target.value)
          }
          disabled={!available}
          placeholder="Nota"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="number"
          min="0"
          max="10"
          step="1"
          className={inputClassName(
            !available || (status !== "Cursada" && status !== "Aprobada")
          )}
          value={grades.final_grade || ""}
          onChange={(e) => handleGradeChange("final_grade", e.target.value)}
          disabled={
            !available || (status !== "Cursada" && status !== "Aprobada")
          }
          placeholder="Nota"
        />
      </td>
      <td className="px-6 py-4">{getStatusBadge(status)}</td>
    </tr>
  );
};

SubjectRow.propTypes = {
  subject: PropTypes.object.isRequired,
  setSubjects: PropTypes.func.isRequired,
  available: PropTypes.bool.isRequired,
};

export default SubjectRow;
