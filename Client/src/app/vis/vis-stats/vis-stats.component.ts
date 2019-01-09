import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import ParCoords from "parcoord-es";
import { Http } from '@angular/http';
import { Globals } from 'src/app/globals';

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

  constructor(private http: Http) { }

  async ngOnInit() {
    // Todo replace with real data
    setTimeout(() => {
      var chart = ParCoords()("div.stats-main-div")
      chart.data([
        { RAINC: 0, RAINNC: 0, GLW: 273.35892, QFX: 0.00002854525, SNOW: 0 },
        { RAINC: 0, RAINNC: 0, GLW: 273.33548, QFX: 0.000028596769, SNOW: 0 },
        { RAINC: 0, RAINNC: 0, GLW: 273.30606, QFX: 0.000028685186, SNOW: 0 },
        { RAINC: 0, RAINNC: 0, GLW: 273.2762, QFX: 0.00002877807, SNOW: 0 },
        { RAINC: 0, RAINNC: 0, GLW: 273.2467, QFX: 0.000028882061, SNOW: 0 },
      ])
        .margin({
          top: 20,
          left: 20,
          right: 20,
          bottom: 20
        })
        .render()
        .createAxes();
    }, 1000);
  }

}
