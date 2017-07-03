import {Component, NgZone} from "@angular/core";
import {ProjectDataService} from "../../project-data.service";
import {NgUploaderOptions} from "ngx-uploader";
import {getErrorMessage} from "../../core/get-error-message.function";
import {ManagerAPIService} from "../../manager-api.service";

@Component({
	selector: 'emudbmanager-upload-form',
	templateUrl: './upload-form.component.html',
	styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent {
	public errorMessage:string = '';
	public options:NgUploaderOptions = new NgUploaderOptions({
		data: {},
		url: ''
	});
	public successMessage: string = '';
	public transferMessage:string = '';
	public uploadProgress: number;

	constructor(private managerAPIService: ManagerAPIService,
				private projectDataService: ProjectDataService,
				private zone: NgZone) {
		this.uploadProgress = 0;

		let uploadTarget = this.managerAPIService.getUploadTarget();
		this.options.url = uploadTarget.url;
		this.options.data = uploadTarget.params;
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
			this.projectDataService.refresh();

			let response = JSON.parse(data.response);

			if (response.success === true) {
				this.successMessage = 'The server has finished processing' +
					' the upload. It has been saved under the UUID ' + response.data + '.';
			} else {
				this.errorMessage = getErrorMessage(response.error);
			}
		}
	}

}
