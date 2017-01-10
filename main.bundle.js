webpackJsonp([0,4],{

/***/ 1024:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(442);


/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(760);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ProjectDataService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



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
        this.infoObservable = __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].create(function (observer) {
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
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* RequestOptions */]({ headers: headers });
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
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].throw('Error during download', error);
        });
    };
    ProjectDataService.prototype.serverQueryWithDefaultSubscription = function (params) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].create(function (observer) {
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
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].create(function (observer) {
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
        this.username = '';
        this.password = '';
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
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].create(function (observer) {
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
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].create(function (observer) {
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["R" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object])
    ], ProjectDataService);
    return ProjectDataService;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/project-data.service.js.map

/***/ },

/***/ 361:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return BundleListDetailComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BundleListDetailComponent = (function () {
    function BundleListDetailComponent(projectDataService, router, route) {
        this.projectDataService = projectDataService;
        this.router = router;
        this.route = route;
        this.allBundles = [];
        this.commentedBundles = [];
        this.database = '';
        this.deleteError = '';
        this.duplicationEditor = {
            commentedOnly: false,
            editorName: '',
            messageError: '',
            messageSuccess: ''
        };
        this.infoEditor = {
            isEditing: false,
            messageError: '',
            messageSuccess: '',
            newName: '',
            newArchiveLabel: ''
        };
        this.reallyDelete = false;
        this.state = 'Info';
        this.tableFormat = [
            { type: 'string', heading: 'Session', value: function (x) { return x.session; } },
            { type: 'string', heading: 'Bundle', value: function (x) { return x.name; } },
            { type: 'boolean', heading: 'Finished editing', value: function (x) { return x.finishedEditing; } },
            { type: 'string', heading: 'Comment', value: function (x) { return x.comment; } }
        ];
    }
    BundleListDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (nextParams) {
            if (typeof nextParams['archiveLabel'] === 'undefined') {
                nextParams['archiveLabel'] = '';
            }
            _this.subBundleList = _this.projectDataService.getBundleList(nextParams['database'], nextParams['name'], nextParams['archiveLabel']).subscribe(function (nextBundleList) {
                _this.database = nextParams['database'];
                _this.setBundleList(nextBundleList);
            });
        });
    };
    BundleListDetailComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleList) {
            this.subBundleList.unsubscribe();
        }
        if (this.subParams) {
            this.subParams.unsubscribe();
        }
    };
    BundleListDetailComponent.prototype.setBundleList = function (bundleList) {
        if (bundleList === null) {
        }
        else {
            this.bundleList = bundleList;
            this.infoEditor.newName = bundleList.name;
            this.infoEditor.newArchiveLabel = bundleList.archiveLabel;
            this.allBundles = bundleList.items;
            this.commentedBundles = bundleList.items.filter(function (element) {
                return element.comment !== '';
            });
        }
    };
    BundleListDetailComponent.prototype.saveEditedInfo = function () {
        var _this = this;
        var newName = this.infoEditor.newName;
        var newArchiveLabel = this.infoEditor.newArchiveLabel;
        this.toggleEditInfo(); // that will reset this.infoEditor.newName
        // and .newArchiveLabel
        this.infoEditor.messageError = '';
        this.infoEditor.messageSuccess = '';
        if (this.bundleList.name === newName && this.bundleList.archiveLabel === newArchiveLabel) {
            this.infoEditor.messageSuccess = 'No changes to be saved.';
            return;
        }
        this.projectDataService.editBundleList(this.database, this.bundleList.name, this.bundleList.archiveLabel, newName, newArchiveLabel).subscribe(function (next) {
            _this.infoEditor.messageSuccess = 'Successfully edited.';
            _this.projectDataService.fetchData();
            if (_this.subBundleList) {
                _this.subBundleList.unsubscribe();
            }
            _this.subBundleList = _this.projectDataService.getBundleList(_this.database, newName, newArchiveLabel).subscribe(function (nextBundleList) {
                _this.setBundleList(nextBundleList);
            });
        }, function (error) {
            _this.infoEditor.messageError = error.message;
        });
    };
    BundleListDetailComponent.prototype.toggleEditInfo = function () {
        if (this.infoEditor.isEditing) {
            this.infoEditor.newName = this.bundleList.name;
            this.infoEditor.newArchiveLabel = this.bundleList.archiveLabel;
            this.infoEditor.isEditing = false;
        }
        else {
            this.infoEditor.isEditing = true;
        }
    };
    BundleListDetailComponent.prototype.deleteBundleList = function () {
        var _this = this;
        this.reallyDelete = false;
        this.projectDataService.deleteBundleList(this.database, this.bundleList).subscribe(function (next) {
            _this.projectDataService.fetchData();
            _this.router.navigate(['/project/databases', _this.database]);
        }, function (error) {
            _this.deleteError = error.message;
        });
    };
    BundleListDetailComponent.prototype.duplicateBundleList = function () {
        var _this = this;
        this.duplicationEditor.messageError = '';
        this.duplicationEditor.messageSuccess = '';
        // Reset editorName but keep commentedOnly.
        // This way the user won't be able to click twice without typing again
        var editorName = this.duplicationEditor.editorName;
        this.duplicationEditor.editorName = '';
        this.projectDataService.duplicateBundleList(this.database, this.bundleList, editorName, this.duplicationEditor.commentedOnly).subscribe(function (next) {
            _this.duplicationEditor.messageSuccess = 'Successfully duplicated' +
                ' bundle list.';
            _this.projectDataService.fetchData();
        }, function (error) {
            _this.duplicationEditor.messageError = error.message;
        });
    };
    BundleListDetailComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-bundle-list-detail',
            template: __webpack_require__(746),
            styles: [__webpack_require__(730)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* ActivatedRoute */]) === 'function' && _c) || Object])
    ], BundleListDetailComponent);
    return BundleListDetailComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/bundle-list-detail.component.js.map

/***/ },

/***/ 362:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return BundleListsDashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BundleListsDashboardComponent = (function () {
    function BundleListsDashboardComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.state = 'Overview';
        this.bundlePattern = '.*';
        this.editors = [];
        this.generatorError = '';
        this.generatorSuccess = '';
        this.newEditor = '';
        this.personsPerBundle = 1;
        this.selectedDatabase = null;
        this.sessionPattern = '.*';
        this.shuffle = false;
    }
    BundleListsDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(function (next) {
            _this.bundleLists = next;
        });
        this.subDatabases = this.projectDataService.getAllDatabases().subscribe(function (next) {
            _this.databases = next;
            _this.selectedDatabase = null;
        });
    };
    BundleListsDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleLists) {
            this.subBundleLists.unsubscribe();
        }
        if (this.subDatabases) {
            this.subDatabases.unsubscribe();
        }
    };
    BundleListsDashboardComponent.prototype.generateLists = function () {
        var _this = this;
        this.checkNumber();
        this.generatorError = '';
        this.generatorSuccess = '';
        if (!this.selectedDatabase) {
            this.generatorError = 'Select a database first';
            return;
        }
        if (this.editors.length === 0) {
            this.generatorError = 'No editors specified';
            return;
        }
        this.projectDataService.generateBundleList(this.selectedDatabase.name, this.sessionPattern, this.bundlePattern, this.editors.map(function (value) {
            return value.name;
        }), this.personsPerBundle, this.shuffle)
            .subscribe(function (next) {
        }, function (error) {
            _this.generatorError = error.message;
        }, function () {
            _this.generatorSuccess += 'Successfully generated all bundle lists';
            _this.projectDataService.fetchData();
        });
    };
    BundleListsDashboardComponent.prototype.addEditor = function () {
        this.editors.push({ name: this.newEditor });
        this.newEditor = '';
    };
    BundleListsDashboardComponent.prototype.checkEditor = function (index) {
        if (this.editors[index].name === '') {
            this.editors.splice(index, 1);
            this.checkNumber();
        }
    };
    BundleListsDashboardComponent.prototype.checkNumber = function () {
        if (this.personsPerBundle > this.editors.length) {
            this.personsPerBundle = this.editors.length;
        }
    };
    BundleListsDashboardComponent.prototype.checkDBConfig = function () {
        return (this.projectDataService.getConfigComments(this.selectedDatabase)
            &&
                this.projectDataService.getConfigFinishedEditing(this.selectedDatabase));
    };
    BundleListsDashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-bundle-lists-dashboard',
            template: __webpack_require__(747),
            styles: [__webpack_require__(731)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], BundleListsDashboardComponent);
    return BundleListsDashboardComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/bundle-lists-dashboard.component.js.map

/***/ },

/***/ 363:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DashboardComponent = (function () {
    function DashboardComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.bundleLists = [];
        this.databases = [];
        this.uploads = [];
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subProjectName = this.projectDataService.getName().subscribe(function (next) {
            _this.projectName = next;
        });
        this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(function (next) {
            _this.bundleLists = next;
        });
        this.subDatabases = this.projectDataService.getAllDatabases().subscribe(function (next) {
            _this.databases = next;
        });
        this.subUploads = this.projectDataService.getAllUploads().subscribe(function (next) {
            _this.uploads = next;
        });
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleLists) {
            this.subBundleLists.unsubscribe();
        }
        if (this.subDatabases) {
            this.subDatabases.unsubscribe();
        }
        if (this.subProjectName) {
            this.subProjectName.unsubscribe();
        }
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    DashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-dashboard',
            template: __webpack_require__(749),
            styles: [__webpack_require__(733)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], DashboardComponent);
    return DashboardComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/dashboard.component.js.map

/***/ },

/***/ 364:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DatabaseDashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DatabaseDashboardComponent = (function () {
    function DatabaseDashboardComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.databases = [];
    }
    DatabaseDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.projectDataService.getAllDatabases().subscribe(function (then) {
            _this.databases = then;
        });
    };
    DatabaseDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    DatabaseDashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-database-dashboard',
            template: __webpack_require__(750),
            styles: [__webpack_require__(734)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], DatabaseDashboardComponent);
    return DatabaseDashboardComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/database-dashboard.component.js.map

/***/ },

