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
var core_1 = require('@angular/core');
var UploadedFile = (function () {
    function UploadedFile(id, originalName, size) {
        this.id = id;
        this.originalName = originalName;
        this.size = size;
        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0
        };
        this.done = false;
        this.error = false;
        this.abort = false;
    }
    UploadedFile.prototype.setProgres = function (progress) {
        this.progress = progress;
    };
    UploadedFile.prototype.setError = function () {
        this.error = true;
        this.done = true;
    };
    UploadedFile.prototype.setAbort = function () {
        this.abort = true;
        this.done = true;
    };
    UploadedFile.prototype.onFinished = function (status, statusText, response) {
        this.status = status;
        this.statusText = statusText;
        this.response = response;
        this.done = true;
    };
    return UploadedFile;
}());
exports.UploadedFile = UploadedFile;
var Ng2Uploader = (function () {
    function Ng2Uploader() {
        this.cors = false;
        this.withCredentials = false;
        this.multiple = false;
        this.maxUploads = 3;
        this.allowedExtensions = [];
        this.maxSize = false;
        this.data = {};
        this.noParams = true;
        this.autoUpload = true;
        this.multipart = true;
        this.method = 'POST';
        this.debug = false;
        this.customHeaders = {};
        this.encodeHeaders = true;
        this.authTokenPrefix = "Bearer";
        this.authToken = undefined;
        this.fieldName = "file";
        this._queue = [];
        this._emitter = new core_1.EventEmitter(true);
    }
    Ng2Uploader.prototype.setOptions = function (options) {
        this.url = options.url != null ? options.url : this.url;
        this.cors = options.cors != null ? options.cors : this.cors;
        this.withCredentials = options.withCredentials != null ? options.withCredentials : this.withCredentials;
        this.multiple = options.multiple != null ? options.multiple : this.multiple;
        this.maxUploads = options.maxUploads != null ? options.maxUploads : this.maxUploads;
        this.allowedExtensions = options.allowedExtensions != null ? options.allowedExtensions : this.allowedExtensions;
        this.maxSize = options.maxSize != null ? options.maxSize : this.maxSize;
        this.data = options.data != null ? options.data : this.data;
        this.noParams = options.noParams != null ? options.noParams : this.noParams;
        this.autoUpload = options.autoUpload != null ? options.autoUpload : this.autoUpload;
        this.multipart = options.multipart != null ? options.multipart : this.multipart;
        this.method = options.method != null ? options.method : this.method;
        this.debug = options.debug != null ? options.debug : this.debug;
        this.customHeaders = options.customHeaders != null ? options.customHeaders : this.customHeaders;
        this.encodeHeaders = options.encodeHeaders != null ? options.encodeHeaders : this.encodeHeaders;
        this.authTokenPrefix = options.authTokenPrefix != null ? options.authTokenPrefix : this.authTokenPrefix;
        this.authToken = options.authToken != null ? options.authToken : this.authToken;
        this.fieldName = options.fieldName != null ? options.fieldName : this.fieldName;
        if (!this.multiple) {
            this.maxUploads = 1;
        }
    };
    Ng2Uploader.prototype.uploadFilesInQueue = function () {
        var _this = this;
        var newFiles = this._queue.filter(function (f) { return !f.uploading; });
        newFiles.forEach(function (f) {
            _this.uploadFile(f);
        });
    };
    ;
    Ng2Uploader.prototype.uploadFile = function (file) {
        var _this = this;
        var xhr = new XMLHttpRequest();
        var form = new FormData();
        form.append(this.fieldName, file, file.name);
        var uploadingFile = new UploadedFile(this.generateRandomIndex(), file.name, file.size);
        var queueIndex = this._queue.indexOf(file);
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var percent = Math.round(e.loaded / e.total * 100);
                uploadingFile.setProgres({
                    total: e.total,
                    loaded: e.loaded,
                    percent: percent
                });
                _this._emitter.emit(uploadingFile);
            }
        };
        xhr.upload.onabort = function (e) {
            uploadingFile.setAbort();
            _this._emitter.emit(uploadingFile);
        };
        xhr.upload.onerror = function (e) {
            uploadingFile.setError();
            _this._emitter.emit(uploadingFile);
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                uploadingFile.onFinished(xhr.status, xhr.statusText, xhr.response);
                _this.removeFileFromQueue(queueIndex);
                _this._emitter.emit(uploadingFile);
            }
        };
        xhr.open(this.method, this.url, true);
        xhr.withCredentials = this.withCredentials;
        if (this.customHeaders) {
            Object.keys(this.customHeaders).forEach(function (key) {
                xhr.setRequestHeader(key, _this.customHeaders[key]);
            });
        }
        if (this.authToken) {
            xhr.setRequestHeader("Authorization", this.authTokenPrefix + " " + this.authToken);
        }
        xhr.send(form);
    };
    Ng2Uploader.prototype.addFilesToQueue = function (files) {
        var index, file;
        for (index = 0; index < files.length; index++) {
            file = files.item(index);
            if (this.isFile(file) && !this.inQueue(file)) {
                this._queue.push(file);
            }
        }
        if (this.autoUpload) {
            this.uploadFilesInQueue();
        }
    };
    Ng2Uploader.prototype.removeFileFromQueue = function (i) {
        this._queue.splice(i, 1);
    };
    Ng2Uploader.prototype.clearQueue = function () {
        this._queue = [];
    };
    Ng2Uploader.prototype.getQueueSize = function () {
        return this._queue.length;
    };
    Ng2Uploader.prototype.inQueue = function (file) {
        var fileInQueue = this._queue.filter(function (f) { return f === file; });
        return fileInQueue.length ? true : false;
    };
    Ng2Uploader.prototype.isFile = function (file) {
        return file !== null && (file instanceof Blob || (file.name && file.size));
    };
    Ng2Uploader.prototype.log = function (msg) {
        if (!this.debug) {
            return;
        }
        console.log('[Ng2Uploader]:', msg);
    };
    Ng2Uploader.prototype.generateRandomIndex = function () {
        return Math.random().toString(36).substring(7);
    };
    Ng2Uploader = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Ng2Uploader);
    return Ng2Uploader;
}());
exports.Ng2Uploader = Ng2Uploader;
//# sourceMappingURL=ng2-uploader.js.map