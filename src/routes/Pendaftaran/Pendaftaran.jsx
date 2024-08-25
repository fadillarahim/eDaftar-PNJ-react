import {
  Box,
  Flex,
  Spinner,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BiodataDiri from "./BiodataDiri/BiodataDiri";
import RekapNilai from "./RekapNilai/RekapNilai";
import Summary from "./Summary/Summary";
import { getDetailPendaftar } from "../../backend/pendaftaran/getDetailPendaftar";
import { useDispatch, useSelector } from "react-redux";

const menus = [
  { key: "biodata-diri", title: "Biodata Diri" },
  { key: "rekap-nilai", title: "Rekap Nilai" },
  { key: "summary", title: "Summary" },
];

function Pendaftaran({ user }) {
  const { menu } = useParams();
  const menuData = {};
  const [isHaveData, setIsHaveData] = useState(false);
  const [pendaftarData, setPendaftarData] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getDetailPendaftarState = useSelector(
    (state) => state.getDetailPendaftar
  );

  const activeStep = menus.findIndex((m) => m.key === menu);

  // useEffect(() => {
  //   if (getDetailPendaftarState.status === "loaded") {
  //     if (getDetailPendaftarState.data.data.pendaftaran) {
  //       setIsHaveData(false);
  //     } else {
  //       setIsHaveData(true);
  //       setPendaftarData(getDetailPendaftarState.data.data);
  //       if (
  //         getDetailPendaftarState.data.data.PendaftarRekapNilaiMap?.length > 0
  //       ) {
  //         setIsCompleted(true);
  //       } else {
  //         setIsCompleted(false);
  //       }
  //     }

  //   }
  // }, [getDetailPendaftarState.status]);

  switch (menu) {
    case "biodata-diri":
      menuData.title = "Biodata Diri";
      menuData.message = "Biodata Diri Calon Mahasiswa Baru";
      menuData.data = (
        <BiodataDiri
          user={user}
          data={pendaftarData}
          isHaveData={isHaveData}
          isCompleted={isCompleted}
        />
      );
      break;
    case "rekap-nilai":
      menuData.title = "Rekap Nilai";
      menuData.message = "Rata-rata Nilai Calon Mahasiswa Baru ";
      menuData.data = (
        <RekapNilai
          user={user}
          data={pendaftarData}
          isHaveData={isHaveData}
          isCompleted={isCompleted}
        />
      );
      break;
    case "summary":
      menuData.title = "Summary Pendaftaran";
      menuData.message = "Data Pendaftaran Calon Mahasiswa Baru";
      menuData.data = (
        <Summary
          user={user}
          data={pendaftarData}
          isHaveData={isHaveData}
          isCompleted={isCompleted}
        />
      );
      break;
    default:
      menuData.title = 500;
      menuData.message = "Internal Server Error";
      menuData.data = null;
      break;
  }

  // useEffect(() => {
  //   dispatch(
  //     getDetailPendaftar({
  //       token: user.token,
  //       nationalIdNumber: user.nationalIdNumber,
  //     })
  //   );
  // }, [dispatch]);

  const handleStepClick = (index) => {
    navigate(`/pendaftaran/${menus[index].key}`);
  };
  return (
    <Box>
      <Box>
        <Stepper index={activeStep} gap="0" w={"100%"}>
          {menus.map((step, index) => (
            <Step
              key={index}
              onClick={() => handleStepClick(index)}
              cursor="pointer"
            >
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        <Flex w={"100%"} mt={10} mb={6}>
          <Flex
            w={"50%"}
            justifyItems={"start"}
            justifyContent={"start"}
            flexDir={"column"}
          >
            <Text fontSize={"xl"} fontWeight={"bold"} mb={1}>
              {menuData.title}
            </Text>
            <Text fontSize={"l"} fontWeight={"500"} color={"gray"}>
              {menuData.message}
            </Text>
          </Flex>
        </Flex>
        {menuData.data}
      </Box>
    </Box>
  );
}

export default Pendaftaran;
