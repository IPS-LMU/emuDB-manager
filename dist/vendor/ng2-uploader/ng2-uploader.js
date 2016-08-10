"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var ng2_uploader_1 = require('./src/services/ng2-uploader');
var ng_file_select_1 = require('./src/directives/ng-file-select');
var ng_file_drop_1 = require('./src/directives/ng-file-drop');
__export(require('./src/services/ng2-uploader'));
__export(require('./src/directives/ng-file-select'));
__export(require('./src/directives/ng-file-drop'));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    directives: [ng_file_select_1.NgFileSelect, ng_file_drop_1.NgFileDrop],
    providers: [ng2_uploader_1.Ng2Uploader]
};
exports.UPLOAD_DIRECTIVES = [ng_file_select_1.NgFileSelect, ng_file_drop_1.NgFileDrop];
//# sourceMappingURL=ng2-uploader.js.map