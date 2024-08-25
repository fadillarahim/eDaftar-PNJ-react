import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const login = createAsyncThunk("login/login", async (model) => {
  if (model.action !== "reset") {
    const [data, isData] = await axios({
      method: "POST",
      url: import.meta.env.VITE_HOST + "/login",
      headers: {
        "Content-Type": "application/json",
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

const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(login.fulfilled, (state, action) => {
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
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const loginSelectors = loginSlice.actions;
export default loginSlice.reducer;
