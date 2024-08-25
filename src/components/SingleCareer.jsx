import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../utils/supabase";
import SubjectRow from "./SubjectRow";

const SingleCareer = ({ careerId }) => {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await supabase.auth.getUser();
      setUserId(user.data.user.id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return; // Esperar hasta que el userId esté disponible

      try {
        setLoading(true);

        // Obtén las materias
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("*")
          .eq("career_id", careerId);

        if (subjectsError) throw subjectsError;

        // Obtén las actas del usuario
        const { data: gradesData, error: gradesError } = await supabase
          .from("student_grades")
          .select("*")
          .eq("student_id", userId);

        if (gradesError) throw gradesError;

        // Convierte el array de actas en un objeto para un acceso más rápido
        const gradesMap = gradesData.reduce((acc, grade) => {
          acc[grade.subject_id] = grade;
          return acc;
        }, {});

        const subjectsWithPrerequisites = await Promise.all(
          subjectsData.map(async (subject) => {
            const { data: prerequisites, error: prereqError } = await supabase
              .from("subject_prerequisites")
              .select("prerequisite_id")
              .eq("subject_id", subject.id);

            if (prereqError) throw prereqError;

            const prerequisitesMet = prerequisites.every(
              (p) => gradesMap[p.prerequisite_id]?.final_grade >= 6
            );

            return {
              ...subject,
              prerequisites: prerequisites
                .map((p) => p.prerequisite_id)
                .join(" - "),
              grades: gradesMap[subject.id] || {
                first_term_grade: null,
                second_term_grade: null,
                final_grade: null,
              },
              available: prerequisitesMet,
            };
          })
        );

        setSubjects(subjectsWithPrerequisites);
        setGrades(gradesMap);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [careerId, userId]);

  const handleSaveChanges = async () => {
    try {
      const updatedGrades = subjects.map((subject) => {
        const { grades } = subject; // Obtener las notas del sujeto actual
        return {
          ...grades, // Copiar las notas de `subject.grades`
          student_id: userId,
          subject_id: subject.id,
          created_at: new Date(),
        };
      });

      await supabase.from("student_grades").upsert(updatedGrades);

      alert("Cambios guardados con éxito");
    } catch (error) {
      alert("Error al guardar los cambios: " + error.message);
    }
  };

  const groupedSubjects = subjects.reduce((acc, subject) => {
    const year = subject.year || 1;
    if (!acc[year]) acc[year] = { 1: [], 2: [] };
    acc[year][subject.semester].push(subject);
    return acc;
  }, {});

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const currentSubjects = groupedSubjects[currentYear] || { 1: [], 2: [] };

  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          Materias para la Carrera ID: {careerId}
        </h2>
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </div>

      <div className="flex justify-center space-x-2 mb-4">
        {Object.keys(groupedSubjects).map((year) => (
          <button
            key={year}
            onClick={() => handleYearChange(parseInt(year))}
            className={`px-4 py-2 rounded hover:bg-opacity-80 transition-colors
        ${
          parseInt(year) === currentYear
            ? "bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-400"
            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
          >
            Año {year}
          </button>
        ))}
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th colSpan="8" className="px-6 py-3">
                Primer Cuatrimestre
              </th>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th scope="col" className="px-6 py-3 w-1/4">
                Materia
              </th>
              <th scope="col" className="px-6 py-3 w-1/6">
                Categoría
              </th>
              <th scope="col" className="px-6 py-3 w-1/4">
                Correlatividades
              </th>
              <th scope="col" className="px-6 py-3 w-1/12">
                1er Parcial
              </th>
              <th scope="col" className="px-6 py-3 w-1/12">
                2do Parcial
              </th>
              <th scope="col" className="px-6 py-3 w-1/12">
                Final
              </th>
              <th scope="col" className="px-6 py-3 w-1/12">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSubjects[1].length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  No hay materias para este cuatrimestre.
                </td>
              </tr>
            ) : (
              currentSubjects[1].map((subject) => (
                <SubjectRow
                  key={subject.id}
                  subject={subject}
                  setSubjects={setSubjects}
                  available={subject.available}
                />
              ))
            )}
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th colSpan="8" className="px-6 py-3">
                Segundo Cuatrimestre
              </th>
            </tr>
            {currentSubjects[2].length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  No hay materias para este cuatrimestre.
                </td>
              </tr>
            ) : (
              currentSubjects[2].map((subject) => (
                <SubjectRow
                  key={subject.id}
                  subject={subject}
                  setSubjects={setSubjects}
                  available={subject.available}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

SingleCareer.propTypes = {
  careerId: PropTypes.string.isRequired,
};

export default SingleCareer;
