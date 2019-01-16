import React, {Component} from 'react';
import axios from 'axios';
import Input from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class ContactForm extends Component{
  
    handleSubmit(e){
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        axios({
            method: "POST", 
            url:"http://localhost:4000/api/v1/send", 
            data: {
                name: name,   
                email: email,  
            }
        }).then((response)=>{
            if (response.data.msg === 'success'){
                alert("Message Sent."); 
                this.resetForm()
            }else if(response.data.msg === 'fail'){
                alert("Message failed to send.")
            }
        })
    }

    resetForm(){
        document.getElementById('contact-form').reset();
    }

    render(){
        return(
            
            // <div className="col-sm-4 offset-sm-4">
            
                <form  id="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                    <div className="row">
                        <div className="col-sm-4">
                            {/* <label for="name">Name</label> */}
                            <input placeholder="Name" type="text" className="form-control" id="name" />
                        </div>
                        <div className="col-sm-4">
                            {/* <label for="exampleInputEmail1">Email address</label> */}
                            <input placeholder="Email" type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                        </div>
                        {/* <div className="form-group">
                            <label for="message">Message</label>
                            <textarea className="form-control" rows="5" id="message"></textarea>
                        </div> */}
                        <Button type="submit" color="inherit">Invite User</Button>
                    </div>
                    
                </form>
            // </div>
        )
    }
}

export default ContactForm; 