import { Award, ShieldCheck, Truck } from "lucide-react"

const HomeButtonInfo = () => {
    return (
        <div className="bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-gray-800 py-4 md:py-8">
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-500 p-3 md:p-4 rounded-full text-amber-50">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-500 text-sm md:text-base">ENVÍO GRATIS</h3>
                            <p className="text-xs md:text-sm">en pedidos superiores a $200</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-500 p-3 md:p-4 rounded-full text-amber-50">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-500 text-sm md:text-base">PAGO SEGURO</h3>
                            <p className="text-xs md:text-sm">Pago Movil, Transferenia, Binance y Visa</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-500 p-3 md:p-4 rounded-full text-amber-50">
                            <Award size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-500 text-sm md:text-base">1 AÑO DE GARANTÍA</h3>
                            <p className="text-xs md:text-sm">Todos nuestros productos están cubiertos por un año contra defectos de fabricación</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeButtonInfo