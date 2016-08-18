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
	private errorMessage:string = '';
	private options: {url:string} = {
		url: ''
	};
	private successMessage: string = '';
	private transferMessage:string = '';
	private uploadProgress: number;
	private zone: NgZone;

	constructor(private projectDataService: ProjectDataService) {
		this.uploadProgress = 0;
		this.zone = new NgZone({ enableLongStackTrace: false });
		this.options.url = this.projectDataService.getUploadURL();
	}

	handleProgress(data): void {
		this.zone.run(() => {
			this.uploadProgress = data.progress.percent;

			if (data.progress.loaded === data.progress.total) {
				this.transferMessage = 'Upload complete. Please wait while the' +
					' server extracts the contents of the zip file (no' +
					' progress indicator is available for this) …';
			}
		});

		if (data.abort) {
			this.errorMessage = 'Upload was aborted.';
		} else if (data.error) {
			this.errorMessage = 'Unknown error during upload.';
		} else if (data.done) {
			this.projectDataService.fetchData();

			let response = JSON.parse(data.response);

			if (response.success === true) {
				this.successMessage = 'The server has finished processing' +
					' the upload. It has been saved under the UUID ' + response.data + '.';
			} else {
				this.errorMessage = response.message;
			}
		}
	}

}
