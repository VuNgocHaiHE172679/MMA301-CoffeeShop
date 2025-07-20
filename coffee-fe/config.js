
const IP = "192.168.137.1";

const shopAppApi = `http://${IP}:9999`;

const apiConfig = {
    baseURL: shopAppApi,
    headers: {
        "Content-Type": "application/json",
    },
};

export default apiConfig;