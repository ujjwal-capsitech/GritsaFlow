import * as React from "react";

const SVGComponent = ({
    fill = "currentColor",
    width = "1em",
    height = "1em",
    thickness = 8,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}

        viewBox="0 0 100 100" //no Space
        fill={fill}
        {...props}
        style={{ display: "block" ,}}
    >
        
        {/*<rect x="48" y="0" width="4" height="100" width={thickness} />*/}
        <rect x={50 - thickness / 2} y="0" width={thickness} height="100" />
        
    </svg>
);

export default SVGComponent;
