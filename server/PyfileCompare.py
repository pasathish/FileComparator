import sys
import difflib
oldFile=sys.argv[1]
updatedFile=sys.argv[2]
flagValue=sys.argv[3]

diff=difflib.Differ()
if("1" in flagValue):
	oldFile=oldFile.lower();
	updatedFile=updatedFile.lower();
if("2" in flagValue):
	oldFile=oldFile.replace(" ","");
	updatedFile=updatedFile.replace(" ","");

oldFileList=oldFile.split("\n");
updatedFileList=updatedFile.split("\n");

#result=diff.compare(oldFileList,updatedFileList);
result=difflib.ndiff(oldFileList,updatedFileList);
for line in result:
	print(line);