/***/ 365:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(91);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DatabaseDetailComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var DatabaseDetailComponent = (function () {
    function DatabaseDetailComponent(projectDataService, route) {
        this.projectDataService = projectDataService;
        this.route = route;
        this.createArchiveCurrent = '';
        this.createArchiveError = '';
        this.downloadList = [];
        this.newName = '';
        this.renameError = '';
        this.renameSuccess = '';
        this.saveConfigError = '';
        this.saveConfigSuccess = '';
        this.state = 'BundleLists';
        this.tableFormat = [
            { type: 'string', heading: 'Name', value: function (x) { return x.name; } },
            { type: 'string', heading: 'Bundles', value: function (x) { return x.bundles.length; } }
        ];
        this.tagList = [];
        this.webAppLink = '';
    }
    DatabaseDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (params) {
            _this.unsubscribe(false);
            _this.subscribe(params['name']);
        });
    };
    DatabaseDetailComponent.prototype.ngOnDestroy = function () {
        this.unsubscribe(true);
    };
    DatabaseDetailComponent.prototype.subscribe = function (databaseName) {
        var _this = this;
        this.subDatabase = this.projectDataService.getDatabase(databaseName).subscribe(function (nextDatabase) {
            _this.database = nextDatabase;
            _this.configComments = _this.savedConfigComments();
            _this.configFinishedEditing = _this.savedConfigFinishedEditing();
        });
        this.subCommitList = this.projectDataService.getCommitList(databaseName).subscribe(function (nextCommitList) {
            _this.commitList = nextCommitList;
        });
        this.subDownloadList = this.projectDataService.getDownloads(databaseName).subscribe(function (nextDownloadList) {
            _this.downloadList = nextDownloadList;
        });
        this.subTagList = this.projectDataService.getTagList(databaseName).subscribe(function (nextTagList) {
            _this.tagList = nextTagList;
        });
        this.subWebAppLink = this.projectDataService.getEmuWebAppURL(databaseName).subscribe(function (nextLink) {
            _this.webAppLink = nextLink;
        });
    };
    DatabaseDetailComponent.prototype.unsubscribe = function (unsubscribeParams) {
        if (this.subParams && unsubscribeParams) {
            this.subParams.unsubscribe();
        }
        if (this.subDatabase) {
            this.subDatabase.unsubscribe();
        }
        if (this.subDownloadList) {
            this.subDatabase.unsubscribe();
        }
        if (this.subCommitList) {
            this.subCommitList.unsubscribe();
        }
        if (this.subTagList) {
            this.subTagList.unsubscribe();
        }
        if (this.subWebAppLink) {
            this.subWebAppLink.unsubscribe();
        }
    };
    DatabaseDetailComponent.prototype.editTag = function (commit) {
        commit.editingTag = !commit.editingTag;
    };
    DatabaseDetailComponent.prototype.countTags = function () {
        var count = this.tagList.length;
        return count;
    };
    DatabaseDetailComponent.prototype.countDownloads = function () {
        var count = this.downloadList.length;
        return count;
    };
    DatabaseDetailComponent.prototype.countCommits = function () {
        var count = 0;
        if (this.commitList) {
            for (var i = 0; i < this.commitList.length; ++i) {
                for (var j = 0; j < this.commitList[i].days.length; ++j) {
                    count += this.commitList[i].days[j].commits.length;
                }
            }
        }
        return count;
    };
    DatabaseDetailComponent.prototype.createArchive = function (treeish) {
        var _this = this;
        this.projectDataService.createArchive(this.database.name, treeish).subscribe(function (next) {
            _this.createArchiveCurrent = treeish;
        }, function (error) {
            _this.createArchiveError = 'Error while preparing';
        });
    };
    DatabaseDetailComponent.prototype.saveTag = function (commit) {
        var _this = this;
        commit.saveTagError = '';
        commit.saveTagSuccess = '';
        if (commit.tagLabel === '') {
            commit.saveTagError = 'Empty labels are not allowed.';
            return;
        }
        this.projectDataService.addTag(this.database.name, commit.commitID, commit.tagLabel).subscribe(function (next) {
            commit.saveTagSuccess = 'Successfully created tag: ' + commit.tagLabel;
            commit.tagLabel = '';
            commit.editingTag = false;
            if (_this.subTagList) {
                _this.subTagList.unsubscribe();
            }
            _this.subTagList = _this.projectDataService.getTagList(_this.database.name).subscribe(function (nextTagList) {
                _this.tagList = nextTagList;
            });
        }, function (error) {
            commit.saveTagError = error.message;
        });
    };
    DatabaseDetailComponent.prototype.saveConfiguration = function () {
        var _this = this;
        this.saveConfigError = '';
        this.saveConfigSuccess = '';
        if (!this.hasUnsavedChanges()) {
            this.saveConfigError = 'No changes to be saved.';
            return;
        }
        this.projectDataService.setDatabaseConfiguration(this.database.name, this.configComments, this.configFinishedEditing)
            .subscribe(function (next) {
            _this.saveConfigSuccess = 'Successfully stored configuration' +
                ' changes.';
            _this.projectDataService.fetchData();
        }, function (error) {
            _this.saveConfigError = error.message;
        });
    };
    DatabaseDetailComponent.prototype.renameDatabase = function () {
        var _this = this;
        this.renameError = '';
        this.renameSuccess = '';
        if (this.database.name === this.newName) {
            this.renameSuccess = 'That is already the database’s name.';
            return;
        }
        this.projectDataService.renameDatabase(this.database.name, this.newName).subscribe(function (next) {
            _this.renameSuccess = 'Successfully renamed';
            _this.projectDataService.fetchData();
            _this.unsubscribe(false);
            _this.subscribe(_this.newName);
        }, function (error) {
            _this.renameError = error.message;
        });
    };
    DatabaseDetailComponent.prototype.hasUnsavedChanges = function () {
        if (this.savedConfigComments() !== this.configComments) {
            return true;
        }
        if (this.savedConfigFinishedEditing() !== this.configFinishedEditing) {
            return true;
        }
        return false;
    };
    DatabaseDetailComponent.prototype.savedConfigComments = function () {
        return this.projectDataService.getConfigComments(this.database);
    };
    DatabaseDetailComponent.prototype.savedConfigFinishedEditing = function () {
        return this.projectDataService.getConfigFinishedEditing(this.database);
    };
    DatabaseDetailComponent.prototype.downloadTarget = function (treeish) {
        return this.projectDataService.getDownloadTarget(this.database.name, treeish);
    };
    DatabaseDetailComponent.prototype.downloadOptions = function (treeish) {
        return Object.keys(this.downloadTarget(treeish).options);
    };
    DatabaseDetailComponent.prototype.transformCommitMessage = function (message) {
        var trigger = 'EMU-webApp auto save commit; ';
        if (message.substr(0, trigger.length) === trigger) {
            var matches = message.match(/User: ([^;]*);.*Bundle: (.*)/);
            if (matches.length === 3) {
                return 'Bundle ' + matches[2] + ' edited by ' + matches[1];
            }
        }
        return message;
    };
    /**
     * Taken from MDN.
     *
     * The precision parameter works same way as PHP and Excel whereby a
     * positive 1 would round to 1 decimal place and -1 would round to the tens.
     */
    DatabaseDetailComponent.prototype.round = function (number, precision) {
        var factor = Math.pow(10, precision);
        var tempNumber = number * factor;
        var roundedTempNumber = Math.round(tempNumber);
        return roundedTempNumber / factor;
    };
    ;
    DatabaseDetailComponent.prototype.displaySize = function (size) {
        if (size > Math.pow(1024, 3)) {
            return this.round(size / Math.pow(1024, 3), 1) + ' GiB';
        }
        else if (size > Math.pow(1024, 2)) {
            return this.round(size / Math.pow(1024, 2), 1) + ' MiB';
        }
        else if (size > 1024) {
            return this.round(size / 1024, 1) + 'KiB';
        }
        else {
            return size + ' B';
        }
    };
    DatabaseDetailComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-database-detail',
            template: __webpack_require__(751),
            styles: [__webpack_require__(735)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* ActivatedRoute */]) === 'function' && _b) || Object])
    ], DatabaseDetailComponent);
    return DatabaseDetailComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/database-detail.component.js.map

/***/ },

/***/ 366:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(91);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return ProjectComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProjectComponent = (function () {
    function ProjectComponent(projectDataService, router) {
        this.projectDataService = projectDataService;
        this.router = router;
        this.bundleLists = [];
        this.databases = [];
        this.uploads = [];
    }
    ProjectComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subBundleLists = this.projectDataService.getAllBundleLists().subscribe(function (next) {
            _this.bundleLists = next;
        });
        this.subDatabases = this.projectDataService.getAllDatabases().subscribe(function (next) {
            _this.databases = next;
        });
        this.subUploads = this.projectDataService.getAllUploads().subscribe(function (next) {
            _this.uploads = next;
        });
    };
    ProjectComponent.prototype.ngOnDestroy = function () {
        if (this.subBundleLists) {
            this.subBundleLists.unsubscribe();
        }
        if (this.subDatabases) {
            this.subDatabases.unsubscribe();
        }
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    ProjectComponent.prototype.logout = function () {
        this.projectDataService.logout();
        this.router.navigate(['/']);
    };
    ProjectComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-project',
            template: __webpack_require__(753),
            styles: [__webpack_require__(737)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], ProjectComponent);
    return ProjectComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/project.component.js.map

/***/ },

/***/ 367:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(91);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return UploadDetailComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UploadDetailComponent = (function () {
    function UploadDetailComponent(projectDataService, route, router) {
        this.projectDataService = projectDataService;
        this.route = route;
        this.router = router;
        this.databaseList = [];
        this.deleteError = '';
        this.mergeForm = {
            duplicateName: false,
            newName: '',
            messageError: '',
            messageSuccess: '',
        };
        this.reallyDelete = false;
        this.state = 'Sessions';
        this.tableFormat = [
            { type: 'string', heading: 'Name', value: function (x) { return x.name; } },
            { type: 'string', heading: 'Bundles', value: function (x) { return x.bundles.length; } }
        ];
    }
    UploadDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subParams = this.route.params.subscribe(function (nextParams) {
            _this.subUpload = _this.projectDataService.getUpload(nextParams['uuid']).subscribe(function (nextUpload) {
                _this.upload = nextUpload;
                if (_this.subDatabase) {
                    _this.subDatabase.unsubscribe();
                }
                _this.subDatabase = _this.projectDataService.getDatabase(_this.upload.name).subscribe(function (nextDatabase) {
                    if (nextDatabase === null) {
                        _this.mergeForm.duplicateName = false;
                    }
                    else {
                        _this.mergeForm.duplicateName = true;
                    }
                });
            });
        });
        this.subDatabaseList = this.projectDataService.getAllDatabases().subscribe(function (nextList) {
            _this.databaseList = nextList;
        });
    };
    UploadDetailComponent.prototype.ngOnDestroy = function () {
        if (this.subDatabase) {
            this.subDatabase.unsubscribe();
        }
        if (this.subDatabaseList) {
            this.subDatabaseList.unsubscribe();
        }
        if (this.subParams) {
            this.subParams.unsubscribe();
        }
        if (this.subUpload) {
            this.subUpload.unsubscribe();
        }
    };
    UploadDetailComponent.prototype.deleteUpload = function () {
        var _this = this;
        this.reallyDelete = false;
        this.projectDataService.deleteUpload(this.upload.uuid).subscribe(function (next) {
            _this.projectDataService.fetchData();
            if (_this.subUpload) {
                _this.subUpload.unsubscribe();
            }
            _this.router.navigate(['/project/uploads']);
        }, function (error) {
            _this.deleteError = error.message;
        });
    };
    UploadDetailComponent.prototype.saveUpload = function () {
        var _this = this;
        this.mergeForm.messageSuccess = '';
        this.mergeForm.messageError = '';
        var name;
        if (this.mergeForm.duplicateName) {
            name = this.mergeForm.newName;
        }
        else {
            name = this.upload.name;
        }
        this.projectDataService.saveUpload(this.upload.uuid, name).subscribe(function (next) {
            _this.projectDataService.fetchData();
            _this.mergeForm.messageSuccess = 'The database has been saved.';
        }, function (error) {
            _this.mergeForm.messageError = error.message;
            console.log(error);
        });
    };
    UploadDetailComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-upload-detail',
            template: __webpack_require__(754),
            styles: [__webpack_require__(738)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* ActivatedRoute */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === 'function' && _c) || Object])
    ], UploadDetailComponent);
    return UploadDetailComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/upload-detail.component.js.map

/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return UploadsDashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UploadsDashboardComponent = (function () {
    function UploadsDashboardComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.state = 'Overview';
        this.uploads = [];
    }
    UploadsDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subUploads = this.projectDataService.getAllUploads().subscribe(function (next) {
            _this.uploads = next;
        });
    };
    UploadsDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    UploadsDashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-uploads-dashboard',
            template: __webpack_require__(756),
            styles: [__webpack_require__(740)],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], UploadsDashboardComponent);
    return UploadsDashboardComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/uploads-dashboard.component.js.map

/***/ },

/***/ 369:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return WelcomeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var WelcomeComponent = (function () {
    function WelcomeComponent(projectDataService, router) {
        this.projectDataService = projectDataService;
        this.router = router;
        this.loginFailed = false;
        this.unknownError = false;
        this.unknownErrorMessage = '';
    }
    WelcomeComponent.prototype.ngOnInit = function () {
    };
    WelcomeComponent.prototype.checkLogin = function () {
        var _this = this;
        this.loginFailed = false;
        this.unknownError = false;
        if (this.sub) {
            return;
        }
        this.sub = this.projectDataService.login(this.username, this.password).subscribe(function (next) {
            _this.router.navigate(['/project/overview']);
        }, function (error) {
            if (error.data === 'BAD_LOGIN') {
                _this.loginFailed = true;
            }
            else {
                _this.unknownError = true;
                _this.unknownErrorMessage = error.message;
            }
            _this.sub = null;
        }, function () {
            _this.sub = null;
        });
    };
    WelcomeComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-welcome',
            template: __webpack_require__(758),
            styles: [__webpack_require__(742)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], WelcomeComponent);
    return WelcomeComponent;
    var _a, _b;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/welcome.component.js.map

/***/ },

/***/ 441:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 441;


/***/ },

/***/ 442:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(574);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__polyfills_ts__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(533);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(573);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_module__ = __webpack_require__(564);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_40" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/main.js.map

/***/ },

