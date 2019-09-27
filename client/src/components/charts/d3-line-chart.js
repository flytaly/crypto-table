import * as d3 from 'd3';
import './chart.less';

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 10, RIGHT: 60 };
const WIDTH = 700;
const INNER_WIDTH = WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 300;
const INNER_HEIGHT = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

export default class LineChart {
    constructor(element, data, xSymbol, ySymbol) {
        this.data = data;
        this.xSymbol = xSymbol;
        this.ySymbol = ySymbol;

        this.svg = d3.select(element)
            .append('svg')
            .attr('width', WIDTH)
            .attr('height', HEIGHT)
            .append('g')
            .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

        this.xLabel = this.svg.append('text')
            .attr('x', INNER_WIDTH / 2)
            .attr('y', INNER_HEIGHT + 30)
            .text(xSymbol);

        this.yLabel = this.svg.append('text')
            .attr('y', -WIDTH + 20)
            .attr('x', INNER_HEIGHT / 2)
            .attr('text-anchor', 'middle')
            .text(`Price (${ySymbol})`)
            .attr('transform', 'rotate(90)');

        this.xAxisGroup = this.svg.append('g')
            .attr('transform', `translate(0, ${INNER_HEIGHT})`);

        this.yAxisGroup = this.svg.append('g')
            .attr('transform', `translate(${INNER_WIDTH}, 0)`);

        this.update();
    }

    update() {
        const { data } = this;
        const xValue = (d) => d.time;
        const yValue = (d) => d[this.ySymbol];

        const yScale = d3.scaleLinear()
            .domain([
                /* d3.min(data, (d) => yValue(d) * 0.80)  */0,
                d3.max(data, (d) => yValue(d) * 1.10),
            ])
            .range([INNER_HEIGHT, 0]);

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, INNER_WIDTH]);

        const xAxisCall = d3.axisBottom(xScale);
        this.xAxisGroup.call(xAxisCall);

        const yAxisCall = d3.axisRight(yScale);
        this.yAxisGroup.call(yAxisCall);

        const lineGenerator = d3.line()
            .x((d) => xScale(xValue(d)))
            .y((d) => yScale(yValue(d)))
            .curve(d3.curveLinear);

        const path = this.svg
            .append('path')
            .attr('class', 'line-path')
            .attr('d', lineGenerator(data));
    }
}
