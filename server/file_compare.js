const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const Event = require('events');
let event = new Event();
module.exports = (app) => {
    
    
    /**UUID function togenerate unique Id for for file name */
    let create_UUID = () => {
        let time = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          var r = (time + Math.random() * 16) % 6 | 0;
          time = Math.floor(time / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
      }
  
    // /** Compare the shell output and file */
    // let doFileCompare=(pythonOutput) => {
    //   let file1LineNo=0;
    //   let file2LineNo=0;
    //   let resultList=[]
    //   let dataList=pythonOutput.split("\n");
    //   // console.log(dataList);
	//   for(var i=0;i<dataList.length;i++){
	// 	  line=dataList[i];
    //       if(line.startsWith("+")){
    //             resultList.push("+"+" "+file2LineNo);
    //             file2LineNo+=1;
    //       }else if(line.startsWith("-")){
    //             resultList.push("-"+" "+file1LineNo);
    //             file1LineNo+=1;
    //       }else if(line.startsWith(" ")){
    //             resultList.push("");
    //             file1LineNo+=1;
    //             file2LineNo+=1;
    //       }else if(line.startsWith("?")){
    //           let lastValue=resultList.pop();
    //             for(var j=0;j<line.length;j++){
    //                 if("^"===line[j]||"-"===line[j]||"+"===line[j])
    //                 {
    //                     lastValue+=" "+(j-1);
    //                 }
    //             }
    //             resultList.push(lastValue)
    //           console.log(dataList[i-1])
    //           console.log(dataList[i-1].length)
    //           console.log(line)
    //           console.log(line.length)
	// 		  i++;
	// 	  }
    //   }
    //   console.log("resultList",resultList)
    // if(resultList.length==0)
    //   resultList.push("*#*#File Format Not Supported*#*#")
    // // console.log("resultList",resultList)
    // return resultList;
    // }
	
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
		let filename = []
        let extend="";
        for (var i = 0; i < 2; i++) {
          let file = request.files.file[i];
          extend = path.extname(request.files.file[i].name.toString());
          filename.push(`${create_UUID()}${extend}`);
          console.log(filename[0])
          file.mv(`${__dirname}/public/${filename[i]}`, err => {
            if (err) {
              console.log(err);
              event.emit("sendErrorResponse", err);
              throw err;
            }
          });
        }
        let timeout = setTimeout(() => {
            event.emit('sendErrorResponse', "File Format not Supported", res);
        }, 10000);

        process1 = childProcess.spawn("python", ["PyfileCompare.py",`${__dirname}/public/${filename[0]}`,`${__dirname}/public/${filename[1]}`,`${condition}`]);
        shellOutput=""

        process1.stdout.on("data", (data) => {
        shellOutput+=data.toString();
        });
		
		process1.stderr.on("data", (data) => {
            event.emit('sendErrorResponse', data, res);
        });

        process1.on('close',()=>{
        clearTimeout(timeout);
        console.log(JSON.parse(shellOutput.toString()))
        res.send({ 'response': JSON.parse(shellOutput.toString()), error:false });
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