/***/ 563:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rxjs_operators__ = __webpack_require__(572);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__rxjs_operators__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.activeAppendix = '';
        this.nextActiveAppendix = '';
    }
    AppComponent.prototype.changeState = function (event) {
        this.nextActiveAppendix += '.';
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        this.activeAppendix = this.nextActiveAppendix;
    };
    AppComponent.prototype.progressBarState = function () {
        if (this.projectDataService.connectionCount === 0) {
            this.activeAppendix = '';
            this.nextActiveAppendix = '';
            return 'idle';
        }
        else {
            return 'active' + this.activeAppendix;
        }
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-root',
            template: __webpack_require__(744),
            styles: [__webpack_require__(728)],
            animations: [
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* trigger */])('progressBar', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* transition */])('* => *', [
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* animate */])(8000, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* keyframes */])([
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '40px 0' }),
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({ 'background-position': '0 0' })
                        ]))
                    ])
                ]),
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* trigger */])('progressBarContainer', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* state */])('idle', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* style */])({
                        height: 0
                    })),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* transition */])('* <=> idle', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* animate */])('300ms'))
                ])
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/app.component.js.map

/***/ },

/***/ 564:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__(563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(524);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_routes__ = __webpack_require__(565);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__project_data_service__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__project_project_component__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__welcome_welcome_component__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__project_upload_form_upload_form_component__ = __webpack_require__(570);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__project_uploads_overview_uploads_overview_component__ = __webpack_require__(571);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__project_bundle_lists_overview_bundle_lists_overview_component__ = __webpack_require__(567);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__project_databases_overview_databases_overview_component__ = __webpack_require__(568);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__project_database_dashboard_database_dashboard_component__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__project_dashboard_dashboard_component__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__project_database_detail_database_detail_component__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__project_bundle_lists_dashboard_bundle_lists_dashboard_component__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__project_bundle_list_detail_bundle_list_detail_component__ = __webpack_require__(361);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__project_upload_detail_upload_detail_component__ = __webpack_require__(367);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__project_uploads_dashboard_uploads_dashboard_component__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_ng2_uploader_ng2_uploader__ = __webpack_require__(562);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__emudbmanager_table_emudbmanager_table_component__ = __webpack_require__(566);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};























var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_18__project_bundle_list_detail_bundle_list_detail_component__["a" /* BundleListDetailComponent */],
                __WEBPACK_IMPORTED_MODULE_17__project_bundle_lists_dashboard_bundle_lists_dashboard_component__["a" /* BundleListsDashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_12__project_bundle_lists_overview_bundle_lists_overview_component__["a" /* BundleListsOverviewComponent */],
                __WEBPACK_IMPORTED_MODULE_15__project_dashboard_dashboard_component__["a" /* DashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_14__project_database_dashboard_database_dashboard_component__["a" /* DatabaseDashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_16__project_database_detail_database_detail_component__["a" /* DatabaseDetailComponent */],
                __WEBPACK_IMPORTED_MODULE_13__project_databases_overview_databases_overview_component__["a" /* DatabasesOverviewComponent */],
                __WEBPACK_IMPORTED_MODULE_22__emudbmanager_table_emudbmanager_table_component__["a" /* EmudbmanagerTableComponent */],
                __WEBPACK_IMPORTED_MODULE_8__project_project_component__["a" /* ProjectComponent */],
                __WEBPACK_IMPORTED_MODULE_19__project_upload_detail_upload_detail_component__["a" /* UploadDetailComponent */],
                __WEBPACK_IMPORTED_MODULE_10__project_upload_form_upload_form_component__["a" /* UploadFormComponent */],
                __WEBPACK_IMPORTED_MODULE_20__project_uploads_dashboard_uploads_dashboard_component__["a" /* UploadsDashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_11__project_uploads_overview_uploads_overview_component__["a" /* UploadsOverviewComponent */],
                __WEBPACK_IMPORTED_MODULE_9__welcome_welcome_component__["a" /* WelcomeComponent */],
                // 3rd party
                __WEBPACK_IMPORTED_MODULE_21_ng2_uploader_ng2_uploader__["a" /* NgFileSelectDirective */]
            ],
            imports: [
                // Angular stuff
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_http__["d" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_router__["c" /* RouterModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_routes__["a" /* appRoutes */])
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]],
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__project_data_service__["a" /* ProjectDataService */]
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/app.module.js.map

/***/ },

/***/ 565:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__project_project_routes__ = __webpack_require__(569);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__welcome_welcome_component__ = __webpack_require__(369);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return appRoutes; });
/* unused harmony export appRoutingProviders */


var appRoutes = __WEBPACK_IMPORTED_MODULE_0__project_project_routes__["a" /* projectRoutes */].concat([
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_1__welcome_welcome_component__["a" /* WelcomeComponent */] },
    { path: '**', component: __WEBPACK_IMPORTED_MODULE_1__welcome_welcome_component__["a" /* WelcomeComponent */] },
]);
var appRoutingProviders = [];
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/app.routes.js.map

/***/ },

/***/ 566:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return EmudbmanagerTableComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EmudbmanagerTableComponent = (function () {
    function EmudbmanagerTableComponent() {
        this.reverseSort = false;
        this.visibleCount = 0;
    }
    Object.defineProperty(EmudbmanagerTableComponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (a) {
            if (!Array.isArray(a)) {
                this._data = [];
            }
            else {
                this._data = a;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Filter this.data based on the filters specified in this.columns[x].filter
     * @returns {Array}
     */
    EmudbmanagerTableComponent.prototype.getVisibleData = function () {
        var _this = this;
        var result = [];
        /**
         * Iterate over all data. If none of the filters block, the item
         * will be pushed to result.
         */
        for (var i = 0; i < this.data.length; ++i) {
            var include = true;
            for (var j = 0; j < this.columns.length; ++j) {
                if (typeof this.columns[j].filter !== 'undefined') {
                    // Different data types (string, boolean) are filtered
                    // differently
                    if (this.columns[j].type === 'string') {
                        var regex = void 0;
                        try {
                            regex = new RegExp(this.columns[j].filter);
                        }
                        catch (e) {
                            continue;
                        }
                        var value = this.columns[j].value(this.data[i]).toString();
                        if (value.match(regex) === null) {
                            include = false;
                            break;
                        }
                    }
                    if (this.columns[j].type === 'boolean') {
                        var filter = this.columns[j].filter;
                        if (typeof filter !== 'boolean') {
                            continue;
                        }
                        if (this.columns[j].value(this.data[i]) !== filter) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            if (include) {
                result.push(this.data[i]);
            }
        }
        this.visibleCount = result.length;
        if (this.sortColumn) {
            result.sort(function (a, b) {
                if (_this.sortColumn.value(a) > _this.sortColumn.value(b)) {
                    if (_this.reverseSort) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                }
                else if (_this.sortColumn.value(a) == _this.sortColumn.value(b)) {
                    return 0;
                }
                else {
                    if (_this.reverseSort) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
            });
        }
        return result;
    };
    EmudbmanagerTableComponent.prototype.ngOnInit = function () {
    };
    EmudbmanagerTableComponent.prototype.isBoolean = function (test) {
        return typeof test === 'boolean';
    };
    EmudbmanagerTableComponent.prototype.percentage = function () {
        if (this.data.length === 0) {
            return 0;
        }
        return Math.round(100 * this.visibleCount / this.data.length);
    };
    EmudbmanagerTableComponent.prototype.sort = function (column) {
        if (this.sortColumn === column) {
            this.reverseSort = !this.reverseSort;
        }
        else {
            this.sortColumn = column;
            this.reverseSort = false;
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(), 
        __metadata('design:type', Array)
    ], EmudbmanagerTableComponent.prototype, "columns", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(), 
        __metadata('design:type', Object)
    ], EmudbmanagerTableComponent.prototype, "data", null);
    EmudbmanagerTableComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-table',
            template: __webpack_require__(745),
            styles: [__webpack_require__(729)]
        }), 
        __metadata('design:paramtypes', [])
    ], EmudbmanagerTableComponent);
    return EmudbmanagerTableComponent;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/emudbmanager-table.component.js.map

/***/ },

/***/ 567:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return BundleListsOverviewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BundleListsOverviewComponent = (function () {
    function BundleListsOverviewComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.databases = [];
    }
    Object.defineProperty(BundleListsOverviewComponent.prototype, "database", {
        get: function () {
            return this._database;
        },
        set: function (database) {
            var _this = this;
            this._database = database;
            if (this.sub) {
                this.sub.unsubscribe();
                this.sub.unsubscribe();
            }
            if (this.database) {
                this.sub = this.projectDataService.getDatabase(this.database).subscribe(function (next) {
                    _this.databases = [next];
                });
            }
            else {
                this.sub = this.projectDataService.getAllDatabases().subscribe(function (next) {
                    _this.databases = next;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    BundleListsOverviewComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    /**
     * Count the number of items in a bundle list that have been marked as
     * "finished editing"
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The absolute number of finished items
     */
    BundleListsOverviewComponent.prototype.countFinishedItems = function (bundleList) {
        return bundleList.items.reduce(function (previousValue, currentValue, currentIndex, array) {
            if (currentValue.finishedEditing) {
                return previousValue + 1;
            }
            else {
                return previousValue;
            }
        }, 0);
    };
    /**
     * Count the number of items in a bundle list that have been commented.
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The absolute number of commented items
     */
    BundleListsOverviewComponent.prototype.countCommentedItems = function (bundleList) {
        return bundleList.items.reduce(function (previousValue, currentValue, currentIndex, array) {
            if (currentValue.comment !== "") {
                return previousValue + 1;
            }
            else {
                return previousValue;
            }
        }, 0);
    };
    /**
     * Count the relative portion (percentage) of items in a bundle list that have
     * been marked as "finished editing"
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The relative portion (percentage) of finished items
     */
    BundleListsOverviewComponent.prototype.percentageFinishedItems = function (bundleList) {
        if (bundleList.items.length === 0) {
            return 0;
        }
        return Math.round(100 * this.countFinishedItems(bundleList) / bundleList.items.length);
    };
    /**
     * Count the relative portion (percentage) of items in a bundle list that have
     * been commented
     *
     * @param bundleList The bundle list in which to count items
     * @returns {number} The relative portion (percentage) of commented items
     */
    BundleListsOverviewComponent.prototype.percentageCommentedItems = function (bundleList) {
        if (bundleList.items.length === 0) {
            return 0;
        }
        return Math.round(100 * this.countCommentedItems(bundleList) / bundleList.items.length);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Input */])(), 
        __metadata('design:type', String)
    ], BundleListsOverviewComponent.prototype, "database", null);
    BundleListsOverviewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-bundle-lists-overview',
            template: __webpack_require__(748),
            styles: [__webpack_require__(732)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], BundleListsOverviewComponent);
    return BundleListsOverviewComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/bundle-lists-overview.component.js.map

/***/ },

/***/ 568:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return DatabasesOverviewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DatabasesOverviewComponent = (function () {
    function DatabasesOverviewComponent(projectDataService) {
        this.projectDataService = projectDataService;
    }
    DatabasesOverviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.projectDataService.getAllDatabases().subscribe(function (next) {
            _this.databases = next;
        });
    };
    DatabasesOverviewComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    };
    DatabasesOverviewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-databases-overview',
            template: __webpack_require__(752),
            styles: [__webpack_require__(736)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], DatabasesOverviewComponent);
    return DatabasesOverviewComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/databases-overview.component.js.map

/***/ },

/***/ 569:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__database_dashboard_database_dashboard_component__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dashboard_dashboard_component__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_component__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__database_detail_database_detail_component__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bundle_lists_dashboard_bundle_lists_dashboard_component__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__uploads_dashboard_uploads_dashboard_component__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__bundle_list_detail_bundle_list_detail_component__ = __webpack_require__(361);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__upload_detail_upload_detail_component__ = __webpack_require__(367);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return projectRoutes; });








var projectRoutes = [{
        path: 'project',
        component: __WEBPACK_IMPORTED_MODULE_2__project_component__["a" /* ProjectComponent */],
        children: [
            { path: 'overview', component: __WEBPACK_IMPORTED_MODULE_1__dashboard_dashboard_component__["a" /* DashboardComponent */] },
            { path: 'databases', component: __WEBPACK_IMPORTED_MODULE_0__database_dashboard_database_dashboard_component__["a" /* DatabaseDashboardComponent */] },
            { path: 'databases/:name', component: __WEBPACK_IMPORTED_MODULE_3__database_detail_database_detail_component__["a" /* DatabaseDetailComponent */] },
            { path: 'bundle-lists', component: __WEBPACK_IMPORTED_MODULE_4__bundle_lists_dashboard_bundle_lists_dashboard_component__["a" /* BundleListsDashboardComponent */] },
            { path: 'bundle-lists/:database/:name', component: __WEBPACK_IMPORTED_MODULE_6__bundle_list_detail_bundle_list_detail_component__["a" /* BundleListDetailComponent */] },
            { path: 'bundle-lists/:database/:name/:archiveLabel', component: __WEBPACK_IMPORTED_MODULE_6__bundle_list_detail_bundle_list_detail_component__["a" /* BundleListDetailComponent */] },
            { path: 'uploads', component: __WEBPACK_IMPORTED_MODULE_5__uploads_dashboard_uploads_dashboard_component__["a" /* UploadsDashboardComponent */] },
            { path: 'uploads/:uuid', component: __WEBPACK_IMPORTED_MODULE_7__upload_detail_upload_detail_component__["a" /* UploadDetailComponent */] },
            { path: 'progress', component: __WEBPACK_IMPORTED_MODULE_1__dashboard_dashboard_component__["a" /* DashboardComponent */] },
        ]
    }];
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/project.routes.js.map

/***/ },

