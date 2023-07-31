import { yupResolver } from "@hookform/resolvers/yup";
import LottieView from "lottie-react-native";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native";
import {
  Button,
  FormInput,
  FormPasswordInput,
  FormSection,
} from "react-native-benji";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";

import styles from "./styles";
import { Color } from "../../constants";
import { auth, db } from "../../api/firebase";
import { IUser } from "../../types";

export interface ILoginForm {
  username: string;
  email: string;
  password: string;
}

const schema = yup.object<ILoginForm>().shape({
  username: yup.string().required("username required"),
  email: yup.string().required("email required").email("email is not valid"),
  password: yup.string().required("password required"),
});

const DEFAULT_VALUES: ILoginForm = {
  username: "",
  email: "",
  password: "",
};

const SignUpScreen: FC = () => {
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
        const userData: IUser = {
          uid: user.uid,
          username: data.username,
          email: user.email,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          createdAt: user.metadata.creationTime,
          lastLoginAt: user.metadata.lastSignInTime,
        };

        await db.collection("users").doc(user.uid).set(userData);
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
          <FormInput
            name="username"
            label="Username"
            control={control}
            error={errors.username}
            returnKeyType="next"
            onSubmitEditing={() => setFocus("email")}
            style={[styles.marginTop]}
          />
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
        </FormSection>
        <Button
          label="Sign Up"
          onPress={handleSubmit(onSubmit)}
          labelColor={Color.white}
          backgroundColor={Color.primary}
          style={{ marginHorizontal: 10 }}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
