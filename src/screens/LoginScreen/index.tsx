import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import styles from "./styles";
import { Color, FontFamily } from "../../constants";
import { NavProp, Routes } from "../../navigation/types";
import { auth } from "../../api/firebase";
import { Button, FormInput, FormPasswordInput } from "../../components";

export interface ILoginForm {
  email: string;
  password: string;
}

const schema = yup.object<ILoginForm>().shape({
  email: yup.string().required("email required").email("email is not valid"),
  password: yup.string().required("password required"),
});

const DEFAULT_VALUES: ILoginForm = {
  email: "",
  password: "",
};

const LoginScreen: FC = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavProp["navigation"]>();

  const { control, handleSubmit, setFocus, formState } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = async (data: ILoginForm) => {
    try {
      setLoading(true);
      await auth.signInWithEmailAndPassword(data.email, data.password);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: Color.background }]}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: Color.background }}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={50}
      >
        <LottieView
          autoPlay
          source={require("../../../assets/lottie/login.json")}
          style={{
            alignSelf: "center",
            width: 200,
            height: 200,
          }}
        />

        <FormInput
          name="email"
          label="Email"
          control={control}
          error={errors.email}
          returnKeyType="next"
          onSubmitEditing={() => setFocus("password")}
          autoCapitalize={"none"}
          keyboardType={"email-address"}
          style={[styles.margin]}
        />
        <FormPasswordInput
          name="password"
          label="Password"
          control={control}
          error={errors.password}
          returnKeyType="done"
          onSubmitEditing={handleSubmit(onSubmit)}
          style={styles.margin}
        />

        <Button
          label="Login"
          onPress={handleSubmit(onSubmit)}
          labelColor={Color.white}
          backgroundColor={Color.primary}
          loading={loading}
          style={{ marginHorizontal: 10, marginBottom: 10 }}
        />
        <TouchableOpacity onPress={() => navigation.navigate(Routes.SignUp)}>
          <Text
            style={{
              textAlign: "right",
              paddingRight: 20,
              color: Color.primary,
              fontFamily: FontFamily.Bold,
            }}
          >
            {"Sign Up"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
