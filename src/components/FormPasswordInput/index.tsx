import Icon from "@expo/vector-icons/Ionicons";
import React, { FC, useState } from "react";
import { Controller, Control, FieldError } from "react-hook-form";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
  TextInput,
  ReturnKeyTypeOptions,
  TouchableOpacity,
} from "react-native";

import styles from "./styles";
import { Color } from "../../constants";
import FormError from "../FormError";
import PasswordStrengthIndicator from "../PasswordStrengthIndicator";
import { useTheme } from "@react-navigation/native";

export interface IFormPasswordInputProps {
  label: string;
  control: Control<any>;
  name: string;
  rules?: Record<string, any>;
  style?: StyleProp<ViewStyle>;
  icon?: () => JSX.Element | null;
  error?: FieldError;
  mask?: string;
  type?: string;
  options?: Record<string, any>;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
  showPasswordValidator?: boolean;
}

const FormPasswordInput: FC<IFormPasswordInputProps> = ({
  label = "Password",
  control,
  name,
  rules,
  style,
  error,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  showPasswordValidator,
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={[styles.root, style]}>
        <View style={styles.rowContainer}>
          <View style={styles.flex1}>
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
                  onChangeText={(text) => {
                    onChange(text);
                    setPassword(text);
                  }}
                  onBlur={onBlur}
                  value={value}
                  style={[styles.input, { color: colors.text }]}
                  placeholderTextColor={Color.placeholder}
                  cursorColor={Color.placeholder}
                  selectionColor={colors.primary}
                  keyboardType={keyboardType}
                  returnKeyType={returnKeyType}
                  onSubmitEditing={onSubmitEditing}
                  autoCapitalize="none"
                  secureTextEntry={isHidden}
                />
              )}
            />
          </View>
          <TouchableOpacity
            style={styles.paddingHorizontal}
            onPress={() => setIsHidden((hidden) => !hidden)}
          >
            <Icon
              name={isHidden ? "eye" : "eye-off"}
              size={20}
              color={Color.grey}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FormError error={error} />
      {showPasswordValidator && (
        <PasswordStrengthIndicator
          requirements={{
            length: 8,
            lowercase: true,
            uppercase: true,
            numbers: true,
            symbols: true,
          }}
          password={password}
        />
      )}
    </View>
  );
};

export default FormPasswordInput;
