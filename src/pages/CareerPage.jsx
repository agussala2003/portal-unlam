import PropTypes from 'prop-types';
import SingleCareer from '../components/SingleCareer';

const CareerPage = ({ id }) => {
  return (
    <div>
      <SingleCareer careerId={id} />
    </div>
  );
};

// Definición de PropTypes para CareerPage
CareerPage.propTypes = {
  id: PropTypes.string.isRequired, // Cambia a PropTypes.number si id es un número
};

export default CareerPage;
