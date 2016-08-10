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
var NgFileSelect = (function () {
    function NgFileSelect(el) {
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
    }
    NgFileSelect.prototype.onFiles = function () {
        var files = this.el.nativeElement.files;
        if (files.length) {
            this.uploader.addFilesToQueue(files);
        }
    };
    NgFileSelect = __decorate([
        core_1.Directive({
            selector: '[ng-file-select]',
            inputs: ['options: ng-file-select'],
            outputs: ['onUpload'],
            host: { '(change)': 'onFiles()' }
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], NgFileSelect);
    return NgFileSelect;
}());
exports.NgFileSelect = NgFileSelect;
//# sourceMappingURL=ng-file-select.js.map