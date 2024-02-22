import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const ProductSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      fill="#000"
      d="M18.5.5H.5v5.684h.9v10.421c0 .503.19.985.527 1.34.338.355.796.555 1.273.555h12.6c.477 0 .935-.2 1.273-.555.337-.355.527-.837.527-1.34V6.185h.9V.5ZM2.3 2.395h14.4v1.894H2.3V2.395Zm13.5 14.21H3.2V6.185h12.6v10.42Zm-9-8.526h5.4c0 .502-.19.984-.527 1.34a1.756 1.756 0 0 1-1.273.555H8.6c-.477 0-.935-.2-1.273-.555a1.947 1.947 0 0 1-.527-1.34Z"
    />
  </Svg>
);
export default ProductSvg;
