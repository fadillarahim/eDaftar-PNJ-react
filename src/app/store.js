import { configureStore } from "@reduxjs/toolkit";


import loginReducers from "../backend/Login/login.js";
import registrasiAkunReducers from "../backend/Login/registrasiAkun.js";

import getUserReducers from "../backend/Master/User/getUser.js";
import createUserReducers from "../backend/Master/User/createUser.js";
import updateUserReducers from "../backend/Master/User/updateUser.js";
import deleteUserReducers from "../backend/Master/User/deleteUser.js";

import getRoleReducers from "../backend/Master/Role/getRole.js";

import getPropinsiReducers from "../backend/pendaftaran/getPropinsi.js";
import getKabupatenKotaReducers from "../backend/pendaftaran/getKabupatenKota.js";
import getKecamatanReducers from "../backend/pendaftaran/getKecamatan.js";
import getAgamaReducers from "../backend/pendaftaran/getAgama.js";

import createBiodataDiriReducers from "../backend/pendaftaran/createBiodataDiri.js";

import createRekapNilaiReducers from "../backend/pendaftaran/createRekapNilai.js";

import getDetailPendaftarReducers from "../backend/pendaftaran/getDetailPendaftar.js";
import getListPendaftarReducers from "../backend/pendaftaran/getListPendaftar.js";
import deletePendaftarReducers from "../backend/pendaftaran/deletePendaftar.js";
import updatePendaftarReducers from "../backend/pendaftaran/updatePendaftar.js";

export const store = configureStore({
    reducer: {
        login: loginReducers,
        registrasiAkun: registrasiAkunReducers,

        getUser: getUserReducers,
        createUser: createUserReducers,
        updateUser: updateUserReducers,
        deleteUser: deleteUserReducers,

        getRole: getRoleReducers,

        getPropinsi: getPropinsiReducers,
        getKabupatenKota: getKabupatenKotaReducers,
        getKecamatan: getKecamatanReducers,
        getAgama: getAgamaReducers,

        createBiodataDiri: createBiodataDiriReducers,

        createRekapNilai: createRekapNilaiReducers,

        getDetailPendaftar: getDetailPendaftarReducers,
        getListPendaftar: getListPendaftarReducers,
        deletePendaftar: deletePendaftarReducers,
        updatePendaftar: updatePendaftarReducers,

    },
})