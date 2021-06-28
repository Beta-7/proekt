import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';


class Auth{

constructor () {
    this.authenticated = false;
    this.username = "";
}

login(username, password){
    return new Promise((success, failure)=>{
     axios.post("/auth/login", {
        username:username,
        password:password
    },{withCredentials: true}).then((res)=>{

        if(res.data.message==="Logged in"){
            
             axios.post("/auth/whoami",{},{withCredentials:true}).then((res=>{
                this.authenticated=true;
                this.username=res.data.username;
                localStorage.setItem('Authenticated', 'True');
                success();
            })).then(()=>{
                return 
            })
        }else{
            failure();            
        }
    })
})
}

logout(){
    
    axios.post("/auth/logout").then((res)=>{
        localStorage.setItem('Authenticated', 'False');
    })
    
}





}

export default new Auth();