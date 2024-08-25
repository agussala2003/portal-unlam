import WelcomeSection from '../components/WelcomeSection';
import Section from '../components/Section';
import imgCarreras from '../assets/images/materias.png';
import imgProgreso from '../assets/images/progreso.png';
import imgOpiniones from '../assets/images/opiniones.png';

const Home = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="py-10 md:py-20">
        {/* Sección de Bienvenida */}
        <WelcomeSection />

        {/* Sección de Carreras */}
        <div className="mt-16 bg-gray-200 dark:bg-gray-800">
          <Section
            title="Sección de Carreras"
            description="Explora y administra todas las carreras ofrecidas. Aquí podrás consultar las materias correspondientes a cada carrera y mantenerte al tanto de los requisitos y contenidos."
            link='/carreras'
            imgSrc={imgCarreras}
            imgAlt="Carreras"
            reverse={false}
          />
        </div>

        {/* Registro del Progreso */}
        <div className="bg-gray-100 dark:bg-gray-900">
          <Section
            title="Registro del Progreso"
            description="Mantén un seguimiento detallado de tu avance académico. Registra tus logros, materias aprobadas y áreas a mejorar para maximizar tu rendimiento académico."
            link='/progreso'
            imgSrc={imgProgreso}
            imgAlt="Progreso"
            reverse={true}
          />
        </div>

        {/* Opiniones de Materias */}
        <div className="mb-5 md:mb-0 bg-gray-200 dark:bg-gray-800">
          <Section
            title="Opiniones de Materias"
            description="Lee y comparte opiniones sobre las materias. Encuentra reseñas de otros estudiantes y deja tus comentarios para ayudar a la comunidad académica."
            link='/carreras'	
            imgSrc={imgOpiniones}
            imgAlt="Opiniones"
            reverse={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
