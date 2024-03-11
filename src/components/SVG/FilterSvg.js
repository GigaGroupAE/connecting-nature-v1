import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const FilterSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={41}
    height={40}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M11.09 12.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v2.086A2 2 0 0 1 28.506 16l-5.414 5.414v7.424a1.1 1.1 0 0 1-1.592.984l-3.717-1.858a1.25 1.25 0 0 1-.691-1.118v-5.432L11.677 16a2 2 0 0 1-.586-1.414V12.5Zm2 .5v1.586l5.56 5.56a1.5 1.5 0 0 1 .44 1.061v5.175l2 1v-6.175c0-.398.159-.78.44-1.06l5.56-5.562V13h-14Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default FilterSvg;
