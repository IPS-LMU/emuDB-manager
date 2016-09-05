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
        this.url = 'https://www.phonetik.uni-muenchen.de/devel/emuDB-manager/server-side/emudb-manager.php';
        this.username = 'dach';
        this.password = 'dach';
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
        var params = new http_1.URLSearchParams();
        params.set('query', 'project_info');
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
                    _this.infoObserver.error('UNKNOWN ERROR');
                }
            }
        });
    };
    ProjectDataService.prototype.serverQuery = function (params) {
        console.log('Querying server', params);
        params.set('user', this.username);
        params.set('password', this.password);
        return this.http
            .get(this.url, { search: params })
            .map(function (response) {
            var json = response.json();
            console.log('Received JSON data', json);
            return json;
        })
            .catch(function (error) {
            return Rx_1.Observable.throw('Error during download', error);
        });
    };
    ProjectDataService.prototype.login = function (username, password) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.username = username;
            _this.password = password;
            var params = new http_1.URLSearchParams();
            params.set('query', 'login');
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
    ProjectDataService.prototype.getBundleList = function (database, name, status) {
        return this.infoObservable.map(function (x) {
            for (var i = 0; i < x.databases.length; ++i) {
                if (x.databases[i].name === database) {
                    for (var j = 0; j < x.databases[i].bundleLists.length; ++j) {
                        if (x.databases[i].bundleLists[j].name === name
                            && x.databases[i].bundleLists[j].status === status) {
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
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            var params = new http_1.URLSearchParams();
            params.set('query', 'rename_db');
            params.set('old_name', oldName);
            params.set('new_name', newName);
            _this.serverQuery(params).subscribe(function (next) {
                if (next.success === true) {
                    observer.next(null);
                    observer.complete();
                }
                else {
                    observer.error(next);
                }
            });
        });
    };
    ProjectDataService.prototype.editBundle = function (database, name, status, newName, newStatus) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            var params = new http_1.URLSearchParams();
            params.set('query', 'edit_bundle_list');
            params.set('database', database);
            params.set('old_name', name);
            params.set('old_status', status);
            params.set('new_name', newName);
            params.set('new_status', newStatus);
            _this.serverQuery(params).subscribe(function (next) {
                if (next.success === true) {
                    observer.next(null);
                    observer.complete();
                }
                else {
                    observer.error(next);
                }
            });
        });
    };
    ProjectDataService.prototype.getUploadURL = function () {
        var params = new http_1.URLSearchParams();
        params.set('user', this.username);
        params.set('password', this.password);
        params.set('query', 'upload');
        return this.url + '?' + params.toString();
    };
    ProjectDataService.prototype.deleteUpload = function (identifier) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            var params = new http_1.URLSearchParams();
            params.set('query', 'delete_upload');
            params.set('uuid', identifier);
            _this.serverQuery(params).subscribe(function (next) {
                if (next.success === true) {
                    observer.next(null);
                    observer.complete();
                }
                else {
                    observer.error(next);
                }
            });
        });
    };
    ProjectDataService.prototype.saveUpload = function (identifier, name) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            var params = new http_1.URLSearchParams();
            params.set('query', 'save_upload');
            params.set('uuid', identifier);
            params.set('name', name);
            _this.serverQuery(params).subscribe(function (next) {
                if (next.success === true) {
                    observer.next(null);
                    observer.complete();
                }
                else {
                    observer.error(next);
                }
            });
        });
    };
    ProjectDataService.prototype.generateBundleList = function (database, sessionPattern, bundlePattern, editors, personsPerBundle, shuffled) {
        //////////
        // Check parameter constraints
        //
        if (editors.length < personsPerBundle) {
        }
        //
        //////////
        return this.getDatabase(database).map(function (dbInfo) {
            if (dbInfo === null) {
            }
            var sessionRegex = new RegExp(sessionPattern);
            var bundleRegex = new RegExp(bundlePattern);
            //////////
            // Select the bundles to add to the newly generated bunldle list(s)
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
            // Distribute bundles to editors
            //
            // Prepare a bundle list for each editor
            var resultBundleLists = [];
            for (var i = 0; i < editors.length; ++i) {
                resultBundleLists.push({
                    name: editors[i],
                    status: '',
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
            // @todo actually return
            return resultBundleLists;
        });
    };
    ProjectDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ProjectDataService);
    return ProjectDataService;
}());
exports.ProjectDataService = ProjectDataService;
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-J2RFjThZ.tmp/0/src/app/project-data.service.js.map