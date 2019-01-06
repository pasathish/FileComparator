import React, { Component } from 'react';
import './App.css';
import ComponentServices from './ComponentServices';
import CheckboxComponent from './checkBoxComponent';
import MergeChangesComponent from './mergeDivComponent';


export default class App extends Component {
    componentService = new ComponentServices();
    constructor(props){
        super(props)
        this.state = {
            editorContent: "Pleace specify the file's to load",
            loadContent: '',
            comments:[],
            file1Content: "",
            file2Content: "",
            enableSaveButton: false,
            enableLoadButton: false,
            file1: "",
            file2: "",
            file1Name: "",
            file2Name: "",
            viewClass: "row",
            alignmentCss: "col-md-12",
            alignmentCssFile1: " ",
            alignmentCssFile2: " ",
            showFile: "display-none",
            showFile1: "display-none",
            showFile2: "display-none",
            rowView: true,
            displayCount: 1,
            downloadFileName: '',
            showRadio: false,
            chechBoxValue:['-l','-li','-lE','-lZ','-lb','-lW','-la'],
            chechBoxLabel:['Default','Ignore Case','Ignore Changes Due to Tab Expansion','Ignore White Space at Line End','Ignore Space Change ','Ignore All White Space','Treat all Files as Text'],
            compareCondition: '-l'
          };
        this.child = React.createRef();
    }

    async loadDifference() {
        let buttonState = this.state;
        buttonState['enableLoadButton'] = false;
        buttonState['comments']=buttonState['comments'];
        this.setState(buttonState);
        let state = this.state;
        console.log(this.refs.customFile1.value);
        console.log(this.refs.customFile2.value);
        let file1 = new FileReader();
        let file2 = new FileReader();
        console.log(this.state.compareCondition)
        if (this.refs.customFile1.files[0]) {
            file1.readAsText(this.refs.customFile1.files[0]);
            state.file1Name = this.refs.customFile1.files[0].name;
        }
        if (this.refs.customFile2.files[0]) {
            file2.readAsText(this.refs.customFile2.files[0]);
            state.file2Name = this.refs.customFile2.files[0].name;
        }
        file1.onloadend = (e) => { state['file1'] = e.target.result; }
        file2.onloadend = (e) => { state['file2'] = e.target.result; }
        let result = this.componentService.uploadFile(this.refs.customFile1.files[0], this.refs.customFile2.files[0], this.state.compareCondition);
        result.then((data) => {
        console.log("response",data["response"]);
        if(data["response"].length==1&&data["response"][0]=="*#*#File Format Not Supported*#*#"){
          state['file1'] = "Sorry!!! File Format Not Supported"
        }
        state['comments']=data["response"];
        state['loadContent'] = data["response"];
        state['editorContent'] = "";
        state['enableLoadButton'] = true;
        state['enableSaveButton'] = true;
        state['showRadio'] = !data["error"];
        this.setState(state);
        this.joinMergeContent();
        })    
    }
    setValue() {
        let state = this.state;
        state.editorContent = this.refs.textValue.value;
        state.enableSaveButton = true;
        this.setState(state);
    }
    
    saveDocument() {
        this.componentService.save(this.refs.textValue.value, this.refs.saveFileName.value);
    }

    fileNameChanged() {
        let state = this.state;
        state.enableLoadButton = this.refs.customFile1.value != "" || this.refs.customFile2.value != "";
        state.downloadFileName = this.refs.customFile1.files[0] ? this.refs.customFile1.files[0].name : this.refs.customFile2.files[0] ? this.refs.customFile2.files[0].name : '';
        this.setState(state);
    }

    changeDownloadFileName(event) {
        let state = this.state;
        state.downloadFileName = event.currentTarget.value;
        this.setState(state);
      }

    conditionCheckBoxChange(currentReference, state, event) {
        state.compareCondition=event.currentTarget.value;
        currentReference.setState(state);
    }

    clear(event){
        this.state.editorContent="";
        this.setState(this.state);
      }

    invisticate(a,b,c){
        console.log(a,b,c)
      }
    
    editDifference(){
      this.state.showFile="display-block";
      this.setState(this.state);
    }

    joinMergeContent(){
      let editorText="";
      this.child.current.getMergeContent().map((value)=>{
        editorText+=value+"\n";
      });
      if(editorText.length>1)
        editorText=editorText.substring(0,editorText.length-1)
      this.state["editorContent"]=editorText;
      this.setState(this.state);
      return editorText;
    }

    mergeContentAddAndDelete(mergeContentList,scope){
      let editorText="";
      mergeContentList.map((value)=>{
        editorText+=value+"\n";
      });
      if(editorText.length>1)
        editorText=editorText.substring(0,editorText.length-1)
        scope.state["editorContent"]=editorText;
        scope.setState(scope.state);
    }

