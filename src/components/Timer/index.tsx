import React, { FC } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { useTimer } from "../../atoms/timer";
import { Color, FontFamily } from "../../constants";

interface IProps {
  style: StyleProp<ViewStyle>;
}

const Timer: FC<IProps> = ({ style }) => {
  const { formattedTime } = useTimer();

  return (
    <View style={style}>
      <Text
        style={{
          fontFamily: FontFamily.Bold,
          fontSize: 40,
          color: Color.white,
        }}
      >
        {formattedTime}
      </Text>
    </View>
  );
};

export default Timer;
