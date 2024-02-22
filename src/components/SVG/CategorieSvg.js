import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const CategorieSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M6.5 10.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4Zm10 0a2 2 0 0 1 1.995 1.85l.005.15v4a2 2 0 0 1-1.85 1.995l-.15.005h-4a2 2 0 0 1-1.995-1.85l-.005-.15v-4a2 2 0 0 1 1.85-1.995l.15-.005h4Zm-10 2h-4v4h4v-4Zm10 0h-4v4h4v-4Zm0-12a2 2 0 0 1 1.995 1.85l.005.15v4a2 2 0 0 1-1.85 1.995l-.15.005h-4a2 2 0 0 1-1.995-1.85L10.5 6.5v-4A2 2 0 0 1 12.35.505L12.5.5h4Zm-10 0a2 2 0 0 1 1.995 1.85l.005.15v4a2 2 0 0 1-1.85 1.995L6.5 8.5h-4A2 2 0 0 1 .505 6.65L.5 6.5v-4A2 2 0 0 1 2.35.505L2.5.5h4Zm10 2h-4v4h4v-4Zm-10 0h-4v4h4v-4Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default CategorieSvg;
