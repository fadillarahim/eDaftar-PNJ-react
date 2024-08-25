import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Flex,
  Image,
  Link,
  Icon,
  IconButton,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";

import { AiFillBank, AiFillDatabase } from "react-icons/ai";
import { FiChevronsLeft, FiChevronsRight, FiHome } from "react-icons/fi";
import { FaIdCard, FaList, FaUser, FaUserShield } from "react-icons/fa";
import { IoEarthSharp } from "react-icons/io5";
import { BsPersonCheckFill } from "react-icons/bs";

export default function Sidebar({
  // appMenu,
  isToggled,
  setIsToggled,
  userPermission,
  ...rest
}) {
  // const homeApp = {
  //   travelrequest: "#/",
  // };

  const sideMenu = {
    homepage: {
      permission: "dashboard",
      mobile: (
        <ToggledItem
          key={"Dashboard"}
          icon={FiHome}
          name={"Dashboard"}
          link="/"
        />
      ),
    },

    master: [
      {
        permission: "master.user.read",
        base: (
          <NavItem
            key="MasterUser"
            icon={FaUser}
            name="User"
            link="/master/user"
          />
        ),
        mobile: (
          <ToggledItem
            key="MasterUser"
            icon={FaUser}
            name="User"
            link="/master/user"
          />
        ),
      },
      {
        permission: "master.role.read",
        base: (
          <NavItem
            key="MasterRole"
            icon={FaUserShield}
            name="Role"
            link="/master/role"
          />
        ),
        mobile: (
          <ToggledItem
            key="MasterRole"
            icon={FaUserShield}
            name="Role"
            link="/master/role"
          />
        ),
      },
    ],

    pendaftaran: [
      {
        permission: "pendaftaran.list.read",
        base: (
          <NavItem
            key="daftarPendaftar"
            icon={FaList}
            name="List Pendaftar"
            link="/list-pendaftar"
          />
        ),
        mobile: (
          <ToggledItem
            key="daftarPendaftar"
            icon={FaList}
            name="List Pendaftar"
            link="/list-pendaftar"
          />
        ),
      },
      {
        permission: "pendaftaran.biodata-diri.read",
        base: (
          <NavItem
            key="biodatadiri"
            icon={FaIdCard}
            name="Pendaftaran"
            link="/pendaftaran/biodata-diri"
          />
        ),
        mobile: (
          <ToggledItem
            key="biodatadiri"
            icon={FaIdCard}
            name="Pendaftaran"
            link="/pendaftaran/biodata-diri"
          />
        ),
      },
    ],
  };

  return (
    <Box
      position={"sticky"}
      left={0}
      zIndex={5}
      transition={{ base: "3s ease", md: "0.5s ease" }}
      bg={"lime"}
      pos={"fixed"}
      h={"full"}
      w={{ base: "full", md: isToggled ? "120px" : 60 }}
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        my={3}
        mx="8"
        justifyContent="space-between"
      >
        <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
          {isToggled ? (
            ""
          ) : (
            <Image
              h={"23 px"}
              w={"130px"}
              mx={"auto"}
              src="eDaftar.png"
              alt="Dan Abramov"
            />
          )}
          <IconButton
            display={{ base: "none", md: "flex" }}
            onClick={setIsToggled}
            aria-label="toggle-sidebar"
            ml={isToggled ? 0 : 10}
            mt={3}
            icon={isToggled ? <FiChevronsRight /> : <FiChevronsLeft />}
          />
        </Flex>
      </Flex>

      <Box
        // overflow={"hidden"}
        overflowY={"auto"}
        // overflowY={"scroll"}
        maxH={"80vh"}
        display={isToggled ? "none" : "block"}
        color="white"
      >
        <Link
          href={"#/"}
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
        >
          <Flex
            align={"center"}
            px={4}
            py={3}
            my={1}
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{ bg: "#6fb9c2", color: "white" }}
            mx={4}
          >
            <Icon
              mr={4}
              fontSize={24}
              as={FiHome}
              _groupHover={{ color: "white" }}
            ></Icon>
            <Text textAlign={"center"} fontWeight={700} fontSize={14}>
              Dashboard
            </Text>
          </Flex>
        </Link>

        <Accordion mx={4} allowMultiple>
          {sideMenu.master.filter((menu) =>
            userPermission.includes(menu.permission)
          ).length > 0 ? (
            <AccordionItem border={"hidden"}>
              <h2>
                <AccordionButton
                  _hover={{ bg: "#6fb9c2", color: "white" }}
                  px={4}
                  py={3}
                  my={1}
                  borderRadius={"6px"}
                  justifyContent={"space-between"}
                >
                  <Flex textAlign={"left"} align={"center"}>
                    <Icon
                      mr={4}
                      fontSize={24}
                      _groupHover={{ color: "white" }}
                      as={AiFillDatabase}
                    />
                    <Text
                      textAlign={"left"}
                      color={"white"}
                      fontWeight={700}
                      fontSize={14}
                    >
                      Master
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                {sideMenu.master
                  .filter((menu) => userPermission.includes(menu.permission))
                  .map((menu) => menu.base)}
              </AccordionPanel>
            </AccordionItem>
          ) : (
            ""
          )}

          {sideMenu.pendaftaran.filter((menu) =>
            userPermission.includes(menu.permission)
          ).length > 0 ? (
            <AccordionItem border={"hidden"}>
              <h2>
                <AccordionButton
                  _hover={{ bg: "#6fb9c2", color: "white" }}
                  px={4}
                  py={3}
                  my={1}
                  borderRadius={"6px"}
                  justifyContent={"space-between"}
                >
                  <Flex textAlign={"left"} align={"center"}>
                    <Icon
                      mr={4}
                      fontSize={24}
                      _groupHover={{ color: "white" }}
                      as={AiFillBank}
                    />
                    <Text
                      textAlign={"left"}
                      color={"white"}
                      fontWeight={700}
                      fontSize={14}
                    >
                      Pendaftaran
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                {sideMenu.pendaftaran
                  .filter((menu) => userPermission.includes(menu.permission))
                  .map((menu) => menu.base)}
              </AccordionPanel>
            </AccordionItem>
          ) : (
            ""
          )}
        </Accordion>
      </Box>
      <Box
        overflowY={"auto"}
        maxH={"80vh"}
        display={isToggled ? "block" : "none"}
        color="white"
      >
        {sideMenu.homepage.mobile}
        {sideMenu.master
          .filter((menu) => userPermission.includes(menu.permission))
          .map((menu) => menu.mobile)}
        {sideMenu.pendaftaran
          .filter((menu) => userPermission.includes(menu.permission))
          .map((menu) => menu.mobile)}
      </Box>
    </Box>
  );
}

const NavItem = ({ link, icon, name = "", ...rest }) => {
  return (
    <Link
      href={"#" + link}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align={"center"}
        px={4}
        py={3}
        my={1}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{ bg: "#ededed", color: "white" }}
        bgColor={"white"}
        {...rest}
      >
        {icon && <Icon mr={4} color={"lime"} fontSize={24} as={icon}></Icon>}
        <Text
          textAlign={"left"}
          color={"gray.700"}
          fontWeight={700}
          fontSize={14}
        >
          {name}
        </Text>
      </Flex>
    </Link>
  );
};

// Navigation Item (Sidebar Menu)
const ToggledItem = ({ link, icon, name = "" }) => {
  const navigate = useNavigate();
  return (
    <Flex
      mb={2}
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Flex
        onClick={() => navigate(link)}
        p="4"
        borderRadius={"lg"}
        cursor="pointer"
        bg={"#6fb9c2"}
      >
        <Icon as={icon} w={"20px"} h={"20px"} />
      </Flex>
      <Text
        maxW={"80px"}
        my={1}
        textAlign={"center"}
        color={"white"}
        fontWeight={700}
        fontSize={14}
      >
        {name}
      </Text>
    </Flex>
  );
};
