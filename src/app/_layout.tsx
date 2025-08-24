import React, { useEffect } from "react";
import { Image } from "expo-image";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";

import "../../global.css";

SplashScreen.preventAutoHideAsync();

cssInterop(Image, { className: "style" });

const RootLayout: React.FC = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <RootSiblingParent>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </RootSiblingParent>
      <StatusBar style="auto" />
    </>
  );
};

export default RootLayout;
