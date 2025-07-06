import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8000",
});

// API function for summarization
export const summarize = async (text) => {
  try {
    const response = await api.post("/summarize", { text: text });
    return response.data;
  } catch (error) {
    console.error("Error calling summarize API:", error);
    return text; // Return original text on error
  }
};

// API function for expansion
export const expand = async (text) => {
  try {
    const response = await api.post("/expand", { text: text });
    return response.data;
  } catch (error) {
    console.error("Error calling expand API:", error);
    return text; // Return original text on error
  }
};

// API function for shortening
export const shorten = async (text) => {
  try {
    const response = await api.post("/summarize", { text: text });
    return response.data;
  } catch (error) {
    console.error("Error calling shorten API:", error);
    return text; // Return original text on error
  }
};

export const saveText = async (text) => {
  try {
    const response = await api.post("/save", { text: text });
    return response.data;
  } catch (error) {
    console.error("Error calling save API:", error);
    return false; // Return false on error
  }
};
