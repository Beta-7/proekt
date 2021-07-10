
import React, { Component} from 'react';
import axios from 'axios';



axios.defaults.baseURL = 'http://localhost:5000';

export default class Login extends Component {
    
   constructor(props){
       super(props);
   
   }
       state={
           "ime":"",
           "broj":"",
           "agent":"",
           "users":[]
       }
   
       componentDidMount(){
        let users=[];
        axios.post("/auth/getUsers",{},{withCredentials:true}).then((res)=>{
            if(res.data.message==="Unauthenticated"){return;}
            res.data.map((elem)=>{
                var joined = this.state.users.concat(elem);
                this.setState({ users: joined })
                console.log(elem)
            })
        })
       }

         onSubmitForm = async e => {
        e.preventDefault();
            axios.post("/firmi/dodadiFirma",{
                name:this.state.ime,
                broj:this.state.broj,
                agent:this.state.agent
            },{withCredentials:true})


            
         
        
    }
     
        render(){
            let user = this.state.users.map((elem) =>
                <option value={elem.username} key={elem.username}>{elem.username}</option>
            );


        return (
            <div className="login">
            <form className="form-addcompany" onSubmit={this.onSubmitForm}>
            
            <h1 className="h3 mb-3 font-weight-normal">Додади компанија</h1>
            <label htmlFor="inputName" className="sr-only">Име</label>
            <input type="text" id="inputName" className="form-control" placeholder="Име на компанија" required autoFocus onChange={e => this.setState({"ime":e.target.value})} />
            <label htmlFor="inputBroj" className="sr-only">Број</label>
            <input type="text" id="inputBroj" className="form-control" placeholder="Број" required onChange={e => this.setState({"broj":e.target.value})} />
            <label htmlFor="inputAgent" className="sr-only">Агент</label>
            <select className="form-control" onChange={e => {this.setState({"agent":e.target.value})}}>
                <option disabled selected>Агент</option>
                {user}


            </select>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Најави се</button>
            
          </form>

          
          </div>
    );
        }
}

