import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const updatePendaftar = createAsyncThunk("pendaftaran/updatePendaftar", async (model) => {
  if (model.action !== "reset") {
    const [data, isData] = await axios({
      method: "PATCH",
      url: import.meta.env.VITE_HOST + "/pendaftaran/list-pendaftar",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": model.token,
      },
      data: model.data,
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

const updatePendaftarSlice = createSlice({
  name: "updatePendaftar",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(updatePendaftar.pending, (state, action) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(updatePendaftar.fulfilled, (state, action) => {
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
      .addCase(updatePendaftar.rejected, (state, action) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const updatePendaftarSelectors = updatePendaftarSlice.actions;
export default updatePendaftarSlice.reducer;
