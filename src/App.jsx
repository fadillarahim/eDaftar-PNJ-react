import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { HashRouter, Route, Routes } from "react-router-dom";

import { Layout } from "./components";
import Login from "./routes/Login/Login";
import Error from "./routes/Error/Error";
import Dashboard from "./routes/Dashboard/Dashboard";
import MasterUser from "./routes/Master/User/MasterUser";
import MasterRole from "./routes/Master/Role/MasterRole";
import Pendaftaran from "./routes/Pendaftaran/Pendaftaran";
import DaftarPendaftar from "./routes/Pendaftaran/DaftarPendaftar/DaftarPendaftar";
import DetailPendaftaran from "./routes/Pendaftaran/DaftarPendaftar/DetailPendaftaran";

// import { ReactSimpleChatbot } from 'react-simple-chatbot'

function App() {
  const [count, setCount] = useState(0);

  return (
    <HashRouter>
      <Routes>
        <Route path="/error/:code" element={<Error />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/">
          <Route
            index
            element={
              <Layout
                headerTitle={"eDaftar - Dashboard"}
                children={<Dashboard />}
              />
            }
          ></Route>
        </Route>
        <Route path="/master">
          <Route
            path="user"
            element={
              <Layout
                headerTitle={"eDaftar - Master User"}
                children={<MasterUser />}
              />
            }
          ></Route>
          <Route
            path="role"
            element={
              <Layout
                headerTitle={"eDaftar - Master Role"}
                children={<MasterRole />}
              />
            }
          ></Route>
        </Route>
        <Route path="/pendaftaran">
          <Route
            path=":menu"
            element={
              <Layout
                headerTitle={"eDaftar - Pendaftaran Mahasiswa"}
                children={<Pendaftaran />}
              />
            }
          ></Route>
        </Route>

        <Route
          path="/list-pendaftar"
          element={
            <Layout
              headerTitle={"eDaftar - Daftar Calon Mahasiswa"}
              children={<DaftarPendaftar />}
            />
          }
        ></Route>
        <Route
          path="/list-pendaftar/:nationalIdNumber"
          element={
            <Layout
              headerTitle={"eDaftar - Detail Pendaftaran"}
              children={<DetailPendaftaran />}
            />
          }
        ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
