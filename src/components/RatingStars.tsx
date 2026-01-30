import { useState } from "react";
import { apiUrl } from "../utils/utils";
import request from "../utils/request";
import useNotify from "../hooks/useNotify";

const RatingStars = ({ stars, orderId }: { stars: number | null, orderId?: number }) => {

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const { notify } = useNotify();

    console.log("stars en rating stars: ", stars);

    const sendRating = async (ratingValue: number) => {
        try {
            const response = await request.post(`${apiUrl}/ratings`, { rating: ratingValue, orderId });
            console.log("Rating submitted successfully:", response.data);
        } catch (error) {
            console.error("Error submitting rating:", error);
            notify.error("Error submitting rating. Please try again.");
        }
    };

    const handleRat = (ratingValue: number) => {
        setRating(ratingValue);
        console.log("Rating value selected:", ratingValue);
        sendRating(ratingValue);
    };


    if (stars === null && rating === 0) return <>
        <div className="w-full py-4 px-2 bg-amber-50 border-y border-amber-200 my-4 flex flex-col items-center">
            <span className="text-sm font-semibold text-amber-800 mb-2 uppercase tracking-wide">
                ¿Cómo calificarías tu compra?
            </span>
            <div className="flex gap-1">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;

                    return (
                        <button
                            type="button"
                            key={ratingValue}
                            className={`transition-all duration-200 transform hover:scale-125 ${ratingValue <= (hover || rating) ? 'text-amber-400' : 'text-gray-300'
                                }`}
                            onClick={() => handleRat(ratingValue)}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-10 h-10 drop-shadow-sm"
                            >
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                        </button>
                    );
                })}
            </div>
        </div>

    </>
}

export default RatingStars;