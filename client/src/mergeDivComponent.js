import React, { Component } from 'react';
import './App.css';

export default class MergeChangesComponent extends Component {
  removeIndex=[]
  mergeContent=[]
  deletedLines=[]
  componentUpdate=true;
  constructor(props){
    super(props)
    this.state={
      "comment":[],
      "deletedLines":[],
  };
  }

  addElement(index,event){
    this.componentUpdate=false;
    //console.log("event",index)
    let span=event.currentTarget.parentElement.getElementsByTagName("span");
    //console.log(span)
    span[0].innerHTML="<ins>"+span[0].innerHTML.replace("<del>","").replace("</del>","")+"</ins>"
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
    //console.log(this.state)
    return this.mergeContent;
  }

  deleteElement(index,event){
    let span=event.currentTarget.parentElement.getElementsByTagName("span");
    span[0].innerHTML="<del>"+span[0].innerHTML.replace("<ins>","").replace("</ins>","")+"</del>"
    if(this.removeIndex.indexOf(index)===-1)
      this.removeIndex.push(index);
    this.componentUpdate=false
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
  //console.log("updated");
  }

  createContentList(file1Content,file2Content,shellOutPut){
    //console.log("shellOutPut type",typeof shellOutPut)
    let final_File=[]
    this.mergeContent=[]
    this.deletedLines=[]
    let file1Count=0;
    shellOutPut.map(line => {
        line=line.replace(new RegExp(/'/g),"").trim();
        if(line.length !=0){
         if(line.startsWith("-")){
            let lineNos=line.split(" ");
            let content=file1Content[lineNos[1]]
            if(lineNos.length>2){
               content=this.formSpanDiv(lineNos.slice(2),content," bg-delete-changes ")
            }
            final_File.push("-"+content)
            this.deletedLines.push(parseInt(lineNos[1])+1)
            this.mergeContent.push(file1Content[lineNos[1]]);
          }else if(line.startsWith("+")){
            let lineNos=line.split(" ");
            let content=file2Content[lineNos[1]]
            if(lineNos.length>2){
               content=this.formSpanDiv(lineNos.slice(2),content," bg-add-changes ")
            }
            final_File.push("+"+content)
            file1Count--;
            this.mergeContent.push(file2Content[lineNos[1]]);
          }
        }
        else{
          final_File.push("*"+file1Content[file1Count])
          this.mergeContent.push(file1Content[file1Count]);
        }
        file1Count++;
    });
    //console.log(final_File)
    if(final_File.length==0 && file1Content.length==1 )
        final_File.push("*"+file1Content[0])
        this.mergeContent.push(file1Content[0]);
    return final_File;
  }


  formSpanDiv(lineNos,content,cssClass){
      let finalString=""
      for(var i=0;i<content.length;i++){
          if(lineNos.indexOf(""+(i+1))!=-1)
            finalString+="\<span class=\""+cssClass+"\"\>"+content[i]+"\</span\>"
          else
            finalString+=content[i]  
      }
      return finalString;
  }

  componentDidMount(){
    //console.log("componentDidUpdate",this.mergeContent)
    let state=this.props.parentScope.state
    state['mergeComponentContent']=this.mergeContent
    this.props.parentScope.setState(state);
    //console.log(this.refs.table);
  }

  
  shouldComponentUpdate(){
    let tem=this.componentUpdate;
    this.componentUpdate=true;
    return tem;
  }

  componentDidUpdate(){
    let spanList=this.refs.table.getElementsByClassName("inner-code-span");
    for(let i=0;i<spanList.length;i++){
      console.log(spanList[i].innerHTML)
      if(spanList[i].innerText.indexOf("<span ")!=-1)
        spanList[i].innerHTML=spanList[i].innerText;
      console.log(spanList[i].innerHTML)
      this.componentUpdate=false;
    }
   }

render(){
  let divIndex=0;
  let lineNO=0;
  let deleteIndex=0;
  var mergedFileWithChanges=[]
  //console.log("fthile1  ", this.props.file1);
  //console.log("file2"+typeof this.props.file2);
  if(this.props.file1){
    mergedFileWithChanges = this.createContentList(this.props.file1.split("\n"),this.props.file2.split("\n"),this.props.comment)
  }
var comment=mergedFileWithChanges.map((value,i)=>{
          divIndex++;
        if(value.trim().startsWith("+")){
          lineNO++;
         // this.mergeContent.push(value.replace("+",""));
          return(<tr className="bg-add inner-text row" key={i} index={i}><td className="text-dark bg-lineno-add line-overflow lineno">{lineNO}</td><td className="lineno bg-lineno-add"></td><td className="text-success code"><span className="line-overflow inner-code-span">{value.replace("+","")}</span></td><td className="pointer" onClick={this.addElement.bind(this,divIndex)}>+</td><td className="pointer" onClick={this.deleteElement.bind(this,divIndex)}>-</td></tr>)
        }else if(value.trim().startsWith("-")){
          deleteIndex++;
         // this.mergeContent.push(value.replace("-",""));
          return(<tr className="bg-delete inner-text row" key={i} index={i}><td className="lineno bg-lineno-delete"></td><td className="text-dark bg-lineno-delete  line-overflow text-right lineno">{this.deletedLines[deleteIndex-1]}</td><td className="text-danger code"><span className="line-overflow inner-code-span">{value.replace("-","")}</span></td><td className="pointer" onClick={this.addElement.bind(this,divIndex)}>+</td><td className="pointer" onClick={this.deleteElement.bind(this,divIndex)}>-</td></tr>)
        }else{
         // this.mergeContent.push(value.replace("*",""));
          lineNO++;
          return(<tr className="row inner-text" key={i} index={i}><td className="vertical-border line-overflow lineno">{lineNO}</td><td className="lineno"></td><td className="code"><span className="line-overflow inner-code-span">{value.replace("*","")}</span></td></tr>)
        }
  })
return (<table ref="table" className="card-body screen_background merge-container" ><tbody>{comment}</tbody></table>);
}
}