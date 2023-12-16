import React from "react";
import { HelperText as PaperHelperText } from "react-native-paper";

type HelperTextProps = Omit<
React.ComponentProps<typeof PaperHelperText>,
"onPressIn" | "onPressOut"
>;

const HelperText = (props: HelperTextProps) => {
  return (
    <PaperHelperText
      {...props}
      onPressIn={undefined}
      onPressOut={undefined}
    />
  );
};

export default HelperText;
