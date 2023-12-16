import * as React from "react";
import { TextInput as Input } from "react-native-paper";
import { getScreenPercentageSize } from "../../utils/getScreenPercentageSize";
import HelperText from "../HelperText";

type InputProps = Omit<React.ComponentProps<typeof Input>, "autoComplete"> & {
  errorText?: string;
  helperText?: string;
  width?: number;
  height?: number;
  name?: string;
};

const TextInput = ({
  errorText,
  helperText,
  width = getScreenPercentageSize(100).width,
  style,
  ...otherProps
}: InputProps) => {
  const { width: defaultWidth } = getScreenPercentageSize(100);
  return (
    <>
      <Input
        autoComplete={undefined}
        error={errorText?.length > 0}
        theme={{
          fonts: {
            regular: {
              fontFamily: "Roboto_400Regular",
            },
          },
        }}
        style={[
          { width: width || defaultWidth, fontFamily: "Roboto_Regular400" },
          style,
        ]}
        {...otherProps}
        {...(errorText?.length > 0 && { mode: "outlined" })}
      />
      {errorText?.length > 0 && (
        <HelperText type="error">{errorText}</HelperText>
      )}
      {helperText?.length > 0 && (
        <HelperText type="info">{helperText}</HelperText>
      )}
    </>
  );
};

export default TextInput;
