import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';


class Auth{

constructor () {
    this.authenticated = false;
    this.username = "";
}

login(username, password){
    console.log('login reqest')
    return axios.post("/auth/login", {
        username:username,
        password:password
    },{withCredentials: true}).then((res)=>{
        console.log(res.data);
        if(res.data.message==="Logged in"){
            
             axios.post("/auth/whoami",{},{withCredentials:true}).then((res=>{
                this.authenticated=true;
                this.username=res.data.username;
                console.log("From login:" + this.username)
                localStorage.setItem('Authenticated', 'True');
            })).then(()=>{
                return 
            })
        }else{
            
        }
    })
}

logout(){
    
    axios.post("/auth/logout").then((res)=>{
        localStorage.setItem('Authenticated', 'False');
    })
    
}


getUsername(){
    console.log("From getUsername:" + this.username)
}



}

export default new Auth();