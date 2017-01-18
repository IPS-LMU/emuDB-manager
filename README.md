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
* Keeping a history of changes to the database (using git)
* Managing a small portion of DBconfig options

## How to use the manager

@IPS-LMU aims to offer speech database hosting as a service for the 
scientific community in the long run. If you are interested in such a service
right now, get in touch with the authors and we might be able to offer you an 
option.
  
You are of course free to use your own hosting resources to install the emuDB
Manager. It is best to install the [EMU-WebSocket-Server](https://github.com/IPS-LMU/IPS-EMUprot-nodeWSserver)
along with it.

## Authors

The main author of the emuDB Manager is Markus Jochim (<markusjochim@phonetik.uni-muenchen.de>).

The main author of the EMU SDMS is Raphael Winkelmann (<raphael@phonetik.uni-muenchen.de>).


## Development notes

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.10 (and updated to beta.24).

### Development server

Run `ng serve -op serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

The `-op` (output path) option is set so `ng` does not pollute the `dist` directory, which is part of the git repo (which the `serve` directory is not as per `.gitignore`).

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Build & Deploy

The deployment process currently looks like this:

```bash
##### On your development machine

# Make sure the working directory is clean
# This is important becaus `ng build` will be based on the working dir and not on the HEAD revision
git status

# Clean and re-populate dist/
rm -r dist
ng build --prod

# Commit the new version to git repo.
# The push is important for the following subtree push
git add dist/
git commit
git push

# Copy the contents of `dist` directory from master branch (as stored on origin)
# to the root directory of build branch on origin
git subtree push --prefix dist origin build

###### On the web server

# Download current version of build branch
git fetch

# This will tell you if the web server’s local branch can be fast-forwarded,
# which should always be the case.
git status

# Do the fast-forward
git pull

# Make sure the web server can read all files
chmod go+rX -R .

# The config file will be protected by means of ACL
chmod 600 server-side/emudb-manager.config.php
setfacl -m mask:r server-side/emudb-manager.config.php
```

### Initial deploy

The first time you deploy emuDB Manager on your web server, you do a `git clone` and then a `git checkout build`.

Protect the config file (server-side/emudb-manager.config.php) by means of ACL.
