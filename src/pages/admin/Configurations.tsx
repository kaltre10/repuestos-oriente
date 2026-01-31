import { Settings } from 'lucide-react';
import DollarRateConfig from '../../components/config/DollarRateConfig';
import BrandsConfig from '../../components/config/BrandsConfig';
import ModelsConfig from '../../components/config/ModelsConfig';
import CategoriesConfig from '../../components/config/CategoriesConfig';
import SubCategoriesConfig from '../../components/config/SubCategoriesConfig';

const Configurations = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-2 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 md:p-0">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              Configuraciones
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Gestiona las configuraciones generales, marcas, modelos y categorías.</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-start">
          <div className="lg:col-span-2">
            <DollarRateConfig />
          </div>
          
          <div className="space-y-6 md:space-y-8">
            <BrandsConfig />
            <ModelsConfig />
          </div>

          <div className="space-y-6 md:space-y-8">
            <CategoriesConfig />
            <SubCategoriesConfig />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurations;
