import react from 'react';
import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';



class WorkingHours extends React.Component {
    state={
        fullName: "noha",
      arrivalTime: "07:47",
      exitTime: "19:00",
      LunchBreakTime: "17:47",
      LunchBreakTime2: "18:30",
      errors :{}
    }; 
    async componentDidMount (){
        const {data} = await axios.get("http://localhost:3000/Employees/");
    }
    handleSubmit = async e => {
        e.preventDefault();

        const errors = this.validate();
        if (errors) return;
        //Call Backend
        const obj ={...this.state,}
        await axios.post("http://localhost:3000/Employees/", this.state);
        const calc = this.Calculate();


    }
    validate = () => {
        const errors = {};
        var lunchBreakConvertedTime = moment(this.state.LunchBreakTime, ["h:mm A"]). format('HH:mm')
        var lunchBreak2ConvertedTime = moment(this.state.LunchBreakTime2, ["h:mm A"]). format('HH:mm')
        var arrivalTimeConverted = moment(this.state.arrivalTime, ["h:mm A"]). format('HH:mm')
        var exitTimeConverted = moment(this.state.exitTime, ["h:mm A"]). format('HH:mm')

        if (this.state.fullName.trim() === "")
            errors.fullName = "Name is not allowed to be empty"
        
        if (lunchBreakConvertedTime < arrivalTimeConverted)
            errors.LunchBreakTime = "Lunch break time doesn't exist"
        
        if (lunchBreakConvertedTime > exitTimeConverted)
            errors.LunchBreakTime = "Lunch break time doesn't exist"
        
        if (lunchBreakConvertedTime > lunchBreak2ConvertedTime)
            errors.LunchBreakTime = "Lunch break time doesn't exist"

        if (lunchBreak2ConvertedTime > exitTimeConverted)
            errors.LunchBreakTime = "Lunch break time doesn't exist"

        if (lunchBreak2ConvertedTime < arrivalTimeConverted)
            errors.LunchBreakTime = "Lunch break time doesn't exist"
        
            this.setState({errors});
         return Object.keys(errors).length === 0 ? null : errors;
    }

    Calculate = () => {
        var startTime = this.state.exitTime.split(":");
        var endTime = this.state.arrivalTime.split(":");

        var startLunchBreak = this.state.LunchBreakTime2.split(":");
        var endLunchBreak = this.state.LunchBreakTime.split(":");

        // Get the time between lunch break
        var diffLunchHours = startLunchBreak[0] > endLunchBreak[0] ? startLunchBreak[0] - endLunchBreak[0]  : endLunchBreak[0] - startLunchBreak[0] ;
        var diffLunchHours = startLunchBreak[1] < endLunchBreak[1] ? diffLunchHours -1 : diffLunchHours;
        var diffLunchMinutes = startLunchBreak[1] > endLunchBreak[1] ? startLunchBreak[1] - endLunchBreak[1]  : endLunchBreak[1] - startLunchBreak[1] ;
        diffLunchMinutes = 60 - diffLunchMinutes;


        // Get the difference between your times
        var diffHours = startTime[0] > endTime[0] ? startTime[0] - endTime[0]  : endTime[0] - startTime[0] ;
        var diffHours = startTime[1] < endTime[1] ? diffHours -1 : diffHours;
        var diffMinutes = startTime[1] > endTime[1] ? startTime[1] - endTime[1]  : endTime[1] - startTime[1] ;
        diffMinutes = 60 - diffMinutes;

        diffHours = diffLunchMinutes > diffMinutes ? diffHours -1 : diffHours;
        diffMinutes = Math. abs(diffMinutes - diffLunchMinutes);

        // Alert the calculated difference
        alert(diffHours + " hours " + diffMinutes + " minutes " );
    }

    handleChange = e => {
        //clone 
        let state = {...this.state}
        //edit 
        state[e.currentTarget.name] = e.currentTarget.value;
        //set state
        this.setState (state);
    }
    
    render() { 
        
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                <h1 className="d-flex justify-content-center">Let's Calculate Your&nbsp;<span className="font-weight-bold">Working Hours</span>&nbsp;Together!</h1>
                     <div className="form-group">
                        <label htmlFor="fullName" className="font-weight-bold">Full Name</label>
                        <input type="text" value={this.state.fullName} onChange={this.handleChange} className="form-control" name="fullName" id="fullName" placeholder="Please Enter Your Unique Name"/>
                     </div>
                     {this.state.errors.fullName &&(<div className="alert alert-danger">{this.state.errors.fullName}</div>)}
                     <div className="form-row">
                        <div className="col">
                        <label htmlFor="arrivalTime" className="font-weight-bold">Arrival Time</label>
                        <input type="time" value={this.state.arrivalTime} onChange={this.handleChange} className="form-control" name="arrivalTime" id="arrivalTime" />
                     </div>
                     <div className="col">
                        <label htmlFor="exitTime" className="font-weight-bold">Exit Time</label>
                        <input type="time" value={this.state.exitTime} onChange={this.handleChange} className="form-control" name="exitTime" id="exitTime" />
                     </div>
                     </div>
                     <br/>
                     <div className="form-row">
                        <div className="col">
                        <label htmlFor="LunchBreakTime" className="font-weight-bold" >Lunch Break From :</label><br/>
                        <input type="time" value={this.state.LunchBreakTime} onChange={this.handleChange} className="form-control" name="LunchBreakTime" id="LunchBreakTime" />
                     </div>
                     <div className="col">
                        <label htmlFor="LunchBreakTime2" className="font-weight-bold" >To :</label>
                        <input type="time" value={this.state.LunchBreakTime2} onChange={this.handleChange} className="form-control" name="LunchBreakTime2" id="LunchBreakTime2" />
                     </div>
                     </div>
                     <br/>
                     {this.state.errors.LunchBreakTime &&(<div className="alert alert-danger">{this.state.errors.LunchBreakTime}</div>)}
                     <br/>
                    <button type="submit" className="btn btn-primary">Calculate</button>
                    
                    
                </form>
          </div>
             );
    }
}
 
export default WorkingHours;