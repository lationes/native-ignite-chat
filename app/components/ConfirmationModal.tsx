import React from 'react';
import { Modal, StyleSheet, Text, View} from 'react-native';
import { Button } from "app/components/Button"
import { translate } from "app/i18n"
import { TextProps } from "app/components/Text"

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: TextProps["text"];
  titleTx?: TextProps["tx"];
  titleTxOptions?: TextProps["txOptions"];
  okCallback: () => void;
  cancelCallback?: () => void;
}

export function ConfirmationModal ({
                                     open,
                                     setOpen,
                                     title,
                                     titleTx,
                                     titleTxOptions,
                                     okCallback,
                                     cancelCallback,
                           }: IProps) {
  const closeModal = () => {
    setOpen(false);
    cancelCallback && cancelCallback();
  }

  const titleContent = titleTx ? translate(titleTx, titleTxOptions) : title;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={closeModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{titleContent}</Text>
          <View style={styles.buttonContainer}>
            <Button
              testID="message-editor-button"
              tx={"common.edit"}
              preset="default"
              style={styles.button}
              onPress={okCallback}
            />
            <Button
              testID="message-editor-button"
              tx={"common.cancel"}
              preset="default"
              style={styles.button}
              onPress={closeModal}
            />
          </View>
        </View>
      </View>
    </Modal>
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
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