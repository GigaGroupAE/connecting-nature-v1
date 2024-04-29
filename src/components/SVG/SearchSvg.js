import { Path, Svg } from 'react-native-svg';

export const SearchSvg = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        stroke="#262626"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0ZM16.51 16.51 22 22"
      />
    </Svg>
  );
};
