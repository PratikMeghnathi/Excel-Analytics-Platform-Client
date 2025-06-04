import { useEffect, useRef, useState } from "react";

function MarqueeText({ children }) {
    const spanRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        const el = spanRef.current;
        if (el && el.scrollWidth > el.clientWidth) {
            setShouldScroll(true);
        }
    }, [children]);

    return (
        <span
            ref={spanRef}
            className={`block ${shouldScroll ? "marquee" : "truncate"} max-w-full overflow-hidden`}
        >
            {children}
        </span>
    );
}

export default MarqueeText;