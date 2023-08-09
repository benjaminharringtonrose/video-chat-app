import React, { FC } from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
  TextInput,
  ReturnKeyTypeOptions,
} from "react-native";

import styles from "./styles";
import FormError from "../FormError";
import { useTheme } from "@react-navigation/native";
import { Color } from "../../constants";

export interface IFormInputProps {
  label: string;
  control: Control<any>;
  name: string;
  rules?: Record<string, any>;
  style?: StyleProp<ViewStyle>;
  icon?: () => JSX.Element | null;
  error?: FieldError;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const FormInput: FC<IFormInputProps> = ({
  label,
  control,
  name,
  rules,
  style,
  error,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  autoCapitalize,
}) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "column" }}>
      <View style={[styles.root, style]}>
        <Text
          style={[
            styles.labelText,
            {
              color: colors.text,
              backgroundColor: colors.background,
            },
          ]}
        >
          {label}
        </Text>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              ref={ref}
              key={name}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={[styles.input, { color: colors.text }]}
              placeholderTextColor={Color.placeholder}
              cursorColor={Color.placeholder}
              selectionColor={colors.primary}
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
            />
          )}
        />
      </View>
      <FormError error={error} />
    </View>
  );
};

export default FormInput;
