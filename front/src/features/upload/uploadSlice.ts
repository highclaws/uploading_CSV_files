import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { AppThunk } from "../../app/store";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import CustomAlert from "../../components/common/CustomAlert";
import apiInstance from "../../api/ApiConfig";

interface UploadState {
  progress: number;
  downloadLink: Buffer | null;
}

const initialState: UploadState = {
  progress: 0,
  downloadLink: null,
};

interface ErrorCollumn {
  property: string;
}

interface ErrorDTO {
  errors: ErrorCollumn[];
  rowIndex: number;
}

export interface ExtendedError extends Error {
  message: string;
  errors: ErrorDTO[];
}

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    uploadCSVRequest: (state) => {
      state.progress = 0;
      state.downloadLink = null;
    },
    uploadCSVProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    uploadCSVSuccess: (state, action: PayloadAction<Buffer>) => {
      console.log("uploadCSVSuccess", action.payload);
      state.progress = 100;
      state.downloadLink = action.payload;
    },
    uploadCSVFailure: (state, action: PayloadAction<ExtendedError>) => {
      state.progress = 0;
      if (action.payload?.errors?.length) {
        console.log(action.payload);
        toast.error(CustomAlert({ data: action.payload }));
      } else {
        toast.error(CustomAlert({ data: action.payload }));
      }
    },
  },
});

export const {
  uploadCSVRequest,
  uploadCSVProgress,
  uploadCSVSuccess,
  uploadCSVFailure,
} = uploadSlice.actions;

export const uploadCSV =
  (file: File): AppThunk =>
  async (dispatch) => {
    dispatch(uploadCSVRequest());

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await apiInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Range: "bytes=0-1023",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            console.log("progress", progress);
            dispatch(uploadCSVProgress(progress));
          }
        },
      });

      dispatch(uploadCSVSuccess(response.data.data));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response && error.response.data) {
          dispatch(uploadCSVFailure(error.response.data));
        } else {
          dispatch(
            uploadCSVFailure({
              message: "Unknown error occurred in axios",
              errors: [],
              name: "axios",
            })
          );
        }
      } else {
        dispatch(
          uploadCSVFailure({
            message: "Unknown error occurred",
            errors: [],
            name: "Unknown",
          })
        );
      }
    }
  };