/***/ 570:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return UploadFormComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UploadFormComponent = (function () {
    function UploadFormComponent(projectDataService) {
        this.projectDataService = projectDataService;
        this.errorMessage = '';
        this.options = {
            data: {
                user: '',
                password: '',
                query: ''
            },
            url: ''
        };
        this.successMessage = '';
        this.transferMessage = '';
        this.uploadProgress = 0;
        this.zone = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["_26" /* NgZone */]({ enableLongStackTrace: false });
        var uploadTarget = this.projectDataService.getUploadTarget();
        this.options.url = uploadTarget.url;
        this.options.data = uploadTarget.params;
    }
    UploadFormComponent.prototype.handleProgress = function (data) {
        var _this = this;
        this.zone.run(function () {
            _this.uploadProgress = data.progress.percent;
            if (data.progress.loaded === data.progress.total) {
                _this.transferMessage = 'Upload complete. Please wait while the' +
                    ' server extracts the contents of the zip file (no' +
                    ' progress indicator is available for this) …';
            }
        });
        if (data.abort) {
            this.errorMessage = 'Upload was aborted.';
        }
        else if (data.error) {
            this.errorMessage = 'Unknown error during upload.';
        }
        else if (data.done) {
            this.projectDataService.fetchData();
            var response = JSON.parse(data.response);
            if (response.success === true) {
                this.successMessage = 'The server has finished processing' +
                    ' the upload. It has been saved under the UUID ' + response.data + '.';
            }
            else {
                this.errorMessage = response.message;
            }
        }
    };
    UploadFormComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-upload-form',
            template: __webpack_require__(755),
            styles: [__webpack_require__(739)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], UploadFormComponent);
    return UploadFormComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/upload-form.component.js.map

/***/ },

/***/ 571:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_data_service__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return UploadsOverviewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UploadsOverviewComponent = (function () {
    function UploadsOverviewComponent(projectDataService) {
        this.projectDataService = projectDataService;
    }
    UploadsOverviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subUploads = this.projectDataService.getAllUploads().subscribe(function (next) {
            _this.uploads = next;
        });
    };
    UploadsOverviewComponent.prototype.ngOnDestroy = function () {
        if (this.subUploads) {
            this.subUploads.unsubscribe();
        }
    };
    UploadsOverviewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* Component */])({
            selector: 'emudbmanager-uploads-overview',
            template: __webpack_require__(757),
            styles: [__webpack_require__(741)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__project_data_service__["a" /* ProjectDataService */]) === 'function' && _a) || Object])
    ], UploadsOverviewComponent);
    return UploadsOverviewComponent;
    var _a;
}());
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/uploads-overview.component.js.map

/***/ },

/***/ 572:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_observable_throw__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_catch__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_publishReplay__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_publishReplay___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_publishReplay__);
// import 'rxjs/Rx'; // adds ALL RxJS statics & operators to Observable




//# sourceMappingURL=/home/markus/code/emuDB-manager/src/rxjs-operators.js.map

/***/ },

/***/ 573:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=/home/markus/code/emuDB-manager/src/environment.js.map

/***/ },

/***/ 574:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(588);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(581);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(577);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(583);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(582);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(580);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(579);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(587);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(576);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(575);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(585);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(578);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(586);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(584);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(589);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(1023);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=/home/markus/code/emuDB-manager/src/polyfills.js.map

/***/ },

/***/ 728:
/***/ function(module, exports) {

module.exports = "/*\n * Base structure\n */\n\n/* Move down content because we have a fixed navbar that is 50px tall */\n.head-container {\n    padding-top: 50px;\n}\n\n/*\n * Global add-ons\n */\n\n.sub-header {\n    padding-bottom: 10px;\n    border-bottom: 1px solid #eee;\n}\n\n/*\n * Top navigation\n * Hide default border to remove 1px line.\n */\n.navbar-fixed-top {\n    border: 0;\n}\n\n.navbar-brand-image {\n    padding: 9px 15px; /* 9px is to (vertically) center a 32x32px image in a 50px bar */\n}\n\n.progress-bar {\n    font-weight: bold;\n    width: 100%;\n}\n\n.progress {\n    margin: 0;\n}"

/***/ },

/***/ 729:
/***/ function(module, exports) {

module.exports = ":host {\n    display: table;\n}"

/***/ },

/***/ 730:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 731:
/***/ function(module, exports) {

module.exports = "label {\n    font-weight: normal;\n}"

/***/ },

/***/ 732:
/***/ function(module, exports) {

module.exports = "td {\n\tvertical-align: middle !important;\n}\n"

/***/ },

/***/ 733:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 734:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 735:
/***/ function(module, exports) {

module.exports = "ul {\n    list-style-type: none;\n}\n\nform {\n    display: inline;\n}"

/***/ },

/***/ 736:
/***/ function(module, exports) {

module.exports = "table ul {\n\tpadding-left: 0;\n\tlist-style-position: inside;\n}\n\ntd {\n\tvertical-align: middle !important;\n}\n"

/***/ },

/***/ 737:
/***/ function(module, exports) {

module.exports = "/*\n * Sidebar\n */\n\n/* Hide for mobile, show later */\n/*\n.sidebar {\n  display: none;\n}\n*/\n@media (min-width: 768px) {\n\t.sidebar {\n\t\tposition: fixed;\n\t\ttop: 51px;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tz-index: 1000;\n\t\tdisplay: block;\n\t\tpadding: 20px;\n\t\toverflow-x: hidden;\n\t\toverflow-y: auto; /* Scrollable contents if viewport is shorter than content. */\n\t\tbackground-color: #f5f5f5;\n\t\tborder-right: 1px solid #eee;\n\t}\n\n\t.nav-sidebar {\n\t\tmargin-right: -21px; /* 20px padding + 1px border */\n\t\tmargin-bottom: 20px;\n\t\tmargin-left: -20px;\n\t}\n\n\t.nav-sidebar > li > a {\n\t\tpadding-right: 20px;\n\t\tpadding-left: 20px;\n\t}\n}\n\n.nav-sidebar > .active > a,\n.nav-sidebar > .active > a:hover,\n.nav-sidebar > .active > a:focus {\n\tcolor: #fff;\n\tbackground-color: #428bca;\n}\n\n#navbar {\n\tmargin: 0;\n\tpadding: 0;\n}\n\n/*\n * Main content\n */\n\n.main {\n\tpadding: 20px;\n}\n\n@media (min-width: 768px) {\n\t.main {\n\t\tpadding-right: 40px;\n\t\tpadding-left: 40px;\n\t}\n}\n\n.main .page-header {\n\tmargin-top: 0;\n}\n\n/*\n * Placeholder dashboard ideas\n */\n\n.placeholders {\n\tmargin-bottom: 30px;\n\ttext-align: center;\n}\n\n.placeholders h4 {\n\tmargin-bottom: 0;\n}\n\n.placeholder {\n\tmargin-bottom: 20px;\n}\n\n.placeholder img {\n\tdisplay: inline-block;\n\tborder-radius: 50%;\n}\n\n/*\n * Adaptations for emuDB manager\n */\n"

/***/ },

/***/ 738:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 739:
/***/ function(module, exports) {

module.exports = ".progress-bar {\n    min-width: 3em;\n}\n\ninput[type=file] {\n    display: none;\n}\n"

/***/ },

/***/ 740:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 741:
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ 742:
/***/ function(module, exports) {

module.exports = ":host {\n\ttext-align: center;\n}\n\n.panel {\n\tmargin-left: 20px;\n\tmargin-right: 20px;\n}\n\n@media (min-width: 768px) {\n\t.panel {\n\t\twidth: 50%;\n\t\tmargin-left: auto;\n\t\tmargin-right: auto;\n\t}\n}\n\n.panel-primary .panel-body {\n\ttext-align: left;\n}\n\n.alert .glyphicon {\n\tcursor: pointer;\n}\n"

/***/ },

/***/ 744:
/***/ function(module, exports) {

module.exports = "<div class=\"head-container\">\n\t<nav class=\"navbar navbar-inverse navbar-fixed-top\">\n\t\t<div class=\"container-fluid\">\n\t\t\t<div class=\"navbar-header\">\n\t\t\t\t<button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\"\n\t\t\t\t        data-target=\".navbar-collapse\" aria-expanded=\"false\" aria-controls=\"navbar\">\n\t\t\t\t\t<span class=\"sr-only\">Toggle navigation</span>\n\t\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t\t<span class=\"icon-bar\"></span>\n\t\t\t\t</button>\n\n\t\t\t\t<span class=\"navbar-brand navbar-brand-image\">\n\t\t\t\t\t<img src=\"assets/emu-icon-32.png\">\n\t\t\t\t</span>\n\t\t\t\t<span class=\"navbar-brand\">emuDB Manager</span>\n\t\t\t</div>\n\t\t\t<div id=\"\" class=\"navbar-collapse collapse\">\n\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"progress\" [@progressBarContainer]=\"progressBarState()\">\n\t\t\t<div class=\"progress-bar progress-bar-striped\" role=\"progressbar\"\n\t\t\t     [@progressBar]=\"progressBarState()\"\n\t\t\t     (@progressBar.start)=\"changeState($event)\"\n\t\t\t>\n\t\t\t\tCommunicating with server\n\t\t\t</div>\n\t\t</div>\n\t</nav>\n\n\t<router-outlet></router-outlet>\n</div>\n"

/***/ },

/***/ 745:
/***/ function(module, exports) {

module.exports = "<thead>\n<tr>\n\t<th *ngFor=\"let column of columns\" (click)=\"sort(column)\">\n\t\t{{column.heading}}\n\n\t\t<template [ngIf]=\"sortColumn === column\">\n\t\t\t<span *ngIf=\"!reverseSort\" class=\"glyphicon glyphicon-triangle-top\"></span>\n\t\t\t<span *ngIf=\"reverseSort\" class=\"glyphicon glyphicon-triangle-bottom\"></span>\n\t\t</template>\n\t</th>\n</tr>\n<tr>\n\t<td *ngFor=\"let column of columns\">\n\t\t<template [ngIf]=\"column.type === 'string'\">\n\t\t\t<input class=\"form-control\" placeholder=\"Filter\" [(ngModel)]=\"column.filter\">\n\t\t</template>\n\n\t\t<template [ngIf]=\"column.type === 'boolean'\">\n\t\t\t<button class=\"btn btn-default\" (click)=\"column.filter = undefined\"\n\t\t\t        [ngClass]=\"{active: !isBoolean(column.filter)}\">\n\t\t\t\tall\n\t\t\t</button>\n\n\t\t\t<button class=\"btn btn-default\" (click)=\"column.filter = true\"\n\t\t\t        [ngClass]=\"{active: column.filter === true}\">\n\t\t\t\t<span class=\"glyphicon glyphicon-ok\"></span>\n\t\t\t</button>\n\n\t\t\t<button class=\"btn btn-default\" (click)=\"column.filter = false\"\n\t\t\t        [ngClass]=\"{active: column.filter === false}\">\n\t\t\t\t<span class=\"glyphicon glyphicon-remove\"></span>\n\t\t\t</button>\n\t\t</template>\n\t</td>\n</tr>\n<tr>\n\t<th [attr.colspan]=\"columns.length\">\n\t\tViewing {{visibleCount}} of {{data.length}} items\n\t\t({{percentage()}} %)\n\t\t<span class=\"pull-right\">\n\t\t\tClick headings to sort\n\t\t\t|\n\t\t\t<span (click)=\"sort(undefined)\">Remove sorting</span>\n\t\t</span>\n\t</th>\n</tr>\n</thead>\n\n<tbody>\n<tr *ngFor=\"let item of getVisibleData()\">\n\t<td *ngFor=\"let column of columns\">\n\t\t<template [ngIf]=\"column.type === 'string'\">\n\t\t\t{{column.value(item)}}\n\t\t</template>\n\n\t\t<template [ngIf]=\"column.type === 'boolean'\">\n\t\t\t<span *ngIf=\"column.value(item)\" class=\"glyphicon glyphicon-ok\"></span>\n\t\t\t<span *ngIf=\"!column.value(item)\" class=\"glyphicon glyphicon-remove\"></span>\n\t\t</template>\n\t</td>\n</tr>\n</tbody>"

/***/ },

