import React from 'react';
import { Modal, ModalProps, StyleSheet, TouchableOpacity } from "react-native"

interface IProps extends ModalProps {
  open: boolean;
  close: () => void;
  children: React.ReactNode;
}

export function ModalBasic ({
                                     open,
                                     close,
                                     children,
                                     ...props
                                   }: IProps) {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={close}
      {...props}
    >
      <TouchableOpacity onPress={close} style={styles.modalBackDrop} activeOpacity={1}>
        {children}
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackDrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.60)',
  }
})

export default ModalBasic;