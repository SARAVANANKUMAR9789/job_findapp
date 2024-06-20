import axios from "axios";
const API_URL = "http://localhost:8800/api-v1";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  console.log("Uploading file:", uploadFile); // Debugging log
  const data = new FormData();
  data.append("file", uploadFile);
  data.append("upload_preset","rvf6eeho");
  data.append("cloud_name","daqatvrwp");
  data.append("folder","jobfind");
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/daqatvrwp/image/upload/`,
      data
    );
    console.log("Upload successful:", response.data); // Debugging log
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading file:", error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to handle it in the calling function if needed
  }
};

export const updateURL = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  navigate,
  location,
  jType,
  exp,
}) => {
  const params = new URLSearchParams();

  if (pageNum && pageNum > 1) {
    params.set("page", pageNum);
  }

  if (query) {
    params.set("search", query);
  }

  if (cmpLoc) {
    params.set("location", cmpLoc);
  }

  if (sort) {
    params.set("sort", sort);
  }

  if (jType) {
    params.set("jtype", jType);
  }

  if (exp) {
    params.set("exp", exp);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};
