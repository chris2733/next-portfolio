type Car = {
  body: string;
  headlight: string;
  rearlight: string;
};

const Car = ({ body, headlight, rearlight }: Car) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="57"
      height="17"
      viewBox="0 0 57 17"
      fill="none"
    >
      <path fill={body} d="M6 6h39v7H6z" />
      <circle cx="37" cy="13" r="3.5" fill="#000" stroke="#1D1D1D" />
      <circle cx="14" cy="13" r="3.5" fill="#000" stroke="#1D1D1D" />
      <path
        fill={body}
        fillRule="evenodd"
        d="M29 0H13.28L6 6h32.5L29 0Zm-9.5 1h-6v4h6V1ZM28 1h-7v4h7V1Z"
        clipRule="evenodd"
      />
      <path fill={rearlight} d="M6 7h1v3H6z" />
      <path fill="url(#a)" d="M0 3.5 6 7v3l-6 3.5v-10Z" />
      <path fill="url(#b)" d="M57 13.5 45 9V7l12-5.5v12Z" />
      <path fill={headlight} d="M43 7h2v2h-2z" />
      <defs>
        <radialGradient
          id="a"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-5.25 0 0 -3.2679 6 8.5)"
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
          gradientTransform="matrix(13.50004 .5 -.31123 8.40317 45 8)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={headlight} />
          <stop offset="1" stopColor={headlight} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Car;
