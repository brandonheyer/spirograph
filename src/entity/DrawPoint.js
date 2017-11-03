import {BaseEntity, Point, Vector} from '2d-engine';

class DrawPoint extends BaseEntity {
  constructor(options) {
    super(options);

    this.radius = 5;
    this.pathString = '';
    this.center = new Point(this.xScale.domain()[1] / 2, this.yScale.domain()[1] / 2);

    this.rotation = 0;
    this.speed = options.speed || 5;
    this.splitTime = this.startSplitTime = 10000;
  }

  nextUpdate(delta) {
    var nextX;
    var nextY;
    var cosR;
    var sinR;
    var rx;
    var ry;

    if (!this.engine.paused) {
      this.splitTime -= delta;

      if (this.splitTime < 0) {
        this.pathElement = this.pathGroup.append('polyline');

        this.pathElement
          .attr('fill', 'none')
          .attr('stroke', '#b2b2ff');

        this.pathString = this.lastPath + ' ';
        this.splitTime = this.startSplitTime;
      }

      this.pointElement
        .attr('cx', this.xScale(this.pos.x))
        .attr('cy', this.yScale(this.pos.y));

      this.rotation = this.rotation + (this.speed * delta / 1000) % 360;

      cosR = Math.cos(this.rotation * Math.PI / 180);
      sinR = Math.sin(this.rotation * Math.PI / 180);

      nextX = this.pos.x - (this.center.x);
      nextY = this.pos.y - (this.center.y);

      rx = (nextX * cosR) - (nextY * sinR);
      ry = (nextX * sinR) + (nextY * cosR);
      this.lastPath = this.xScale(rx + this.center.x) + ',' + this.yScale(ry + this.center.y);
      this.pathString += this.lastPath + ' ';

      this.pathElement
        .attr('points', this.pathString)

      this.pathGroup
        .attr(
          'transform',
          'translate(' + this.xScale(this.center.x) + ', ' + this.yScale(this.center.y) + ')' +
          'rotate(' + (-1 * this.rotation) + ')'  +
          'translate(' + (-1 * this.xScale(this.center.x)) + ', ' + (-1 * this.yScale(this.center.y)) + ')'
        );
    }
  }

  update(delta) {
    this.update = this.nextUpdate;
  }

  updateStyles() {
    this.pointElement
      .attr('r', this.xScale(this.radius))
      .attr('fill', '#dd0d0d');

    this.pathElement
      .attr('fill', 'none')
      .attr('stroke', '#b2b2ff');
  }

  destroy() {
    this.element.remove();
    this.element = undefined;
  }

  render(canvas) {
    if (!this.element) {
      this.element = canvas.append('g');

      this.pathGroup = this.element.append('g');
      this.pathElement = this.pathGroup.append('polyline');

      this.pointElement = this.element.append('circle');

      this.updateStyles();
    }
  }
}

export default DrawPoint;
