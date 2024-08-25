import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaDownload, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDetailPendaftar } from "../../../backend/pendaftaran/getDetailPendaftar";
import { useNavigate } from "react-router-dom";
import { formatDateWithoutTime } from "../../../utils/formatDate";
import { formatNumber } from "../../../utils/formatNumber";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Summary = ({ user, data, isHaveData, isCompleted }) => {
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState({});

  const dispatch = useDispatch();
  const getDetailPendaftarState = useSelector(
    (state) => state.getDetailPendaftar
  );

  useEffect(() => {
    dispatch(
      getDetailPendaftar({
        token: user.token,
        nationalIdNumber: user.nationalIdNumber,
      })
    );
  }, [dispatch]);

  const handleDownloadPDF = () => {
    const input = document.getElementById('summary');
  
    html2canvas(input, { scale: 2 }).then((canvas) => { // Scale for better quality
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
  
      // Calculate the height of the image to fit within A4 dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const pdfHeight = imgHeight * imgWidth / imgWidth;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  
      // Save the PDF
      pdf.save(`${getDetailPendaftarState.data.data.fullName}-eDaftarPNJ.pdf`);
    });
  };

  useEffect(() => {
    if (getDetailPendaftarState.status === "loaded") {
      if (getDetailPendaftarState.data.data.id) {
        if (
          getDetailPendaftarState.data.data.PendaftarRekapNilaiMap.length > 0
        ) {
          navigate("/pendaftaran/summary");
        } else {
          navigate("/pendaftaran/rekap-nilai");
        }
      } else {
        navigate("/pendaftaran/biodata-diri");
      }
    }
  }, [getDetailPendaftarState.status]);

  const handleOperation = () => {};
  return (
    <Box>
      {getDetailPendaftarState.status === "loaded" ? (
        <>
          <Stack id="summary">
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Nomor Induk Kependudukan (NIK)
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.nationalIdNumber || ""
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Nama Lengkap Sesuai Ijazah{" "}
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={getDetailPendaftarState.data.data.fullName || ""}
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Jenis Kelamin{" "}
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <RadioGroup value={getDetailPendaftarState.data.data.gender}>
                  <Stack direction="row" gap={2}>
                    <Radio value="Pria" isReadOnly>
                      Pria
                    </Radio>
                    <Radio value="Wanita" isReadOnly>
                      Wanita
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Agama
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.MasterReligion.name || ""
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Status
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <RadioGroup
                  value={getDetailPendaftarState.data.data.maritalStatus}
                >
                  <Stack direction="row" gap={2}>
                    <Radio value="Belum Menikah">Belum Menikah</Radio>
                    <Radio value="Menikah">Menikah</Radio>
                    <Radio value="Lain-lain">Lain-lain (Janda/Duda)</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Kewarganegaraan
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <RadioGroup
                  value={getDetailPendaftarState.data.data.citizenship}
                >
                  <Stack direction="row" gap={2}>
                    <Radio value="WNI Asli">WNI Asli</Radio>
                    <Radio value="WNI Keturunan">WNI Keturunan</Radio>
                    <Radio value="WNA">WNA</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
            </FormControl>
            <FormControl
              w={"100%"}
              display={
                getDetailPendaftarState.data.data.isForeigner === true
                  ? "flex"
                  : "none"
              }
              mb={1}
            >
              <FormLabel w={"30%"} alignContent={"center"}>
                Negara Kewarganegaraan
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={getDetailPendaftarState.data.data.foreignCountry || ""}
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>

            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Tempat dan Tanggal Lahir
            </Text>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Negara Kelahiran
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <RadioGroup
                  value={
                    getDetailPendaftarState.data.data.bornAbroad === true
                      ? "Luar Negeri"
                      : "Indonesia"
                  }
                >
                  <Stack direction="row" gap={2}>
                    <Radio value="Indonesia">Indonesia</Radio>
                    <Radio value="Luar Negeri">Luar Negeri</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Tempat Lahir Sesuai Ijazah
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={getDetailPendaftarState.data.data.placeOfBirth || ""}
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl
              w={"100%"}
              display={
                getDetailPendaftarState.data.data.bornAbroad === true
                  ? "flex"
                  : "none"
              }
              mb={1}
            >
              <FormLabel w={"30%"} alignContent={"center"}>
                Negara Tempat Lahir
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={getDetailPendaftarState.data.data.birthCountry || ""}
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <Stack
              direction="column"
              display={
                getDetailPendaftarState.data.data.bornAbroad === false
                  ? "flex"
                  : "none"
              }
              mt={1}
            >
              <FormControl w={"100%"} display={"flex"} mb={1}>
                <FormLabel w={"30%"} alignContent={"center"}>
                  Propinsi Kelahiran
                </FormLabel>
                <Flex w={"70%"} direction={"column"}>
                  <Input
                    w={"100%"}
                    value={
                      getDetailPendaftarState.data.data.birthProvinceName || ""
                    }
                    isReadOnly
                    bg={"gray.200"}
                    cursor={"not-allowed"}
                  />
                </Flex>
              </FormControl>
              <FormControl w={"100%"} display={"flex"} mb={1}>
                <FormLabel w={"30%"} alignContent={"center"}>
                  Kabupaten atau Kota Kelahiran
                </FormLabel>
                <Flex w={"70%"} direction={"column"}>
                  <Input
                    w={"100%"}
                    value={
                      getDetailPendaftarState.data.data.birthCityName || ""
                    }
                    isReadOnly
                    bg={"gray.200"}
                    cursor={"not-allowed"}
                  />
                </Flex>
              </FormControl>
            </Stack>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Tanggal lahir
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={formatDateWithoutTime(
                    getDetailPendaftarState.data.data.dateOfBirth
                  )}
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>

            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Alamat dan Domisili
            </Text>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Alamat KTP
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Textarea
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.idCardAddress
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Alamat Domisili
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Textarea
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.currentAddress
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Propinsi Domisili
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.provinceNameAddress
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Kabupaten atau Kota Domisili
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.cityNameAddress
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Kecamatan Domisili
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.districtNameAddress
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Kontak
            </Text>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Nomor Telepon
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.telephoneNumber
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Nomor HP
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.phoneNumber
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Email
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  value={
                    getDetailPendaftarState.data.data.email || ""
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <Divider borderWidth={"1px"} color={"gray.500"} mt={5} mb={3} />
            <Text fontSize={"xl"} fontWeight={"500"} color={"gray"} mb={3}>
              Rekap Nilai
            </Text>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
                Matematika
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  textAlign={"right"}
                  value={
                    formatNumber(getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].matematika || "")
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
              Bahasa Inggris
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  textAlign={"right"}
                  value={
                    formatNumber(getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].bahasaInggris || "")
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
              Bahasa Indonesia
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  textAlign={"right"}
                  value={
                    formatNumber(getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].bahasaIndonesia || "")
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
              Ilmu Pengetahuan Alam
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  textAlign={"right"}
                  value={
                    formatNumber(getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].ipa || "")
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
              Ilmu Pengetahuan Sosial
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  textAlign={"right"}
                  value={
                    formatNumber(getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].ips || "")
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
                />
              </Flex>
            </FormControl>
            <FormControl w={"100%"} display={"flex"} mb={1}>
              <FormLabel w={"30%"} alignContent={"center"}>
              Agama
              </FormLabel>
              <Flex w={"70%"} direction={"column"}>
                <Input
                  w={"100%"}
                  textAlign={"right"}
                  value={
                    formatNumber(getDetailPendaftarState.data.data.PendaftarRekapNilaiMap[0].agama || "")
                  }
                  isReadOnly
                  bg={"gray.200"}
                  cursor={"not-allowed"}
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
              leftIcon={<FaDownload />}
              colorScheme="teal"
              onClick={handleDownloadPDF}
            >
              Unduh
            </Button>
          </Box>
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

export default Summary;
