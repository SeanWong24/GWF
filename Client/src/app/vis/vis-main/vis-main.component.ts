import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Tag } from "../Tag";
import * as d3 from "d3";
import { Globals } from "src/app/globals";
import { AlertController, ModalController } from "@ionic/angular";
import { AddTagModalPage } from "./add-tag-modal/add-tag-modal.page";
import { DatasetDetail } from "src/app/DatasetInfo";

@Component({
  selector: "app-vis-main",
  templateUrl: "./vis-main.component.html",
  styleUrls: ["./vis-main.component.scss"]
})
export class VisMainComponent implements OnInit {

  private _userTagList: Tag[];
  @Input() set userTagList(value: Tag[]) {
    var previousValue = this._userTagList;
    this._userTagList = value;
    this.drawUserTags();
  }
  get userTagList() {
    return this._userTagList;
  }

  private _pickedDate: string;
  @Input() set pickedDate(value: string) {
    this._pickedDate = value;
    this.updateSvgImage();
  }
  get pickedDate() {
    return this._pickedDate;
  }

  private _selectedVariable: DatasetDetail;
  @Input() set selectedVariable(value: DatasetDetail) {
    this._selectedVariable = value;
    this.updateSvgImage();
  }
  get selectedVariable() {
    return this._selectedVariable;
  }

  @Input() private selectRectForAddingTag: boolean;
  @Input() private brushedChartData: any;
  @Input() isShowingBrushedChartData: boolean;

  @Input() obtainUserTags: () => void;
  @Input() updateChart: (date: string, xMin?: number, yMin?: number, xMax?: number, yMax?: number) => void;

  @Input() resetVisImageTransform: () => void;
  @Output() resetVisImageTransformChange = new EventEmitter();


  @Input() showPCBrushedRange: () => void;
  @Output() showPCBrushedRangeChange = new EventEmitter();

  //#region For mouse rect area selection

  mouseSelection: [number, number, number, number] = [null, null, null, null];
  mouserRightButtonDown = false;

  get mouseSelectionRect() {
    var temp: [number, number, number, number]
    if (this.mouseSelection[2] && this.mouseSelection[3]) {
      temp = [0, 0, 0, 0];
      temp[0] = Math.min(this.mouseSelection[0], this.mouseSelection[2]);
      temp[1] = Math.min(this.mouseSelection[1], this.mouseSelection[3]);
      temp[2] = Math.max(this.mouseSelection[0], this.mouseSelection[2]);
      temp[3] = Math.max(this.mouseSelection[1], this.mouseSelection[3]);
    }
    else {
      temp = this.mouseSelection;
    }
    return temp;
  }

  //#endregion


  private get mainSvg() {
    return d3.select("app-vis-main svg.main-svg");
  }

