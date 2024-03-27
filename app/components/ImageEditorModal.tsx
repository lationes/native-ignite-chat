import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native"
import * as ImagePicker from "expo-image-picker";
import { translate } from "app/i18n"
import { Text, TextProps } from "app/components/Text"
import { colors, spacing } from "app/theme"
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ModalBasic from "app/components/ModalBasic"

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: TextProps["text"];
  titleTx?: TextProps["tx"];
  titleTxOptions?: TextProps["txOptions"];
  saveImageCallback: (image: ImagePicker.ImagePickerAsset) => void;
  removeImageCallback?: () => void;
  showRemove?: boolean;
  cancelCallback?: () => void;
}

export function ImageEditorModal ({
                                     open,
                                     setOpen,
                                     title,
                                     titleTx,
                                     titleTxOptions,
                                     saveImageCallback,
                                     removeImageCallback,
                                     showRemove,
                                     cancelCallback,
                                   }: IProps) {
  const closeModal = () => {
    setOpen(false);
    cancelCallback && cancelCallback();
  }

  const uploadImage = async (mode: 'gallery' | 'camera') => {
    try {
      let result;

      if (mode === 'camera') {
        await ImagePicker.requestCameraPermissionsAsync();

        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        });
      }

      if (mode === 'gallery') {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        })
      }

      if (result && !result.canceled) {
        await saveImage(result.assets[0]);
      }
    } catch (e) {
      alert('Error uploading image' + e.message);
      setOpen(false);
    }
  }

  const saveImage = async (image: ImagePicker.ImagePickerAsset) => {
    try {
      saveImageCallback(image);
      setOpen(false);
    } catch (e) {
      throw (e);
    }
  }

  const titleContent = titleTx ? translate(titleTx, titleTxOptions) : title;

  return (
    <ModalBasic
      open={open}
      close={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text preset={'subheading'}>{titleContent}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => uploadImage('camera')}>
              <View style={styles.editorButton}>
                <MaterialIcons name={'add-a-photo'} color={colors.palette.primary500} size={30} />
                <Text tx={'imageEditor.camera'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadImage('gallery')}>
              <View style={styles.editorButton}>
                <FontAwesome name={'photo'} color={colors.palette.primary500} size={30} />
                <Text tx={'imageEditor.gallery'} />
              </View>
            </TouchableOpacity>
            { showRemove && (
              <TouchableOpacity onPress={removeImageCallback}>
                <View style={styles.editorButton}>
                  <MaterialCommunityIcons name={'delete-outline'} color={colors.palette.primary500} size={30} />
                  <Text tx={'common.remove'} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ModalBasic>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: colors.palette.neutral200,
    borderRadius: 20,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    gap: spacing.md,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: 'row',
    gap: spacing.md,
  },
  editorButton: {
    width: 90,
    height: 90,
    padding: spacing.xs,
    borderRadius: spacing.sm,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.palette.secondary100,
  }
});

export default ImageEditorModal;