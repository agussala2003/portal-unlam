import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import Loader from "../components/Loader";
import CategoryFilter from "../components/CategoryFilter";
import CareerCard from "../components/CareerCard";
import ErrorMessage from "../components/ErrorMessage";

const Careers = () => {
  const [filteredCareers, setFilteredCareers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareers = async () => {
      const { data, error } = await supabase.from("careers").select("*");
      if (error) {
        console.error("Error fetching careers:", error);
      } else {
        const uniqueCategories = [
          ...new Set(data.map((career) => career.category)),
        ];
        setCategories(uniqueCategories);
        filterByCategory(data);
        await fetchUserProgress(); // Llama a la función para obtener el progreso del usuario
      }
      setLoading(false);
    };

    fetchCareers();
  }, []);

  const fetchUserProgress = async () => {
    const user = await supabase.auth.getUser();
    if (user.error && user.error.status == 400) {
      setError("Debes tener cuenta para ver las carreras.");
      setLoading(false);
      return; // Si no hay usuario autenticado o hay error, no hace nada más
    }

    const { data: grades, error: gradesError } = await supabase
      .from("student_grades")
      .select("*")
      .eq("student_id", user.data.user.id);

    if (gradesError) {
      console.error("Error fetching student grades:", gradesError);
      setLoading(false);
      return;
    }

    // Obtener los IDs de las materias
    const subjectIds = grades.map((grade) => grade.subject_id);

    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("*, careers(*)")
      .in("id", subjectIds);

    if (subjectsError) {
      console.error("Error fetching subjects:", subjectsError);
      setLoading(false);
      return;
    }

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
      if (grade && (grade.first_term_grade >= 7 && grade.second_term_grade >= 7 )|| grade.final_grade >= 4) {
        progressByCareer[careerId].completed += 1;
      }
    });

    setProgress(progressByCareer);
    setLoading(false);
  };

  const filterByCategory = (careers) => {
    const categories = {};
    careers.forEach((career) => {
      if (!categories[career.category]) {
        categories[career.category] = [];
      }
      categories[career.category].push(career);
    });
    setFilteredCareers(categories);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

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
      {/* Dropdown de Filtros */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {Object.keys(filteredCareers)
        .filter(
          (category) => !selectedCategory || category === selectedCategory
        )
        .map((category) => (
          <div key={category} className="mb-10 mt-5">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers[category].map((career) => (
                <CareerCard key={career.id} career={career} progress={progress} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Careers;
