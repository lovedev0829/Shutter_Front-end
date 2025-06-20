import { ErrorMessage } from "../helpers/common";
import { apiUrls } from "./apiUrls";
import { API } from "./apiUtils";


export const PostImage = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    const apiResponse = await API(apiUrls.uploadFiles, {}, "POST", formData);
    if (apiResponse.data.isSuccess) {
      return apiResponse.data.data;
    }
  } catch (err) {
    ErrorMessage(err?.message);
  }
};




