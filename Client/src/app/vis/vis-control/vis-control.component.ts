import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-vis-control",
  templateUrl: "./vis-control.component.html",
  styleUrls: ["./vis-control.component.scss"]
})
export class VisControlComponent implements OnInit {

  @Input() appConfig: any;

  @Input() private _pickedDate: string;
  @Input() set pickedDate(value: string) {
    this._pickedDate = value;
    this.pickedDateChange.emit(value);
  }
  @Output() pickedDateChange = new EventEmitter();
  get pickedDate() {
    return this._pickedDate;
  }

  private _selectedVariableName: string;
  @Input() set selectedVariableName(value: string) {
    this._selectedVariableName = value;
    this.selectedVariableNameChange.emit(value);
  }
  @Output() selectedVariableNameChange = new EventEmitter();
  get selectedVariableName() {
    return this._selectedVariableName;
  }

  @Input() resetVisImageTransform: () => void;

  constructor() { }

  ngOnInit() {
  }

}