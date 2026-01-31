import { Truck } from 'lucide-react';
import { useDollarRate } from '../hooks/useDollarRate';
import useStore from '../states/global';
import { memo, useMemo } from 'react';

const Envio = memo(({ freeShippingThreshold }: { freeShippingThreshold: number }) => (
    <div>
        <span className="flex items-center gap-2">
            <Truck size={16} />
            Envío gratis desde ${Number(freeShippingThreshold).toFixed(2)}
        </span>
    </div>
));

const FlagImage = memo(() => (
    <img
        className='hidden sm:inline'
        src="https://flagcdn.com/w40/ve.png"
        srcSet="https://flagcdn.com/w80/ve.png 2x"
        width="25"
        alt="Venezuela"
        loading="lazy" // 👈 Añadir lazy loading
    />
));

const PrecioDolar = memo(({ dollarRate }: { dollarRate: number }) => (
    <span className="flex items-center gap-2">
        <FlagImage />
        <span className="">USD</span>
        <span className="font-semibold">{Number(dollarRate).toFixed(2)} Bs</span>
    </span>
));

const SwitchButtons = memo(({ currency, setCurrency }: { 
    currency: string; 
    setCurrency: (curr: "USD" | "BS") => void 
}) => (
    <div className="flex bg-white rounded-full p-0.5 shadow-sm border border-gray-200">
        <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-full transition-all duration-200 ${
                currency === 'USD'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            USD
        </button>
        <button
            onClick={() => setCurrency('BS')}
            className={`px-3 py-1 rounded-full transition-all duration-200 ${
                currency === 'BS'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            BS
        </button>
    </div>
));

const MobileTop = memo(({ freeShippingThreshold, dollarRate }: { 
    freeShippingThreshold: number; 
    dollarRate: number 
}) => (
    <div className="block md:hidden">
        <div className="mx-auto flex py-1">
            <div className='flex gap-2'>
                <div className='flex'>
                    <Truck size={26} />
                </div>
                <div>
                    <span className="flex items-center gap-2">
                        Envío gratis desde ${Number(freeShippingThreshold).toFixed(2)}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                        <FlagImage />
                        <span className="">USD</span>
                        <span className="">{Number(dollarRate).toFixed(2)} Bs</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
));

const DesktopTop = memo(({ freeShippingThreshold, dollarRate }: { 
    freeShippingThreshold: number; 
    dollarRate: number 
}) => (
    <div className="hidden md:block">
        <div className="mx-auto px-4 lg:px-8 flex justify-between items-center bg-gray-100 py-1">
            <div className='flex gap-6'>
                <Envio freeShippingThreshold={freeShippingThreshold} />
                <PrecioDolar dollarRate={dollarRate} />
            </div>
        </div>
    </div>
));

const TopBanner = () => {
    const { currency, setCurrency } = useStore();
    const { dollarRate, freeShippingThreshold } = useDollarRate();

    // Usar useMemo para memoizar valores que no cambian frecuentemente
    const memoizedDollarRate = useMemo(() => Number(dollarRate).toFixed(2), [dollarRate]);
    const memoizedShippingThreshold = useMemo(() => Number(freeShippingThreshold).toFixed(2), [freeShippingThreshold]);

    return (
        <div className="text-gray-800 text-sm">
            <div className="mx-auto px-4 lg:px-8 flex justify-between items-center bg-gray-100 py-1">
                <div className='flex gap-3'>
                    <MobileTop 
                        freeShippingThreshold={Number(memoizedShippingThreshold)} 
                        dollarRate={Number(memoizedDollarRate)} 
                    />
                    <DesktopTop 
                        freeShippingThreshold={Number(freeShippingThreshold)} 
                        dollarRate={Number(memoizedDollarRate)} 
                    />
                </div>
                <SwitchButtons currency={currency} setCurrency={setCurrency} />
            </div>
        </div>
    );
};

export default memo(TopBanner);