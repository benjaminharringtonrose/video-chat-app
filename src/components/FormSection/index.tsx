import React, { FC } from "react";
import { View, Text } from "react-native";

import styles from "./styles";
import { Color } from "../../constants";

export interface IFormSectionProps {
  title: string;
  description: string;
  children: JSX.Element | JSX.Element[] | null;
}

const FormSection: FC<IFormSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <View style={[styles.root, { backgroundColor: Color.card }]}>
      <View>
        <Text style={[styles.titleText, { color: Color.text }]}>{title}</Text>
        <Text style={[styles.descriptionText, { color: Color.text }]}>
          {description}
        </Text>
        {children}
      </View>
    </View>
  );
};

export default FormSection;
