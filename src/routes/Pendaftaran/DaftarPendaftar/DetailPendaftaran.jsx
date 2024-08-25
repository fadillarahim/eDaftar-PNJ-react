import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailPendaftar } from "../../../backend/pendaftaran/getDetailPendaftar";
import { getPropinsi } from "../../../backend/pendaftaran/getPropinsi";
import { getKabupatenKota } from "../../../backend/pendaftaran/getKabupatenKota";
import { getKecamatan } from "../../../backend/pendaftaran/getKecamatan";
import { getAgama } from "../../../backend/pendaftaran/getAgama";
import { updatePendaftar } from "../../../backend/pendaftaran/updatePendaftar";
import { Select as SearchSelect } from "chakra-react-select";
import PhoneInput from "react-phone-number-input";
import { FaQuestionCircle, FaSave } from "react-icons/fa";
import { ModalComponent, useToastHook } from "../../../components";

const DetailPendaftaran = ({ user }) => {
  const navigate = useNavigate();
  const { nationalIdNumber } = useParams();
  const [toast, setToast] = useToastHook();

  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();
  const [metadata, setMetadata] = useState({});
  const [nikError, setNikError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [telephoneError, setTelephoneError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [tanggalLahirError, setTanggalLahirError] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [kewarganegaraan, setKewarganegaraan] = useState("");
  const [statusMenikah, setStatusMenikah] = useState("");
  const [negaraKelahiran, setNegaraKelahiran] = useState("");
  const [currentRegionOperation, setCurrentRegionOperation] = useState("");
  const [listPropinsiKelahiran, setListPropinsiKelahiran] = useState([]);
  const [listKabupatenKotaKelahiran, setListKabupatenKotaKelahiran] = useState(
    []
  );
  const [listPropinsiAlamat, setListPropinsiAlamat] = useState([]);
  const [listKabupatenKotaAlamat, setListKabupatenKotaAlamat] = useState([]);
  const [listKecamatanAlamat, setListKecamatanAlamat] = useState([]);

  const dispatch = useDispatch();
  const getDetailPendaftarState = useSelector(
    (state) => state.getDetailPendaftar
  );
  const getPropinsiState = useSelector((state) => state.getPropinsi);
  const getKabupatenKotaState = useSelector((state) => state.getKabupatenKota);
  const getKecamatanState = useSelector((state) => state.getKecamatan);
  const getAgamaState = useSelector((state) => state.getAgama);
  const updatePendaftarState = useSelector(
    (state) => state.updatePendaftar
  );

  useEffect(() => {
    dispatch(
      getDetailPendaftar({
        token: user.token,
        nationalIdNumber: nationalIdNumber,
      })
    );
    dispatch(getPropinsi({ token: user.token }));
    dispatch(getAgama({ token: user.token }));
  }, [dispatch]);

  useEffect(() => {
    if (getDetailPendaftarState.status === "loaded") {
      setJenisKelamin(getDetailPendaftarState.data.data.gender);
      setStatusMenikah(getDetailPendaftarState.data.data.maritalStatus);
      setKewarganegaraan(getDetailPendaftarState.data.data.citizenship);
      setNegaraKelahiran(
        getDetailPendaftarState.data.data.bornAbroad === true
          ? "Luar Negeri"
          : "Indonesia"
      );
      if (getDetailPendaftarState.data.data.PendaftarRekapNilaiMap.length > 0) {
        setMetadata({
          ...getDetailPendaftarState.data.data,
          matematika:
            getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0]
              .matematika,
          bahasaInggris:
            getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0]
              .bahasaInggris,
          bahasaIndonesia:
            getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0]
              .bahasaIndonesia,
          ipa: getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].ipa,
          ips: getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].ips,
          agama:
            getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].agama,
        });
      } else {
        setMetadata(getDetailPendaftarState.data.data);
      }
    }
  }, [getDetailPendaftarState.status]);

  useEffect(() => {
    if (getKabupatenKotaState.status === "loaded") {
      if (currentRegionOperation === "kelahiran") {
        setListKabupatenKotaKelahiran([...getKabupatenKotaState.data.data]);
      } else if (currentRegionOperation === "alamat") {
        setListKabupatenKotaAlamat([...getKabupatenKotaState.data.data]);
      }
    }
  }, [getKabupatenKotaState.status]);

  useEffect(() => {
    if (updatePendaftarState.status === "error") {
      setToast({ message: updatePendaftarState.data.message, type: "error" });
      dispatch(updatePendaftar({ action: "reset" }));
    } else if (updatePendaftarState.status === "loaded") {
      setToast({
        message: updatePendaftarState.data.message,
        type: "success",
      });
      dispatch(updatePendaftar({ action: "reset" }));
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [updatePendaftarState.status, setToast]);

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

  const isFormInvalid =
    !metadata.nationalIdNumber ||
    nikError !== "" ||
    !metadata.fullName ||
    !metadata.gender ||
    !metadata.religionId ||
    !metadata.maritalStatus ||
    !metadata.citizenship ||
    (metadata.isForeigner &&
      (!metadata.foreignCountry || metadata.foreignCountry === "")) ||
    (metadata.bornAbroad &&
      (!metadata.birthCountry || metadata.birthCountry === "")) ||
    (!metadata.bornAbroad &&
      (!metadata.birthProvinceId ||
        metadata.birthProvinceId === "" ||
        !metadata.birthCityId ||
        metadata.birthCityId === "")) ||
    !metadata.dateOfBirth ||
    tanggalLahirError !== "" ||
    !metadata.idCardAddress ||
    !metadata.currentAddress ||
    !metadata.provinceIdAddress ||
    metadata.provinceIdAddress === "" ||
    !metadata.cityIdAddress ||
    metadata.cityIdAddress === "" ||
    !metadata.districtIdAddress ||
    metadata.districtIdAddress === "" ||
    !metadata.telephoneNumber ||
    telephoneError !== "" ||
    !metadata.phoneNumber ||
    phoneError !== "" ||
    !metadata.email ||
    emailError !== "" ||
    !metadata.matematika ||
    !metadata.bahasaInggris ||
    !metadata.bahasaIndonesia ||
    !metadata.ipa ||
    !metadata.ips ||
    !metadata.agama;
  const handleCheckData = () => {
    if (isFormInvalid) {
      setToast({
        message: "Mohon isi semua form dengan benar",
        type: "warning",
      });
    } else {
      onConfirmationOpen();
    }
  };

  const handleOperation = () => {
    dispatch(updatePendaftar({ token: user.token, data: { metadata } }));
  }

  return (
    <Box>
      {getDetailPendaftarState.status === "loaded" &&
      getPropinsiState.status === "loaded" &&
      getAgamaState.status === "loaded" ? (
        <>
          <Flex w={"100%"} mb={10}>
            <Flex
              w={"50%"}
              justifyItems={"start"}
              justifyContent={"start"}
              flexDir={"column"}
            >
              <Text fontSize={"xl"} fontWeight={"bold"} mb={3}>
                {getDetailPendaftarState.data.data.fullName}
              </Text>
              <Text fontSize={"l"} fontWeight={"500"} color={"gray"}>
                Detail Data Pendaftaran
              </Text>
            </Flex>
          </Flex>
          <Stack id="detail">
            <FormControl w={"100%"} display={"flex"} isInvalid={nikError}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Nomor Induk Kependudukan (NIK)
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                {/* <Input
                  key={"nik"}
                  w={"100%"}
                  type="text"
                  placeholder="Masukkan Nomor NIK Sesuai Ijazah"
                  value={metadata.nationalIdNumber || ""}
                  onChange={(e) => {
                    if (e.target.value.length > 16) {
                      setNikError("NIK tidak boleh lebih dari 16 digit.");
                    } else if (e.target.value.length < 16) {
                      setMetadata({
                        ...metadata,
                        nationalIdNumber: e.target.value,
                      });
                      setNikError("NIK harus terdiri dari 16 digit.");
                    } else {
                      setNikError("");
                      setMetadata({
                        ...metadata,
                        nationalIdNumber: e.target.value,
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    const allowedKeys = /^[0-9]$/;
                    const value = e.target.value;
                    const isMaxLength = value.length >= 16;

                    if (
                      !allowedKeys.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete"
                    ) {
                      e.preventDefault();
                    }

                    if (
                      isMaxLength &&
                      !["Backspace", "Delete"].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  
                /> */}
                 <Input
                  w={"100%"}
                  value={
                    metadata.nationalIdNumber || ""
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />

                {nikError && <FormErrorMessage>{nikError}</FormErrorMessage>}
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Nama Lengkap Sesuai Ijazah
              </FormLabel>
              <Input
                w={"70%"}
                type="text"
                placeholder="Masukkan Nama Lengkap Sesuai Ijazah"
                onChange={(e) => {
                  setMetadata({ ...metadata, fullName: e.target.value });
                }}
                value={metadata.fullName || ""}
                defaultValue={metadata.fullName || ""}
                onKeyDown={(e) => {
                  const allowedKeys = /^[a-zA-Z\s.,]*$/; // Hanya mengizinkan huruf, spasi, koma, dan titik
                  if (!allowedKeys.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Jenis Kelamin
              </FormLabel>

              <RadioGroup
                onChange={(e) => {
                  setJenisKelamin(e);
                  setMetadata({
                    ...metadata,
                    gender: e,
                  });
                }}
                value={jenisKelamin}
              >
                <Stack direction="row" gap={2}>
                  <Radio value="Pria">Pria</Radio>
                  <Radio value="Wanita">Wanita</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Agama
              </FormLabel>
              <SearchSelect
                placeholder="Pilih Agama Sesuai Ijazah"
                options={getAgamaState.data.data.map((rl) => ({
                  label: rl.name,
                  value: rl.id,
                }))}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    religionId: e.value,
                  })
                }
                defaultValue={{
                  label: metadata.MasterReligion?.name,
                  value: metadata.religionId,
                }}
                chakraStyles={{
                  container: (provided, state) => ({
                    ...provided,
                    w: "70%",
                  }),
                }}
              />
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Status
              </FormLabel>

              <RadioGroup
                onChange={(e) => {
                  setStatusMenikah(e);
                  setMetadata({
                    ...metadata,
                    maritalStatus: e,
                  });
                }}
                value={statusMenikah}
              >
                <Stack direction="row" gap={2}>
                  <Radio value="Belum Menikah">Belum Menikah</Radio>
                  <Radio value="Menikah">Menikah</Radio>
                  <Radio value="Lain-lain">Lain-lain (Janda/Duda)</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Kewarganegaraan
              </FormLabel>

              <RadioGroup
                onChange={(e) => {
                  setKewarganegaraan(e);
                  console.log(e);
                  setMetadata({
                    ...metadata,
                    citizenship: e,
                    isForeigner: e === "WNA" ? true : false,
                    foreignCountry: "",
                  });
                }}
                value={kewarganegaraan}
              >
                <Stack direction="row" gap={2}>
                  <Radio value="WNI Asli">WNI Asli</Radio>
                  <Radio value="WNI Keturunan">WNI Keturunan</Radio>
                  <Radio value="WNA">WNA</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl
              w={"100%"}
              display={kewarganegaraan === "WNA" ? "flex" : "none"}
              isRequired
              mt={1}
            >
              <FormLabel w={"30%"} alignContent={"center"}>
                Negara Kewarganegaraan
              </FormLabel>
              <Input
                w={"70%"}
                type="text"
                placeholder="Negara Kewargaranegaraan"
                value={metadata.foreignCountry ? metadata.foreignCountry : ""}
                onChange={(e) => {
                  setMetadata({
                    ...metadata,
                    foreignCountry: e.target.value,
                  });
                }}
              />
            </FormControl>

            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Tempat dan Tanggal Lahir
            </Text>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Negara Kelahiran
              </FormLabel>
              <RadioGroup
                onChange={(e) => {
                  setNegaraKelahiran(e);
                  setMetadata({
                    ...metadata,
                    birthCountry: "",
                    bornAbroad: e === "Luar Negeri" ? true : false,
                  });
                }}
                value={negaraKelahiran}
              >
                <Stack direction="row" gap={2}>
                  <Radio value="Indonesia">Indonesia</Radio>
                  <Radio value="Luar Negeri">Luar Negeri</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Tempat Lahir Sesuai Ijazah
              </FormLabel>
              <Input
                w={"70%"}
                type="text"
                placeholder="Masukkan Tempat Lahir Sesuai Ijazah"
                onChange={(e) => {
                  setMetadata({ ...metadata, placeOfBirth: e.target.value });
                }}
                value={metadata.placeOfBirth ? metadata.placeOfBirth : ""}
              />
            </FormControl>
            <FormControl
              w={"100%"}
              display={negaraKelahiran === "Luar Negeri" ? "flex" : "none"}
              isRequired
              mt={1}
            >
              <FormLabel w={"30%"} alignContent={"center"}>
                Negara Tempat Lahir
              </FormLabel>
              <Input
                w={"70%"}
                type="text"
                placeholder="Negara Tempat Lahir jika diluar Indonesia"
                onChange={(e) => {
                  setMetadata({ ...metadata, birthCountry: e.target.value });
                }}
                value={metadata.birthCountry ? metadata.birthCountry : ""}
              />
            </FormControl>
            <Stack
              direction="column"
              display={negaraKelahiran === "Indonesia" ? "flex" : "none"}
              mt={1}
            >
              <FormControl w={"100%"} display={"flex"} isRequired>
                <FormLabel w={"30%"} alignContent={"center"}>
                  Propinsi Kelahiran
                </FormLabel>
                <SearchSelect
                  placeholder="Pilih Propinsi Kelahiran"
                  options={getPropinsiState.data.data.map((rl) => ({
                    label: rl.name,
                    value: rl.id,
                  }))}
                  onChange={(e) => {
                    setCurrentRegionOperation("kelahiran");
                    dispatch(
                      getKabupatenKota({
                        token: user.token,
                        province_id: e.value,
                      })
                    );
                    setMetadata({
                      ...metadata,
                      birthProvinceId: e.value,
                      birthProvinceName: e.label,
                      birthCityId: "",
                      birthCityName: "",
                    });
                  }}
                  value={{
                    label: metadata.birthProvinceName
                      ? metadata.birthProvinceName
                      : "",
                    value: metadata.birthProvinceId
                      ? metadata.birthProvinceId
                      : "",
                  }}
                  chakraStyles={{
                    container: (provided, state) => ({
                      ...provided,
                      w: "70%",
                    }),
                  }}
                />
              </FormControl>
              <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
                <FormLabel w={"30%"} alignContent={"center"}>
                  Kabupaten atau Kota Kelahiran
                </FormLabel>
                <SearchSelect
                  placeholder="Pilih Kabupaten atau Kota Kelahiran"
                  options={
                    getKabupatenKotaState.status === "loaded" &&
                    listKabupatenKotaKelahiran.length > 0
                      ? listKabupatenKotaKelahiran.map((rl) => ({
                          label: rl.name,
                          value: rl.id,
                        }))
                      : []
                  }
                  onChange={(e) => {
                    setMetadata({
                      ...metadata,
                      birthCityId: e.value,
                      birthCityName: e.label,
                    });
                  }}
                  value={
                    metadata.birthCityName && metadata.birthCityId !== ""
                      ? {
                          label: metadata.birthCityName
                            ? metadata.birthCityName
                            : "",
                          value: metadata.birthCityId
                            ? metadata.birthCityId
                            : "",
                        }
                      : []
                  }
                  chakraStyles={{
                    container: (provided, state) => ({
                      ...provided,
                      w: "70%",
                    }),
                  }}
                />
              </FormControl>
            </Stack>
            <FormControl
              w={"100%"}
              display={"flex"}
              isRequired
              mt={1}
              isInvalid={tanggalLahirError}
            >
              <FormLabel w={"30%"} alignContent={"center"}>
                Tanggal Lahir
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  type="date"
                  placeholder="Masukkan Tanggal Lahir Sesuai Ijazah"
                  onChange={(e) => {
                    const currentYear = new Date().getFullYear();
                    const birthYear = new Date(e.target.value).getFullYear();
                    // Menghitung umur
                    if (currentYear - birthYear < 17) {
                      setTanggalLahirError("Umur minimal 17 tahun");
                    } else {
                      setTanggalLahirError("");
                      setMetadata({
                        ...metadata,
                        dateOfBirth: e.target.value,
                      });
                    }
                  }}
                  value={
                    metadata.dateOfBirth
                      ? (metadata.dateOfBirth || "").slice(0, 10)
                      : ""
                  }
                />
                {tanggalLahirError && (
                  <FormErrorMessage>{tanggalLahirError}</FormErrorMessage>
                )}
              </Flex>
            </FormControl>

            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Alamat dan Domisili
            </Text>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Alamat KTP
              </FormLabel>
              <Textarea
                w={"70%"}
                type="text"
                placeholder="Alamat sesuai KTP atau kertu identitas lainnya"
                onChange={(e) => {
                  setMetadata({ ...metadata, idCardAddress: e.target.value });
                }}
                value={metadata.idCardAddress}
              />
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Alamat Domisili
              </FormLabel>
              <Textarea
                w={"70%"}
                type="text"
                placeholder="Alamat Domisili Saat Ini"
                onChange={(e) => {
                  setMetadata({
                    ...metadata,
                    currentAddress: e.target.value,
                  });
                }}
                value={metadata.currentAddress}
              />
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Propinsi Domisili
              </FormLabel>
              <SearchSelect
                placeholder="Pilih Propinsi Domisili"
                options={getPropinsiState.data.data.map((rl) => ({
                  label: rl.name,
                  value: rl.id,
                }))}
                onChange={(e) => {
                  setCurrentRegionOperation("alamat");
                  dispatch(
                    getKabupatenKota({
                      token: user.token,
                      province_id: e.value,
                    })
                  );
                  setMetadata({
                    ...metadata,
                    provinceIdAddress: e.value,
                    provinceNameAddress: e.label,
                    cityIdAddress: "",
                    cityNameAddress: "",
                    districtIdAddress: "",
                    districtNameAddress: "",
                  });
                }}
                defaultValue={{
                  label: metadata.provinceNameAddress
                    ? metadata.provinceNameAddress
                    : "",
                  value: metadata.provinceIdAddress
                    ? metadata.provinceIdAddress
                    : "",
                }}
                chakraStyles={{
                  container: (provided, state) => ({
                    ...provided,
                    w: "70%",
                  }),
                }}
              />
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Kabupaten atau Kota Domisili
              </FormLabel>
              <SearchSelect
                placeholder="Pilih Kabupaten atau Kota Domisili"
                options={
                  getKabupatenKotaState.status === "loaded" &&
                  listKabupatenKotaAlamat
                    ? listKabupatenKotaAlamat.map((rl) => ({
                        label: rl.name,
                        value: rl.id,
                      }))
                    : []
                }
                onChange={(e) => {
                  dispatch(
                    getKecamatan({
                      token: user.token,
                      regency_id: e.value,
                    })
                  );
                  setMetadata({
                    ...metadata,
                    cityIdAddress: e.value,
                    cityNameAddress: e.label,
                    districtIdAddress: "",
                    districtNameAddress: "",
                  });
                }}
                value={
                  metadata.cityNameAddress && metadata.cityIdAddress !== ""
                    ? {
                        label: metadata.cityNameAddress
                          ? metadata.cityNameAddress
                          : "",
                        value: metadata.cityIdAddress
                          ? metadata.cityIdAddress
                          : "",
                      }
                    : []
                }
                chakraStyles={{
                  container: (provided, state) => ({
                    ...provided,
                    w: "70%",
                  }),
                }}
              />
            </FormControl>
            <FormControl w={"100%"} display={"flex"} isRequired mt={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Kecamatan Domisili
              </FormLabel>
              <SearchSelect
                placeholder="Pilih Kecamatan Domisili"
                options={
                  getKecamatanState.status === "loaded"
                    ? getKecamatanState.data.data.map((rl) => ({
                        label: rl.name,
                        value: rl.id,
                      }))
                    : []
                }
                onChange={(e) => {
                  setMetadata({
                    ...metadata,
                    districtIdAddress: e.value,
                    districtNameAddress: e.label,
                  });
                }}
                value={
                  metadata.districtNameAddress &&
                  metadata.districtIdAddress !== ""
                    ? {
                        label: metadata.districtNameAddress
                          ? metadata.districtNameAddress
                          : "",
                        value: metadata.districtIdAddress
                          ? metadata.districtIdAddress
                          : "",
                      }
                    : []
                }
                chakraStyles={{
                  container: (provided, state) => ({
                    ...provided,
                    w: "70%",
                  }),
                }}
              />
            </FormControl>
            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Kontak
            </Text>
            <FormControl
              w={"100%"}
              display={"flex"}
              isRequired
              mt={1}
              isInvalid={telephoneError}
            >
              <FormLabel w={"30%"} alignContent={"center"}>
                Nomor Telepon
              </FormLabel>
              <Flex display={"column"} w={"70%"}>
                <Input
                  value={metadata.telephoneNumber || ""}
                  w={"30%"}
                  placeholder="Masukkan Nomor Telepon"
                  type="text"
                  onChange={(e) => {
                    const value = e.target.value;

                    // Batasi panjang input
                    if (value.length < 10) {
                      setTelephoneError(
                        "Nomor telepon harus terdiri dari minimal 10 digit."
                      );
                    } else {
                      setTelephoneError("");
                    }
                    setMetadata({ ...metadata, telephoneNumber: value });
                  }}
                  onKeyDown={(e) => {
                    // Cek apakah key yang ditekan adalah backspace atau angka
                    if (
                      (e.key !== "Backspace" && !/^\d$/.test(e.key)) ||
                      metadata.telephoneNumber.length === 14
                    ) {
                      e.preventDefault();
                    }

                    if (
                      e.key !== "Backspace" &&
                      metadata.telephoneNumber.length >= 13
                    ) {
                      e.preventDefault();
                    }
                  }}
                />

                {telephoneError && (
                  <FormErrorMessage>{telephoneError}</FormErrorMessage>
                )}
              </Flex>
            </FormControl>
            <FormControl
              w={"100%"}
              display={"flex"}
              isRequired
              mt={1}
              isInvalid={phoneError}
            >
              <FormLabel w={"30%"} alignContent={"center"}>
                Nomor HP
              </FormLabel>
              <Flex display={"column"} w={"70%"}>
                <Box
                  border={"1px solid"}
                  borderColor={"gray.300"}
                  borderRadius={"5px"}
                  w={"30%"}
                  px={2}
                  py={1}
                >
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="ID"
                    value={metadata.phoneNumber ? metadata.phoneNumber : ""}
                    onChange={(e) => {
                      console.log(e);
                      if (e && e.length < 12) {
                        setMetadata({ ...metadata, phoneNumber: e });
                        setPhoneError("Inputkan nomor yang valid");
                      } else if (e && e.length >= 13) {
                        setPhoneError("");
                      } else if (e && e.length >= 4 && e[3] === "0") {
                        const e = e.slice(0, 3) + e.slice(4);
                        setMetadata({ ...metadata, phoneNumber: e });
                        setPhoneError("");
                      }
                      // setMetadata({ ...metadata, phoneNumber: e });
                    }}
                    countrySelectProps={{ disabled: true }}
                    style={{
                      border: "none", // Menghilangkan border default
                      outline: "none", // Menghilangkan outline
                      padding: "0.5rem",
                    }}
                    numberInputProps={{
                      border: "none", // Menghilangkan border default
                      outline: "none", // Menghilangkan outline
                      padding: "0.5rem",
                    }}
                    limitMaxLength={13}
                  />
                </Box>
                {phoneError && (
                  <FormErrorMessage>{phoneError}</FormErrorMessage>
                )}
              </Flex>
            </FormControl>
            <FormControl
              display={"flex"}
              alignItems={"center"}
              w={"100%"}
              isRequired
              mb={3}
              mt={1}
              isInvalid={emailError}
            >
              <FormLabel w={"30%"}>Email</FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  onChange={handleEmailChange}
                  type="email"
                  value={metadata.email ? metadata.email.toLowerCase() : ""}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Masukkan Alamat Email"
                />
                {emailError && (
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                )}
              </Flex>
            </FormControl>
            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Rekap Nilai
            </Text>
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
                      bahasaIndonesia: parseFloat(e.target.value),
                    });
                  }}
                  value={
                    metadata.bahasaIndonesia ? metadata.bahasaIndonesia : ""
                  }
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
              onClick={handleCheckData}
            >
              Simpan Perubahan
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
                  isLoading={updatePendaftarState.status !== "idle"}
                  
                >
                  Tidak
                </Button>
                <Button
                  onClick={handleOperation}
                  colorScheme={"twitter"}
                  isLoading={updatePendaftarState.status !== "idle"}
                >
                  ya
                </Button>
              </>
            }
          >
            <Flex
              w={"full"}
              justifyContent={"center"}
              alignItems={"center"}
              mb={5}
            >
              <FaQuestionCircle size={100} color="orange" />
            </Flex>

            <Text
              fontSize={"md"}
              lineHeight={"1.5"}
              textAlign={"center"}
              mb={3}
              fontWeight={"bold"}
            >
              Apakah anda yakin akan menyimpan perubahan yang anda lakukan?
            </Text>
            
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

export default DetailPendaftaran;
