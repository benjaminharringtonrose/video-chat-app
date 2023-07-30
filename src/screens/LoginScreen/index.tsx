/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import {
  Button,
  FormInput,
  FormPasswordInput,
  FormSection,
  useMockRequest,
  usePrevious,
} from "react-native-benji";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import styles from "./styles";
import { Color } from "../../constants";
import { NavProp, Routes } from "../../navigation";
import { auth } from "../../api/firebase";
import { IUser } from "../../types";

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
  const navigation = useNavigation<NavProp>();
  const { loading, error, onRequest } = useMockRequest();

  const { control, handleSubmit, setFocus, formState } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const prevLoading = usePrevious<boolean>(loading);
  useEffect(() => {
    const successfulRequest = prevLoading && !loading && !error;
    if (successfulRequest) {
      navigation.goBack();
    }
  }, [prevLoading, loading, error]);

  const onSubmit = async (data: ILoginForm) => {
    try {
      await auth.signInWithEmailAndPassword(data.email, data.password);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: Color.white }}
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
        <FormSection title={"Login"} description={"Welcome back!"}>
          <FormInput
            name="email"
            label="Email"
            control={control}
            error={errors.email}
            returnKeyType="next"
            onSubmitEditing={() => setFocus("password")}
            style={[styles.marginTop]}
          />
          <FormPasswordInput
            name="password"
            label="Password"
            control={control}
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            style={styles.marginTop}
          />
        </FormSection>
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
              fontWeight: "600",
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
