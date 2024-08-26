import { useParams } from 'react-router-dom';
import SingleCareer from '../components/SingleCareer';

const CareerPage = () => {
  const { careerId } = useParams(); // Extrae el parámetro de la URL

  return (
    <div>
      <SingleCareer careerId={careerId} />
    </div>
  );
};

export default CareerPage;
