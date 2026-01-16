import DollarRateConfig from '../../components/config/DollarRateConfig';
import BrandsConfig from '../../components/config/BrandsConfig';
import ModelsConfig from '../../components/config/ModelsConfig';
import CategoriesConfig from '../../components/config/CategoriesConfig';

const Configurations = () => {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Configuraciones</h1>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
        <DollarRateConfig />
        <BrandsConfig />
        <ModelsConfig />
        <CategoriesConfig />
      </div>
    </div>
  );
};

export default Configurations;
