import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Td,
  Text,
  Th,
  Tr,
  textDecoration,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  CustomTag,
  ModalComponent,
  TablePaginate,
  useToastHook,
} from "../../../components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePendaftar } from "../../../backend/pendaftaran/deletePendaftar";
import { getListPendaftar } from "../../../backend/pendaftaran/getListPendaftar";
import { formatDate } from "../../../utils/formatDate";
import { FiTrash } from "react-icons/fi";
import { formatNumber } from "../../../utils/formatNumber";

const DaftarPendaftar = ({ user }) => {
  const [toast, setToast] = useToastHook();
  const navigate = useNavigate();
  const {
    isOpen: isOperationOpen,
    onOpen: onOperationOpen,
    onClose: onOperationClose,
  } = useDisclosure();

  const [search, setSearch] = useState("");
  const [metadata, setMetadata] = useState({});

  const dispatch = useDispatch();
  const getListPendaftarState = useSelector((state) => state.getListPendaftar);
  const deletePendaftarState = useSelector((state) => state.deletePendaftar);

  useEffect(() => {
    dispatch(getListPendaftar({ token: user.token }));
  }, [dispatch]);

  useEffect(() => {
    if (deletePendaftarState.status === "error") {
      setToast({ message: deletePendaftarState.data.message, type: "error" });
      dispatch(deletePendaftar({ action: "reset" }));
    } else if (deletePendaftarState.status === "loaded") {
      setToast({ message: deletePendaftarState.data.message, type: "success" });
      dispatch(deletePendaftar({ action: "reset" }));
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [deletePendaftarState.status, setToast]);

  const filteredPendaftar = useMemo(() => {
    if (
      getListPendaftarState.data.data &&
      getListPendaftarState.data.data.length > 0
    ) {
      return getListPendaftarState.data.data.filter(
        (user) =>
          user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.nationalIdNumber.toLowerCase().includes(search.toLowerCase())
      );
    }
    return [];
  }, [search, getListPendaftarState.data.data]);

  const handleOperation = () => {
    if (!metadata.id) {
      setToast({ message: "Pilih data yang ingin di hapus", type: "error" });
    } else {
      dispatch(deletePendaftar({ token: user.token, data: { metadata } }));
    }
  };

  return (
    <Box>
      {getListPendaftarState.status === "loaded" ? (
        <>
          <Flex w={"100%"} mb={10}>
            <Flex
              w={"50%"}
              justifyItems={"start"}
              justifyContent={"start"}
              flexDir={"column"}
            >
              <Text fontSize={"xl"} fontWeight={"bold"} mb={3}>
                eDaftar Calon Mahasiswa
              </Text>
              <Text fontSize={"l"} fontWeight={"500"} color={"gray"}>
                Daftar Calon Mahasiswa yang sudah mendaftar di eDaftar PNJ
              </Text>
            </Flex>
          </Flex>

          <TablePaginate
            id="master-user"
            customHead={true}
            totalHead={8}
            tableStatus={getListPendaftarState.status}
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
                  NIK
                </Th>
                <Th textAlign={"center"} className="th">
                  NAMA
                </Th>
                <Th textAlign={"center"} className="th">
                  EMAIL
                </Th>
                <Th textAlign={"center"} className="th">
                  NO. HP
                </Th>
                <Th textAlign={"center"} className="th">
                  JENIS KELAMIN
                </Th>
                <Th textAlign={"center"} className="th">
                  TANGGAL PENDAFTARAN
                </Th>
                <Th textAlign={"center"} className="th">
                  TOTAL NILAI
                </Th>
                <Th textAlign={"center"} className="th">
                  STATUS
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
            tableItem={filteredPendaftar.map((fi, i) => (
              <Tr key={i}>
                <Td textAlign={"center"} className="td">
                  {i + 1}
                </Td>
                <Td className="td" textAlign="center" color={"blue.500"} _hover={{ textDecoration: "underline" }}>
                  <Link to={`/list-pendaftar/${fi.nationalIdNumber}`}>
                    {fi.nationalIdNumber}
                  </Link>
                </Td>
                <Td className="td">{fi.fullName}</Td>
                <Td className="td">{fi.email}</Td>
                <Td className="td">{fi.phoneNumber}</Td>
                <Td className="td">{fi.gender}</Td>
                <Td className="td">{formatDate(fi.createdAt)}</Td>
                <Td className="td" textAlign={"right"}>
                  {formatNumber(fi.totalNilai)}
                </Td>
                <Td className="td" textAlign={"center"}>
                  <CustomTag
                    color={
                      fi.status === "DRAFT"
                        ? "blue"
                        : fi.status === "SELESAI"
                        ? "green"
                        : "red"
                    }
                    text={fi.status}
                  />
                </Td>

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
                      colorScheme="red"
                      icon={<FiTrash />}
                      onClick={() => {
                        setMetadata(fi);
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
            title={`HAPUS PENDAFTAR`}
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
                  isLoading={deletePendaftarState.status !== "idle"}
                >
                  Tidak
                </Button>
                <Button
                  onClick={handleOperation}
                  colorScheme={"red"}
                  isLoading={deletePendaftarState.status !== "idle"}
                >
                  Ya
                </Button>
              </>
            }
          >
            <Text
              fontSize={"md"}
              lineHeight={"1.5"}
              textAlign={"center"}
              mb={3}
            >
              Apakah anda yakin ingin menghapus data Calon Mahasiswa ini?
              Setelah penghapusan data tidak dapat dikembalikan
            </Text>
            <Stack>
              <FormControl
                display={"flex"}
                w={"full"}
                alignItems={"center"}
                isRequired
                mb={3}
                zIndex={100}
              >
                <Flex w={"100%"}>
                  <FormLabel w={"40%"}>
                    Nomor Induk Kependudukan (NIK)
                  </FormLabel>
                  <Input
                    w={"60%"}
                    type="text"
                    value={
                      metadata.nationalIdNumber ? metadata.nationalIdNumber : ""
                    }
                    isDisabled
                  />
                </Flex>
              </FormControl>
              <FormControl
                display={"flex"}
                w={"full"}
                alignItems={"center"}
                isRequired
                mb={3}
                zIndex={100}
              >
                <Flex w={"100%"}>
                  <FormLabel w={"40%"}>Nama Mahasiswa</FormLabel>
                  <Input
                    w={"60%"}
                    type="text"
                    value={metadata.fullName ? metadata.fullName : ""}
                    isDisabled
                  />
                </Flex>
              </FormControl>
              <FormControl
                display={"flex"}
                w={"full"}
                alignItems={"center"}
                isRequired
                mb={3}
                zIndex={100}
              >
                <Flex w={"100%"}>
                  <FormLabel w={"40%"}>Email Mahasiswa</FormLabel>
                  <Input
                    w={"60%"}
                    type="text"
                    value={metadata.email ? metadata.email : ""}
                    isDisabled
                  />
                </Flex>
              </FormControl>
              <FormControl
                display={"flex"}
                w={"full"}
                alignItems={"center"}
                isRequired
                mb={3}
                zIndex={100}
              >
                <Flex w={"100%"}>
                  <FormLabel w={"40%"}>Jenis Kelamin Mahasiswa</FormLabel>
                  <Input
                    w={"60%"}
                    type="text"
                    value={metadata.gender ? metadata.gender : ""}
                    isDisabled
                  />
                </Flex>
              </FormControl>
              <FormControl
                display={"flex"}
                w={"full"}
                alignItems={"center"}
                isRequired
                mb={3}
                zIndex={100}
              >
                <Flex w={"100%"}>
                  <FormLabel w={"40%"}>Total Rata-rata Nilai</FormLabel>
                  <Input
                    w={"60%"}
                    type="text"
                    value={metadata.totalNilai ? metadata.totalNilai : ""}
                    isDisabled
                  />
                </Flex>
              </FormControl>

              <FormControl
                display={"flex"}
                w={"full"}
                alignItems={"center"}
                isRequired
                mb={3}
                zIndex={100}
              >
                <Flex w={"100%"}>
                  <FormLabel w={"40%"}>Status Pendaftaran</FormLabel>
                  <Input
                    w={"60%"}
                    type="text"
                    value={metadata.status ? metadata.status : ""}
                    isDisabled
                  />
                </Flex>
              </FormControl>
            </Stack>
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

export default DaftarPendaftar;
