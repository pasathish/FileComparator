var gitlab = require('node-gitlab');
 module.exports=()=>{
    var client = gitlab.create({
    api: 'https://gitlab.com/api/v4',
    privateToken: 'XvAUHwUzeUwBEd8BHAPo'
    });
    
    // client.milestones.list({id: "10557995"}, function (err, milestones) {
    // console.log(err, milestones);
    // });
    // client.projects.get({id: "10557995"}, function (err, milestones) {
    //     console.log(err, milestones);
    // });
    client.repositoryFiles.get({id : "10557995", file_path : "client/public/favicon.ico", ref:"master"},function (err, milestones) {
        console.log(err, milestones);
        });
 }