import VehicleColour from "types/vehicleColours";

const Car = ({ body, headlight, rearlight }: VehicleColour) => {
  return (
    <svg
      width="57"
      height="17"
      viewBox="0 0 57 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="6" y="6" width="39" height="7" fill={body} />
      <circle cx="37" cy="13" r="3.5" fill="black" stroke="#1D1D1D" />
      <circle cx="14" cy="13" r="3.5" fill="black" stroke="#1D1D1D" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29 0H13.2794L6 6H38.5L29 0ZM19.5 1H13.5V3V5H19.5V1ZM28 1H21V5H33L28 1Z"
        fill={body}
      />
      <rect x="6" y="7" width="1" height="3" fill={rearlight} />
      <path d="M0 3.5L6 7V10L0 13.5V3.5Z" fill="url(#paint0_radial_6_3)" />
      <path d="M57 13.5L45 9V7L57 1.5V13.5Z" fill="url(#paint1_radial_6_3)" />
      <rect x="43" y="7" width="2" height="2" fill={headlight} />
      <defs>
        <radialGradient
          id="paint0_radial_6_3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(6 8.5) rotate(-180) scale(5.25 3.2679)"
        >
          <stop stopColor={rearlight} />
          <stop offset="1" stopColor={rearlight} stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_6_3"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(45 8) rotate(2.1211) scale(13.5093 8.40893)"
        >
          <stop stopColor={headlight} />
          <stop offset="1" stopColor={headlight} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Car;
