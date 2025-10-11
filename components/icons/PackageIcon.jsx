export default function PackageIcon({ width = 20, height = 20, stroke = "#A8ABAE", ...props }) {
  return (
    <svg width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
     aria-hidden="true">
      <path
        d="M2.5 7.5H17.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V7.5Z"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 7.50004L4.54167 3.41671C4.6808 3.14059 4.89401 2.90861 5.15744 2.74673C5.42087 2.58484 5.72414 2.49943 6.03333 2.50004H13.9667C14.2773 2.49788 14.5823 2.58256 14.8473 2.74453C15.1124 2.9065 15.3269 3.13931 15.4667 3.41671L17.5 7.50004"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 2.5V7.5"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

