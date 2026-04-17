import axios from "axios";

const uploadFileToPinata = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity", // To support large files
      headers: {
        'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
        'pinata_secret_api_key': process.env.REACT_APP_PINATA_API_SECRET,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.IpfsHash;  // The IPFS CID of the uploaded file
  } catch (error) {
    console.error("Error uploading to Pinata IPFS:", error);
    throw error;
  }
};
