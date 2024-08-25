import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "idle",
  code: "",
  data: "",
};

export const createUser = createAsyncThunk("user/createUser", async (model) => {
  if (model.action !== "reset") {
    const [data, isData] = await axios({
      method: "POST",
      url: import.meta.env.VITE_HOST + "/master/user",
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

const createUserSlice = createSlice({
  name: "createUser",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state, action) => {
        state.status = "loading";
        state.data = "";
      })
      .addCase(createUser.fulfilled, (state, action) => {
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
      .addCase(createUser.rejected, (state, action) => {
        state.status = "error";
        state.data = "";
      });
  },
});

export const createUserSelectors = createUserSlice.actions;
export default createUserSlice.reducer;
