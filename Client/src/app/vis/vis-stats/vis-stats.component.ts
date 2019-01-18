import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import ParCoords from "parcoord-es";
import { Http } from '@angular/http';
import { Globals } from 'src/app/globals';
import * as d3 from 'd3';
import { rgb } from 'd3';

@Component({
  selector: 'app-vis-stats',
  templateUrl: './vis-stats.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './vis-stats.component.scss',
    '../../../../node_modules/parcoord-es/dist/parcoords.css'
  ]
})
export class VisStatsComponent implements OnInit {

  private _pickedDate: string;
  @Input() private set pickedDate(value: string) {
    this._pickedDate = value;
    this.updateChart(value);
  }
  private get pickedDate() {
    return this._pickedDate;
  }

  private _selectedVariableName: string;
  @Input() private set selectedVariableName(value: string) {
    this._selectedVariableName = value;
    this.updateChart(this._pickedDate);
  }
  private get selectedVariableName() {
    return this._selectedVariableName;
  }

  private chart: any;
  private chartData: any[];

  @Input() resetPCBrush: () => void;
  @Output() resetPCBrushChange = new EventEmitter();

  @Input() updateChart: (date: string, xMin?: number, yMin?: number, xMax?: number, yMax?: number) => void;
  @Output() updateChartChange = new EventEmitter();

  @Input() brushedChartData: any;
  @Output() brushedChartDataChange = new EventEmitter();

  @Input() showPCBrushedRange: () => void;

  constructor(private http: Http) { }

  ngOnInit() {
    this.updateChartChange.emit(async (date: string, xMin = 0, yMin = 0, xMax = 698, yMax = 638) => {
      this.chartData = await this.obtainChartData(date, xMin, yMin, xMax, yMax);
      this.generateChart();
    });
  }

  private generateChart() {
    var keys = Object.keys(this.chartData[0]);
    keys.splice(keys.indexOf("latitude"), 1);
    keys.splice(keys.indexOf("longitude"), 1);
    keys.splice(keys.indexOf("time"), 1);

    var dimensions = {};
    for (const key of keys) {
      dimensions[key] = { "type": "number" }
    }

    d3.selectAll("div.stats-main-div").selectAll("*").remove();

    this.chart = ParCoords()("div.stats-main-div")
      .data(this.chartData)
      .dimensions(dimensions)
      .margin({
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      })
      .mode("queue")
      .render()
      .createAxes()
      .reorderable()
      .brushMode("1D-axes")
      .color(d => d3.scaleLinear().domain([0, 1]).range(["blue", "red"] as any)(d[this.selectedVariableName]))
      .alpha(.3)
      .on("brush", d => {
        this.brushedChartDataChange.emit(d);
        if (this.showPCBrushedRange) {
          this.showPCBrushedRange();
        }
      });

    this.resetPCBrushChange.emit(
      () => this.chart.brushReset()
    );
  }


  private async obtainChartData(date: string, xMin: number, yMin: number, xMax: number, yMax: number) {
    var params = "?date=" + date +
      "&xMin=" + xMin +
      "&yMin=" + yMin +
      "&xMax=" + xMax +
      "&yMax=" + yMax;
    const response = await this.http.get(Globals.config.serverEndPoint + "/dataset/detail" + params).toPromise();
    return response.json();
  }
}
