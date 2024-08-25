import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../backend/Login/login";
import { registrasiAkun } from "../../backend/Login/registrasiAkun";
import { useNavigate } from "react-router-dom";
import { useToastHook } from "../../components";

const Login = () => {
  const [toast, setToast] = useToastHook();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [metadataUser, setMetadataUser] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isUlangiPasswordVisible, setIsUlangiPasswordVisible] = useState(false);
  const [activityType, setActivityType] = useState("Login");
  const [emailError, setEmailError] = useState("");
  const [nikError, setNikError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const loginState = useSelector((state) => state.login);
  const registrasiAkunState = useSelector((state) => state.registrasiAkun);

  useEffect(() => {
    if (loginState.status === "error") {
      setToast({
        message: loginState.data.message,
        type: "error",
      });
      dispatch(login({ action: "reset" }));
    } else if (loginState.status === "loaded") {
      setToast({
        message: loginState.data.message,
        type: "success",
      });
      localStorage.setItem("edaftar-user-token", loginState.data.data.token);
      navigate("/");
      dispatch(login({ action: "reset" }));
    }
  }, [loginState.status, setToast]);

  useEffect(() => {
    if (registrasiAkunState.status === "error") {
      setToast({
        message: registrasiAkunState.data.message,
        type: "error",
      });
      dispatch(registrasiAkun({ action: "reset" }));
    } else if (registrasiAkunState.status === "loaded") {
      setToast({
        message: registrasiAkunState.data.message,
        type: "success",
      });
      dispatch(registrasiAkun({ action: "reset" }));
      resetState();
      setActivityType("Login");
    }
  }, [registrasiAkunState.status, setToast]);

  const resetState = () => {
    setMetadataUser({});
    setEmailError("");
    setPasswordError("");
    setNikError("");
    setConfirmPasswordError("");
    setIsPasswordVisible(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value.toLowerCase();
    setMetadataUser({ ...metadataUser, email });

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
    setMetadataUser({ ...metadataUser, password });

    if (!validatePassword(password)) {
      setPasswordError("Password minimal 6 karakter");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (password) => {
    return password.length >= 6;
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setMetadataUser({ ...metadataUser, confirmPassword });

    if (!validateConfirmPassword(confirmPassword)) {
      setConfirmPasswordError("Password tidak valid");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleOperation = () => {
    if (!metadataUser.email || !metadataUser.password) {
      setToast({
        message: "Mohon isi semua form",
        type: "warning",
      });
    } else if (
      activityType === "Registrasi Akun" &&
      (!metadataUser.confirmPassword || !metadataUser.username || !metadataUser.nationalIdNumber)
    ) {
      setToast({
        message: "Mohon isi semua form",
        type: "warning",
      });
    } else if (
      activityType === "Registrasi Akun" &&
      metadataUser.password !== metadataUser.confirmPassword
    ) {
      setToast({
        message: "Password dan Konfirmasi Password harus sama",
        type: "warning",
      });
    } else {
      if (activityType === "Registrasi Akun") {
        dispatch(registrasiAkun({ data: { metadataUser } }));
      } else if (activityType === "Login") {
        dispatch(login({ data: { metadataUser } }));
      }
    }
  };

  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      bg={"gray.200"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box w={"50%"} bg={"white"} p={10} h={"100vh"}>
        <Image src="eDaftar PNJ.jpg" alt="Logo PNJ" />
      </Box>
      <Box
        w={"50%"}
        bg={"#028797"}
        p={10}
        h={"100vh"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box w={"xl"} bg={"white"} p={10} borderRadius={10}>
          <Text
            mb={5}
            fontSize={"3xl"}
            fontWeight={"bold"}
            color={"gray.700"}
            textAlign={"center"}
          >
            {activityType}
          </Text>
          <Text mb={9} fontSize={"lg"} color={"gray.600"} textAlign={"center"}>
            Selamat Datang di Aplikasi PMB Online PNJ
          </Text>
          <Flex direction={"column"} gap={3}>
            <FormControl
              display={activityType === "Login" ? "none" : "block"}
              isRequired
              isInvalid={nikError}
            >
              <FormLabel>Nomor Induk Kependudukan (NIK)</FormLabel>
              <Input
                onChange={(e) => {
                  if (e.target.value.length > 16) {
                    setNikError("NIK tidak boleh lebih dari 16 digit.");
                    
                  } else if (e.target.value.length < 16) {
                    setMetadataUser({
                      ...metadataUser,
                      nationalIdNumber: e.target.value,
                    });
                    setNikError("NIK harus terdiri dari 16 digit.");
                  } else {
                    setNikError("");
                    setMetadataUser({
                      ...metadataUser,
                      nationalIdNumber: e.target.value,
                    });
                  }
                }}
                type="text"
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

                  if (isMaxLength && !["Backspace", "Delete"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                value={metadataUser.nationalIdNumber ? metadataUser.nationalIdNumber : ""}
                placeholder="Masukkan NIK"
              />
              {nikError && (
                <FormErrorMessage>{nikError}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              display={activityType === "Login" ? "none" : "block"}
              isRequired
            >
              <FormLabel>Username</FormLabel>
              <Input
                onChange={(e) => {
                  // Izinkan hanya huruf dan panjang maksimal 15 karakter
                  if (
                    /^[A-Za-z]*$/.test(e.target.value) &&
                    e.target.value.length <= 15
                  ) {
                    setMetadataUser({
                      ...metadataUser,
                      username: e.target.value.toLowerCase(),
                    });
                  }
                }}
                type="text"
                onKeyDown={(e) => {
                  const isSpecialKey =
                    e.key === "Backspace" || e.key === "Delete";
                  const isMaxLength =
                    metadataUser.username && metadataUser.username.length >= 15;

                  // Cegah input jika bukan huruf atau panjang lebih dari 15, kecuali jika tombol "Backspace" atau "Delete"
                  if (
                    (!isSpecialKey && isMaxLength) ||
                    /[^A-Za-z]/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
                value={metadataUser.username ? metadataUser.username : ""}
                placeholder="Masukkan Username"
              />
            </FormControl>
            <FormControl isRequired isInvalid={emailError}>
              <FormLabel>Email</FormLabel>
              <Input
                onChange={handleEmailChange}
                type="email"
                value={
                  metadataUser.email ? metadataUser.email.toLowerCase() : ""
                }
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault(); // Mencegah spasi dari masuk ke input
                  }
                }}
                placeholder="Masukkan Email"
              />
              {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={passwordError}>
              <FormLabel>Password</FormLabel>
              <Input
                type={isPasswordVisible ? "text" : "password"}
                onChange={handlePasswordChange}
                onKeyDown={(e) => {
                  if (e.key === " " || /[^A-Za-z0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                value={metadataUser.password ? metadataUser.password : ""}
                placeholder="Masukkan Password Minimal 6 Karakter"
              />
              {passwordError && (
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              )}
              <Flex
                justifyContent={"flex-start"}
                mt={3}
                gap={3}
                display={activityType === "Login" ? "flex" : "none"}
              >
                <Checkbox
                  defaultChecked={isPasswordVisible}
                  onChange={(e) => setIsPasswordVisible(!isPasswordVisible)}
                />
                <Text>Lihat Password</Text>
              </Flex>
            </FormControl>
            <FormControl
              display={activityType === "Login" ? "none" : "block"}
              isRequired
              isInvalid={confirmPasswordError}
            >
              <FormLabel>Konfirmasi Password</FormLabel>
              <Input
                type={isUlangiPasswordVisible ? "text" : "password"}
                onChange={handleConfirmPasswordChange}
                value={
                  metadataUser.confirmPassword
                    ? metadataUser.confirmPassword
                    : ""
                }
                onKeyDown={(e) => {
                  if (e.key === " " || /[^A-Za-z0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Masukkan Ulang Password"
              />
              {confirmPasswordError && (
                <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              colorScheme={"teal"}
              mt={5}
              isLoading={
                loginState.status !== "idle" ||
                registrasiAkunState.status !== "idle"
              }
              onClick={handleOperation}
            >
              {activityType === "Login" ? "Login" : "Registrasi Akun"}
            </Button>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              display={activityType === "Login" ? "flex" : "none"}
            >
              <Text>
                Belum punya akun?{" "}
                <Link
                  color="blue.500"
                  onClick={() => {
                    resetState();
                    setActivityType("Registrasi Akun");
                  }}
                >
                  Registrasi
                </Link>
              </Text>
            </Flex>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              display={activityType === "Registrasi Akun" ? "flex" : "none"}
            >
              <Text>
                Sudah punya akun?{" "}
                <Link
                  color="blue.500"
                  onClick={() => {
                    resetState();
                    setActivityType("Login");
                  }}
                >
                  Login
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
