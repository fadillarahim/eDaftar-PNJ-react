import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Td,
  Text,
  Textarea,
  Th,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  ModalComponent,
  TablePaginate,
  useToastHook,
} from "../../../components";
import { Select as SearchSelect } from "chakra-react-select";
import { useDispatch, useSelector } from "react-redux";
import { getRole } from "../../../backend/Master/Role/getRole";
import { getUser } from "../../../backend/Master/User/getUser";
import { createUser } from "../../../backend/Master/User/createUser";
import { updateUser } from "../../../backend/Master/User/updateUser";
import { deleteUser } from "../../../backend/Master/User/deleteUser";
import { formatDateWithoutTime } from "../../../utils/formatDate";
import { FiEdit, FiTrash } from "react-icons/fi";
const MasterUser = ({ user }) => {
  const [toast, setToast] = useToastHook();
  const {
    isOpen: isOperationOpen,
    onOpen: onOperationOpen,
    onClose: onOperationClose,
  } = useDisclosure();
  const [metadata, setMetadata] = useState({});
  const [search, setSearch] = useState("");
  const [operation, setOperation] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const getUserState = useSelector((state) => state.getUser);
  const getRoleState = useSelector((state) => state.getRole);
  const createUserState = useSelector((state) => state.createUser);
  const updateUserState = useSelector((state) => state.updateUser);
  const deleteUserState = useSelector((state) => state.deleteUser);

  useEffect(() => {
    dispatch(getUser({ token: user.token }));
    dispatch(getRole({ token: user.token }));
  }, [dispatch]);

  useEffect(() => {
    if (createUserState.status === "error") {
      setToast({ message: createUserState.data.message, type: "error" });
      dispatch(createUser({ action: "reset" }));
    } else if (createUserState.status === "loaded") {
      setToast({ message: createUserState.data.message, type: "success" });
      dispatch(createUser({ action: "reset" }));
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [createUserState.status, setToast]);

  useEffect(() => {
    if (updateUserState.status === "error") {
      setToast({ message: updateUserState.data.message, type: "error" });
      dispatch(updateUser({ action: "reset" }));
    } else if (updateUserState.status === "loaded") {
      setToast({ message: updateUserState.data.message, type: "success" });
      dispatch(updateUser({ action: "reset" }));
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [updateUserState.status, setToast]);

  useEffect(() => {
    if (deleteUserState.status === "error") {
      setToast({ message: deleteUserState.data.message, type: "error" });
      dispatch(deleteUser({ action: "reset" }));
    } else if (deleteUserState.status === "loaded") {
      setToast({ message: deleteUserState.data.message, type: "success" });
      dispatch(deleteUser({ action: "reset" }));
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [deleteUserState.status, setToast]);

  const filteredUser = useMemo(() => {
    if (getUserState.data.data && getUserState.data.data.length > 0) {
      return getUserState.data.data.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.masterRole.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return [];
  }, [search, getUserState.data.data]);

  const handleOperation = () => {
    if (
      !metadata.username ||
      !metadata.email ||
      !metadata.roleId ||
      !metadata.password 
    ) {
      setToast({ message: "Mohon isi semua form", type: "warning" });
    } else if(emailError || passwordError){
        setToast({ message: "Mohon isi form dengan benar", type: "warning" });
    }else if(operation !== "TAMBAH" && !metadata.id){
      setToast({ message: "ID user tidak ditemukan", type: "warning" });
    } else {
        if(operation === "TAMBAH"){
            dispatch(createUser({ token: user.token, data: {metadata} }));
        } else if(operation === "EDIT"){
            dispatch(updateUser({ token: user.token, data: {metadata} }));
        } else {
            dispatch(deleteUser({ token: user.token, data: {metadata} }));
        }
    }
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value.toLowerCase();
    setMetadata({ ...metadata, email });

    if (!validateEmail(email)) {
      setEmailError("Email tidak valid");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setMetadata({ ...metadata, password });

    if (!validatePassword(password)) {
      setPasswordError("Password minimal 6 karakter");
    } else {
      setPasswordError("");
    }
  };
  return (
    <Box>
      {getUserState.status === "loaded" && getRoleState.status === "loaded" ? (
        <>
          <Flex w={"100%"} mb={10}>
            <Flex
              w={"50%"}
              justifyItems={"start"}
              justifyContent={"start"}
              flexDir={"column"}
            >
              <Text fontSize={"xl"} fontWeight={"bold"} mb={3}>
                eDaftar User
              </Text>
              <Text fontSize={"l"} fontWeight={"500"} color={"gray"}>
                Daftar User aplikasi eDaftar PNJ
              </Text>
            </Flex>
            <Flex justifyContent={"flex-end"} w={"50%"} mb={3}>
              <Button
                leftIcon={<FaPlus />}
                colorScheme="twitter"
                variant="solid"
                id="btn-add-user"
                onClick={async () => {
                  setMetadata({});
                  setOperation("TAMBAH");
                  onOperationOpen();
                }}
              >
                Tambah User
              </Button>
            </Flex>
          </Flex>
          <TablePaginate
            id="master-user"
            customHead={true}
            totalHead={5}
            tableStatus={getUserState.status}
            searchComponent={
              <InputGroup w={"70%"}>
                <Input
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputRightElement>
                  <FaSearch color="green.500" />
                </InputRightElement>
              </InputGroup>
            }
            tableHead={
              <Tr>
                <Th textAlign={"center"} className="th">
                  #
                </Th>
                <Th textAlign={"center"} className="th">
                  USERNAME
                </Th>
                <Th textAlign={"center"} className="th">
                  EMAIL
                </Th>
                <Th textAlign={"center"} className="th">
                  PASSWORD
                </Th>
                <Th textAlign={"center"} className="th">
                  ROLE
                </Th>

                <Th
                  textAlign={"center"}
                  className="th"
                  bg={"white"}
                  position={"sticky"}
                  right={0}
                >
                  AKSI
                </Th>
              </Tr>
            }
            tableItem={filteredUser.map((fi, i) => (
              <Tr key={i}>
                <Td textAlign={"center"} className="td">
                  {i + 1}
                </Td>
                <Td className="td">{fi.username}</Td>

                <Td className="td">{fi.email}</Td>
                <Td className="td">{fi.password}</Td>
                <Td className="td">{fi.masterRole.name}</Td>

                <Td
                  className="td"
                  right={0}
                  bgColor={"white"}
                  textAlign={"center"}
                  justifyContent={"center"}
                  position={"sticky"}
                >
                  <Flex justifyContent={"center"} gap={3}>
                    <IconButton
                      size={"md"}
                      color={"white"}
                      colorScheme="yellow"
                      icon={<FiEdit />}
                      onClick={() => {
                        setMetadata({
                          ...fi,
                          roleName: fi.masterRole.name,
                        });
                        setOperation("EDIT");
                        onOperationOpen();
                      }}
                    />
                    <IconButton
                      size={"md"}
                      color={"white"}
                      colorScheme="red"
                      icon={<FiTrash />}
                      onClick={() => {
                        setMetadata({
                            ...fi,
                            roleName: fi.masterRole.name,
                          });
                        setOperation("HAPUS");
                        onOperationOpen();
                      }}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          />
          <ModalComponent
            size="4xl"
            title={`${operation} USER`}
            isOpen={isOperationOpen}
            onClose={() => {
              setMetadata({});
              onOperationClose();
            }}
            footer={
              <>
                <Button
                  onClick={() => {
                    setMetadata({});
                    onOperationClose();
                  }}
                  colorScheme={"gray"}
                  mr={3}
                  isLoading={
                    createUserState.status !== "idle" ||
                    updateUserState.status !== "idle" ||
                    deleteUserState.status !== "idle"
                  }
                >
                  {operation === "HAPUS" ? "Tidak" : "Batal"}
                </Button>
                <Button
                  onClick={handleOperation}
                  colorScheme={operation === "HAPUS" ? "red" : "twitter"}
                  isLoading={
                    createUserState.status !== "idle" ||
                    updateUserState.status !== "idle" ||
                    deleteUserState.status !== "idle"
                  }
                >
                  {operation === "HAPUS" ? "Ya" : "Submit"}
                </Button>
              </>
            }
          >
            <Text
                fontSize={"md"}
                lineHeight={"1.5"}
                textAlign={"center"}
                mb={3}
                display={operation === "HAPUS" ? "block" : "none"}
              >
                Apakah anda yakin ingin menghapus user ini?
              </Text>
            <FormControl
              display={"flex"}
              w={"full"}
              alignItems={"center"}
              isRequired
              mb={3}
              zIndex={100}
              
            >
              <Flex w={"100%"}>
                <FormLabel w={"20%"}>Username</FormLabel>

                <Input
                  w={"80%"}
                  onChange={(e) => {
                    // Izinkan hanya huruf dan panjang maksimal 15 karakter
                    if (
                      /^[A-Za-z]*$/.test(e.target.value) &&
                      e.target.value.length <= 15
                    ) {
                      setMetadata({
                        ...metadata,
                        username: e.target.value.toLowerCase(),
                      });
                    }
                  }}
                  type="text"
                  onKeyDown={(e) => {
                    const isSpecialKey =
                      e.key === "Backspace" || e.key === "Delete";
                    const isMaxLength =
                      metadata.username &&
                      metadata.username.length >= 15;

                    // Cegah input jika bukan huruf atau panjang lebih dari 15, kecuali jika tombol "Backspace" atau "Delete"
                    if (
                      (!isSpecialKey && isMaxLength) ||
                      /[^A-Za-z]/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  value={metadata.username ? metadata.username : ""}
                  placeholder="Masukkan Username"
                  isDisabled={operation === "HAPUS"}
                />
              </Flex>
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              w={"100%"}
              isRequired
              mb={3}
              isInvalid={emailError}
            >
              <FormLabel w={"20%"}>Email</FormLabel>
              <Flex w={"80%"} direction={"column"}>
                <Input
                  onChange={handleEmailChange}
                  type="email"
                  value={metadata.email ? metadata.email.toLowerCase() : ""}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Masukkan Email"
                  isDisabled={operation === "HAPUS"}
                />
                {emailError && (
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                )}
              </Flex>
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              isRequired
              w={"100%"}
              mb={3}
              isInvalid={passwordError}
            >
              <FormLabel w={"20%"}>Password</FormLabel>
              <Flex w={"80%"} direction={"column"}>
                <Input
                  type={"text"}
                  onChange={handlePasswordChange}
                  onKeyDown={(e) => {
                    if (e.key === " " || /[^A-Za-z0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  value={metadata.password ? metadata.password : ""}
                  placeholder="Masukkan Password Minimal 6 Karakter"
                  isDisabled={operation === "HAPUS"}
                />
                {passwordError && (
                  <FormErrorMessage>{passwordError}</FormErrorMessage>
                )}
              </Flex>
            </FormControl>

            <FormControl
              display={"flex"}
              alignItems={"center"}
              isRequired
              mb={3}
            >
              <Flex w={"100%"}>
                <FormLabel w={"20%"}>Role</FormLabel>
                <SearchSelect
                  placeholder="Pilih Role User"
                  options={getRoleState.data.data.map((rl) => ({
                    label: rl.name,
                    value: rl.id,
                  }))}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      roleId: e.value,
                      roleName: e.label,
                    })
                  }
                  defaultValue={
                    metadata.roleName && metadata.roleId
                      ? { label: metadata.roleName, value: metadata.roleId }
                      : null
                  }
                  chakraStyles={{
                    container: (provided, state) => ({
                      ...provided,
                      w: "80%",
                    }),
                  }}
                  isDisabled={operation === "HAPUS"}
                />
              </Flex>
            </FormControl>
          </ModalComponent>
        </>
      ) : (
        <>
          <Flex w={"full"} justifyContent={"center"} alignItems={"center"}>
            <Spinner size={"xl"} color="green.500" />
          </Flex>
        </>
      )}
    </Box>
  );
};

export default MasterUser;
