import React from "react";
import {
  Avatar,
  Divider,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import useToastHook from "../ToastHook";

export default function Header({ user, isToggled, headerTitle }) {
  const navigate = useNavigate();
  const [toast, setToast] = useToastHook();

  return (
    <Flex
      bg={"lime"}
      position={"sticky"}
      top={0}
      zIndex={3}
      w="100%"
      px={10}
      py={5}
      color="white"
      flexDir={"row"}
    >
      <Flex h={"full"} w={"75%"} justifyContent={"left"} alignItems={"center"}>
        <IconButton
          display={{ base: "none", md: "flex" }}
          onClick={() => navigate(-1)}
          bg={"white"}
          color={"black"}
          _hover={{ bg: "#6fb9c2", color: "white" }}
          borderRadius={"full"}
          icon={<FiArrowLeft />}
          transition={"0.5s ease"}
          ml={isToggled ? "6.6rem" : "14.4rem"}
          mr={3}
        />
        <Text className="card-txt-bold" fontSize={30}>
          {headerTitle}
        </Text>
      </Flex>

      <Flex h={"full"} w={"25%"} justifyContent={"right"} alignItems={"center"}>
        <Menu>
          <MenuButton transition="all 0.3s" _focus={{ boxShadow: "none" }}>
            <HStack alignItems={"center"}>
              <Avatar
                src={`https://ui-avatars.com/api/?name=${user.username}&color=2d4739&background=6fb9c2`}
                mr={3}
              />
              <VStack spacing={0} alignItems={"left"}>
                <Text
                  className={"card-txt-bold"}
                  fontSize={"20px"}
                  textAlign={"left"}
                >
                  {user.username}
                </Text>
                <Text
                  className={"card-txt-bold"}
                  fontSize={"14px"}
                  textAlign={"left"}
                >
                  {user.username}
                </Text>
              </VStack>
            </HStack>
          </MenuButton>
          <MenuList bg={"white"} borderColor={"gray.400"} zIndex={1000}>
            <MenuItem
              color={"black"}
              onClick={() => {
                localStorage.removeItem("edaftar-user-token");
                localStorage.removeItem("edaftar-current-user");
                setToast({
                  type: "success",
                  message: "Logout Sukses",
                })
                navigate("/login");
              }}
            >
              Keluar
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}
