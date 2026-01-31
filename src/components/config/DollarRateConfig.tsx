import { DollarSign, Save, Truck, Package } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50/50 px-4 md:px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Configuraciones Generales
        </h2>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-4 md:gap-6">
          <div className="space-y-1.5">
            <label htmlFor="dollarRate" className="block text-sm font-semibold text-gray-700">
              Precio del Dólar (USD)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 group-focus-within:text-blue-500 transition-colors">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                id="dollarRate"
                value={dollarRate}
                onChange={(e) => setDollarRate(e.target.value)}
                className="block w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                placeholder="0.00"
                disabled={loadingDollar}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="freeShippingThreshold" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              Envío Gratis desde (USD)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 group-focus-within:text-blue-500 transition-colors">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                id="freeShippingThreshold"
                value={freeShippingThreshold}
                onChange={(e) => setLocalFreeShippingThreshold(e.target.value)}
                className="block w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                placeholder="0.00"
                disabled={loadingDollar}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="shippingPrice" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              Precio de Envío (USD)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 group-focus-within:text-blue-500 transition-colors">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                id="shippingPrice"
                value={shippingPrice}
                onChange={(e) => setLocalShippingPrice(e.target.value)}
                className="block w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900"
                placeholder="0.00"
                disabled={loadingDollar}
              />
            </div>
          </div>

          <button
            onClick={handleSaveConfig}
            disabled={loadingDollar}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg shadow-sm shadow-blue-200 transition-all active:scale-[0.98]"
          >
            {loadingDollar ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar
              </>
            )}
          </button>
        </div>
        {errorDollar && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            {errorDollar}
          </div>
        )}
      </div>
    </div>
  );
};

export default DollarRateConfig;
