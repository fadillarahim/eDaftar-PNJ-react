import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Text, Box, Alert, Button } from "@chakra-ui/react";

function Error() {
  const { code } = useParams();
  const errorMessage = {};

  switch (code) {
    case "400":
      errorMessage.code = code;
      errorMessage.message = "Not Found";
      errorMessage.data = null;
      break;
    case "401":
      errorMessage.code = code;
      errorMessage.message = "Unauthorized";
      errorMessage.data = <Unauthorized />;
      break;
    case "403":
      errorMessage.code = code;
      errorMessage.message = "Forbidden";
      errorMessage.data = <Forbidden />;
      break;
    case "404":
      errorMessage.code = code;
      errorMessage.message = "Not Found";
      errorMessage.data = <NotFound />;
      break;
    default:
      errorMessage.code = 500;
      errorMessage.message = "Internal Server Error";
      errorMessage.data = null;
      break;
  }

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      bg={"gray.50"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
    >
      <Flex h={"50px"} alignItems={"center"}>
        <Text fontSize={"2xl"} fontWeight={"semibold"}>
          {errorMessage.code}
        </Text>
        <Box mx={5} h={"full"} w={"1.5px"} bg={"gray.400"} />
        <Text fontSize={"2xl"} fontWeight={"medium"}>
          {errorMessage.message}
        </Text>
      </Flex>
      {errorMessage.code !== "500" ? errorMessage.data : ""}
    </Flex>
  );
}

const NotFound = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Flex flexDir={"column"} alignItems={"center"} m={5}>
      <Alert status="info" mb={3} fontSize={{ base: 14, sm: 16 }}>
        {message ? message : "the page you want to access doesn't exist"}
      </Alert>
      <Button onClick={() => navigate("/")} colorScheme="gray" size="md">
        Kembali ke Dashboard
      </Button>
    </Flex>
  );
};

const Unauthorized = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Flex flexDir={"column"} alignItems={"center"} m={5}>
      <Alert status="info" mb={3} fontSize={{ base: 14, sm: 16 }}>
        {message ? message : "Anda harus login terlebih dahulu"}
      </Alert>
      <Button
        onClick={() => {
          localStorage.removeItem("edaftar-user-token");
          navigate("/login");
        }}
        colorScheme="gray"
        size="md"
      >
        Kembali ke Halaman Login
      </Button>
    </Flex>
  );
};

const Forbidden = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Flex flexDir={"column"} alignItems={"center"} m={5}>
      <Alert status="info" mb={3} fontSize={{ base: 14, sm: 16 }}>
        {message
          ? message
          : "Anda tidak memiliki izin untuk mengakses halaman ini"}
      </Alert>
      <Button onClick={() => navigate("/")} colorScheme="gray" size="md">
        Kembali ke Dashboard
      </Button>
    </Flex>
  );
};

export default Error;
