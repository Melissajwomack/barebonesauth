import axios from "axios";
const API = {
  JWT: false,
  setJWT(token){
    this.JWT = token;
  },
  getJWT(){
    return this.JWT;
  },
  isLoggedIn(){
    return this.JWT != false;
  },
  login(email, password){
    return axios.post("/api/login", { email, password })
    .then((response) => {
      if(response.data.token){
          this.setJWT(response.data.token);
      }
      return Promise.resolve(response);
    })
  },
  logout(){
    this.JWT = false;
  },
  register(email, password){
    return axios.post("/api/register", { email, password })
  },
  hello(){
    return axios.get("/hello",
      {
        headers : {
          Authorization: `Bearer ${this.JWT}`
        }
      }
    )
  },
  goodbye(){
    return axios.post("/goodbye", { date: "somedata"},
      {
        headers : {
          Authorization: `Bearer ${this.JWT}`
        }
      }
    )
  }
};

export default API;
