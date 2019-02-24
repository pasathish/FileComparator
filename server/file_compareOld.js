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

    /** Compare the shell output and file */
    let doFileCompare=(datafile,file1) => {
      file1data=fs.readFileSync(file1,"utf8")
      let data=fs.readFileSync(datafile,"utf8")
      //console.log("454664546",file1data)
      //console.log("9787445154",data.toString())
      let inputfile=file1data.toString().split("\n");
      console.log(inputfile);
      let file1LineNo=0;
      let file2LineNo=0;
      let resultList=[]
      let dataList=data.split("\n");
      console.log(dataList);
      dataList.map(line => {
          line=line.trim();
          pipeCompare=""
          pipeCompare=inputfile[file1LineNo].trim();
          console.log("pipeCompare",pipeCompare)
          console.log("line",line.length)
          if(pipeCompare.length>57){
            pipeCompare=pipeCompare.substring(0,57)
          }
		  line=(line.replace(pipeCompare,"").trim()).trim();
          if(line.endsWith("(")){
                resultList.push("");
                file1LineNo+=1;
                file2LineNo+=1;
          }else if(line.endsWith("<")){
                resultList.push("-"+" "+file1LineNo);
                file1LineNo+=1;
          }else if(line.replace(pipeCompare,"").trim().startsWith("|")){
                resultList.push("+-"+" "+file1LineNo+" "+file2LineNo);
                file1LineNo+=1;
                file2LineNo+=1;
          }else if(line.startsWith(">")){
                resultList.push("+"+" "+file2LineNo);
                file2LineNo+=1;
          }
          // console.log("pipeCompare",pipeCompare);
          // console.log("line",line)
      })
    if(resultList.length==0)
      resultList.push("*#*#File Format Not Supported*#*#")
    console.log("resultList",resultList)
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
       // console.log(request.body);
        condition = request.body.compareCondition.toString().replace(new RegExp(',','g'),' ');
        // console.log("ha ha ha ha ha ha ha ah",condition)
        //console.log("file1", request.files.file[0]);
       //console.log("file2", request.files.file[1]);
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
            event.emit('doUnlink', filename);
          }, 10000);
        process1 = childProcess.spawn("sdiff", [condition.trim(),`${__dirname}\\public\\${filename[0]}`, `${__dirname}\\public\\${filename[1]}`]);
        shellOutput=""
        process1.stdout.on("data", (data) => {
          shellOutput+=data.toString();
        });
        process1.on('close',()=>{
          clearTimeout(timeout);
          console.log("Hello World",shellOutput.toString())
          filename.push(`${create_UUID()}${extend}`);
          fs.writeFileSync(`${__dirname}\\public\\${filename[filename.length-1]}`, shellOutput.toString(),function(){});
          //console.log(" Data=======",doFileCompare(data.toString('utf8'),request.files.file[0].toString('utf8')));
          res.send({ 'response': doFileCompare(`${__dirname}\\public\\${filename[2]}`,`${__dirname}\\public\\${filename[0]}`), error:false });
          event.emit('doUnlink', filename);
        })
        process1.on("error", (data) => { console.log("process error", data) });
        process1.stderr.on("data", (data) => {
            event.emit('sendErrorResponse', data, res);
            event.emit('doUnlink', filename);
            //console.log("script error", data.toString('utf8'));
          });
        });

        event.on('doUnlink', (filename) => {
            fs.unlink(`${__dirname}\\public\\${filename[0]}`, () => { console.log(`${filename[0]} removed`) });
            fs.unlink(`${__dirname}\\public\\${filename[1]}`, () => { console.log(`${filename[1]} removed`) });
            fs.unlink(`${__dirname}\\public\\${filename[2]}`, () => { console.log(`${filename[2]} removed`) });
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