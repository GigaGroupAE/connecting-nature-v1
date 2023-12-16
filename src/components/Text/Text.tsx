import { Text as RNText } from "react-native";
import React from "react";
import { useStyles } from "./styles";

type TextProps = React.ComponentProps<typeof RNText> & {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
};

const Text = ({ variant = "p", ...otherProps }: TextProps) => {
  const styles = useStyles();

  return <RNText style={styles[variant]} {...otherProps} />;
};

export default Text;