/***/ 746:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">Individual bundle list</h1>\n\n<div class=\"panel panel-default\">\n\n\t<ul class=\"panel-body nav nav-pills nav-justified\">\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Info'}\">\n\t\t\t<a (click)=\"state = 'Info'\">\n\t\t\t\tInfo\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'CommentedBundles'}\">\n\t\t\t<a (click)=\"state = 'CommentedBundles'\">\n\t\t\t\tCommented bundles <span class=\"badge\">{{commentedBundles?.length}}</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'AllBundles'}\">\n\t\t\t<a (click)=\"state = 'AllBundles'\">\n\t\t\t\tAll bundles <span class=\"badge\">{{allBundles?.length}}</span>\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\n\t<div *ngIf=\"state === 'Info'\">\n\t\t<form (ngSubmit)=\"saveEditedInfo()\">\n\t\t\t<div class=\"table-responsive\">\n\t\t\t\t<table class=\"table table-striped\">\n\t\t\t\t\t<tbody>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Database</td>\n\t\t\t\t\t\t<td><a [routerLink]=\"['/project/databases', database]\">{{database}}</a></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Editor</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span *ngIf=\"!infoEditor.isEditing\">{{bundleList?.name}}</span>\n\t\t\t\t\t\t\t<input *ngIf=\"infoEditor.isEditing\" class=\"form-control\"\n\t\t\t\t\t\t\t       placeholder=\"New name\"\n\t\t\t\t\t\t\t       [(ngModel)]=\"infoEditor.newName\"\n\t\t\t\t\t\t\t       name=\"newName\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Archive label</td>\n\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t<span *ngIf=\"!infoEditor.isEditing\">{{bundleList?.archiveLabel}}</span>\n\t\t\t\t\t\t\t<input *ngIf=\"infoEditor.isEditing\" class=\"form-control\"\n\t\t\t\t\t\t\t       placeholder=\"New archive label\"\n\t\t\t\t\t\t\t       [(ngModel)]=\"infoEditor.newArchiveLabel\"\n\t\t\t\t\t\t\t       name=\"newArchiveLabel\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\n\t\t\t<div class=\"panel-body\">\n\t\t\t\t<p>\n\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" (click)=\"toggleEditInfo()\"\n\t\t\t\t\t        [ngClass]=\"{active: infoEditor.isEditing}\">\n\t\t\t\t\t\tEdit\n\t\t\t\t\t</button>\n\n\t\t\t\t\t<button *ngIf=\"infoEditor.isEditing\" type=\"submit\"\n\t\t\t\t\t        class=\"btn btn-success pull-right\">\n\t\t\t\t\t\tSave\n\t\t\t\t\t</button>\n\t\t\t\t</p>\n\n\t\t\t\t<p *ngIf=\"infoEditor.messageSuccess\" class=\"alert alert-success\">\n\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t        (click)=\"infoEditor.messageSuccess = ''\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t{{infoEditor.messageSuccess}}\n\t\t\t\t</p>\n\n\t\t\t\t<p *ngIf=\"infoEditor.messageError\" class=\"alert alert-danger\">\n\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t        (click)=\"infoEditor.messageError = ''\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t{{infoEditor.messageError}}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</form>\n\n\t\t<hr>\n\n\t\t<div class=\"panel-body\">\n\t\t\t<p>\n\t\t\t\tBundle lists can be duplicated. The copy will be assigned to a different editor but\n\t\t\t\tit will share the same comments. All “finished editing” ticks will be reset.\n\t\t\t</p>\n\n\t\t\t<p>\n\t\t\t\tThis is useful to review the comments in the EMU-webApp, along with the signal and\n\t\t\t\tannotation data.\n\t\t\t</p>\n\n\t\t\t<form (ngSubmit)=\"duplicateBundleList()\">\n\t\t\t\t<p>\n\t\t\t\t\t<input class=\"form-control\" placeholder=\"Choose editor for duplicate\"\n\t\t\t\t\t       [(ngModel)]=\"duplicationEditor.editorName\" name=\"editorName\">\n\t\t\t\t</p>\n\n\t\t\t\t<div class=\"checkbox\">\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input type=\"checkbox\" [(ngModel)]=\"duplicationEditor.commentedOnly\"\n\t\t\t\t\t\t       name=\"commentedOnly\">\n\t\t\t\t\t\tOnly duplicate commented bundles\n\t\t\t\t\t</label>\n\t\t\t\t</div>\n\n\t\t\t\t<p *ngIf=\"duplicationEditor.messageError\" class=\"alert alert-danger\">\n\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t        (click)=\"duplicationEditor.messageError = ''\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t{{duplicationEditor.messageError}}\n\t\t\t\t</p>\n\n\t\t\t\t<p *ngIf=\"duplicationEditor.messageSuccess\" class=\"alert alert-success\">\n\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t        (click)=\"duplicationEditor.messageSuccess = ''\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t{{duplicationEditor.messageSuccess}}\n\t\t\t\t</p>\n\n\n\t\t\t\t<p>\n\t\t\t\t\t<button class=\"btn btn-primary\" [disabled]=\"!duplicationEditor.editorName\">\n\t\t\t\t\t\tDuplicate\n\t\t\t\t\t</button>\n\t\t\t\t</p>\n\t\t\t</form>\n\t\t</div>\n\n\t\t<hr>\n\n\t\t<div class=\"panel-body\">\n\t\t\t<div class=\"checkbox\">\n\t\t\t\t<label>\n\t\t\t\t\t<input type=\"checkbox\" [(ngModel)]=\"reallyDelete\">\n\t\t\t\t\tDelete this bundle list? This is irreversible!\n\t\t\t\t</label>\n\t\t\t</div>\n\n\t\t\t<p *ngIf=\"deleteError\" class=\"alert alert-danger\">\n\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"deleteError = ''\">\n\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t</button>\n\n\t\t\t\t{{deleteError}}\n\t\t\t</p>\n\n\t\t\t<p>\n\t\t\t\t<button type=\"button\" class=\"btn btn-danger\" [disabled]=\"!reallyDelete\"\n\t\t\t\t        (click)=\"deleteBundleList()\">\n\t\t\t\t\tDelete\n\t\t\t\t</button>\n\t\t\t</p>\n\n\t\t</div>\n\t</div>\n\n\t<div *ngIf=\"state === 'CommentedBundles'\" class=\"table-responsive\">\n\t\t<emudbmanager-table class=\"table table-striped\"\n\t\t                    [columns]=\"tableFormat\" [data]=\"commentedBundles\">\n\t\t</emudbmanager-table>\n\t</div>\n\n\t<div *ngIf=\"state === 'AllBundles'\" class=\"table-responsive\">\n\t\t<emudbmanager-table class=\"table table-striped\"\n\t\t                    [columns]=\"tableFormat\" [data]=\"allBundles\">\n\t\t</emudbmanager-table>\n\t</div>\n</div>\n"

/***/ },

/***/ 747:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">Bundle lists</h1>\n\n<div class=\"panel panel-default\">\n\n\t<ul class=\"panel-body nav nav-pills nav-justified\">\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Overview'}\">\n\t\t\t<a (click)=\"state = 'Overview'\">\n\t\t\t\tExisting bundle lists <span class=\"badge\">{{bundleLists?.length}}</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Generator'}\">\n\t\t\t<a (click)=\"state = 'Generator'\">\n\t\t\t\tGenerate bundle list\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\n\t<emudbmanager-bundle-lists-overview *ngIf=\"state === 'Overview'\" database=\"\">\n\n\t</emudbmanager-bundle-lists-overview>\n\n\t<div *ngIf=\"state === 'Generator'\" class=\"panel-body\">\n\t\t<form class=\"container-fluid\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<p class=\"col-md-4\">\n\t\t\t\t\tSelect the database for which to generate a bundle list:\n\t\t\t\t</p>\n\n\t\t\t\t<div class=\"col-md-8\">\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<select class=\"form-control\" [(ngModel)]=\"selectedDatabase\"\n\t\t\t\t\t\t        [ngModelOptions]=\"{standalone: true}\">\n\t\t\t\t\t\t\t<option *ngFor=\"let database of databases\" [ngValue]=\"database\">\n\t\t\t\t\t\t\t\t{{database.name}}\n\t\t\t\t\t\t\t</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</p>\n\n\t\t\t\t\t<p class=\"alert alert-warning\" *ngIf=\"selectedDatabase && !checkDBConfig()\">\n\t\t\t\t\t\tThe selected database {{selectedDatabase?.name}} is not configured to\n\t\t\t\t\t\tallow bundle comments and “finished editing” checkboxes. Please review\n\t\t\t\t\t\tthe database configuration.\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<hr>\n\n\t\t\t<div class=\"row\">\n\t\t\t\t<p class=\"col-md-4\">\n\t\t\t\t\tWhat bundles from what sessions shall be included?\n\t\t\t\t</p>\n\n\t\t\t\t<p class=\"col-md-2\">\n\t\t\t\t\tBundle pattern:\n\t\t\t\t</p>\n\n\t\t\t\t<p class=\"col-md-6\">\n\t\t\t\t\t<input [ngModelOptions]=\"{standalone: true}\" [(ngModel)]=\"bundlePattern\"\n\t\t\t\t\t       class=\"form-control\">\n\t\t\t\t</p>\n\t\t\t</div>\n\n\t\t\t<div class=\"row\">\n\t\t\t\t<p class=\"col-md-4\">\n\t\t\t\t</p>\n\n\t\t\t\t<p class=\"col-md-2\">\n\t\t\t\t\tSession pattern:\n\t\t\t\t</p>\n\n\t\t\t\t<p class=\"col-md-6\">\n\t\t\t\t\t<input [ngModelOptions]=\"{standalone: true}\" [(ngModel)]=\"sessionPattern\"\n\t\t\t\t\t       class=\"form-control\">\n\t\t\t\t</p>\n\t\t\t</div>\n\n\t\t\t<hr>\n\n\t\t\t<div class=\"row\">\n\t\t\t\t<p class=\"col-md-4\">\n\t\t\t\t\tWho are the editors? (one name per line)\n\t\t\t\t</p>\n\n\t\t\t\t<div class=\"col-md-8\">\n\t\t\t\t\t<p *ngFor=\"let editor of editors let i=index\">\n\t\t\t\t\t\t<input [(ngModel)]=\"editor.name\" class=\"form-control\"\n\t\t\t\t\t\t       [ngModelOptions]=\"{standalone: true}\" (change)=\"checkEditor(i)\">\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<input [ngModelOptions]=\"{standalone: true}\" [(ngModel)]=\"newEditor\"\n\t\t\t\t\t\t       (change)=\"addEditor()\" class=\"form-control\">\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<hr>\n\n\t\t\t<div class=\"row\">\n\t\t\t\t<p class=\"col-md-4\">\n\t\t\t\t\tIn case you have multiple editors:\n\t\t\t\t</p>\n\n\t\t\t\t<div class=\"col-md-4\">\n\n\t\t\t\t\t<p>How many persons shall be assigned to each bundle?</p>\n\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<input [ngModelOptions]=\"{standalone: true}\" [(ngModel)]=\"personsPerBundle\"\n\t\t\t\t\t\t       type=\"number\" class=\"form-control\" min=\"1\" [max]=\"editors.length\">\n\t\t\t\t\t</p>\n\n\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-md-4\">\n\t\t\t\t\t<p>\n\t\t\t\t\t\tShall the bundles be shuffled before distributing them among the editors?\n\t\t\t\t\t</p>\n\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t<input type=\"checkbox\" [(ngModel)]=\"shuffle\"\n\t\t\t\t\t\t\t       [ngModelOptions]=\"{standalone: true}\" disabled>\n\t\t\t\t\t\t\tShuffle (NOT YET IMPLEMENTED)\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\n\t\t\t<hr>\n\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col-md-12\">\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\"\n\t\t\t\t\t\t        (click)=\"generateLists()\">\n\t\t\t\t\t\t\tGenerate\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</p>\n\n\t\t\t\t\t<p *ngIf=\"generatorSuccess\" class=\"alert alert-success\">\n\t\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t\t        (click)=\"generatorSuccess = ''\">\n\t\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t{{generatorSuccess}}\n\t\t\t\t\t</p>\n\n\t\t\t\t\t<p *ngIf=\"generatorError\" class=\"alert alert-danger\">\n\t\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t\t        (click)=\"generatorError = ''\">\n\t\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t{{generatorError}}\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</form>\n\t</div>\n</div>\n"

