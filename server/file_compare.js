const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const Event = require('events');
let event = new Event();
module.exports = (app) => {
	
    /** Compare the shell output and file */
    let doFileCompare=(pythonOutput) => {
      let file1LineNo=0;
      let file2LineNo=0;
      let resultList=[]
      let dataList=pythonOutput.split("\n");
      // console.log(dataList);
	  for(var i=0;i<dataList.length;i++){
		  line=dataList[i];
          if(line.startsWith("+")){
                resultList.push("+"+" "+file2LineNo);
                file2LineNo+=1;
          }else if(line.startsWith("-")){
                resultList.push("-"+" "+file1LineNo);
                file1LineNo+=1;
          }else if(line.startsWith(" ")){
                resultList.push("");
                file1LineNo+=1;
                file2LineNo+=1;
          }else if(line.startsWith("?")){
              let lastValue=resultList.pop();
                for(var j=0;j<line.length;j++){
                    if("^"===line[j]||"-"===line[j]||"+"===line[j])
                    {
                        lastValue+=" "+(j-1);
                    }
                }
                resultList.push(lastValue)
              console.log(dataList[i-1])
              console.log(dataList[i-1].length)
              console.log(line)
              console.log(line.length)
			  i++;
		  }
      }
      //console.log("resultList",resultList)
    if(resultList.length==0)
      resultList.push("*#*#File Format Not Supported*#*#")
    // console.log("resultList",resultList)
    return resultList;
    }
	
    /**File Upload router part and shell execution */
    app.route("/uploadFile").post((request, res, next) => {
        process.on("error",(err)=>{
        res.send({ 'response': 'check' , error:false })
        console.log(err)
        })

        process.on('uncaughtException', (err) => {
        console.log(err)
        res.send({ 'response': 'check' , error:false })
        });

        condition = request.body.compareCondition.toString().replace(new RegExp(',','g'),' ');
        
		console.log("condition",condition)
		
        let timeout = setTimeout(() => {
            event.emit('sendErrorResponse', "File Format not Supported", res);
        }, 10000);

        process1 = childProcess.spawn("python", ["PyfileCompare.py",`${request.files.file[0].data.toString()}`,`${request.files.file[1].data.toString()}`,`${condition}`]);
        shellOutput=""

        process1.stdout.on("data", (data) => {
        shellOutput+=data.toString();
        });
		
		process1.stderr.on("data", (data) => {
            event.emit('sendErrorResponse', data, res);
        });

        process1.on('close',()=>{
        clearTimeout(timeout);
        console.log(shellOutput.toString())
        res.send({ 'response': doFileCompare(shellOutput.toString()), error:false });
        })

        process1.on("error", (data) => { console.log("process error", data) });
            
    });

        event.on('sendErrorResponse', (data, res) => {
            console.log("data", data.toString('utf8'));
            res.status(500).send({ 'response': "Sorry !!! File format not supported",error:true });
            res.end();
          });

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
         res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
    }      