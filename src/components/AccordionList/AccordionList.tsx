import { Text, StyleProp, TextStyle, ViewStyle } from "react-native";
import React from "react";
import { List } from "react-native-paper";
import GroupAccordion, {
  GroupAccordionProps,
} from "../../screens/Home/Components/GroupAccordion/GroupAccordion";
import { GroupAccordionRowProps } from "../../screens/Home/Components/GroupAccordionRow/types";
import { reduce } from "lodash";

type AccordionListProps<T> = {
  // Sections
  SectionTitle: string;
  SectionTitleStyle?: StyleProp<TextStyle>;
  SectionStyle?: StyleProp<ViewStyle>;
  SectionProps?: Omit<
    React.ComponentProps<typeof List.Section>,
    "title" | "styles" | "titleStyle"
  >;
  // Accordion
  Accordions: GroupAccordionProps<GroupAccordionRowProps>[];
  EmptyListMessage?: any;
  SkipEmptySections: boolean;
};

const AccordionList = <T extends unknown>({
  SectionTitle = "",
  SectionTitleStyle,
  SectionStyle,
  Accordions = [],
  EmptyListMessage = "",
  SkipEmptySections = false,
}: AccordionListProps<T>): React.ReactElement => {
  if (SkipEmptySections && Accordions.length === 0) {
    return null;
  }
  return (
    <List.Section
      title={SectionTitle}
      titleStyle={SectionTitleStyle}
      style={SectionStyle}
    >
      {Accordions.length > 0 ? (
        Accordions.map(
          (accordionProps: GroupAccordionProps<GroupAccordionRowProps>) => {
            // eslint-disable-next-line react/jsx-key
            return <GroupAccordion {...accordionProps} />;
          },
        )
      ) : (
        <List.Subheader
          style={{
            color: "#4582C3",
            opacity: 0.6,
          }}
        >
          {EmptyListMessage}
        </List.Subheader>
      )}
    </List.Section>
  );
};

export default AccordionList;
