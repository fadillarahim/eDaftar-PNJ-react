import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Box } from "@chakra-ui/react";
import { Header, Sidebar } from "../Moleculs";

import axios from "axios";

export default function Layout({
  appMenu,
  headerTitle,
  children,
  isAuth = true,
  showNav = false,
  navLink,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false); //ini nanti di chane jadi false if login feature already use
  const [userData, setUserData] = useState({});
  const [isToggled, setIsToggled] = useState(false);
  // cek user login
  useEffect(() => {
    const isLogin = localStorage.getItem("edaftar-user-token");
    if (!isLogin) {
      navigate("/login");
    } 

  }, []);
  
  useEffect(() => {
    localStorage.setItem("access-page", window.location.href);
  }, []);

  

  const checkToken = async () => {
    if (isAuth) {
      const isAuthenticated = localStorage.getItem("edaftar-user-token");
      if (isAuthenticated) {
        await axios({
          method: "GET",
          url: import.meta.env.VITE_HOST + "/user/me",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": isAuthenticated,
          },
        })
          .then((res) => {
            const currUserData = res.data;
            const data = {
              id: currUserData.data.id,
              username: currUserData.data.username,
              role: currUserData.data.role,
              nationalIdNumber: currUserData.data.nationalIdNumber,
              isAdmin: currUserData.data.isAdmin,
              email: currUserData.data.email,
              permission: currUserData.data.permission,
            };

            localStorage.setItem("edaftar-current-user", JSON.stringify(data));
            setUserData({
              ...data,
              token: isAuthenticated,
            });
            setIsLoggedIn(true);
          })
          .catch((err) => {
            if (err.response.status === 401) {
              return navigate("/error/401");
            }
          });
      } else {
        setIsLoggedIn(false);
        navigate("/login");
      }
    }
  };

  const checkToggled = () => {
    const check = localStorage.getItem("is-sidebar-toggled");

    if (check && check === "true") setIsToggled(true);
    else setIsToggled(false);
  };

  useEffect(() => {
    checkToken();
  }, [isLoggedIn]);

  useEffect(() => {
    checkToggled();
  }, [isToggled]);

  return isLoggedIn ? (
    <Box minH={"100vh"} bg={"gray.200"}>
      {/* Sidebar */}
      <Sidebar
        isToggled={isToggled}
        userPermission={userData.permission}
        setIsToggled={() => {
          if (isToggled) {
            localStorage.setItem("is-sidebar-toggled", "false");
            return setIsToggled(false);
          }
          localStorage.setItem("is-sidebar-toggled", "true");
          return setIsToggled(true);
        }}
        display={{ base: "none", md: "block" }}
      />

      <Header user={userData} isToggled={isToggled} headerTitle={headerTitle} />

      <Box
        // mx={5}
        // my={5}
        transition={"0.5s ease"}
        pl={isToggled ? "8.8rem" : "16.3rem"}
        pr={5}
        pb={5}
        mt={5}
        
      >
        <Box
          bg={"white"}
          position={"relative"}
          top={showNav ? "-2rem" : "0rem"}
          zIndex={2}
          borderRadius={"lg"}
          w={"100%"}
          p={7}
          mb={5}
        >
          {React.cloneElement(children, { user: userData })}
        </Box>
      </Box>
    </Box>
  ) : (
    ""
  ) ;
}
