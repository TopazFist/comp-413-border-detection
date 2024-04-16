import { api } from "../components/api";

const Logout = () => {
    api.post("/auth/logout/").then((response) => console.log(JSON.stringify(response.data))).then(() => window.location.href = "/");
}

export default Logout;