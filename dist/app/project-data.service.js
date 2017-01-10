"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var ProjectDataService = (function () {
    function ProjectDataService(http) {
        this.http = http;
        this._connectionCount = 0;
        this.emuWebAppURL = 'https://ips-lmu.github.io/EMU-webApp/';
        this.nodeJSServerURL = 'wss://webapp2.phonetik.uni-muenchen.de:17890/manager';
        this.url = 'https://www.phonetik.uni-muenchen.de/apps/emuDB-manager/server-side/emudb-manager.php';
        this.username = '';
        this.password = '';
        this.createHotObservable();
    }
    ProjectDataService.prototype.createHotObservable = function () {
        var _this = this;
        this.infoObservable = Rx_1.Observable.create(function (observer) {
            _this.infoObserver = observer;
        }).publishReplay(1);
        this.infoObservable.connect();
    };
    ProjectDataService.prototype.fetchData = function () {
        var _this = this;
        var params = {
            query: 'project_info'
        };
        this.serverQuery(params).subscribe(function (next) {
            if (next.success === true) {
                _this.infoObserver.next(next.data);
            }
            else {
                if (next.data === 'BAD_LOGIN') {
                    _this.infoObserver.error('BAD_LOGIN');
                    _this.createHotObservable();
                }
                else {
                    console.log('Unknown error in server response');
                }
            }
        });
    };
    ProjectDataService.prototype.serverQuery = function (params) {
        var _this = this;
        console.log('Querying server', params);
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ headers: headers });
        params.user = this.username;
        params.password = this.password;
        var body = '';
        for (var i in params) {
            if (body != '') {
                body += '&';
            }
            body += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]);
        }
        ++this._connectionCount;
        return this.http
            .post(this.url, body, options)
            .map(function (response) {
            --_this._connectionCount;
            var json = response.json();
            console.log('Received JSON data', json);
            return json;
        })
            .catch(function (error) {
            --_this._connectionCount;
            return Rx_1.Observable.throw('Error during download', error);
        });
    };
    ProjectDataService.prototype.serverQueryWithDefaultSubscription = function (params) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.serverQuery(params).subscribe(function (next) {
                if (next.success === true) {
                    observer.next(next.data);
                    observer.complete();
                }
                else {
                    observer.error(next);
                }
            });
        });
    };
    ProjectDataService.prototype.login = function (username, password) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.username = username;
            _this.password = password;
            var params = {
                query: 'login'
            };
            _this.serverQuery(params).subscribe(function (next) {
                if (next.success === true) {
                    observer.next(null);
                    observer.complete();
                    _this.fetchData();
                }
                else {
                    observer.error(next);
                }
            });
        });
    };
    ProjectDataService.prototype.logout = function () {
        this.createHotObservable();
    };
    ProjectDataService.prototype.getAllDatabases = function () {
        return this.infoObservable.map(function (x) {
            return x.databases;
        });
    };
    ProjectDataService.prototype.getAllBundleLists = function () {
        return this.infoObservable.map(function (x) {
            var result = [];
            for (var i = 0; i < x.databases.length; ++i) {
                result = result.concat(x.databases[i].bundleLists);
            }
            return result;
        });
    };
    ProjectDataService.prototype.getBundleList = function (database, name, archiveLabel) {
        return this.infoObservable.map(function (x) {
            for (var i = 0; i < x.databases.length; ++i) {
                if (x.databases[i].name === database) {
                    for (var j = 0; j < x.databases[i].bundleLists.length; ++j) {
                        if (x.databases[i].bundleLists[j].name === name
                            && x.databases[i].bundleLists[j].archiveLabel === archiveLabel) {
                            return x.databases[i].bundleLists[j];
                        }
                    }
                }
            }
            return null;
        });
    };
    /**
     * Returns the info object for a single database
     *
     * @param name The name of the database in question
     * @returns A DatabaseInfo object if the DB exists, otherwise null
     */
    ProjectDataService.prototype.getDatabase = function (name) {
        return this.infoObservable.map(function (x) {
            for (var i = 0; i < x.databases.length; ++i) {
                if (x.databases[i].name === name) {
                    return x.databases[i];
                }
            }
            return null;
        });
    };
    ProjectDataService.prototype.getName = function () {
        return this.infoObservable.map(function (x) {
            return x.name;
        });
    };
    ProjectDataService.prototype.getDownloads = function (database) {
        return this.infoObservable.map(function (x) {
            return x.downloads.filter(function (value) {
                return (value.database == database);
            });
        });
    };
    ProjectDataService.prototype.getAllUploads = function () {
        return this.infoObservable.map(function (x) {
            return x.uploads;
        });
    };
    ProjectDataService.prototype.getUpload = function (uuid) {
        return this.infoObservable.map(function (x) {
            for (var i = 0; i < x.uploads.length; ++i) {
                if (x.uploads[i].uuid === uuid) {
                    return x.uploads[i];
                }
            }
            return null;
        });
    };
    ProjectDataService.prototype.countBundles = function (sessions) {
        var result = 0;
        for (var i = 0; i < sessions.length; ++i) {
            result += sessions[i].bundles.length;
        }
        return result;
    };
    ProjectDataService.prototype.renameDatabase = function (oldName, newName) {
        return this.serverQueryWithDefaultSubscription({
            query: 'rename_db',
            old_name: oldName,
            new_name: newName
        });
    };
    ProjectDataService.prototype.setDatabaseConfiguration = function (database, bundleComments, bundleFinishedEditing) {
        return this.serverQueryWithDefaultSubscription({
            query: 'set_database_configuration',
            database: database,
            bundleComments: bundleComments,
            bundleFinishedEditing: bundleFinishedEditing
        });
    };
    ProjectDataService.prototype.addTag = function (database, commit, label) {
        return this.serverQueryWithDefaultSubscription({
            query: 'add_tag',
            database: database,
            commit: commit,
            label: label
        });
    };
    ProjectDataService.prototype.editBundleList = function (database, name, archiveLabel, newName, newArchiveLabel) {
        return this.serverQueryWithDefaultSubscription({
            'query': 'edit_bundle_list',
            'database': database,
            'old_name': name,
            'old_archive_label': archiveLabel,
            'new_name': newName,
            'new_archive_label': newArchiveLabel
        });
    };
    ProjectDataService.prototype.getUploadTarget = function () {
        return {
            url: this.url,
            params: {
                'user': this.username,
                'password': this.password,
                'query': 'upload'
            }
        };
    };
    ProjectDataService.prototype.getDownloadTarget = function (database, treeish) {
        return {
            url: this.url,
            options: {
                query: 'download_database',
                user: this.username,
                password: this.password,
                database: database,
                treeish: treeish
            }
        };
    };
    ProjectDataService.prototype.deleteUpload = function (identifier) {
        return this.serverQueryWithDefaultSubscription({
            'query': 'delete_upload',
            'uuid': identifier
        });
    };
    ProjectDataService.prototype.deleteBundleList = function (database, bundleList) {
        return this.serverQueryWithDefaultSubscription({
            query: 'delete_bundle_list',
            database: database,
            name: bundleList.name,
            archive_label: bundleList.archiveLabel
        });
    };
    ProjectDataService.prototype.saveUpload = function (identifier, name) {
        return this.serverQueryWithDefaultSubscription({
            'query': 'save_upload',
            'uuid': identifier,
            'name': name
        });
    };
    ProjectDataService.prototype.createArchive = function (databaseName, treeish) {
        return this.serverQueryWithDefaultSubscription({
            'query': 'create_archive',
            'database': databaseName,
            'treeish': treeish
        });
    };
    ProjectDataService.prototype.duplicateBundleList = function (database, bundleList, newName, commentedOnly) {
        //
        // Create a modified copy of `bundleList`
        var newBundleList = {
            name: bundleList.name,
            archiveLabel: bundleList.archiveLabel,
            items: []
        };
        // Copy the items from `bundleList` to `newBundleList`
        for (var i = 0; i < bundleList.items.length; ++i) {
            if (commentedOnly && !bundleList.items[i].comment) {
                continue;
            }
            newBundleList.items.push({
                name: bundleList.items[i].name,
                session: bundleList.items[i].session,
                comment: bundleList.items[i].comment,
                finishedEditing: false
            });
        }
        //
        // Send query to server
        return this.serverQueryWithDefaultSubscription({
            query: 'save_bundle_list',
            database: database,
            name: newName,
            list: JSON.stringify(newBundleList.items)
        });
    };
    ProjectDataService.prototype.generateBundleList = function (database, sessionPattern, bundlePattern, editors, personsPerBundle, shuffled) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            //////////
            // Check parameter constraints
            //
            if (editors.length < personsPerBundle) {
                observer.error({
                    message: 'Invalid parameters.'
                });
                return;
            }
            //
            //////////
            _this.getDatabase(database).map(function (dbInfo) {
                if (dbInfo === null) {
                    observer.error('Invalid database specified');
                    return;
                }
                for (var i = 0; i < editors.length; ++i) {
                    for (var j = 0; j < dbInfo.bundleLists.length; ++j) {
                        if (editors[i] === dbInfo.bundleLists[j].name && dbInfo.bundleLists[j].archiveLabel === '') {
                            observer.error({
                                message: 'Editor already has a' + ' non-archived bundle list: ' + editors[i]
                            });
                            return;
                        }
                    }
                }
                var sessionRegex = new RegExp(sessionPattern);
                var bundleRegex = new RegExp(bundlePattern);
                //////////
                // Select the bundles to add to the newly generated bundle list(s)
                //
                var bundleListSource = [];
                for (var i = 0; i < dbInfo.sessions.length; ++i) {
                    if (sessionRegex.test(dbInfo.sessions[i].name)) {
                        for (var j = 0; j < dbInfo.sessions[i].bundles.length; ++j) {
                            if (bundleRegex.test(dbInfo.sessions[i].bundles[j])) {
                                bundleListSource.push({
                                    session: dbInfo.sessions[i].name,
                                    name: dbInfo.sessions[i].bundles[j],
                                    comment: '',
                                    finishedEditing: false
                                });
                            }
                        }
                    }
                }
                //
                //////////
                //////////
                // Shuffle bundle list source if so requested
                //
                if (shuffled) {
                }
                //
                //////////
                //////////
                // Distribute bundles among editors
                //
                // Prepare a bundle list for each editor
                var resultBundleLists = [];
                for (var i = 0; i < editors.length; ++i) {
                    resultBundleLists.push({
                        name: editors[i],
                        archiveLabel: '',
                        items: []
                    });
                }
                // The next editor who will receive a bundle
                var nextEditor = -1;
                for (var i = 0; i < bundleListSource.length; ++i) {
                    for (var j = 0; j < personsPerBundle; ++j) {
                        nextEditor += 1;
                        if (nextEditor >= editors.length) {
                            nextEditor = 0;
                        }
                        resultBundleLists[nextEditor].items.push(bundleListSource[i]);
                    }
                }
                //
                //////////
                var successCount = 0;
                for (var i = 0; i < resultBundleLists.length; ++i) {
                    var params = {
                        query: 'save_bundle_list',
                        database: database,
                        name: resultBundleLists[i].name,
                        list: JSON.stringify(resultBundleLists[i].items)
                    };
                    _this.serverQuery(params).subscribe(function (next) {
                        if (next.success === true) {
                            ++successCount;
                            observer.next(null);
                            if (successCount === resultBundleLists.length) {
                                observer.complete();
                            }
                        }
                        else {
                            observer.error(next);
                            return;
                        }
                    });
                }
            }).subscribe().unsubscribe();
        });
    };
    ProjectDataService.prototype.getEmuWebAppURL = function (database) {
        var _this = this;
        return this.getName().map(function (projectName) {
            var url = _this.emuWebAppURL;
            url += '?autoConnect=true&serverUrl=';
            var nodeJS = _this.nodeJSServerURL;
            // we should not use this.username here but rather something
            // retrieved from the server (which doesnt exist yet;
            // this.getName() isn't right either but it's used so the
            // function is async already)
            nodeJS += '/' + _this.username + '/databases/' + database;
            url += encodeURIComponent(nodeJS);
            return url;
        });
    };
    Object.defineProperty(ProjectDataService.prototype, "connectionCount", {
        get: function () {
            return this._connectionCount;
        },
        set: function (value) {
            this._connectionCount = value;
        },
        enumerable: true,
        configurable: true
    });
    ProjectDataService.prototype.getCommitList = function (database) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            var params = {
                query: 'list_commits',
                database: database
            };
            _this.serverQuery(params).subscribe(function (next) {
                if (next.success === true) {
                    var sortedResult = [];
                    var currentMonth = void 0;
                    var currentDay = void 0;
                    for (var i = 0; i < next.data.length; ++i) {
                        var dateTime = next.data[i].date;
                        var month = dateTime.substring(0, 7);
                        var day = dateTime.substring(0, 10);
                        var time = dateTime.substring(11);
                        if (month !== currentMonth) {
                            sortedResult.push({
                                month: month,
                                open: false,
                                days: []
                            });
                        }
                        currentMonth = month;
                        var monthObject = sortedResult[sortedResult.length - 1];
                        if (day !== currentDay) {
                            monthObject.days.push({
                                day: day,
                                open: false,
                                commits: []
                            });
                        }
                        currentDay = day;
                        var dayObject = monthObject.days[monthObject.days.length - 1];
                        dayObject.commits.push({
                            commitID: next.data[i].commitID,
                            dateTime: time,
                            message: next.data[i].message,
                            tagLabel: ''
                        });
                    }
                    observer.next(sortedResult);
                    observer.complete();
                }
                else {
                    observer.error(next);
                }
            });
        });
    };
    ProjectDataService.prototype.getTagList = function (database) {
        return this.serverQueryWithDefaultSubscription({
            query: 'list_tags',
            database: database
        });
    };
    ProjectDataService.prototype.getConfigComments = function (database) {
        if (!database
            || !database.dbConfig
            || !database.dbConfig['EMUwebAppConfig']
            || !database.dbConfig['EMUwebAppConfig'].restrictions) {
            return false;
        }
        return (database.dbConfig['EMUwebAppConfig'].restrictions.bundleComments === true);
    };
    ProjectDataService.prototype.getConfigFinishedEditing = function (database) {
        if (!database
            || !database.dbConfig
            || !database.dbConfig['EMUwebAppConfig']
            || !database.dbConfig['EMUwebAppConfig'].restrictions) {
            return false;
        }
        return (database.dbConfig['EMUwebAppConfig'].restrictions.bundleFinishedEditing === true);
    };
    ProjectDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ProjectDataService);
    return ProjectDataService;
}());
exports.ProjectDataService = ProjectDataService;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-FI8bgmIz.tmp/0/src/app/project-data.service.js.map