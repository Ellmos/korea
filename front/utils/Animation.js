import { Animated, Easing } from "react-native";

const bezier = Easing.bezier(0.25, 0.1, 0.25, 1);

function Animate(ref, toValue, duration, callback = () => {}, easing = bezier) {
  Animated.timing(ref, {
    toValue: toValue,
    easing: easing,
    duration: duration,
    useNativeDriver: true,
  }).start(() => callback());
}

export { Animate, bezier };
