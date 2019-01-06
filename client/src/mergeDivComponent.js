import React, { Component } from 'react';
import './App.css';

export default class MergeChangesComponent extends Component {
  removeIndex=[]
  mergeContent=[]
  deletedLines=[]
  constructor(props){
    super(props)
    this.state={
      "comment":[],
      "deletedLines":[],
  };
  }

  addElement(index,event){
    console.log("event",index)
    let span=event.currentTarget.parentElement.getElementsByTagName("span");
    console.log(span)
    span[1].innerHTML="<ins>"+span[1].innerText+"</ins>"
    if(this.removeIndex.indexOf(index)!==-1){
      var eleindex = this.removeIndex.indexOf(index);
      if (eleindex > -1) {
        this.removeIndex.splice(eleindex, 1);
      }
      this.updateParent(this.removeIndex);
    }
    // span[2].remove();
    // span[2].remove();
  }

  getMergeContent(){
    console.log(this.state)
    return this.mergeContent;
  }

  deleteElement(index,event){
    let span=event.currentTarget.parentElement.getElementsByTagName("span");
    span[1].innerHTML="<del>"+span[1].innerText+"</del>"
    if(this.removeIndex.indexOf(index)===-1)
      this.removeIndex.push(index);
    this.updateParent(this.removeIndex);
  }

  updateParent(removeIndex){
    let editorText="";
    this.mergeContent.map((value,index)=>{
      if(this.removeIndex.indexOf(index+1)===-1)
        editorText+=value+"\n";
    });
    if(editorText.length>1)
      editorText=editorText.substring(0,editorText.length-1)
      this.props.parentScope.state["editorContent"]=editorText;
      this.props.parentScope.setState(this.props.parentScope.state);
  console.log("updated");
  }

  createContentList(file1Content,file2Content,shellOutPut){
    console.log("shellOutPut type",typeof shellOutPut)
    let final_File=[]
    this.deletedLines=[]
    let file1Count=0;
    shellOutPut.map(line => {
        line=line.replace(new RegExp(/'/g),"").trim();
        if(line.length !=0){
          if(line.startsWith("+-")){
            let linNo=line.split(" ");
            final_File.push("-"+file1Content[linNo[1]])
            this.deletedLines.push(parseInt(linNo[1])+1)
            final_File.push("+"+file2Content[linNo[2]])
          }else if(line.startsWith("-")){
            let linNo=line.split(" ");
            final_File.push("-"+file1Content[linNo[1]])
            this.deletedLines.push(parseInt(linNo[1])+1)
          }else if(line.startsWith("+")){
            let linNo=line.split(" ");
            final_File.push("+"+file2Content[linNo[1]])
            file1Count--;
          }
        }
        else{
          final_File.push("*"+file1Content[file1Count])
        }
        file1Count++;
    });
    console.log(final_File)
    if(final_File.length==0 && file1Content.length==1 )
        final_File.push("*"+file1Content[0])
    return final_File;
  }

  componentDidMount(){
    console.log("componentDidUpdate",this.mergeContent)
    let state=this.props.parentScope.state
    state['mergeComponentContent']=this.mergeContent
    this.props.parentScope.setState(state);
  }

render(){
  let divIndex=0;
  let lineNO=0;
  let deleteIndex=0;
  this.mergeContent=[]
  var mergedFileWithChanges=[]
  console.log("fthile1  ", this.props.file1);
  console.log("file2"+typeof this.props.file2);
  if(this.props.file1){
    mergedFileWithChanges = this.createContentList(this.props.file1.split("\n"),this.props.file2.split("\n"),this.props.comment)
  }
var comment=mergedFileWithChanges.map((value,i)=>{
          divIndex++;
        if(value.trim().startsWith("+")){
          lineNO++;
          this.mergeContent.push(value.replace("+",""));
          return(<div className="bg-add row" key={i} index={i}><span className="text-dark  line-no-width">{lineNO}</span><span className="text-success col-md-11">{value.replace("+","")}</span><span className="btn btn-sm" onClick={this.addElement.bind(this,divIndex)}>+</span><span className="btn btn-sm" onClick={this.deleteElement.bind(this,divIndex)}>-</span></div>)
        }else if(value.trim().startsWith("-")){
          deleteIndex++;
          this.mergeContent.push(value.replace("-",""));
          return(<div className="bg-delete row" key={i} index={i}><span className="text-dark  line-no-width text-right">{this.deletedLines[deleteIndex-1]}</span><span className="text-danger col-md-11">{value.replace("-","")}</span><span className="btn btn-sm" onClick={this.addElement.bind(this,divIndex)}>+</span><span className="btn btn-sm" onClick={this.deleteElement.bind(this,divIndex)}>-</span></div>)
        }else{
          this.mergeContent.push(value.replace("*",""));
          lineNO++;
          return(<div className="row" key={i} index={i}><span className="vertical-border line-no-width">{lineNO}</span><span className="col-md-11">{value.replace("*","")}</span></div>)
        }
  })
return (<div className="card-body screen_background merge-container" >{comment}</div>);
}
}