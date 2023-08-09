import { FC } from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { useTheme } from "@react-navigation/native";
import styles from "./styles";

interface IProps {
  title: string;
  description?: string;
  lottie?: any;
}

const EmptyStateView: FC<IProps> = ({ title, description, lottie }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.noResultsContainer]}>
      <View style={styles.tophalf}>
        {lottie && (
          <LottieView
            source={lottie}
            style={styles.lottie}
            loop={false}
            autoPlay={true}
          />
        )}
      </View>
      <View style={styles.bottomHalf}>
        <Text style={[styles.noResultsTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.noResultsDescription, { color: colors.text }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export default EmptyStateView;
