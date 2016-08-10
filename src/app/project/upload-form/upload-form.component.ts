import {Component, NgZone} from "@angular/core";
import {UPLOAD_DIRECTIVES} from "ng2-uploader/ng2-uploader";
import {ProjectDataService} from "../../project-data.service";

@Component({
	moduleId: module.id,
	selector: 'emudbmanager-upload-form',
	templateUrl: 'upload-form.component.html',
	styleUrls: ['upload-form.component.css'],
	directives: [UPLOAD_DIRECTIVES]
})
export class UploadFormComponent {
	uploadFile: any;
	uploadProgress: number;
	uploadResponse: Object;
	zone: NgZone;
	options: {url:string} = {
		url: ''
	};

	constructor(private projectDataService: ProjectDataService) {
		this.uploadProgress = 0;
		this.uploadResponse = {};
		this.zone = new NgZone({ enableLongStackTrace: false });
		this.options.url = this.projectDataService.getUploadURL();
		console.debug(this.options.url);
	}

	handleUpload(data): void {
		this.uploadFile = data;
		this.zone.run(() => {
			this.uploadProgress = data.progress.percent;
		});
		let resp = data.response;
		if (resp) {
			resp = JSON.parse(resp);
			this.uploadResponse = resp;
		}
	}

}
