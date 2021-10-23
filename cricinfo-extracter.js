// the purpose of this project is to extract information of worldcup 2019 from cricinfo and present
// that in the form of excel and pdf scorecards
// the real purpose is to learn how to extract information and get experience with js

//run-> node filename.js --source= "https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results" --excel=worldcup.csv --dataFolder=data
//installation of all libraries
let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let excel4node = require("excel4node");
let pdf = require("pdf-lib");
let fs = require("fs");
let args = minimist(process.argv);
let path = require("path");
//download data using axios

let responseKaPromise = axios.get(args.source);
responseKaPromise.then(function(response){
//get html via axios
let html = response.data;
let JSDOM = jsdom.JSDOM;
let dom = new JSDOM(html);
let document = dom.window.document;
let matches = [];    //matches array
let matchDivs = document.querySelectorAll("div.match-score-block");
for(let i = 0;i<matchDivs.length;i++){
    let matchDiv = matchDivs[i];
let match={
t1:"",
t2:"",
t1s:"",
t2s:"",
result:""
};
let teamParas = matchDiv.querySelectorAll("div.name-detail>p.name");
match.t1 = teamParas[0].textContent;
match.t2 = teamParas[1].textContent;
let scoreSpans = matchDiv.querySelectorAll("div.score-detail>span.score");
if (scoreSpans.length == 2) {                        //if both matches were conducted
    match.t1s = scoreSpans[0].textContent;
    match.t2s = scoreSpans[1].textContent;
} else if (scoreSpans.length == 1) {                 //if single match occured
    match.t1s = scoreSpans[0].textContent;
    match.t2s = "";
} else {                                              //if no match occured
    match.t1s = "";
    match.t2s = "";
}
let resultSpan = matchDiv.querySelector("div.status-text > span");
match.result = resultSpan.textContent;
matches.push(match);         
}

let matchesJSON = JSON.stringify(matches);
fs.writeFileSync("matches.json",matchesJSON,"utf-8");
let teams =[];
for(let i = 0;i<matches.length;i++){  
    pushTeamInTeamsIfNotAlreadyThere(teams,matches[i].t1);
    pushTeamInTeamsIfNotAlreadyThere(teams,matches[i].t2);    
}

for(let i = 0; i < matches.length; i++){
    addMatchToSpecificTeam(teams, matches[i].t1, matches[i].t2, matches[i].t1s, matches[i].t2s, matches[i].result);
    addMatchToSpecificTeam(teams, matches[i].t2, matches[i].t1, matches[i].t2s, matches[i].t1s, matches[i].result);
}

let teamsJSON = JSON.stringify(teams);
fs.writeFileSync("teams.json",teamsJSON,"utf-8");
createExcelFile(teams,args.excel);   
createFolderAndPdfs(teams,args.dataFolder);
});

 function createFolderAndPdfs(teams,dataFolder){
    
     //if a dir is already there we ll not re create it
    

     if(fs.existsSync(dataFolder) == true){
        fs.rmdirSync(dataFolder, { recursive: true });
    }

    fs.mkdirSync(dataFolder);

     
     for(let i=0;i<teams.length;i++){
      //making path
         let teamFolderName = path.join(dataFolder,teams[i].name);
         if(fs.existsSync(teamFolderName)==false){
            fs.mkdirSync(teamFolderName); 
         }
  
         for (let j = 0; j < teams[i].matches.length; j++){
             let match = teams[i].matches[j];                     //vs.pdf
             createMatchScoreCardPdf(teamFolderName,teams[i].name,match);
         }
     }
 }

function createMatchScoreCardPdf(teamFolderName,homeTeam,match){
    let  matchFileName = path.join(teamFolderName,match.vs +".pdf");
    fs.writeFileSync(matchFileName,"","utf-8");
    let templateFileBytes = fs.readFileSync("Result.pdf");
    let pdfDocKaPromise = pdf.PDFDocument.load(templateFileBytes);
    pdfDocKaPromise.then(function(pdfdoc){
      let page = pdfdoc.getPage(0);
      page.drawText(homeTeam ,{
        x:318,
        y:570,
        size:13
      });
      page.drawText(match.vs ,{
        x:318,
        y:547,
        size:13
       });
      page.drawText(match.selfScore ,{
        x:318,
        y:520,
        size:13
       });
      page.drawText(match.oppScore ,{
        x:318,
        y:500,
        size:13
       });
      page.drawText(match.result ,{
        x:318,
        y:474,
        size:13
       });
        
      //saving the changes made uptil here.
      let changedBytesKaPromise = pdfdoc.save();
      changedBytesKaPromise.then(function(changedBytes){
          fs.writeFileSync(matchFileName,changedBytes);

      });
    });

}
 


function createExcelFile(teams,excelFileName) {     
    let wb = new excel4node.Workbook(); 
    var hs = wb.createStyle({
        font:{
            bold: true,
            //underline : true ,
            size: 15,
        },
        fill:{
            type: 'pattern',
            patternType: 'solid',
            fgColor: 'yellow'
        
        },
        border: {
            left: {
                style: 'double', 
                color: 'black' 
            },
            right: {
                style: 'double', 
                color: 'black' 
            },
            top: {
                style: 'double', 
                color: 'black' 
            },
            bottom: {
                style: 'double', 
                color: 'black' 
            },
            outline:true
        }
    });

    for (let i = 0; i < teams.length; i++) {          
        let sheet = wb.addWorksheet(teams[i].name);

        sheet.cell(1, 1).string("VS").style(hs);
        sheet.cell(1, 2).string("Self Score").style(hs);
        sheet.cell(1, 3).string("Opp Score").style(hs);
        sheet.cell(1, 4).string("Result").style(hs);
        for (let j = 0; j < teams[i].matches.length; j++) {  
            sheet.cell(2 + j, 1).string(teams[i].matches[j].vs);
            sheet.cell(2 + j, 2).string(teams[i].matches[j].selfScore);
            sheet.cell(2 + j, 3).string(teams[i].matches[j].oppScore);
            sheet.cell(2 + j, 4).string(teams[i].matches[j].result);
        }
    }

    wb.write(excelFileName);  //write step
}

function addMatchToSpecificTeam(teams, homeTeam, oppTeam, selfScore, oppScore, result){
    let tidx = -1;
    for(let i = 0; i < teams.length; i++){
        if(teams[i].name == homeTeam){
            tidx = i;
            break;
        }
    }

    let team = teams[tidx];
    team.matches.push({
        vs: oppTeam,
        selfScore: selfScore,
        oppScore: oppScore,
        result: result
    });
}
function pushTeamInTeamsIfNotAlreadyThere(teams,teamName){
    let tidx = -1;
    for(let j = 0 ;j<teams.length;j++){
        if(teams[j].name == teamName){
            tidx = j;
            break;
        }
  } 
       if(tidx==-1){
           let team ={
               name:teamName,
               matches:[]
           };
           teams.push(team);
       }
}