/***/ },

/***/ 748:
/***/ function(module, exports) {

module.exports = "<div class=\"table-responsive\">\n\t<table class=\"table table-striped\">\n\t\t<thead>\n\t\t<tr>\n\t\t\t<th *ngIf=\"!database\">Database</th>\n\t\t\t<th>Editor</th>\n\t\t\t<th>Archive label</th>\n\t\t\t<th>Bundles</th>\n\t\t\t<th>Finished</th>\n\t\t\t<th>Comments</th>\n\t\t\t<th>Actions</th>\n\t\t</tr>\n\t\t</thead>\n\n\t\t<tbody>\n\n\t\t<template ngFor let-db [ngForOf]=\"databases\">\n\t\t\t<template ngFor let-bundleList [ngForOf]=\"db.bundleLists\">\n\t\t\t\t<tr>\n\t\t\t\t\t<td *ngIf=\"!database\"><a [routerLink]=\"['/project/databases', db.name]\">{{db.name}}</a>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>{{bundleList.name}}</td>\n\t\t\t\t\t<td>{{bundleList.archiveLabel}}</td>\n\t\t\t\t\t<td>{{bundleList.items.length}}</td>\n\t\t\t\t\t<td>{{countFinishedItems(bundleList)}} ({{percentageFinishedItems(bundleList)}}\n\t\t\t\t\t\t%)\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>{{countCommentedItems(bundleList)}}\n\t\t\t\t\t\t({{percentageCommentedItems(bundleList)}} %)\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t[routerLink]=\"['/project/bundle-lists', db.name, bundleList.name, bundleList.archiveLabel]\"\n\t\t\t\t\t\t\tclass=\"btn btn-default\">\n\t\t\t\t\t\t\tView &amp; edit\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</template>\n\t\t</template>\n\n\t\t</tbody>\n\t</table>\n</div>\n"

/***/ },

/***/ 749:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">Project overview</h1>\n\n<div class=\"panel panel-primary\">\n\t<div class=\"panel-heading\"><span class=\"panel-title\">{{projectName}}</span></div>\n\n\t<table class=\"table table-striped\">\n\t\t<tbody>\n\t\t<tr>\n\t\t\t<td>Number of databases</td>\n\t\t\t<td>{{databases.length}}</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>Number of bundle lists</td>\n\t\t\t<td>{{bundleLists.length}}</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>Number of uploads</td>\n\t\t\t<td>{{uploads.length}}</td>\n\t\t</tr>\n\t\t</tbody>\n\t</table>\n\n</div>\n"

/***/ },

/***/ 750:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">Databases <span class=\"badge\">{{databases?.length}}</span></h1>\n\n<emudbmanager-databases-overview></emudbmanager-databases-overview>\n"

/***/ },

/***/ 751:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">Database: {{database?.name}}</h1>\n\n<p>\n\t<a class=\"btn btn-primary\" [href]=\"webAppLink\" target=\"_blank\">EMU-webApp</a>\n</p>\n\n<hr>\n\n<p>\n\tURL to EMU-webApp: {{webAppLink}}\n</p>\n\n<hr>\n\n<div class=\"panel panel-default\">\n\n\t<ul class=\"panel-body nav nav-pills nav-justified\">\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'BundleLists'}\">\n\t\t\t<a (click)=\"state = 'BundleLists'\">\n\t\t\t\tBundle lists <span class=\"badge\">{{database?.bundleLists?.length}}</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Sessions'}\">\n\t\t\t<a (click)=\"state = 'Sessions'\">\n\t\t\t\tSessions <span class=\"badge\">{{database?.sessions?.length}}</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Download'}\">\n\t\t\t<a (click)=\"state = 'Download'\">\n\t\t\t\tDownload + Version history\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Config'}\">\n\t\t\t<a (click)=\"state = 'Config'\">\n\t\t\t\tDatabase configuration\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Rename'}\">\n\t\t\t<a (click)=\"state = 'Rename'\">\n\t\t\t\tRename database\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\n\n\t<emudbmanager-bundle-lists-overview *ngIf=\"state === 'BundleLists'\" [database]=\"database?.name\">\n\t</emudbmanager-bundle-lists-overview>\n\n\n\t<div *ngIf=\"state === 'Sessions'\" class=\"table-responsive\">\n\t\t<emudbmanager-table class=\"table table-striped\"\n\t\t                    [columns]=\"tableFormat\" [data]=\"database?.sessions\">\n\t\t</emudbmanager-table>\n\t</div>\n\n\t<div *ngIf=\"state === 'Download'\" class=\"panel-body\">\n\t\t<div class=\"alert alert-warning\">\n\t\t\t<p>\n\t\t\t\t<strong>\n\t\t\t\t\tWhile your team is editing the database, every change is recorded (using git).\n\t\t\t\t</strong>\n\t\t\t\tThis lets you go back to any previous version of your database. E.g., whenever you\n\t\t\t\tdelete or create a bundle list (in emuDB Manager), or when somebody changes the\n\t\t\t\tannotation of a bundle (in EMU-webApp), the current state of the database is\n\t\t\t\trecorded. This is called a <em>git commit</em>.\n\t\t\t</p>\n\n\t\t\t<hr>\n\n\t\t\t<p>\n\t\t\t\t<strong>\n\t\t\t\t\tDownloading the database is a two-step process.\n\t\t\t\t</strong>\n\t\t\t\tFirst, pick a version and prepare it for download. Second (a few minutes later), you\n\t\t\t\tcan grab the zip file.\n\t\t\t</p>\n\n\t\t\t<hr>\n\n\t\t\t<p>\n\t\t\t\t<strong>\n\t\t\t\t\tTags can be used to mark important versions of your database.\n\t\t\t\t</strong>\n\t\t\t\tIn the “all versions” view, you can select a version and “stick a tag to it”.\n\t\t\t\tThis way, you and your colleagues can easily find the version later. Technically,\n\t\t\t\tthis adds a <em>git tag</em> to your database.\n\t\t\t</p>\n\t\t</div>\n\n\t\t<hr>\n\n\t\t<h3 class=\"sub-header\">\n\t\t\tVersions prepared for download <span class=\"badge\">{{countDownloads()}}</span>\n\t\t</h3>\n\n\t\t<div class=\"table-responsive\">\n\t\t\t<table class=\"table table-striped\">\n\t\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th>Version</th>\n\t\t\t\t\t<th>Date prepared for download</th>\n\t\t\t\t\t<th>Size (hover for exact size)</th>\n\t\t\t\t\t<th>Actions</th>\n\t\t\t\t</tr>\n\t\t\t\t</thead>\n\n\t\t\t\t<tbody>\n\t\t\t\t<tr *ngIf=\"createArchiveCurrent\">\n\t\t\t\t\t<td colspan=\"3\">\n\t\t\t\t\t\t<p class=\"alert alert-success\">\n\t\t\t\t\t\t\t<strong>\n\t\t\t\t\t\t\t\tAnother version is currently being prepared for download.\n\t\t\t\t\t\t\t</strong>\n\t\t\t\t\t\t\tRefresh this page in a few minutes to see if the download is already\n\t\t\t\t\t\t\tavailable.<br>\n\n\t\t\t\t\t\t\t<strong>Whether this green hint stays or disappears</strong> does not\n\t\t\t\t\t\t\tindicate that the preparation process has finished. It may or may not\n\t\t\t\t\t\t\tcoincide.<br>\n\n\t\t\t\t\t\t\t<strong>Note also</strong> that in case the preparation process\n\t\t\t\t\t\t\tactually fails, you cannot, at this time, be notified of it\n\t\t\t\t\t\t\tautomatically. Check with the system administrator if the preparation\n\t\t\t\t\t\t\tseems to take too long (but 10 or 15 minutes are not unusual).\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr *ngFor=\"let download of downloadList\">\n\t\t\t\t\t<td>\n\t\t\t\t\t\t{{download.treeish}}\n\t\t\t\t\t</td>\n\t\t\t\t\t<td>{{download.date}}</td>\n\t\t\t\t\t<td [title]=\"download.size + ' B'\">{{displaySize(download.size)}}</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<form method=\"post\" [action]=\"downloadTarget(download.treeish).url\"\n\t\t\t\t\t\t      target=\"_blank\" ngNoForm>\n\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t*ngFor=\"let option of downloadOptions(download.treeish)\"\n\t\t\t\t\t\t\t\t\ttype=\"hidden\"\n\t\t\t\t\t\t\t\t\tname=\"{{option}}\"\n\t\t\t\t\t\t\t\t\tvalue=\"{{downloadTarget(download.treeish).options[option]}}\"\n\t\t\t\t\t\t\t>\n\n\t\t\t\t\t\t\t<button class=\"btn btn-primary\">\n\t\t\t\t\t\t\t\tDownload\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\n\t\t<p *ngIf=\"countDownloads() == 0\">\n\t\t\t<em>No version of this database has been prepared for download so far.</em>\n\t\t</p>\n\n\t\t<button class=\"btn btn-primary btn-sm\" (click)=\"createArchive('HEAD')\"\n\t\t        [disabled]=\"createArchiveCurrent\">\n\t\t\t<span *ngIf=\"createArchiveCurrent === 'HEAD'\">Preparing</span>\n\t\t\t<span *ngIf=\"createArchiveCurrent !== 'HEAD'\">\n\t\t\t\tPrepare current version for download\n\t\t\t</span>\n\t\t</button>\n\n\t\t<hr>\n\n\t\t<h3 class=\"sub-header\">\n\t\t\tTagged versions <span class=\"badge\">{{countTags()}}</span>\n\t\t</h3>\n\n\t\t<p *ngIf=\"countTags() === 0\">\n\t\t\t<em>No tagged versions so far. You can search a version and tag it below (in the all\n\t\t\t\tversions section).</em>\n\t\t</p>\n\n\t\t<div class=\"table-responsive\">\n\t\t\t<table class=\"table table-striped\">\n\t\t\t\t<thead>\n\t\t\t\t<tr>\n\t\t\t\t\t<th>Tag</th>\n\t\t\t\t\t<th>Actions</th>\n\t\t\t\t</tr>\n\t\t\t\t</thead>\n\n\t\t\t\t<tbody>\n\t\t\t\t<tr *ngFor=\"let tag of tagList\">\n\t\t\t\t\t<td>{{tag}}</td>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<button class=\"btn btn-primary btn-xs\" (click)=\"createArchive(tag)\"\n\t\t\t\t\t\t        [disabled]=\"createArchiveCurrent\">\n\t\t\t\t\t\t\t<span *ngIf=\"createArchiveCurrent === tag\">Preparing</span>\n\t\t\t\t\t\t\t<span *ngIf=\"createArchiveCurrent !== tag\">\n\t\t\t\t\t\tPrepare for download\n\t\t\t\t\t</span>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>\n\n\t\t<h3 class=\"sub-header\">\n\t\t\tAll versions <span class=\"badge\">{{countCommits()}}</span>\n\t\t</h3>\n\n\t\t<ul>\n\t\t\t<li *ngFor=\"let month of commitList\">\n\t\t\t\t<a (click)=\"month.open = !month.open\">\n\t\t\t\t\t<span [ngClass]=\"{\n\t\t\t\t\t\t'glyphicon': true,\n\t\t\t\t\t\t'glyphicon-collapse-down': !month.open,\n\t\t\t\t\t\t'glyphicon-collapse-up': month.open\n\t\t\t\t\t}\"></span>\n\n\t\t\t\t\t{{month.month}}\n\t\t\t\t</a>\n\n\t\t\t\t<ul *ngIf=\"month.open\">\n\t\t\t\t\t<li *ngFor=\"let day of month.days\">\n\t\t\t\t\t\t<a (click)=\"day.open = !day.open\">\n\t\t\t\t\t\t\t<span [ngClass]=\"{\n\t\t\t\t\t\t\t\t'glyphicon': true,\n\t\t\t\t\t\t\t\t'glyphicon-collapse-down': !day.open,\n\t\t\t\t\t\t\t\t'glyphicon-collapse-up': day.open\n\t\t\t\t\t\t\t}\"></span>\n\n\t\t\t\t\t\t\t{{day.day}}\n\t\t\t\t\t\t</a>\n\n\t\t\t\t\t\t<div class=\"table-responsive\" *ngIf=\"day.open\">\n\t\t\t\t\t\t\t<table class=\"table table-striped\">\n\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t<th>Time</th>\n\t\t\t\t\t\t\t\t\t<th>Commit ID (hover for full ID)</th>\n\t\t\t\t\t\t\t\t\t<th>Commit description (hover for full description)</th>\n\t\t\t\t\t\t\t\t\t<th>Actions</th>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</thead>\n\n\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t<tr *ngFor=\"let commit of day.commits\">\n\t\t\t\t\t\t\t\t\t<td>{{commit.dateTime}}</td>\n\t\t\t\t\t\t\t\t\t<td [title]=\"commit.commitID\">\n\t\t\t\t\t\t\t\t\t\t{{commit.commitID?.substr(0, 7)}}\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td [title]=\"commit.message\">\n\t\t\t\t\t\t\t\t\t\t{{transformCommitMessage(commit.message)}}\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t<button class=\"btn btn-primary btn-xs\"\n\t\t\t\t\t\t\t\t\t\t        [disabled]=\"createArchiveCurrent\"\n\t\t\t\t\t\t\t\t\t\t        (click)=\"createArchive(commit.commitID.substr(0, 7))\">\n\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"createArchiveCurrent === commit.commitID\">Preparing</span>\n\t\t\t\t\t\t\t\t\t\t\t<span *ngIf=\"createArchiveCurrent !== commit.commitID\">\n\t\t\t\t\t\t\t\t\t\t\t\tPrepare for download\n\t\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t\t\t\t\t<button class=\"btn btn-primary btn-xs\"\n\t\t\t\t\t\t\t\t\t\t        (click)=\"editTag(commit)\"\n\t\t\t\t\t\t\t\t\t\t        [ngClass]=\"{active: commit.editingTag}\">\n\t\t\t\t\t\t\t\t\t\t\tAdd tag\n\t\t\t\t\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t\t\t\t\t<form *ngIf=\"commit.editingTag\" class=\"form-inline\"\n\t\t\t\t\t\t\t\t\t\t      (ngSubmit)=\"saveTag(commit)\">\n\t\t\t\t\t\t\t\t\t\t\t<input class=\"form-control\" placeholder=\"Tag label\"\n\t\t\t\t\t\t\t\t\t\t\t       [(ngModel)]=\"commit.tagLabel\" name=\"tagLabel\">\n\t\t\t\t\t\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-xs btn-primary\"\n\t\t\t\t\t\t\t\t\t\t\t        [ngClass]=\"{disabled: commit.tagLabel===''}\">\n\t\t\t\t\t\t\t\t\t\t\t\tSave tag\n\t\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t\t</form>\n\n\t\t\t\t\t\t\t\t\t\t<p *ngIf=\"commit.saveTagError\" class=\"alert alert-danger\">\n\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t\t\t\t\t\t\t        (click)=\"commit.saveTagError = ''\">\n\t\t\t\t\t\t\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t\t\t\t\t\t{{commit.saveTagError}}\n\t\t\t\t\t\t\t\t\t\t</p>\n\n\t\t\t\t\t\t\t\t\t\t<p *ngIf=\"commit.saveTagSuccess\"\n\t\t\t\t\t\t\t\t\t\t   class=\"alert alert-success\">\n\t\t\t\t\t\t\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t\t\t\t\t\t\t        (click)=\"commit.saveTagSuccess = ''\">\n\t\t\t\t\t\t\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t\t\t\t\t\t{{commit.saveTagSuccess}}\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n\n\t<div *ngIf=\"state === 'Config'\" class=\"panel-body\">\n\t\t<p>\n\t\t\tEmu databases are configured by means of the _DBconfig.json file.\n\t\t</p>\n\n\t\t<p>\n\t\t\tThe emuDB Manager is only meant to manage a small portion of the numerous possible\n\t\t\tconfiguration options. All other options must be configured via emuR.\n\t\t</p>\n\n\t\t<hr>\n\n\t\t<div class=\"checkbox\">\n\t\t\t<label>\n\t\t\t\t<input type=\"checkbox\" [(ngModel)]=\"configComments\">\n\t\t\t\tIn EMU-webApp, show “bundle comment” fields\n\t\t\t</label>\n\t\t</div>\n\n\t\t<div class=\"checkbox\">\n\t\t\t<label>\n\t\t\t\t<input type=\"checkbox\" [(ngModel)]=\"configFinishedEditing\">\n\t\t\t\tIn EMU-webApp, show “finished editing” checkboxes\n\t\t\t</label>\n\t\t</div>\n\n\t\t<p *ngIf=\"saveConfigSuccess\" class=\"alert alert-success\">\n\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"saveConfigSuccess = ''\">\n\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t</button>\n\n\t\t\t{{saveConfigSuccess}}\n\t\t</p>\n\n\t\t<p *ngIf=\"saveConfigError\" class=\"alert alert-danger\">\n\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"saveConfigError = ''\">\n\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t</button>\n\n\t\t\t{{saveConfigError}}\n\t\t</p>\n\n\n\t\t<p>\n\t\t\t<button class=\"btn btn-default\" (click)=\"saveConfiguration()\">Save</button>\n\t\t</p>\n\n\t\t<p class=\"alert alert-warning\" *ngIf=\"hasUnsavedChanges()\">\n\t\t\tYou have unsaved changes.\n\t\t</p>\n\t</div>\n\n\t<div *ngIf=\"state === 'Rename'\" class=\"panel-body\">\n\t\t<form (ngSubmit)=\"renameDatabase()\">\n\t\t\t<p>\n\t\t\t\tCurrent name of the database: {{database?.name}}\n\t\t\t</p>\n\n\t\t\t<p>\n\t\t\t\t<input class=\"form-control\" placeholder=\"New name\" [(ngModel)]=\"newName\"\n\t\t\t\t       name=\"newName\" autocomplete=\"off\">\n\t\t\t</p>\n\n\t\t\t<p *ngIf=\"renameSuccess\" class=\"alert alert-success\">\n\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"renameSuccess = ''\">\n\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t</button>\n\n\t\t\t\t{{renameSuccess}}\n\t\t\t</p>\n\n\t\t\t<p *ngIf=\"renameError\" class=\"alert alert-danger\">\n\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"renameError = ''\">\n\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t</button>\n\n\t\t\t\t{{renameError}}\n\t\t\t</p>\n\n\t\t\t<p>\n\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">Rename</button>\n\t\t\t</p>\n\t\t</form>\n\t</div>\n\n</div>\n"

