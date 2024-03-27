import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Button } from "app/components/Button"
import { translate } from "app/i18n"
import { TextProps } from "app/components/Text"
import { colors, spacing } from "app/theme"
import ModalBasic from "app/components/ModalBasic"

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: TextProps["text"];
  titleTx?: TextProps["tx"];
  titleTxOptions?: TextProps["txOptions"];
  okCallback: () => void;
  okTitle?: TextProps["text"];
  okTitleTx?: TextProps["tx"];
  okTitleTxOptions?: TextProps["txOptions"];
  cancelTitle?: TextProps["text"];
  cancelTitleTx?: TextProps["tx"];
  cancelTitleTxOptions?: TextProps["txOptions"];
  cancelCallback?: () => void;
}

export function ConfirmationModal ({
                                     open,
                                     setOpen,
                                     title,
                                     titleTx,
                                     titleTxOptions,
                                     okTitle,
                                     okTitleTx,
                                     okTitleTxOptions,
                                     cancelTitle,
                                     cancelTitleTx,
                                     cancelTitleTxOptions,
                                     okCallback,
                                     cancelCallback,
                           }: IProps) {
  const closeModal = () => {
    setOpen(false);
    cancelCallback && cancelCallback();
  }

  const closeModalSuccess = () => {
    setOpen(false);
    okCallback && okCallback();
  }

  const titleContent = titleTx ? translate(titleTx, titleTxOptions) : title;

  return (
    <ModalBasic
      open={open}
      close={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{titleContent}</Text>
          <View style={styles.buttonContainer}>
            <Button
              testID="message-editor-button"
              tx={okTitleTx || 'common.ok'}
              txOptions={okTitleTxOptions}
              text={okTitle}
              preset="default"
              style={styles.button}
              onPress={closeModalSuccess}
            />
            <Button
              testID="message-editor-button"
              tx={cancelTitleTx || "common.cancel"}
              txOptions={cancelTitleTxOptions}
              text={cancelTitle}
              preset="default"
              style={styles.button}
              onPress={closeModal}
            />
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
    gap: 8,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ConfirmationModal;