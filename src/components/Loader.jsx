const Loader = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-green-500"></div>
            <p className="ml-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
                Cargando...
            </p>
        </div>
    )
}

export default Loader;