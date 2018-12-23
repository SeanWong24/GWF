import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Tag } from "../Tag";
import * as d3 from "d3";
import { Globals } from "src/app/globals";

@Component({
  selector: "app-vis-main",
  templateUrl: "./vis-main.component.html",
  styleUrls: ["./vis-main.component.scss"]
})
export class VisMainComponent implements OnInit {

  private _userTagList: Tag[];
  @Input() set userTagList(value: Tag[]) {
    this._userTagList = value;
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

  private _selectedVariableName: string;
  @Input() set selectedVariableName(value: string) {
    this._selectedVariableName = value;
    this.updateSvgImage();
  }
  get selectedVariableName() {
    return this._selectedVariableName;
  }

  @Input() resetVisImageTransform: () => void;
  @Output() resetVisImageTransformChange = new EventEmitter();


  private get mainSvg() {
    return d3.select("app-vis-main svg.main-svg");
  }

  private readonly zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", () => {
    const t = d3.event.transform;
    this.mainSvg.selectAll("g").attr("transform", t);
    this.mainSvg.selectAll("g.user-tags circle")
      .attr("r", 3 / t.k);
  });

  constructor() { }

  ngOnInit() {
    this.resetVisImageTransformChange.emit(
      () => this.zoom.transform(this.mainSvg as any, d3.zoomIdentity)
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
    img
      .on("contextmenu.preventDefault", () => d3.event.preventDefault());
    // .on("mousedown.selectRect", () => this.selectRectMouseDownHandler(img))
    // .on("mousemove.selectRect", () => this.selectRectMouseMoveHandler(img))
    // .on("mouseup.selectRect", () => this.selectRectMouseUpHandler());
    this.generateSvgZoom();
  }

  private generateSvgZoom() {
    this.mainSvg
      .call(this.zoom);
  }

  private updateSvgImage() {
    if (this.pickedDate && this.selectedVariableName && !this.mainSvg.select("g.image-holder image").empty()) {
    // if (true) {
      const dateSplit = this.pickedDate.split("-");
      this.mainSvg.select("g.image-holder image")
        .attr(
          "xlink:href",
          Globals.config.visImageBasePath + "/" +
          dateSplit[0] + "/" + dateSplit[1] + "/" + dateSplit[2] + "/" +
          this.selectedVariableName + ".png"
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
        (!tag.variable || tag.variable == this.selectedVariableName)
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
              // .on("click", this.userTagClickedHandler(tag))
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
              // .on("click", this.userTagClickedHandler(tag))
              .append("title")
              .text(tag.name);
        }
      }
    }
  }

}
