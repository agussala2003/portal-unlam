import { useParams } from 'react-router-dom';
import CareerPage from './CareerPage';

const CareerPageWrapper = () => {
  const { careerId } = useParams(); // Extrae el parámetro de la URL

  return <CareerPage id={careerId} />;
};

export default CareerPageWrapper;
