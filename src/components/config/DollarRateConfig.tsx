import { FaDollarSign, FaSave, FaTruck, FaBox } from 'react-icons/fa';
import { useDollarRate } from '../../hooks/useDollarRate';
import useNotify from '../../hooks/useNotify';

const DollarRateConfig = () => {
  const {
    dollarRate,
    freeShippingThreshold,
    shippingPrice,
    setDollarRate,
    setLocalFreeShippingThreshold,
    setLocalShippingPrice,
    loading: loadingDollar,
    error: errorDollar,
    saveConfig
  } = useDollarRate();

  const { notify } = useNotify()

  const handleSaveConfig = async () => {
    const success = await saveConfig(dollarRate, freeShippingThreshold, shippingPrice);
    if (success) {
      notify.success("Configuraciones guardadas con éxito")
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-700 flex items-center">
          <FaDollarSign className="mr-2 text-green-600" />
          Configuraciones Generales
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Tasa del Dólar */}
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1">
            <label htmlFor="dollarRate" className="block text-xs font-medium text-gray-700 mb-1">
              Precio del Dólar (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                id="dollarRate"
                value={dollarRate}
                onChange={(e) => setDollarRate(e.target.value)}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0.00"
                disabled={loadingDollar}
              />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="freeShippingThreshold" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <FaTruck className="mr-1 text-blue-500" />
              Cantidad para Envío Gratis (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                id="freeShippingThreshold"
                value={freeShippingThreshold}
                onChange={(e) => setLocalFreeShippingThreshold(e.target.value)}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0.00"
                disabled={loadingDollar}
              />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="shippingPrice" className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              <FaBox className="mr-1 text-orange-500" />
              Precio de Envío (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                id="shippingPrice"
                value={shippingPrice}
                onChange={(e) => setLocalShippingPrice(e.target.value)}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0.00"
                disabled={loadingDollar}
              />
            </div>
          </div>

          <button
            onClick={handleSaveConfig}
            disabled={loadingDollar}
            className={`whitespace-nowrap flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white h-[38px] ${loadingDollar ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
              } transition-colors duration-200`}
          >
            {loadingDollar ? (
              <span>Guardando...</span>
            ) : (
              <>
                <FaSave className="mr-2" />
                Guardar Configuraciones
              </>
            )}
          </button>
        </div>
        {errorDollar && <p className="mt-2 text-xs text-red-600">{errorDollar}</p>}
      </div>
    </div>
  );
};

export default DollarRateConfig;
