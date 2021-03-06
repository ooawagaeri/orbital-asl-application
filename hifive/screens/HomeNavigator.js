import * as React from "react";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MediaQuery } from "react-native-responsive";
import CameraScreen from "./CameraScreen";
import PractiseScreen from "./PractiseScreen";
import QuizScreen from "./QuizScreen";
import TranslatorScreen from "./TranslatorScreen";
import VideosScreen from "./VideosScreen";

const CamStack = createStackNavigator();
const PracStack = createStackNavigator();
const QuizStack = createStackNavigator();
const TransStack = createStackNavigator();
const VideosStack = createStackNavigator();

/**
 * Camera screen component
 * @returns {JSX.Element}
 * @constructor
 */
function CamStackScreen() {
  return (
    <CamStack.Navigator headerMode="none">
      <CamStack.Screen name="Sign to Text" component={CameraScreen} />
    </CamStack.Navigator>
  );
}

/**
 * Quiz screen component
 * @returns {JSX.Element}
 * @constructor
 */
function QuizStackScreen() {
  return (
    <QuizStack.Navigator headerMode="none">
      <QuizStack.Screen name="Quiz" component={QuizScreen} />
    </QuizStack.Navigator>
  );
}

/**
 * Translation screen component
 * @returns {JSX.Element}
 * @constructor
 */
function TransStackScreen() {
  return (
    <TransStack.Navigator headerMode="none">
      <TransStack.Screen name="Text to Sign" component={TranslatorScreen} />
    </TransStack.Navigator>
  );
}

/**
 * Practise screen component
 * @returns {JSX.Element}
 * @constructor
 */
function PracStackScreen() {
  return (
    <PracStack.Navigator headerMode="none">
      <PracStack.Screen name="Gesture Practise" component={PractiseScreen} />
    </PracStack.Navigator>
  );
}

/**
 * Resources component
 * @returns {JSX.Element}
 * @constructor
 */
function VideosStackScreen() {
  return (
    <VideosStack.Navigator headerMode="none">
      <VideosStack.Screen name="Video Resources" component={VideosScreen} />
    </VideosStack.Navigator>
  );
}

/**
 * React Native Bottom Tab
 * @type {import("@react-navigation/native").TypedNavigator<Record<string, object | undefined>, TabNavigationState<Record<string, object | undefined>>, BottomTabNavigationOptions, BottomTabNavigationEventMap, typeof BottomTabNavigator>}
 */
const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      initialRouteName="Camera"
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "grey",
        style: styles.container,
        labelStyle: {
          fontFamily: "FuturaPTDemi",
          fontSize: 12,
        },
      }}
      theme={theme}
    >
      <Tab.Screen
        name="Practise"
        displayName="Practise"
        component={PracStackScreen}
        options={{
          tabBarLabel: "Practise",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="hand-paper-o" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        displayName="Quiz"
        component={QuizStackScreen}
        options={{
          tabBarLabel: "Quiz",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="thought-bubble"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        displayName="Camera"
        component={CamStackScreen}
        options={{
          tabBarLabel: "Sign to Text",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="enhance-photo-translate"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Translator"
        displayName="Translator"
        component={TransStackScreen}
        options={{
          tabBarLabel: "Text to Sign",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="translate" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Videos"
        displayName="Videos"
        component={VideosStackScreen}
        options={{
          tabBarLabel: "Resources",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="youtube" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0,
    elevation: 0,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: "transparent",
  },
});

const theme = {
  colors: {
    background: "transparent",
  },
};
