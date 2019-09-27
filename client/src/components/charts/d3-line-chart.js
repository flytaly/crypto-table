import * as d3 from 'd3';
import { interpolatePath } from 'd3-interpolate-path';
import './d3-line-chart.less';

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 10, RIGHT: 60 };
const WIDTH = 700;
const INNER_WIDTH = WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 300;
const INNER_HEIGHT = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

export default class LineChart {
    constructor(element, data, xSymbol, ySymbol, loading) {
        this.data = data;
        this.xSymbol = xSymbol;
        this.ySymbol = ySymbol;
        this.tranDuration = 250;

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

        this.loading = this.svg.append('text')
            .attr('x', INNER_WIDTH / 2)
            .attr('y', INNER_HEIGHT / 2);

        this.update(null, loading);
    }

    update(newValues, loading) {
        if (loading) {
            this.loading.text('Loading...');
            return;
        }
        this.loading.text('');

        const prevData = this.data;

        if (newValues) {
            this.data = newValues.data || this.data;
            this.xSymbol = newValues.xSymbol || this.xSymbol;
            this.ySymbol = newValues.ySymbol || this.ySymbol;
        }

        const { data } = this;
        if (!data || !data.length) return;

        const xValue = (d) => d.time;
        const yValue = (d) => d[this.ySymbol];

        const yScale = d3.scaleLinear()
            .domain([
                d3.min(data, (d) => yValue(d) * 0.95),
                d3.max(data, (d) => yValue(d) * 1.05),
            ])
            .range([INNER_HEIGHT, 0]);

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, xValue))
            .range([0, INNER_WIDTH]);

        const xAxisCall = d3.axisBottom(xScale);
        this.xAxisGroup.transition().duration(this.tranDuration).call(xAxisCall);

        const yAxisCall = d3.axisRight(yScale);
        this.yAxisGroup.transition().duration(this.tranDuration).call(yAxisCall);

        const lineGenerator = d3.line()
            .x((d) => xScale(xValue(d)))
            .y((d) => yScale(yValue(d)))
            .curve(d3.curveLinear);

        const path = this.svg.selectAll('.line-path').data([data]);

        path
            .attr('d', lineGenerator)
            .attr('class', 'line-path')
            .transition()
            .duration(this.tranDuration)
            .attrTween('d', (d) => {
                const prev = lineGenerator(prevData);
                const next = lineGenerator(d);
                return interpolatePath(prev, next);
            });

        path.exit().remove();

        const pathEnter = path.enter()
            .append('svg:path')
            .attr('d', lineGenerator)
            .attr('class', 'line-path');

        // Animation on enter
        if (pathEnter.node()) {
            const totalLength = pathEnter.node().getTotalLength();
            pathEnter
                .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                .attr('stroke-dashoffset', -totalLength)
                .transition()
                .duration(this.tranDuration)
                .ease(d3.easeLinear)
                .attr('stroke-dashoffset', 0);
        }
    }
}
