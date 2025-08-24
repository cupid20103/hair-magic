import { ImageRequireSource } from "react-native";

export interface WrapperProps {
  children?: React.ReactNode;
}

export interface UploadModalProps {
  modalVisible: boolean;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress: () => void;
  onClose: () => void;
}

export interface HairStyleProps {
  title: string;
  image: ImageRequireSource;
  onPress?: () => void;
}

export interface SkeletonImageProps {
  className?: string;
  uri?: string;
}
