import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const getKabupatenKota = createAsyncThunk("pendaftaran/getKabupatenKota", async (model) => {
  if (model.action !== "reset") {
    const [data, isData] = await axios({
      method: "GET",
      url: import.meta.env.VITE_HOST + `/pendaftaran/kabupaten-kota/${model.province_id}`,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": model.token,
      },
    })
      .then((result) => {
        const responseAPI = result;
        return [responseAPI, true];
      })
      .catch((error) => {
        if (error.response) console.log(error.response);
        return [error.response, false];
      });

    return JSON.stringify(data);
  }

  return JSON.stringify({ data: "reset" });
});

const getKabupatenKotaSlice = createSlice({
  name: "getKabupatenKota",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getKabupatenKota.pending, (state, action) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(getKabupatenKota.fulfilled, (state, action) => {
        var record = JSON.parse(action.payload);
        if (record.status === 200) {
          state.status = "loaded";
          state.code = record.status;
          state.data = record.data;
        } else {
          if (record.data === "reset") {
            state.status = "idle";
            state.data = "";
            state.code = "";
          } else {
            state.status = "error";
            state.code = record.status;
            state.data = record.data;
          }
        }
      })
      .addCase(getKabupatenKota.rejected, (state, action) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const getKabupatenKotaSelectors = getKabupatenKotaSlice.actions;
export default getKabupatenKotaSlice.reducer;