/***/ },

/***/ 752:
/***/ function(module, exports) {

module.exports = "<div class=\"table-responsive\">\n\t<table class=\"table table-striped\">\n\t\t<thead>\n\t\t<tr>\n\t\t\t<th>Name</th>\n\t\t\t<th>Sessions</th>\n\t\t\t<th>Bundles</th>\n\t\t\t<th>Bundle lists</th>\n\t\t\t<th>Actions</th>\n\t\t</tr>\n\t\t</thead>\n\t\t<tbody>\n\n\t\t<tr *ngFor=\"let database of databases\">\n\t\t\t<td>{{database.name}}</td>\n\t\t\t<td>{{database.sessions.length}}</td>\n\t\t\t<td>{{projectDataService.countBundles(database.sessions)}}</td>\n\t\t\t<td>\n\t\t\t\t<ul>\n\t\t\t\t\t<li *ngFor=\"let bundleList of database.bundleLists\">\n\t\t\t\t\t\t{{bundleList.name}}\n\t\t\t\t\t\t<span *ngIf=\"bundleList.archiveLabel\">({{bundleList.archiveLabel}})</span>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t\t<button [routerLink]=\"['/project/databases', database.name]\"\n\t\t\t\t        class=\"btn btn-default\">\n\t\t\t\t        View &amp; edit\n\t\t\t\t</button>\n\t\t\t</td>\n\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n"

/***/ },

/***/ 753:
/***/ function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n\t<div class=\"row\">\n\n\t\t<nav class=\"col-sm-3 col-md-2 navbar sidebar navbar-collapse collapse\">\n\t\t\t<ul class=\"nav nav-sidebar\">\n\t\t\t\t<li routerLinkActive=\"active\"><a routerLink=\"/project/overview\">Project overview</a>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<ul class=\"nav nav-sidebar\">\n\t\t\t\t<li routerLinkActive=\"active\"><a routerLink=\"/project/databases\">Databases <span\n\t\t\t\t\tclass=\"badge pull-right\">{{databases?.length}}</span></a></li>\n\t\t\t\t<li routerLinkActive=\"active\"><a routerLink=\"/project/bundle-lists\">Bundle lists\n\t\t\t\t\t<span\n\t\t\t\t\t\tclass=\"badge pull-right\">{{bundleLists?.length}}</span></a></li>\n\t\t\t\t<li routerLinkActive=\"active\"><a routerLink=\"/project/uploads\">Uploads\n\t\t\t\t\t<span class=\"badge pull-right\">{{uploads?.length}}</span></a></li>\n\t\t\t</ul>\n\t\t\t<ul class=\"nav nav-sidebar\">\n\t\t\t\t<li><a (click)=\"projectDataService.fetchData()\">Refresh</a></li>\n\t\t\t\t<li><a (click)=\"logout()\">Logout</a></li>\n\t\t\t</ul>\n\t\t</nav>\n\n\t\t<div class=\"col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main\">\n\t\t\t<router-outlet></router-outlet>\n\t\t</div>\n\t</div>\n</div>\n"

/***/ },

