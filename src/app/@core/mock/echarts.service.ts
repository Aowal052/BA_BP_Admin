import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';

@Injectable()
export class EchartsService {
  private pie = {
    grid: {
      containLabel: true,
      bottom: '23',
      top: '60',
      left: '23',
      right: '38',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'auto',
      top: 'center',
      data: ['data1', 'data2', 'data3', 'data4', 'data5'],
    },
    series: [
      {
        name: 'series',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
          },
        },
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 335, name: 'data1' },
          { value: 310, name: 'data2' },
          { value: 234, name: 'data3' },
          { value: 135, name: 'data4' },
          { value: 1548, name: 'data5' },
        ],
      },
    ],
  };

  private historgram = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
    },
    legend: {
      data: ['US', 'Story', 'Task', 'BUG', 'data'],
      top: 10,
      left: 15,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '1%',
      top: '80',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: [
        '2020年02月',
        '2020年03月',
        '2020年04月',
        '2020年05月',
        '2020年06月',
        '2020年07月',
        '2020年08月',
        '2020年09月',
        '2020年10月',
        '2020年11月',
        '2020年12月',
        '2021年01月',
        '2021年02月',
        '2021年03月',
      ],
      axisLabel: { interval: 'auto', fontSize: 16 },
    },
    yAxis: { type: 'value', axisLabel: { fontSize: 16 } },
    series: [
      {
        name: 'US',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [0, 8, 3, 110, 183, 168, 94, 67, 52, 70, 67, 0, 0, 0],
        itemStyle: {
          color: '#1DD1A1',
        },
      },
      {
        name: 'Story',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [0, 0, 0, 0, 0, 0, 0, 14, 58, 55, 69, 77, 60, 59],
        itemStyle: {
          color: '#3F8FEC',
        },
      },
      {
        name: 'Task',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [0, 0, 0, 2, 7, 3, 12, 52, 6, 13, 24, 25, 12, 6],
        itemStyle: {
          color: '#FECA57',
        },
      },
      {
        name: 'BUG',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [7, 31, 41, 40, 44, 82, 64, 63, 33, 39, 36, 27, 9, 9],
        itemStyle: {
          color: '#855CF8',
        },
      },
      {
        name: 'data',
        type: 'bar',
        barMaxWidth: 40,
        label: { show: false, color: '#ffffff' },
        emphasis: { focus: 'series' },
        data: [7, 39, 44, 152, 234, 253, 170, 196, 149, 177, 196, 129, 81, 74],
        itemStyle: {
          color: '#F79044',
        },
      },
    ],
  };

  private lineChart = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['data1', 'data2'],
    },

    calculable: true,

    xAxis: [
      {
        axisLabel: {
          rotate: 30,
          interval: 0,
        },
        axisLine: {
          lineStyle: {
            color: '#CECECE',
          },
        },
        type: 'category',
        boundaryGap: true,
        data: ['category1', 'category2', 'category3', 'category4', 'category5', 'category6', 'category6'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#CECECE',
          },
        },
      },
    ],
    series: [
      {
        name: 'name',
        type: 'line',
        symbol: 'none',
        smooth: 0.2,
        color: ['#1DD1A1'],
        data: [20222, 10222, 152222, 22222, 30222, 44222, 40222],
        areaStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: 'linear',
            global: false,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(29, 209, 161, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(29, 209, 161, 0)',
              },
            ],
          },
        },
      },
      {
        name: 'name',
        type: 'line',
        symbol: 'none',
        smooth: 0.2,
        color: ['#3F8FEC'],
        data: [10001, 20001, 30010, 40100, 50010, 60100, 70010],
        areaStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: 'linear',
            global: false,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(63, 143, 236, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(63, 143, 236, 0)',
              },
            ],
          },
        },
      },
    ],
  };

  private person = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    legend: {
      data: ['data1', 'data2', 'data3'],
    },
    xAxis: [
      {
        type: 'category',
        data: ['category1', 'category2', 'category3', 'category4', 'category5', 'category6', 'category7', 'category8', 'category9', 'category10', 'category11', 'category12'],
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'yAxis',
        min: 0,
        max: 200,
        interval: 50,
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: 'series',
        type: 'bar',
        data: [50, 60, 70, 80, 90, 180, 135, 162, 60, 20, 100, 90],
      },
      {
        name: 'series2',
        type: 'bar',
        data: [10, 10, 20, 15, 30, 50, 60, 10, 30, 5, 10, 20],
      },
      {
        name: 'series3',
        type: 'line',
        data: [60, 70, 80, 90, 100, 190, 150, 180, 80, 80, 150, 120],
      },
    ],
  };

  getPie(): Observable<any> {
    return observableOf(this.pie);
  }

  getHistorgram(): Observable<any> {
    return observableOf(this.historgram);
  }

  getLineChart(): Observable<any> {
    return observableOf(this.lineChart);
  }

  getPerson(): Observable<any> {
    return observableOf(this.person);
  }
}
