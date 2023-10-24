import VehicleColour from "types/vehicleColours";
import randomColour from "utils/randomColour";

const Lorry = ({ body, headlight, rearlight }: VehicleColour) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="96"
      height="31"
      fill="none"
      viewBox="0 0 96 31"
    >
      <path fill={body} d="M6 0h59v27H6zM66 22h18v5H66v-5Z" />
      <rect x="6" width="59" height="27" fill={randomColour()} />
      <circle cx="78" cy="27" r="3.5" fill="#000" stroke="#1D1D1D" />
      <path
        fill={body}
        fillRule="evenodd"
        d="M81.5 4H70v18h14V6.077L83 4h-1.5ZM83 7.6h-8.5v7.8H83V7.6Z"
        clipRule="evenodd"
      />
      <path fill={rearlight} d="M6 21.5h1v3H6z" />
      <path fill="url(#a)" d="m0 18 6 3.5v3L0 28V18Z" />
      <path fill="url(#b)" d="m96 26-12-5v-3l12-6v14Z" />
      <path fill={headlight} d="M82 18h2v3h-2z" />
      <circle cx="12" cy="27" r="3.5" fill="#000" stroke="#1D1D1D" />
      <circle cx="59" cy="27" r="3.5" fill="#000" stroke="#1D1D1D" />
      <defs>
        <radialGradient
          id="a"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-5.25 0 0 -3.2679 6 23)"
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
          gradientTransform="matrix(13.50004 .5 -.31123 8.40317 84 19.5)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={headlight} />
          <stop offset="1" stopColor={headlight} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Lorry;
