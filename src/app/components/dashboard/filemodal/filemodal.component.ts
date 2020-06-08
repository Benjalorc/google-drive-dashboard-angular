import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filemodal',
  templateUrl: './filemodal.component.html',
  styleUrls: ['./filemodal.component.css']
})
export class FilemodalComponent{

	@Input() listado;
	@Input() titulo;

	constructor(public modalService: NgbModal) {}

	ngOnInit() {
	}

	open(content) {
		this.modalService.open(content, {size: 'lg'});
	}
}