/***/ 754:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">Uploaded database: {{upload?.name}}</h1>\n\n<p>\n\tUUID (Universally Unique Identifier): {{upload?.uuid}}\n</p>\n<p>\n\tUpload date: {{upload?.date}}\n</p>\n\n<hr>\n\n<div class=\"panel panel-default\">\n\n\t<ul class=\"panel-body nav nav-pills nav-justified\">\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Sessions'}\">\n\t\t\t<a (click)=\"state = 'Sessions'\">\n\t\t\t\tSessions <span class=\"badge\">{{upload?.sessions?.length}}</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Save'}\">\n\t\t\t<a (click)=\"state = 'Save'\">\n\t\t\t\tSave\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Delete'}\">\n\t\t\t<a (click)=\"state = 'Delete'\">\n\t\t\t\tDelete\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\n\t<div *ngIf=\"state === 'Sessions'\" class=\"table-responsive\">\n\t\t<emudbmanager-table class=\"table table-striped\"\n\t\t                    [columns]=\"tableFormat\" [data]=\"upload?.sessions\">\n\t\t</emudbmanager-table>\n\t</div>\n\n\t<div *ngIf=\"state === 'Save'\" class=\"panel-body\">\n\t\t<p>\n\t\t\tThis upload contains an EMU speech database with\n\t\t\t<strong>{{upload?.sessions?.length}}</strong>\n\t\t\t<template [ngIf]=\"upload?.sessions?.length != 1\">sessions</template>\n\t\t\t<template [ngIf]=\"upload?.sessions?.length == 1\">session</template>\n\t\t\tthat is named <strong>{{upload?.name}}</strong>.\n\t\t</p>\n\n\t\t<p>\n\t\t\tIt can either be saved as a database of its own, or merged with an existing database.\n\t\t</p>\n\n\t\t<hr>\n\n\t\t<div [ngSwitch]=\"mergeForm.duplicateName\">\n\t\t\t<form (ngSubmit)=\"saveUpload()\">\n\t\t\t\t<div *ngSwitchCase=\"true\">\n\t\t\t\t\t<p>\n\t\t\t\t\t\tThe project already has a database named <strong>{{upload?.name}}</strong>.\n\t\t\t\t\t\tIf you want to save this upload as a database of its own, you have to\n\t\t\t\t\t\trename it first.\n\t\t\t\t\t</p>\n\n\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<input class=\"form-control\" placeholder=\"New name\"\n\t\t\t\t\t\t       [(ngModel)]=\"mergeForm.newName\" name=\"mergeNewName\">\n\t\t\t\t\t</p>\n\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<button type=\"submit\" class=\"btn btn-default\"\n\t\t\t\t\t\t        [disabled]=\"mergeForm.newName == ''\">\n\t\t\t\t\t\t\tSave <strong>{{upload?.name}}</strong> as a database named\n\n\t\t\t\t\t\t\t<strong *ngIf=\"mergeForm.newName\">{{mergeForm.newName}}</strong>\n\t\t\t\t\t\t\t<em *ngIf=\"!mergeForm.newName\">[choose a name first]</em>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\n\t\t\t\t<div *ngSwitchCase=\"false\">\n\t\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">\n\t\t\t\t\t\tSave <strong>{{upload?.name}}</strong> as a database of its own\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\n\t\t\t\t<p *ngIf=\"mergeForm.messageSuccess\" class=\"alert alert-success\">\n\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t        (click)=\"mergeForm.messageSuccess = ''\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t{{mergeForm.messageSuccess}}\n\t\t\t\t</p>\n\n\t\t\t\t<p *ngIf=\"mergeForm.messageError\" class=\"alert alert-danger\">\n\t\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\"\n\t\t\t\t\t        (click)=\"mergeForm.messageError = ''\">\n\t\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t\t</button>\n\n\t\t\t\t\t{{mergeForm.messageError}}\n\t\t\t\t</p>\n\t\t\t</form>\n\t\t</div>\n\n\t\t<hr>\n\n\t\t<p>\n\t\t\tIf you would rather merge <strong>{{upload?.name}}</strong> with an existing\n\t\t\tdatabase, pick one. It will then be checked whether the two can be merged.\n\t\t</p>\n\n\t\t<div class=\"dropdown\">\n\t\t\t<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMerge\"\n\t\t\t        data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n\t\t\t\tMerge <strong>{{upload?.name}}</strong> with database\n\t\t\t\t<span class=\"caret\"></span>\n\t\t\t</button>\n\t\t\t<ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMerge\">\n\t\t\t\t<li *ngIf=\"databaseList.length === 0\">\n\t\t\t\t\t<a><em>No database available</em></a>\n\t\t\t\t</li>\n\t\t\t\t<li *ngFor=\"let database of databaseList\"><a>{{database.name}}</a></li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n\n\t<div *ngIf=\"state === 'Delete'\" class=\"panel-body\">\n\t\t<div class=\"checkbox\">\n\t\t\t<label>\n\t\t\t\t<input type=\"checkbox\" [(ngModel)]=\"reallyDelete\">\n\t\t\t\tDelete this upload? This is irreversible!\n\t\t\t</label>\n\t\t</div>\n\n\t\t<hr>\n\n\t\t<p *ngIf=\"deleteError\" class=\"alert alert-danger\">\n\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"deleteError = ''\">\n\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t</button>\n\n\t\t\t{{deleteError}}\n\t\t</p>\n\n\t\t<p>\n\t\t\t<button type=\"button\" class=\"btn btn-danger\" [disabled]=\"!reallyDelete\"\n\t\t\t        (click)=\"deleteUpload()\">\n\t\t\t\tDelete\n\t\t\t</button>\n\t\t</p>\n\t</div>\n\n</div>\n"

/***/ },

/***/ 755:
/***/ function(module, exports) {

module.exports = "<div class=\"panel-body\">\n\t<h2 class=\"sub-header\">Instructions</h2>\n\n\t<ul>\n\t\t<li>\n\t\t\tUpload a ZIP file here.\n\t\t</li>\n\n\t\t<li>\n\t\t\tThe ZIP file must contain a valid EMU speech database: a directory called\n\t\t\t<i>name</i>_emuDB, which in turn contains <i>name</i>_DBconfig.json and a number of\n\t\t\tsession directories.\n\t\t</li>\n\n\t\t<li>\n\t\t\tThe EMU speech database can then either be saved as a new database or merged with an\n\t\t\texisting database.\n\t\t</li>\n\n\t\t<li>\n\t\t\tIf you want to merge two databases, you have to make sure the new data and the old\n\t\t\tdata fit together.\n\n\t\t\t<ul>\n\t\t\t\t<li>\n\t\t\t\t\tThe new database must not contain sessions that are already there in the old\n\t\t\t\t\tdatabase.\n\t\t\t\t</li>\n\n\t\t\t\t<li>\n\t\t\t\t\tIt is important, that the <em>annotation structure of both databases is the\n\t\t\t\t\tsame</em>. They must contain the same levels and the same types of links.\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</li>\n\t</ul>\n</div>\n\n\n<div class=\"panel-body\">\n\t<h2 class=\"sub-header\">Upload</h2>\n\n\t<div>\n\t\t<label for=\"file-pb\">\n\t\t\t<span class=\"glyphicon glyphicon-upload\"></span>\n\t\t\tSelect a file to upload\n\t\t</label>\n\t\t<input type=\"file\" id=\"file-pb\" ngFileSelect [options]=\"options\"\n\t\t       (onUpload)=\"handleProgress($event)\">\n\t</div>\n\n\t<div>\n\t\t<div class=\"progress\">\n\t\t\t<div class=\"progress-bar progress-bar-striped\" role=\"progressbar\"\n\t\t\t     [attr.aria-valuenow]=\"uploadProgress\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n\t\t\t     [style.width]=\"uploadProgress + '%'\">\n\t\t\t\t{{uploadProgress}} %\n\t\t\t</div>\n\t\t</div>\n\n\t\t<p *ngIf=\"transferMessage\" class=\"alert alert-success\">\n\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"transferMessage = ''\">\n\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t</button>\n\n\t\t\t{{transferMessage}}\n\t\t</p>\n\n\t\t<p *ngIf=\"successMessage\" class=\"alert alert-success\">\n\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"successMessage = ''\">\n\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t</button>\n\n\t\t\t{{successMessage}}\n\t\t</p>\n\n\t\t<p *ngIf=\"errorMessage\" class=\"alert alert-danger\">\n\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"errorMessage = ''\">\n\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t</button>\n\n\t\t\t{{errorMessage}}\n\t\t</p>\n\t</div>\n</div>\n\n"

/***/ },

/***/ 756:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">Uploads</h1>\n\n<div class=\"panel panel-default\">\n\t<ul class=\"panel-body nav nav-pills nav-justified\">\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'Overview'}\">\n\t\t\t<a (click)=\"state = 'Overview'\">\n\t\t\t\tUploaded databases <span class=\"badge\">{{uploads?.length}}</span>\n\t\t\t</a>\n\t\t</li>\n\t\t<li role=\"presentation\" [ngClass]=\"{active: state === 'New'}\">\n\t\t\t<a (click)=\"state = 'New'\">\n\t\t\t\tUpload new file\n\t\t\t</a>\n\t\t</li>\n\t</ul>\n\n\t<emudbmanager-uploads-overview *ngIf=\"state === 'Overview'\">\n\t</emudbmanager-uploads-overview>\n\n\t<emudbmanager-upload-form *ngIf=\"state === 'New'\" class=\"panel-body\">\n\t</emudbmanager-upload-form>\n</div>\n"

/***/ },

/***/ 757:
/***/ function(module, exports) {

module.exports = "<div class=\"table-responsive\">\n\t<table class=\"table table-striped\">\n\t\t<thead>\n\t\t<tr>\n\t\t\t<th>Unique identifier (UUID)</th>\n\t\t\t<th>Database name</th>\n\t\t\t<th>Upload date</th>\n\t\t\t<th>Sessions</th>\n\t\t\t<th>Bundles</th>\n\t\t\t<th>Actions</th>\n\t\t</tr>\n\t\t</thead>\n\n\t\t<tbody>\n\t\t<tr *ngFor=\"let upload of uploads\">\n\t\t\t<td>{{upload.uuid}}</td>\n\t\t\t<td>{{upload.name}}</td>\n\t\t\t<td>{{upload.date}}</td>\n\t\t\t<td>{{upload.sessions.length}}</td>\n\t\t\t<td>{{projectDataService.countBundles(upload.sessions)}}</td>\n\t\t\t<td>\n\t\t\t\t<button [routerLink]=\"['/project/uploads', upload.uuid]\" class=\"btn btn-default\">\n\t\t\t\t\tView &amp; edit\n\t\t\t\t</button>\n\t\t\t</td>\n\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n"

/***/ },

/***/ 758:
/***/ function(module, exports) {

module.exports = "<h1 class=\"page-header\">emuDB Manager</h1>\n\n<div class=\"panel panel-default\">\n\t<div class=\"panel-heading\">Login</div>\n\t<div class=\"panel-body\">\n\t\t<form (ngSubmit)=\"checkLogin()\">\n\t\t\t<p>\n\t\t\t\t<input autofocus class=\"form-control\" placeholder=\"Username\" [(ngModel)]=\"username\"\n\t\t\t\t       name=\"username\">\n\t\t\t</p>\n\n\t\t\t<p>\n\t\t\t\t<input class=\"form-control\" type=\"password\" placeholder=\"Password\"\n\t\t\t\t       [(ngModel)]=\"password\" name=\"password\">\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<button type=\"submit\" class=\"btn btn-default\">\n\t\t\t\t\tLogin\n\t\t\t\t</button>\n\t\t\t</p>\n\t\t\t<p *ngIf=\"loginFailed\" class=\"alert alert-danger\" role=\"alert\">\n\t\t\t\tInvalid login credentials supplied.\n\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"loginFailed = false\">\n\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t</button>\n\t\t\t</p>\n\t\t\t<div *ngIf=\"unknownError\" class=\"alert alert-danger\" role=\"alert\">\n\t\t\t\t<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"unknownError = false\">\n\t\t\t\t\t<span aria-hidden=\"true\">&times;</span>\n\t\t\t\t</button>\n\n\t\t\t\t<p>\n\t\t\t\t\tAn error has occurred. The project data could not be loaded.\n\t\t\t\t</p>\n\n\t\t\t\t<p>\n\t\t\t\t\tPlease check your internet connection, or consult your system administrator\n\t\t\t\t\tor the software provider.\n\t\t\t\t</p>\n\n\t\t\t\t<p>\n\t\t\t\t\tError message: {{unknownErrorMessage}}\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</form>\n\t</div>\n</div>\n\n<div class=\"panel panel-primary\">\n\t<div class=\"panel-heading\">What is this?</div>\n\t<div class=\"panel-body\">\n\t\t<p>This manager is a part of the EMU Speech Database Management System (EMU\n\t\t\tSDMS).</p>\n\n\t\t<p>\n\t\t\tEMU offers a unique way to store and analyse data collected in the speech\n\t\t\tsciences\n\t\t\tand linguistics.\n\t\t</p>\n\n\t\t<p>\n\t\t\tThis manager allows your research group to:\n\t\t</p>\n\n\t\t<ul>\n\t\t\t<li>create and manage a number of EMU Databases</li>\n\t\t\t<li>assign parts of the database to project members for segmentation,\n\t\t\t\tlabelling and\n\t\t\t\tvalidation\n\t\t\t\ttasks\n\t\t\t</li>\n\t\t\t<li>extend your databases with newly collected data</li>\n\t\t</ul>\n\t</div>\n</div>\n"

/***/ }

},[1024]);
//# sourceMappingURL=main.bundle.map