import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";

const ModalComponent = ({
  title,
  children,
  footer,
  isOpen,
  onClose,
  size = "2xl",
  scrollBehaviorInside = false,
}) => {
  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        closeOnOverlayClick={false}
        scrollBehavior={scrollBehaviorInside ? "inside" : "outside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={24}
            fontWeight={"bold"}
          >
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          {footer ? <ModalFooter>{footer}</ModalFooter> : <></>}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ModalComponent;
