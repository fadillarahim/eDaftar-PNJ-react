import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const getRole = createAsyncThunk("role/getRole", async (model) => {
  if (model.action !== "reset") {
    const [data, isData] = await axios({
      method: "GET",
      url: import.meta.env.VITE_HOST + "/master/role",
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

const getRoleSlice = createSlice({
  name: "getRole",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getRole.pending, (state, action) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(getRole.fulfilled, (state, action) => {
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
      .addCase(getRole.rejected, (state, action) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const getRoleSelectors = getRoleSlice.actions;
export default getRoleSlice.reducer;
