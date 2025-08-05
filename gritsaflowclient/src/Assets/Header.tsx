import * as React from "react";
import type { JSX } from "react/jsx-runtime";
const SVGComponent = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth={2}
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      margin: "-3px 4px",
    }}
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 7h5l3.5 5h9.5" />
    <path d="M3 17h5l3.495 -5" />
    <path d="M18 15l3 -3l-3 -3" />
  </svg>
);
export default SVGComponent;
