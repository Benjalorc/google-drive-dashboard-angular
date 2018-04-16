import { Component, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-filemodal',
  templateUrl: './filemodal.component.html',
  styleUrls: ['./filemodal.component.css']
})
export class FilemodalComponent{

	@Input() listado;
	@Input() titulo;

	closeResult: string;

	constructor(private modalService: NgbModal) {}

	ngOnInit() {
	}

	open(content) {
		this.modalService.open(content, {size: 'lg'}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {

			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});

		console.log(this.listado);
	}

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
