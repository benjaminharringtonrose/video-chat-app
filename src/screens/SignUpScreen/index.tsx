/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, View } from "react-native";
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
import { auth, db } from "../../api/firebase";

const TITLE = "Welcome Back!";

const DESCRIPTION =
  "Some user instructions may go here and it can wrap multiple times. Here's some more text to fill it up.";

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

const SignUpScreen: FC = () => {
  const navigation = useNavigation<any>();
  const { loading, error, onRequest } = useMockRequest();

  const { control, handleSubmit, setFocus, formState } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = async (data: ILoginForm) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      if (user) {
        const userDoc = db.collection("users").doc();
        await userDoc.set(user);
      }
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
          source={require("../../../assets/lottie/sign_up.json")}
          style={{
            alignSelf: "center",
            width: 200,
            height: 200,
          }}
        />
        <FormSection
          title={"Sign Up"}
          description={"We need just a couple things from you to get started"}
        >
          <View>
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
              showPasswordValidator
            />
          </View>
        </FormSection>
        <Button
          label="Sign Up"
          onPress={handleSubmit(onSubmit)}
          labelColor={Color.white}
          backgroundColor={Color.primary}
          loading={loading}
          style={{ marginHorizontal: 10 }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