  private readonly zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", () => {
    const t = d3.event.transform;
    this.mainSvg.selectAll("g").attr("transform", t);
    this.mainSvg.selectAll("g.user-tags circle")
      .attr("r", 3 / t.k);
  });

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.resetVisImageTransformChange.emit(
      () => this.zoom.transform(this.mainSvg as any, d3.zoomIdentity)
    );
    this.showPCBrushedRangeChange.emit(
      () => {
        this.mainSvg.selectAll(".brushed-chart-data-vis").remove();
        if (this.isShowingBrushedChartData) {
          const g = this.mainSvg.append("g")
            .classed("brushed-chart-data-vis", true);
          g.selectAll("rect")
            .data(this.brushedChartData)
            .enter()
            .append("rect")
            .attr("x", (d: any) => +d.latitude / 699 * 640 - 640 / 70 / 2)
            .attr("y", (d: any) => +d.longitude / 639 * 480 - 480 / 64 / 2)
            .attr("width", (d: any) => 640 / 70)
            .attr("height", (d: any) => 480 / 64)
            .attr("fill", "white")
            .attr("opacity", .3);
        }
      }
    );

    this.generateVisulization();
    this.updateSvgImage();
  }

  private generateVisulization() {
    const g = this.mainSvg.append("g")
      .classed("image-holder", true);
    const img = g.append("image")
      .attr("width", "100%")
      .attr("height", "100%");
    this.mainSvg
      .on("contextmenu.preventDefault", () => d3.event.preventDefault())
      .on("mousedown.selectRect", () => this.selectRectMouseDownHandler(img))
      .on("mousemove.selectRect", () => this.selectRectMouseMoveHandler(img))
      .on("mouseup.selectRect", () => this.selectRectMouseUpHandler());
    this.generateSvgZoom();
  }

  private removeUserDrawingRect() {
    this.mainSvg.selectAll("g.draw-rect").remove();
  }

  private selectRectMouseDownHandler(img: d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
    if (d3.event.button == 2) {
      this.mouseSelection = [null, null, null, null];
      var position = d3.mouse(img.node() as any);
      this.mouseSelection[0] = position[0];
      this.mouseSelection[1] = position[1];

      this.removeUserDrawingRect();
      var g = this.mainSvg.append("g")
        .classed("draw-rect", true)
        .attr("transform", this.mainSvg.select("g.image-holder").attr("transform"));
      g.append("rect")
        .attr("fill", "red")
        .attr("opacity", .3)

      this.mouserRightButtonDown = true;
    }
  }

  private selectRectMouseMoveHandler(img: d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
    if (this.mouserRightButtonDown) {
      var position = d3.mouse(img.node() as any);

      this.mouseSelection[2] = position[0];
      this.mouseSelection[3] = position[1];

      this.mainSvg.select("g.draw-rect rect")
        .attr("x", this.mouseSelectionRect[0])
        .attr("y", this.mouseSelectionRect[1])
        .attr("width", this.mouseSelectionRect[2] - this.mouseSelectionRect[0])
        .attr("height", this.mouseSelectionRect[3] - this.mouseSelectionRect[1]);
    }
  }

  private selectRectMouseUpHandler() {
    if (d3.event.button == 2) {
      switch (this.selectRectForAddingTag) {
        case true:
          this.addUserTag(this.mouseSelectionRect);
          this.mouserRightButtonDown = false;
          this.removeUserDrawingRect();
          break;
        default:
          this.mouserRightButtonDown = false;
          if (!this.mouseSelectionRect[2] && !this.mouseSelectionRect[3]) {
            this.updateChart(this.pickedDate);
          }
          else {
            var xMin = this.mouseSelectionRect[0] / 700 * 699;
            var yMin = this.mouseSelectionRect[1] / 640 * 639;
            var xMax = this.mouseSelectionRect[2] / 700 * 699;
            var yMax = this.mouseSelectionRect[2] / 640 * 639;
            this.updateChart(this.pickedDate, xMin, yMin, xMax, yMax);
          }
          break;
      }
    }
  }

  private async addUserTag(rect: [number, number, number, number]) {
    var position;
    var tagType: string;
    if (!rect[2] && !rect[3]) {
      tagType = "dot";
      position = "(" + rect[0] + "," + rect[1] + ")";
    }
    else {
      tagType = "rect";
      position = "(" + rect[0] + "," + rect[1] + "," + rect[2] + "," + rect[3] + ")";
    }

    const modal = await this.modalCtrl.create({
      component: AddTagModalPage,
      componentProps: {
        "pickedDate": this.pickedDate,
        "selectedVariableName": this.selectedVariable.name,
        "currentTag": new Tag("", tagType, "#111111", position, ""),
        "isModifying": false
      }
    });
    modal.onDidDismiss().then(this.obtainUserTags);
    modal.present();
  }

  private generateSvgZoom() {
    this.mainSvg
      .call(this.zoom);
  }

  private updateSvgImage() {
    if (this.pickedDate && this.selectedVariable && !this.mainSvg.select("g.image-holder image").empty()) {
      // if (true) {
      const dateSplit = this.pickedDate.split("-");
      this.mainSvg.select("g.image-holder image")
        .attr(
          "xlink:href",
          Globals.config.visImageBasePath + "/" +
          dateSplit[0] + "/" + dateSplit[1] + "/" + dateSplit[2] + "/" +
          this.selectedVariable.name + ".png"
        );

      this.drawUserTags();
    }
  }

  private drawUserTags() {
    const g = this.mainSvg.selectAll("g.user-tags");
    if (!g.empty()) {
      var gTransform = g.attr("transform");
      g.remove();
    }
    const userTagsG = this.mainSvg.append("g")
      .classed("user-tags", true)
      .attr("transform", gTransform);
    for (const tag of this.userTagList) {
      if (
        (!tag.date || tag.date.substring(0, 10) == this.pickedDate) &&
        (!tag.variable || tag.variable == this.selectedVariable.name)
      ) {
        let position: string[] = [];
        switch (tag.type) {
          case "dot":
            position = tag.position.replace("(", "").replace(")", "").split(",");
            userTagsG
              .append("circle")
              .attr("cx", position[0])
              .attr("cy", position[1])
              .attr("r", 3)
              .attr("opacity", .5)
              .attr("fill", tag.color)
              .on("click", this.userTagClickedHandler(tag))
              .append("title")
              .text(tag.name);
            break;
          case "rect":
            position = tag.position.replace("(", "").replace(")", "").split(",");
            userTagsG
              .append("rect")
              .attr("x", position[0])
              .attr("y", position[1])
              .attr("width", +position[2] - +position[0])
              .attr("height", +position[3] - +position[1])
              .attr("opacity", .5)
              .attr("fill", tag.color)
              .on("click", this.userTagClickedHandler(tag))
              .append("title")
              .text(tag.name);
        }
      }
    }
  }

  userTagClickedHandler(tag: Tag) {
    return async () => {
      const modal = await this.modalCtrl.create({
        component: AddTagModalPage,
        componentProps: {
          "pickedDate": this.pickedDate,
          "selectedVariableName": this.selectedVariable.name,
          "currentTag": Tag.Clone(tag),
          "isModifying": true
        }
      });
      modal.onDidDismiss().then(this.obtainUserTags);
      modal.present();
    }
  }
}
