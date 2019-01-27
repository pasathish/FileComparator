import React, { Component } from 'react';
import './App.css';

export default class CheckboxComponent extends Component {
    CheckBoxChange(event) {
        this.props.CheckBoxChange(this.props.currentReference, this.props.state, event);
    }
    conditionCheckBoxChange(event) {
        console.log(event)
        this.props.conditionCheckBoxChange(this.props.currentReference, this.props.state, event);
    }

    forCheckboxElement(state){
        let checkBoxKeyList = state.chechBoxValue;
        let checkBoxLabel = state.chechBoxLabel;
        let checkBox;
        checkBox=checkBoxKeyList.map((value,index)=>{
            if(index==0){
                return( <div className="custom-control custom-checkbox custom-control-inline paddingLeft-1" key={index}>
                    <input type="checkbox" onChange={this.conditionCheckBoxChange.bind(this)} id={"file-c"+index+"-checkbox"} defaultChecked className="custom-control-input" value={value}  name="condition" ></input>
                    <label className="custom-control-label" htmlFor={"file-c"+index+"-checkbox"}>{checkBoxLabel[index]}</label>
                    </div>)
            }
            else{
                return(
                        <div className="custom-control custom-checkbox custom-control-inline paddingLeft-1" key={index}>
                        <input type="checkbox" onChange={this.conditionCheckBoxChange.bind(this)} id={"file-c"+index+"-checkbox"} className="custom-control-input" value={value}  name="condition" ></input>
                        <label className="custom-control-label" htmlFor={"file-c"+index+"-checkbox"}>{checkBoxLabel[index]}</label>
                        </div>);
            }
        })
        return checkBox;
    }

    render() {
            return (<div className="paddingTop-1">
                <div className="custom-control custom-checkbox custom-control-inline col">
                    <div className="text-info">Set compare Conditions</div>
                    {this.forCheckboxElement(this.props.state)}
                </div> 
                <div className={"custom-control custom-checkbox custom-control-inline display-none "+(this.props.show?"":"display-none") }>
                    <div className="custom-control custom-checkbox custom-control-inline paddingLeft-1">
                        <input type="checkbox" onChange={this.CheckBoxChange.bind(this)} className="custom-control-input" value="0" id="file-1-checkbox" defaultChecked name="example"></input>
                        <label className="custom-control-label" htmlFor="file-1-checkbox">Display Merged File</label>
                    </div>
                    <div className="custom-control custom-checkbox custom-control-inline">
                        <input type="checkbox" onChange={this.CheckBoxChange.bind(this)} className="custom-control-input" value="1" id="file-2-checkbox" name="example"></input>
                        <label className="custom-control-label" htmlFor="file-2-checkbox">Display File1</label>
                    </div>
                    <div className="custom-control custom-checkbox custom-control-inline">
                        <input type="checkbox" onChange={this.CheckBoxChange.bind(this)} className="custom-control-input" value="2" id="file-3-checkbox" name="example"></input>
                        <label className="custom-control-label" htmlFor="file-3-checkbox">Display File2</label>
                    </div>
                </div></div>);
    }
}