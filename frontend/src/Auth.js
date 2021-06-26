import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

class Auth{

constructor () {
    this.authenticated = false;
    this.username = "";
}

login(username, password){
    axios.post("/auth/login", {
        username:username,
        password:password
    },{withCredentials: true}).then((res)=>{
        if(res.data.message==="Logged in"){
            
            axios.post("/auth/whoami",{},{withCredentials:true}).then((res=>{
                this.authenticated=true;
                this.username=res.data.username;
                console.log("From login:" + this.username)
            })).then(()=>{
                return
            })


        }else{

        }
    })
}

getUsername(){
    console.log("From getUsername:" + this.username)
}


}

export default new Auth();