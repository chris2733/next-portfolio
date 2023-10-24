import VehicleColour from "types/vehicleColours";

const SportsCar = ({ body, headlight, rearlight }: VehicleColour) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="54"
      height="15"
      fill="none"
      viewBox="0 0 54 15"
    >
      <rect width="36" height="5" x="6" y="6" fill={body} rx="1" />
      <circle cx="35" cy="11" r="3.5" fill="#000" stroke="#1D1D1D" />
      <circle cx="13" cy="11" r="3.5" fill="#000" stroke="#1D1D1D" />
      <path
        fill={body}
        fillRule="evenodd"
        d="M27.5 2H12L7 6H41L27.5 2ZM18 3H13.2931V5H18V3ZM26.5 3H20V4V5H32.5L26.5 3Z"
        clipRule="evenodd"
      />
      <path fill={rearlight} d="M6 6.5h1V9H6V6.5Z" />
      <path fill="url(#a)" d="m0 3 6 3.5V9l-6 4V3Z" />
      <path fill="url(#b)" d="M54 12 42 8V6l12-6v12Z" />
      <path fill={headlight} d="M40 6h2v2h-2z" />
      <defs>
        <radialGradient
          id="a"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-5.25 0 0 -3.2679 6 8)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={rearlight} />
          <stop offset="1" stopColor={rearlight} stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="b"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(13.50004 .5 -.31123 8.40317 42 6.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={headlight} />
          <stop offset="1" stopColor={headlight} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default SportsCar;
