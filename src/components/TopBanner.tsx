import { Truck } from 'lucide-react';
import { useDollarRate } from '../hooks/useDollarRate';
import useStore from '../states/global';
const TopBanner = () => {

    const { currency, setCurrency } = useStore();
    const { dollarRate } = useDollarRate();

    const Envio = () => <div>
        <span className="flex items-center gap-2">
            <Truck size={16} />
            Envío gratis desde $200
        </span>
    </div>

    const PrecioDolar = () => <span className="flex items-center gap-2">
        <img
            className='hidden sm:inline'
            src="https://flagcdn.com/w40/ve.png"
            srcSet="https://flagcdn.com/w80/ve.png 2x"
            width="25"
            alt="Venezuela"></img>
        <span className="">USD</span>
        <span className="font-semibold">{Number(dollarRate).toFixed(2)} Bs</span>
    </span>

    const SwitchButtons = () => <div className="flex bg-white rounded-full p-0.5 shadow-sm border border-gray-200">
        <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-full transition-all duration-200 ${currency === 'USD'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            USD
        </button>
        <button
            onClick={() => setCurrency('BS')}
            className={`px-3 py-1 rounded-full transition-all duration-200 ${currency === 'BS'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            BS
        </button>
    </div>

    // Este se verá solo en pantallas menores a 768px (md)
    const MobileTop = () => (
        <div className="block md:hidden">
            <div className="mx-auto flex py-1">
                <div className='flex gap-2'>
                    <div className='flex'>
                        <Truck size={26} />
                    </div>
                    <div>
                        <span className="flex items-center gap-2">
                            Envío gratis desde $200
                        </span>
                        <span className="flex items-center gap-2 text-xs text-gray-500">
                            <img
                                className='hidden sm:inline'
                                src="https://flagcdn.com/w40/ve.png"
                                srcSet="https://flagcdn.com/w80/ve.png 2x"
                                width="25"
                                alt="Venezuela"></img>
                            <span className="">USD</span>
                            <span className="">{Number(dollarRate).toFixed(2)} Bs</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    // Este se verá solo en pantallas desde 768px (md) en adelante
    const DesktopTop = () => (
        <div className="hidden md:block">
            <div className="mx-auto px-4 lg:px-8 flex justify-between items-center bg-gray-100 py-1">
                <div className='flex gap-6'>
                    <Envio />
                    <PrecioDolar />
                </div>
            </div>
        </div>
    );

    return (<>
        <div className="text-gray-800 text-sm">
            <div className="mx-auto px-4 lg:px-8 flex justify-between items-center bg-gray-100 py-1">
                <div className='flex gap-3'>
                    <MobileTop />
                    <DesktopTop />
                </div>
                <SwitchButtons />
            </div>
        </div>

    </>)

}

export default TopBanner