    CheckBoxChange(currentReference, state, event) {
        if (event.currentTarget.checked)
          state.displayCount++;
        else
          state.displayCount--;
        if (event.currentTarget.value == "1") {
          state.showFile1 = event.currentTarget.checked ? "" : " display-none";
        } else if (event.currentTarget.value == "0") {
          state.showFile = event.currentTarget.checked ? "" : " display-none";
        } else
          state.showFile2 = event.currentTarget.checked ? "" : " display-none";
        if (state.rowView && state.displayCount) {
          state.alignmentCss = "col-md-" + (12 / state.displayCount);
          state.alignmentCssFile1 = "col-md-" + (12 / state.displayCount);
          state.alignmentCssFile2 = "col-md-" + (12 / state.displayCount);
        }
        currentReference.setState(state);
      }

    render(){
        // return <div className="text-success text-center">Hello world</div>
      return (<div className="card">
      <div className="form-control text-center"><b>Compare your Files Here</b></div>
      <div className="row paddingLeft-1 display-none">
        <label className={" text-primary   " + this.state.alignmentCss + " " + this.state.showFile}  >Merged File</label>
        <label className={" text-primary   " + this.state.alignmentCssFile1 + " " + this.state.showFile1}  >{this.state.file1Name}</label>
        <label className={" text-primary  " + this.state.alignmentCssFile2 + " " + this.state.showFile2}  >{this.state.file2Name}</label>
      </div>
      <div className="row paddingLeft-1">
        <textarea ref="textValue" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className={" bg-dark  text-white text-nowrap form-inline " + this.state.alignmentCss + " " + this.state.showFile} onChange={this.setValue.bind(this)} style={{ height: "500px" }} value={this.state.editorContent}></textarea>
        <textarea ref="file1" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className={" bg-dark  text-white text-nowrap form-inline " + this.state.alignmentCssFile1 + " " + this.state.showFile1} style={{ height: "500px" }} value={this.state.file1}></textarea>
        <textarea ref="file1" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" className={" bg-dark text-white text-nowrap form-inline " + this.state.alignmentCssFile2 + " " + this.state.showFile2} style={{ height: "500px" }} value={this.state.file2}></textarea>
      </div>
      <form className={"form-group paddingTop-1 " + this.state.showFile} >
            <input type="button" onClick={this.clear.bind(this)} className="btn btn-primary btn-sm marginLeft-2" value="Clear" />
            <input type="button" onClick={()=>{this.state.showFile="display-none";this.setState(this.state);}} className="btn btn-primary btn-sm marginLeft-2" value="Close" />
      </form>
      <MergeChangesComponent ref={this.child} comment={this.state.comments} parentScope={this} joinMergeContent={this.mergeContentAddAndDelete} file1={this.state.file1} file2={this.state.file2}></MergeChangesComponent>
      <form className="form-group paddingTop-1" >
        <div className="custom-file col-md-3">
          <input type="file" className="form-control form-control-file border btn-sm" onChange={this.fileNameChanged.bind(this)} ref="customFile1" id="customFile1" />
        </div>
        <div className="custom-file col-md-3">
          <input type="file" className="form-control form-control-file border btn-sm" onChange={this.fileNameChanged.bind(this)} ref="customFile2" id="customFile2" />
        </div>
        <input type="button" onClick={this.loadDifference.bind(this)} className="btn btn-primary btn-sm marginLeft-2" disabled={!this.state.enableLoadButton} value="Load" />
        <input type="button" onClick={this.editDifference.bind(this)} className="btn btn-primary btn-sm marginLeft-2" disabled={!this.state.enableSaveButton} value="Edit" />
        <CheckboxComponent  currentReference={this} conditionCheckBoxChange={this.conditionCheckBoxChange} state={this.state} CheckBoxChange={this.CheckBoxChange} show={this.state.showRadio} />
        <div style={{ "paddingTop": "10px" }}>
          <label className="form-control-label text-weight-bold text-primary" style={{ "paddingRight": "8px", "paddingLeft": "16px" }} htmlFor="save-fila-name">Enter File Name </label>
          <input type="text" ref="saveFileName" onChange={this.changeDownloadFileName.bind(this)} className="form-control-input" value={this.state.downloadFileName} style={{ "marginRight": "8px" }} id="save-file-name" />
          <input type="button" onClick={this.saveDocument.bind(this)} style={{ "marginBottom": "4px", "marginLeft": "20px" }} disabled={!this.state.enableSaveButton} className="btn btn-primary btn-sm" value="Download"></input>
        </div>
      </form>
    </div>);
    }


}
