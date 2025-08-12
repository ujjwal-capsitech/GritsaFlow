import * as React from "react";

const SVGComponent = ({ fill = "currentColor", ...props }) => (
    <svg
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="5em"
        height="5em"
        viewBox="0 0 100 100"
        xmlSpace="preserve"
        fill={fill}
        {...props}
    >
        <g>
            <path
                transform="rotate(90 50 50)"
                d="M26,50.5c0,1.104,0.896,2,2,2h44c1.104,0,2-0.896,2-2s-0.896-2-2-2H28C26.896,48.5,26,49.396,26,50.5z"
            />
        </g>
    </svg>
);

export default SVGComponent;
