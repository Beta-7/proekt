import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';


class Auth{


login(username, password){
    return new Promise((success, failure)=>{
     axios.post("/auth/login", {
        username:username,
        password:password
    },{withCredentials: true}).then((res)=>{

        if(res.data.message==="Logged in"){
            
             axios.post("/auth/whoami",{},{withCredentials:true}).then((res=>{
<<<<<<< HEAD
                localStorage.setItem("isAuthenticated", true);
                localStorage.setItem("Username", res.data.username);
                localStorage.setItem("isAdmin", res.data.isAdmin);
=======
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('Username', res.data.username);
                localStorage.setItem('isAdmin', res.data.isAdmin);
>>>>>>> main
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
        localStorage.setItem('isAuthenticated', false);
        localStorage.setItem('Username', null);
        localStorage.setItem('isAdmin', false);
    })
    
}





}

export default new Auth();