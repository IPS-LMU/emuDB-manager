# emuDB Manager

The emuDB manager is a part of the [EMU Speech Database Management System](https://ips-lmu.github.io/EMU.html).

The EMU-SDMS is a collection of software tools for the creation, manipulation and analysis of speech databases. At the core of the EMU-SDMS is a database search engine which allows the researcher to find various speech segments based on the sequential and hierarchical structure of the utterances in which they occur.

The emuDB Manager is a web front-end for research groups to manage a 
collection of EMU speech databases. It allows:

* Uploading, merging and renaming databases
* Creating and archiving bundle lists (bundle lists make a part of the 
database visible online to a certain editor and allows the editor to make 
changes and comments)
* Evaluating the online comments from editors

## Authors

The main author of the emuDB Manager is Markus Jochim (<markusjochim@phonetik.uni-muenchen.de>).

The main author of the EMU SDMS is Raphael Winkelmann (<raphael@phonetik.uni-muenchen.de>).


## Development notes

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.10.

### Development server

Run `ng serve -op serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

The `-op` (output path) option is set so `ng` does not pollute the `dist` directory, which is part of the git repo (which the `serve` directory is not as per `.gitignore`).

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Build & Deploy

The deployment process currently looks like this:

```bash
# Make sure the working directory is clean
# This is important becaus `ng build` will be based on the working dir and not on the HEAD revision
git status

# Clean and re-populate dist/
rm -r dist
ng build

# Commit the new version to git repo.
# The push is important for the following subtree push
git add dist/
git commit -m "new dev build" # 'dev build' because I have not started using the -prod flag for ng build
git push

# Copy the contents of `dist` directory from master branch (as stored on origin)
# to the root directory of build branch on origin
git subtree push --prefix dist origin build

# On the web server
git pull # or git fetch and then git merge if you are careful
chmod go+rX -R .
```
