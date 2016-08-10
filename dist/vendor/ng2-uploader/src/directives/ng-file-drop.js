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
var ng2_uploader_1 = require('../services/ng2-uploader');
var NgFileDrop = (function () {
    function NgFileDrop(el) {
        var _this = this;
        this.el = el;
        this.onUpload = new core_1.EventEmitter();
        this.uploader = new ng2_uploader_1.Ng2Uploader();
        setTimeout(function () {
            _this.uploader.setOptions(_this.options);
        });
        this.uploader._emitter.subscribe(function (data) {
            _this.onUpload.emit(data);
        });
        this.initEvents();
    }
    NgFileDrop.prototype.initEvents = function () {
        var _this = this;
        this.el.nativeElement.addEventListener('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var dt = e.dataTransfer;
            var files = dt.files;
            if (files.length) {
                _this.uploader.addFilesToQueue(files);
            }
        }, false);
        this.el.nativeElement.addEventListener('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        this.el.nativeElement.addEventListener('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
    };
    NgFileDrop = __decorate([
        core_1.Directive({
            selector: '[ng-file-drop]',
            inputs: ['options: ng-file-drop'],
            outputs: ['onUpload']
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], NgFileDrop);
    return NgFileDrop;
}());
exports.NgFileDrop = NgFileDrop;
//# sourceMappingURL=ng-file-drop.js.map