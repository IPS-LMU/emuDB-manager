"use strict";
var core_1 = require('@angular/core');
var UploadedFile = (function () {
    function UploadedFile(id, originalName, size) {
        this.id = id;
        this.originalName = originalName;
        this.size = size;
        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0,
            speed: 0,
            speedHumanized: null
        };
        this.done = false;
        this.error = false;
        this.abort = false;
        this.startTime = new Date().getTime();
        this.endTime = 0;
        this.speedAverage = 0;
        this.speedAverageHumanized = null;
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
        this.endTime = new Date().getTime();
        this.speedAverage = this.size / (this.endTime - this.startTime) * 1000;
        this.speedAverage = parseInt(this.speedAverage, 10);
        this.speedAverageHumanized = humanizeBytes(this.speedAverage);
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
        this.data = {};
        this.autoUpload = true;
        this.multipart = true;
        this.method = 'POST';
        this.debug = false;
        this.customHeaders = {};
        this.encodeHeaders = true;
        this.authTokenPrefix = 'Bearer';
        this.authToken = undefined;
        this.fieldName = 'file';
        this.previewUrl = false;
        this.calculateSpeed = false;
        this._queue = [];
        this._emitter = new core_1.EventEmitter();
        this._previewEmitter = new core_1.EventEmitter();
    }
    Ng2Uploader.prototype.setOptions = function (options) {
        this.url = options.url != null ? options.url : this.url;
        this.cors = options.cors != null ? options.cors : this.cors;
        this.withCredentials = options.withCredentials != null ? options.withCredentials : this.withCredentials;
        this.multiple = options.multiple != null ? options.multiple : this.multiple;
        this.maxUploads = options.maxUploads != null ? options.maxUploads : this.maxUploads;
        this.data = options.data != null ? options.data : this.data;
        this.autoUpload = options.autoUpload != null ? options.autoUpload : this.autoUpload;
        this.multipart = options.multipart != null ? options.multipart : this.multipart;
        this.method = options.method != null ? options.method : this.method;
        this.customHeaders = options.customHeaders != null ? options.customHeaders : this.customHeaders;
        this.encodeHeaders = options.encodeHeaders != null ? options.encodeHeaders : this.encodeHeaders;
        this.authTokenPrefix = options.authTokenPrefix != null ? options.authTokenPrefix : this.authTokenPrefix;
        this.authToken = options.authToken != null ? options.authToken : this.authToken;
        this.fieldName = options.fieldName != null ? options.fieldName : this.fieldName;
        this.previewUrl = options.previewUrl != null ? options.previewUrl : this.previewUrl;
        this.calculateSpeed = options.calculateSpeed != null ? options.calculateSpeed : this.calculateSpeed;
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
        Object.keys(this.data).forEach(function (k) {
            form.append(k, _this.data[k]);
        });
        var uploadingFile = new UploadedFile(this.generateRandomIndex(), file.name, file.size);
        var queueIndex = this._queue.indexOf(file);
        var time = new Date().getTime();
        var load = 0;
        var speed = 0;
        var speedHumanized = null;
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                if (_this.calculateSpeed) {
                    time = new Date().getTime() - time;
                    load = e.loaded - load;
                    speed = load / time * 1000;
                    speed = parseInt(speed, 10);
                    speedHumanized = humanizeBytes(speed);
                }
                var percent = Math.round(e.loaded / e.total * 100);
                if (speed === 0) {
                    uploadingFile.setProgres({
                        total: e.total,
                        loaded: e.loaded,
                        percent: percent
                    });
                }
                else {
                    uploadingFile.setProgres({
                        total: e.total,
                        loaded: e.loaded,
                        percent: percent,
                        speed: speed,
                        speedHumanized: speedHumanized
                    });
                }
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
            xhr.setRequestHeader('Authorization', this.authTokenPrefix + " " + this.authToken);
        }
        xhr.send(form);
    };
    Ng2Uploader.prototype.addFilesToQueue = function (files) {
        var _this = this;
        files.forEach(function (file, i) {
            if (_this.isFile(file) && !_this.inQueue(file)) {
                _this._queue.push(file);
            }
        });
        if (this.previewUrl) {
            files.forEach(function (file) { return _this.createFileUrl(file); });
        }
        if (this.autoUpload) {
            this.uploadFilesInQueue();
        }
    };
    Ng2Uploader.prototype.createFileUrl = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            _this._previewEmitter.emit(reader.result);
        });
        reader.readAsDataURL(file);
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
    Ng2Uploader.prototype.generateRandomIndex = function () {
        return Math.random().toString(36).substring(7);
    };
    return Ng2Uploader;
}());
exports.Ng2Uploader = Ng2Uploader;
function humanizeBytes(bytes) {
    if (bytes === 0) {
        return '0 Byte';
    }
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i] + '/s';
}
//# sourceMappingURL=ng2-uploader.js.map