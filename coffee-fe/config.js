
const IP = "192.168.0.100";

const shopAppApi = `http://${IP}:9999`;

const apiConfig = {
    baseURL: shopAppApi,
    headers: {
        "Content-Type": "application/json",
    },
};

export default apiConfig;