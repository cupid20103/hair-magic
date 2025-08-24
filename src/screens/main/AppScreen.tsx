import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { fetch } from "expo/fetch";
import Feather from "@expo/vector-icons/Feather";
import { HairStyle, SkeletonImage, UploadModal } from "@/components";
import { hairStyleData } from "@/lib/constant";
import { cn, generateAPIURL, imageToBase64, isEmpty, toast } from "@/lib/utils";

const AppScreen: React.FC = () => {
  const [selfie, setSelfie] = useState<string | undefined>(undefined);
  const [prompt, setPrompt] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | undefined>(undefined);

  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";

  const uploadImage = async (mode: "camera" | "gallery" | "remove") => {
    try {
      if (mode === "camera") {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();

        if (!granted) {
          toast({ message: "Camera permission is required." });

          setModalVisible(false);

          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          setSelfie(result.assets[0].uri);
        }
      } else if (mode === "gallery") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          setSelfie(result.assets[0].uri);
        }
      } else {
        setSelfie(undefined);
      }

      setModalVisible(false);
    } catch (error) {
      toast({ message: "Failed to pick image." });

      console.error(error);
    }
  };

  const handleImage = async () => {
    if (isEmpty(selfie) || prompt.trim().length === 0 || isLoading) {
      toast({ message: "Please upload an image and enter a prompt." });

      return;
    }

    try {
      setIsLoading(true);

      if (!isReady) {
        setIsReady(true);

        return;
      } else {
        const input_image = selfie && (await imageToBase64(selfie));

        const response = await fetch(generateAPIURL("/api/hair"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input_image, prompt: prompt.trim() }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setResult(data.result);
      }
    } catch (error) {
      toast({ message: "Failed to process image." });

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = useCallback(() => {
    setIsReady(false);
    setResult(undefined);
  }, []);

  return (
    <ScrollView>
      <View className="flex flex-col gap-y-5 mx-5 my-7">
        <View className="flex flex-col gap-y-5">
          {!isReady ? (
            <View className="flex flex-col gap-y-3">
              <Text className="text-4xl font-bold text-center dark:text-white">
                Try a Stunning {"\n"} New Look with {"\n"} AI Hair Magic
              </Text>
              <Text className="text-base text-gray-500 text-center">
                Upload your photo, describe your ideal hairstyle, and see the
                transformation!
              </Text>
            </View>
          ) : (
            <Pressable onPress={handleClear}>
              {!isDarkMode ? (
                <Feather name="arrow-left" size={24} color="black" />
              ) : (
                <Feather name="arrow-left" size={24} color="white" />
              )}
            </Pressable>
          )}
          {!isEmpty(result) && (
            <Text className="text-4xl font-bold text-center dark:text-white">
              Here's Your {"\n"} New Look
            </Text>
          )}
          <View className="flex flex-col gap-y-5">
            <Pressable
              className={cn(
                "w-full rounded-xl overflow-hidden",
                isReady ? "h-96" : "bg-white h-64",
                isEmpty(selfie) && "border-2 border-gray-300 border-dashed"
              )}
              onPress={() => setModalVisible(true)}
              disabled={isReady}
            >
              {isEmpty(result) ? (
                <>
                  {!isEmpty(selfie) ? (
                    <Image
                      className="w-full h-full"
                      source={{ uri: selfie }}
                      contentFit="cover"
                    />
                  ) : (
                    <View className="flex-1 flex-col items-center justify-center">
                      <View className="w-16 h-16 flex justify-center items-center bg-gray-100 rounded-full">
                        <Feather name="camera" size={20} color="black" />
                      </View>
                      <Text className="mt-3 text-base text-gray-700">
                        Upload photo
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Click or drag and drop
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <SkeletonImage className="w-full h-full" uri={result} />
              )}
            </Pressable>
            {!isEmpty(result) && (
              <View className="flex flex-col gap-y-5">
                <View className="h-48 flex flex-row gap-x-5">
                  <View className="flex-1 flex-col gap-y-1.5">
                    <Text className="text-base font-medium text-gray-500 text-center">
                      Before
                    </Text>
                    <Image
                      className="flex-1 rounded-xl"
                      source={{ uri: selfie }}
                      contentFit="cover"
                    />
                  </View>
                  <View className="flex-1 flex-col gap-y-1.5">
                    <Text className="text-base font-medium text-gray-500 text-center">
                      After
                    </Text>
                    <SkeletonImage
                      className="flex-1 rounded-xl overflow-hidden"
                      uri={result}
                    />
                  </View>
                </View>
                <Text className="text-lg font-medium text-gray-500 text-center">
                  Want to modify or try another look?
                </Text>
              </View>
            )}
            <TextInput
              className="p-3 text-base text-gray-700 bg-white border border-gray-300 rounded-xl"
              value={prompt}
              onChangeText={(text) => setPrompt(text)}
              numberOfLines={1}
              placeholder={
                isEmpty(result)
                  ? "e.g. Short bob with icy highlights"
                  : "e.g. Make it shorter with more layers"
              }
              placeholderTextColor="#d1d5db"
            />
            <Pressable
              className="relative p-3 rounded-full shadow-lg shadow-black/50 overflow-hidden"
              onPress={handleImage}
            >
              <LinearGradient
                className="absolute inset-0"
                colors={["#C4A8AA", "#322626"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              {isLoading ? (
                <View className="flex flex-row items-center justify-center gap-x-1.5">
                  <ActivityIndicator color="white" />
                  <Text className="text-lg font-bold text-white text-center">
                    Processing...
                  </Text>
                </View>
              ) : (
                <Text className="text-lg font-bold text-white text-center">
                  {isEmpty(result) ? "See My New Look" : "Generate New Look"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
        {isEmpty(result) && (
          <>
            {!isReady ? (
              <View className="flex flex-col gap-y-5">
                <Text className="text-lg font-semibold text-gray-700">
                  Popular Styles
                </Text>
                <View className="flex flex-row justify-between gap-x-3">
                  {hairStyleData.map((item, index) => (
                    <HairStyle
                      key={index}
                      title={item.title}
                      image={item.image}
                      onPress={() => setPrompt(item.title)}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <Text className="text-sm text-gray-500 text-center">
                Your photo is processed securely for transformation only and is
                not stored or shared.
              </Text>
            )}
          </>
        )}
      </View>
      <UploadModal
        modalVisible={modalVisible}
        onCameraPress={() => uploadImage("camera")}
        onGalleryPress={() => uploadImage("gallery")}
        onRemovePress={() => uploadImage("remove")}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

export default AppScreen;
