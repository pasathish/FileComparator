import json
import sys
import difflib
oldFileName=sys.argv[1]
updatedFileName=sys.argv[2]
flagValue=sys.argv[3]
resultList=[]
file2LineNo=0;
file1LineNo=0;
oldFile=[];
updatedFile=[];
with open(oldFileName,"r") as oldFileObject:
	oldFile=oldFileObject.readlines();

with open(updatedFileName,"r") as updatedFileObject:
	updatedFile=updatedFileObject.readlines();

diff=difflib.Differ()
if("1" in flagValue):
	oldTempList=[]
	updatedTempList=[]
	for line in oldFile:
		oldTempList.append(line.lower());
	for line in updatedFile:
		updatedTempList.append(line.lower());
	oldFile=oldTempList;
	updatedFile=updatedTempList;

if("2" in flagValue):
	oldTempList=[]
	updatedTempList=[]
	for line in oldFile :
		oldTempList.append(line.replace(" ",""));
	for line in updatedFile :
		updatedTempList.append(line.replace(" ",""));
	oldFile=oldTempList;
	updatedFile=updatedTempList;


#result=diff.compare(oldFileList,updatedFileList);
result=difflib.ndiff(oldFile,updatedFile);
for line in result:
	# print(line);
	if(line.startswith("+")):
		resultList.append("+"+" "+str(file2LineNo));
		file2LineNo+=1;
	elif(line.startswith("-")):
		resultList.append("-"+" "+str(file1LineNo));
		file1LineNo+=1;
	elif(line.startswith(" ")):
		resultList.append("");
		file1LineNo+=1;
		file2LineNo+=1;
	elif(line.startswith("?")):
		lastValue=resultList.pop();
		j=0
		while(j<len(line)):
			if("^" in line[j] or "-" in line[j] or "+" in line[j]):
				lastValue+=" "+str(j-1);
			j+=1;
		resultList.append(lastValue);
print(json.dumps(resultList));
