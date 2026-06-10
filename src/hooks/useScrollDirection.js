import { useEffect, useRef, useState } from "react";

export const useScrollDirection = ({ topThreshold = 10 } = {}) => {
    const [visible, setVisible] = useState(true);
    const lastY = useRef(0);

    useEffect(() => {
        const handler = () => {
            const currentY = window.scrollY;
            if (currentY < topThreshold) {
                setVisible(true);
            } else if (currentY > lastY.current + 4) {
                setVisible(false);
            } else if (currentY < lastY.current - 4) {
                setVisible(true);
            }
            lastY.current = currentY;
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, [topThreshold]);

    return visible;
};
