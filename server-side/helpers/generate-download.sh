#!/bin/sh

##
## Generates a ZIP file with a given version of a given emuDB for users to download.
##
## Speech databases managed by emuDB-Manager are git repositories containing an
## emuDB. This script takes a "tree-ish" (which can be a commit, tree, or tag;
## see git-checkout(1)) and a path to a repository. A zip file with that repo
## is created with HEAD pointing to the given tree-ish. The script also takes a
## path to a project directory, in which the zip file will be stored.

##
## Usage:
## generate-download.sh <projectDirectory> <repoPath> <tree-ish>
##
## IMPORTANT: The parameters are not escaped - DO NOT pass arguments from
##            untrusted sources (such as a browser) without validating them.
##

projectDirectory="$1"
repoPath="$2"
treeish="$3"

#####
# Check whether directories exist (and quit if they do not)
#
[ -d "$projectDirectory" ] || exit 1
[ -d "$repoPath" ] || exit 2



######
## Derive other dir and file names
#
dbName=$(basename "$repoPath" _emuDB)
processDir="$projectDirectory/processing/$$"
targetDir="$processDir/${dbName}_emuDB"
zipFilename="${dbName}_emuDB.${treeish}.zip"
finalTarget="$projectDirectory/downloads/$zipFilename"

logFile="$processDir/process.log"


#####
## Create working directory
#
if [ ! -e "$processDir" ]
then
	mkdir -p "$processDir" || exit 3
fi


echo "$(date) Created working directory" >> "$logFile"



#####
## Check if zip file already exists (quit if it does)
#
if [ -e "$finalTarget" ]
then
	echo "$(date) Requested zip file exists already" >> "$logFile"
	exit 4
fi



#####
## Clone repository, check out the desired version, and zip it up
#
echo "$(date) Running git clone" >> "$logFile"
git clone --local --no-hardlinks --no-checkout "$repoPath" "$targetDir" &>> "$logFile" || exit 5

echo "$(date) Running git reset" >> "$logFile"
git -C "$targetDir" reset --hard -q "$treeish" &>> "$logFile" || exit 6

echo "$(date) Running git remote remove origin" >> "$logFile"
git -C "$targetDir" remote remove origin &>> "$logFile" || exit 7

echo "$(date) Running zip" >> "$logFile"
cd "$processDir" || exit 8
zip -qr0 "$zipFilename" "${dbName}_emuDB/" &>> "$logFile" || exit 9

echo "$(date) Removing clone" >> "$logFile"
rm -r "${dbName}_emuDB/" &>> "$logFile" || exit 10

echo "$(date) Storing zip file in downloads" >> "$logFile"
mv "$zipFilename" "$finalTarget" &>> "$logFile" || exit 11

#cd ..
#rmdir "$processDir" || exit 12


exit 0

