const WelcomeSection = () => {
  return (
    <div className="w-11/12 mx-auto flex flex-col md:flex-row justify-center items-center gap-10">
      <div className='md:w-1/2 text-center'>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          <span className='text-green-500'>Portal UNLaM</span>, tu espacio académico centralizado
        </h1>
        <p className="mt-5 text-lg">
          Simplifica tu vida estudiantil con acceso a todas tus carreras, materias y progreso académico en un solo lugar.
        </p>
        <button className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg">
          Descubre más
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
