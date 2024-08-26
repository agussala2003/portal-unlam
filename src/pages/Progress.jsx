import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import CareerProgress from '../components/CareerProgress';
import PendingFinals from '../components/PendingFinals';
import RemainingSubjectsForIntermediateDegree from '../components/RemainingSubjectsForIntermediateDegree';
import RemainingSubjectsForFinalDegree from '../components/RemainingSubjectsForFinalDegree';
import GeneralAverage from '../components/GeneralAverage';
import BestGrades from '../components/BestGrades';
import YearlyProgress from '../components/YearlyProgress';
import AvailableSubjects from '../components/AvaiableSubjects';

const Progress = () => {
    const [progress, setProgress] = useState({});
    const [bestGrades, setBestGrades] = useState([]);
    const [intermediateSubjects, setIntermediateSubjects] = useState(0);
    const [finalSubjects, setFinalSubjects] = useState(0);
    const [subjectsWithPrerequisites, setSubjectsWithPrerequisites] = useState([]);
    const [yearlySubjects, setYearlySubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingFinals, setPendingFinals] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            const user = await supabase.auth.getUser();
            if (user.error && user.error.status === 400) {
                setError('Debes tener cuenta para ver tu progreso.');
                setLoading(false);
                return; // Si no hay usuario autenticado o hay error, no hace nada más
            }

            const { data: grades, error: gradesError } = await supabase
                .from('student_grades')
                .select('*')
                .eq('student_id', user.data.user.id);

            if (gradesError) {
                console.error('Error fetching student grades:', gradesError);
                setLoading(false);
                return;
            }

            const subjectIds = grades.map((grade) => grade.subject_id);

            const { data: subjects, error: subjectsError } = await supabase
                .from('subjects')
                .select('*, careers(*)')
                .in('id', subjectIds);

            if (subjectsError) {
                console.error('Error fetching subjects:', subjectsError);
                setLoading(false);
                return;
            }

            // Crear un mapa de IDs de materias a nombres de materias
            const subjectMap = subjects.reduce((map, subject) => {
                map[subject.id] = subject.name; // Asumiendo que 'name' es el campo con el nombre de la materia
                return map;
            }, {});

            // Armar el objeto de progreso
            const progressByCareer = {};
            subjects.forEach((subject) => {
                const careerId = subject.careers.id;
                if (!progressByCareer[careerId]) {
                    progressByCareer[careerId] = {
                        careerId: subject.careers.id,
                        completed: 0,
                        total: 0,
                    };
                }
                progressByCareer[careerId].total += 1;
                const grade = grades.find((g) => g.subject_id === subject.id);
                if (grade && (grade.first_term_grade >= 7 && grade.second_term_grade >= 7) || grade.final_grade >= 4) {
                    progressByCareer[careerId].completed += 1;
                }
            });
            setProgress(progressByCareer);

            const sortedGrades = grades
                .map((grade) => {
                    const finalGrade = grade.final_grade || 0;
                    const avgFirstSecond = (grade.first_term_grade + grade.second_term_grade) / 2;
                    const useFinalGrade = finalGrade > 0; // Usar la nota final si está disponible
                    const bothFirstSecondAboveSeven = grade.first_term_grade >= 7 && grade.second_term_grade >= 7;

                    // Determinar la mejor nota basada en la validación
                    const bestGrade = useFinalGrade ? Math.round(finalGrade) :
                        (bothFirstSecondAboveSeven ? Math.round(avgFirstSecond) : 0);

                    return {
                        ...grade,
                        avg: bestGrade,
                        subjectName: subjectMap[grade.subject_id] || 'Unknown Subject', // Asignar el nombre de la materia
                    };
                })
                .filter((grade) => grade.avg > 0) // Filtrar materias con promedio 0
                .sort((a, b) => b.avg - a.avg);

            setBestGrades(sortedGrades);

            // Obtener las notas pendientes de final
            const pendingFinalsGrade = grades.filter((grade) => {
                const { final_grade, first_term_grade, second_term_grade } = grade;

                // Verifica si el final aún no está rendido
                const finalNotTaken = final_grade === null || final_grade === 0;

                // Verifica si ambos parciales están aprobados pero no promocionados
                const partialsPassed = first_term_grade >= 4 && second_term_grade >= 4;
                const notPromoted = !(first_term_grade >= 7 && second_term_grade >= 7);

                // Devuelve true solo si todas las condiciones se cumplen
                return finalNotTaken && partialsPassed && notPromoted;
            }).map((grade) => ({
                ...grade,
                subjectName: subjectMap[grade.subject_id] || 'Unknown Subject', // Agrega el nombre de la materia
            }));

            // Guarda las materias pendientes de final
            setPendingFinals(pendingFinalsGrade);

            // Obtener las materias que cumplen las condiciones y agregar el nombre de la materia
            const subjectNameAndYear = subjects.reduce((map, subject) => {
                map[subject.id] = {
                    name: subject.name,  // Nombre de la materia
                    year: subject.year   // Año de la materia
                };
                return map;
            }, {});

            const fullSubjectGrades = grades.map((grade) => {
                const subject = subjectNameAndYear[grade.subject_id] || { name: 'Unknown Subject', year: 0 };
                return {
                    ...grade,
                    subjectName: subject.name,
                    year_level: subject.year
                };
            });

            // Filtrar las materias por año
            const intermediateSubjectsFilteredByYear = fullSubjectGrades
                .filter((grade) => grade.year_level <= 3);

            // Contar todas las materias del 3er año o menos
            const totalSubjectsIntermediate = intermediateSubjectsFilteredByYear.length;

            // Contar todas las materias
            const totalSubjectsFinal = fullSubjectGrades.length;

            // Filtrar las materias aprobadas (con final tomado)
            const intermediateSubjectsTaken = intermediateSubjectsFilteredByYear
                .filter((grade) => grade.final_grade !== null || (grade.first_term_grade >= 7 && grade.second_term_grade >= 7));

            // Contar las materias aprobadas
            const totalTaken = intermediateSubjectsTaken.length;

            // Calcular las materias con final pendiente para el titulo intermedio
            const pendingFinalsCountIntermediate = totalSubjectsIntermediate - totalTaken;

            // Calcular las materias con final pendiente para el titulo intermedio
            const pendingFinalsCountFinal = totalSubjectsFinal - totalTaken;

            // Actualizar el estado con la cantidad de materias con final pendiente
            setIntermediateSubjects(pendingFinalsCountIntermediate);

            // Calcular las materias con final pendiente para el titulo final
            setFinalSubjects(pendingFinalsCountFinal);

            // Progreso de materias dividido por años
            const progressByYear = {};
            fullSubjectGrades.forEach((grade) => {
                const year = grade.year_level;
                if (!progressByYear[year]) {
                    progressByYear[year] = {
                        year,
                        completed: 0,
                        total: 0,
                    };
                }
                progressByYear[year].total += 1;

                // Buscar la nota correspondiente
                const gradeAux = grades.find((g) => g.subject_id === grade.subject_id);

                if (gradeAux && (gradeAux.first_term_grade >= 7 && gradeAux.second_term_grade >= 7) || gradeAux.final_grade >= 4) {
                    progressByYear[year].completed += 1;
                }
            });

            // Convertir el objeto a un array si necesitas un formato más ordenado o para mostrar
            const sortedProgressByYear = Object.values(progressByYear).sort((a, b) => a.year - b.year);

            setYearlySubjects(sortedProgressByYear);

             // Create a map for quick lookup of grades by subject_id
             const gradesMap = grades.reduce((acc, grade) => {
                acc[grade.subject_id] = grade;
                return acc;
            }, {});

            // Fetch prerequisites and process subjects
            const subjectsWithPrerequisitesAux = await Promise.all(
                subjects.map(async (subject) => {
                    const { data: prerequisites, error: prereqError } = await supabase
                        .from('subject_prerequisites')
                        .select('prerequisite_id')
                        .eq('subject_id', subject.id);

                    if (prereqError) throw prereqError;

                    const prerequisitesMet = prerequisites.every((p) => {
                        const grade = gradesMap[p.prerequisite_id];
                        return grade &&
                            grade.first_term_grade >= 4 &&
                            grade.second_term_grade >= 4;
                    });

                    return {
                        ...subject,
                        prerequisites: prerequisites
                            .map((p) => p.prerequisite_id)
                            .join(' - '),
                        grades: gradesMap[subject.id] || {
                            first_term_grade: null,
                            second_term_grade: null,
                            final_grade: null,
                        },
                        available: prerequisitesMet,
                    };
                })
            );

            // Update state
            setSubjectsWithPrerequisites(subjectsWithPrerequisitesAux);

            setLoading(false);
        };

        fetchProgress();
    }, []);

    if (loading) {
        return <Loader />;
    }
    if (error) {
        return (
            <ErrorMessage error={error} />
        );
    }

    return (
        <div className="w-11/12 mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Progreso General</h1>

            {/* Progreso General del Alumno */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <CareerProgress progress={progress} />
                <PendingFinals grades={pendingFinals} />
                <RemainingSubjectsForIntermediateDegree intermediateSubjects={intermediateSubjects} />
                <RemainingSubjectsForFinalDegree finalSubjects={finalSubjects} />
                <GeneralAverage grades={bestGrades} />
                <BestGrades bestGrades={bestGrades} />
                <AvailableSubjects availableSubjects={subjectsWithPrerequisites} />
                <YearlyProgress progress={yearlySubjects} />
            </div>
        </div>
    );
};

export default Progress;
