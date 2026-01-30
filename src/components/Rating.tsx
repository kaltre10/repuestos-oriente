import { useState } from "react";
import { Star } from "lucide-react"

const Rating = ({ hover = false, action = () => { }, stars }: { hover: boolean, action: any, stars: number | null }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    return <>
        <div className="flex items-center gap-2">
            <div 
                className={`flex text-yellow-400 ${hover ? 'cursor-pointer' : ''}`}
                onMouseLeave={() => setHoverIndex(null)}
            >
                {[...Array(5)].map((_, i) => {
                    const isFilled = hoverIndex !== null 
                        ? i <= hoverIndex 
                        : (stars !== null && i < stars);

                    return (
                        <Star 
                            key={i} 
                            size={20} 
                            onMouseEnter={() => hover && setHoverIndex(i)}
                            onClick={() => action(i + 1)} 
                            fill={isFilled ? 'currentColor' : 'none'} 
                        />
                    );
                })}
            </div>
        </div>
    </>
}

export default Rating