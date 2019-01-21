import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DatasetInfo, DatasetDetail } from "src/app/DatasetInfo";

@Component({
  selector: "app-vis-control",
  templateUrl: "./vis-control.component.html",
  styleUrls: ["./vis-control.component.scss"]
})
export class VisControlComponent implements OnInit {

  @Input() datasetInfo: DatasetInfo;

  @Input() private _pickedDate: string;
  @Input() set pickedDate(value: string) {
    this._pickedDate = value;
    this.pickedDateChange.emit(value);
  }
  @Output() pickedDateChange = new EventEmitter();
  get pickedDate() {
    return this._pickedDate;
  }

  private _selectedVariable: DatasetDetail;
  @Input() set selectedVariable(value: DatasetDetail) {
    this._selectedVariable = value;
    this.selectedVariableChange.emit(value);
  }
  @Output() selectedVariableChange = new EventEmitter();
  get selectedVariable() {
    return this._selectedVariable;
  }

  private _selectRectForAddingTag: boolean;
  @Input() set selectRectForAddingTag(value: boolean) {
    this._selectRectForAddingTag = value;
    this.selectRectForAddingTagChange.emit(value);
  }
  @Output() selectRectForAddingTagChange = new EventEmitter();
  get selectRectForAddingTag() {
    return this._selectRectForAddingTag;
  }

  private _isShowingBrushedChartData: boolean;
  @Input() set isShowingBrushedChartData(value: boolean) {
    this._isShowingBrushedChartData = value;
    this.isShowingBrushedChartDataChange.emit(value);
    if (this.showPCBrushedRange) {
      this.showPCBrushedRange();
    }
  }
  @Output() isShowingBrushedChartDataChange = new EventEmitter();
  get isShowingBrushedChartData() {
    return this._isShowingBrushedChartData;
  }

  @Input() resetVisImageTransform: () => void;
  @Input() resetPCBrush: () => void;
  @Input() showPCBrushedRange: () => void;

  constructor() { }

  ngOnInit() {
  }

}
