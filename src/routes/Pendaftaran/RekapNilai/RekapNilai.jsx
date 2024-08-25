import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaQuestionCircle, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDetailPendaftar } from "../../../backend/pendaftaran/getDetailPendaftar";
import { useNavigate } from "react-router-dom";
import { ModalComponent, useToastHook } from "../../../components";
import { createRekapNilai } from "../../../backend/pendaftaran/createRekapNilai";

const RekapNilai = ({ user, data, isHaveData, isCompleted }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useToastHook();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();
  const [metadata, setMetadata] = useState({});

  const dispatch = useDispatch();
  const getDetailPendaftarState = useSelector(
    (state) => state.getDetailPendaftar
  );
  const createRekapNilaiState = useSelector((state) => state.createRekapNilai);

  useEffect(() => {
    dispatch(
      getDetailPendaftar({
        token: user.token,
        nationalIdNumber: user.nationalIdNumber,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (createRekapNilaiState.status === "error") {
      setToast({ message: createRekapNilaiState.data.message, type: "error" });
      dispatch(createRekapNilai({ action: "reset" }));
    } else if (createRekapNilaiState.status === "loaded") {
      setToast({
        message: createRekapNilaiState.data.message,
        type: "success",
      });
      dispatch(createRekapNilai({ action: "reset" }));
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [createRekapNilaiState.status, setToast]);

  useEffect(() => {
    if (getDetailPendaftarState.status === "loaded") {
      if (getDetailPendaftarState.data.data.id) {
        if (
          getDetailPendaftarState.data.data.PendaftarRekapNilaiMap.length > 0
        ) {
          navigate("/pendaftaran/summary");
        } else {
          setMetadata({
            pendaftarId: getDetailPendaftarState.data.data.id,
          });
          navigate("/pendaftaran/rekap-nilai");
        }
      } else {
        navigate("/pendaftaran/biodata-diri");
      }
    }
  }, [getDetailPendaftarState.status]);

  const handleOperation = () => {
    if (
      !metadata.matematika ||
      !metadata.bahasaInggris ||
      !metadata.bahasaIndonesia ||
      !metadata.ipa ||
      !metadata.ips ||
      !metadata.agama
    ) {
      setToast({
        type: "warning",
        message: "Mohon isi semua form",
      });
    } else {
      

      dispatch(createRekapNilai({ token: user.token, data: {metadata} }));
    }
  };
  return (
    <Box>
      <Stack>
        <FormControl w={"100%"} display={"flex"} isRequired>
          <FormLabel w={"30%"} alignContent={"center"}>
            Matematika
          </FormLabel>
          <Flex w={"70%"} direction={"column"}>
            <Input
              w={"100%"}
              type="number"
              textAlign={"right"}
              inputMode="numeric"
              placeholder="0"
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  matematika: parseFloat(e.target.value),
                });
              }}
              value={metadata.matematika ? metadata.matematika : ""}
              onKeyDown={(e) => {
                const allowedKeys = /^[0-9\b.]$/;

                if (
                  !allowedKeys.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Flex>
        </FormControl>
        <FormControl w={"100%"} display={"flex"} isRequired>
          <FormLabel w={"30%"} alignContent={"center"}>
            Bahasa Inggris
          </FormLabel>
          <Flex w={"70%"} direction={"column"}>
            <Input
              w={"100%"}
              type="number"
              textAlign={"right"}
              inputMode="numeric"
              placeholder="0"
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  bahasaInggris: parseFloat(e.target.value),
                });
              }}
              value={metadata.bahasaInggris ? metadata.bahasaInggris : ""}
              onKeyDown={(e) => {
                const allowedKeys = /^[0-9\b.]$/;

                if (
                  !allowedKeys.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Flex>
        </FormControl>
        <FormControl w={"100%"} display={"flex"} isRequired>
          <FormLabel w={"30%"} alignContent={"center"}>
            Bahasa Indonesia
          </FormLabel>
          <Flex w={"70%"} direction={"column"}>
            <Input
              w={"100%"}
              type="number"
              textAlign={"right"}
              inputMode="numeric"
              placeholder="0"
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  bahasaIndonesia:parseFloat(e.target.value),
                });
              }}
              value={metadata.bahasaIndonesia ? metadata.bahasaIndonesia : ""}
              onKeyDown={(e) => {
                const allowedKeys = /^[0-9\b.]$/;

                if (
                  !allowedKeys.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Flex>
        </FormControl>
        <FormControl w={"100%"} display={"flex"} isRequired>
          <FormLabel w={"30%"} alignContent={"center"}>
            Ilmu Pengetahuan Alam
          </FormLabel>
          <Flex w={"70%"} direction={"column"}>
            <Input
              w={"100%"}
              type="number"
              textAlign={"right"}
              inputMode="numeric"
              placeholder="0"
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  ipa: parseFloat(e.target.value),
                });
              }}
              value={metadata.ipa ? metadata.ipa : ""}
              onKeyDown={(e) => {
                const allowedKeys = /^[0-9\b.]$/;

                if (
                  !allowedKeys.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Flex>
        </FormControl>
        <FormControl w={"100%"} display={"flex"} isRequired>
          <FormLabel w={"30%"} alignContent={"center"}>
            Ilmu Pengetahuan Sosial
          </FormLabel>
          <Flex w={"70%"} direction={"column"}>
            <Input
              w={"100%"}
              type="number"
              textAlign={"right"}
              inputMode="numeric"
              placeholder="0"
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  ips: parseFloat(e.target.value),
                });
              }}
              value={metadata.ips ? metadata.ips : ""}
              onKeyDown={(e) => {
                const allowedKeys = /^[0-9\b.]$/;

                if (
                  !allowedKeys.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Flex>
        </FormControl>
        <FormControl w={"100%"} display={"flex"} isRequired>
          <FormLabel w={"30%"} alignContent={"center"}>
            Pendidikan Agama
          </FormLabel>
          <Flex w={"70%"} direction={"column"}>
            <Input
              w={"100%"}
              type="number"
              textAlign={"right"}
              inputMode="numeric"
              placeholder="0"
              onChange={(e) => {
                setMetadata({
                  ...metadata,
                  agama: parseFloat(e.target.value),
                });
              }}
              value={metadata.agama ? metadata.agama : ""}
              onKeyDown={(e) => {
                const allowedKeys = /^[0-9\b.]$/;

                if (
                  !allowedKeys.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Flex>
        </FormControl>
      </Stack>
      <Box
        mt={9}
        mb={5}
        display={"flex"}
        w={"100%"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        alignContent={"center"}
      >
        <Button
          leftIcon={<FaSave />}
          colorScheme="twitter"
          onClick={() => {
            if (
              !metadata.matematika ||
              !metadata.bahasaInggris ||
              !metadata.bahasaIndonesia ||
              !metadata.ipa ||
              !metadata.ips ||
              !metadata.agama
            ) {
              setToast({
                type: "warning",
                message: "Mohon isi semua form",
              });
              return;
            } else{
              onConfirmationOpen();
            }
          }}
          isLoading={createRekapNilaiState.status !== "idle"}
        >
          Simpan Nilai
        </Button>
      </Box>
      <ModalComponent
        size="xl"
        title={"KONFIRMASI"}
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        footer={
          <>
            <Button
              onClick={onConfirmationClose}
              colorScheme={"gray"}
              mr={3}
              isLoading={createRekapNilaiState.status !== "idle"}
            >
              Tidak
            </Button>
            <Button
              onClick={handleOperation}
              colorScheme={"twitter"}
              isLoading={createRekapNilaiState.status !== "idle"}
            >
              ya
            </Button>
          </>
        }
      >
        <Flex w={"full"} justifyContent={"center"} alignItems={"center"} mb={5}>
          <FaQuestionCircle size={100} color="orange" />
        </Flex>

        <Text fontSize={"md"} lineHeight={"1.5"} textAlign={"center"} mb={3}fontWeight={"bold"}>
          Apakah anda yakin akan menyimpan data rekap nilai?
        </Text>
        <Text fontSize={"md"} lineHeight={"1.5"} textAlign={"center"} mb={3}>
          Segala bentuk perubahan data rekap nilai tidak akan dapat dilakukan
          setelah anda menyetujui penyimpanan data.
        </Text>
      </ModalComponent>
    </Box>
  );
};

export default RekapNilai;
