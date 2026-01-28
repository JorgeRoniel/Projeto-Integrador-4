import React from "react";
import { Star } from "lucide-react";

function StarRating({ rating }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-0.5">
            {stars.map((star) => (
                <Star
                    key={star}
                    size={16}
                    className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'}
                />
            ))}
        </div>
    );
}

export default StarRating;