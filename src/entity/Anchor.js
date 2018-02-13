import * as d3 from 'd3';
import _ from 'lodash';
import {BaseEntity, Point, Vector} from '2d-engine';

class Anchor extends BaseEntity {
  constructor(options) {
    super(options);

    this.anchorRadius = 25;

    this.radius = options.radius || 250;
    this.offset = options.offset || 100;
    this.rotationSpeed = options.speed || 20;
    this.rotation = options.rotation || Math.floor(Math.random() * 360);
    this.startingRotation = this.rotation;
    this.dragStop = options.dragStop || function() {};
    this.armLength = options.armLength;

    this.anchorPos = new Point(0, 0);
  }

  update(delta) {
    if (!this.engine.paused) {
      this.rotation = this.rotation + (this.rotationSpeed * (delta / 1000)) % 360;
    }

    this.anchorPos.x = this.pos.x + (this.offset * Math.cos(this.rotation * Math.PI / 180));
    this.anchorPos.y = this.pos.y + (this.offset * Math.sin(this.rotation * Math.PI / 180));

    this.centerElement
      .attr('cx', this.xScale(this.pos.x))
      .attr('cy', this.yScale(this.pos.y));

    this.anchorElement
      .attr('cx', this.xScale(this.anchorPos.x))
      .attr('cy', this.yScale(this.anchorPos.y));
  }

  updateStyles() {
    this.centerElement
      .attr('r', this.xScale(this.radius))
      .attr('fill', '#fafaff');

    this.anchorElement
      .attr('r', this.xScale(this.anchorRadius))
      .attr('fill', '#f0f0ff');

    this.armElement
      .attr('stroke', '#bcbcbc');
  }

  destroy() {
    this.element.remove();
    this.element = undefined;
  }

  render(canvas) {
    if (!this.element) {
      this.element = canvas.append('g');
      this.centerElement = this.element.append('circle');
      this.anchorElement = this.element.append('circle');
      this.armElement = this.element.append('line');

      this.anchorElement.call(
        d3.drag()
          .on('start', _.bind(function() {
            if (this.engine.paused || this.alreadyPaused) {
              this.alreadyPaused = true;
            } else {
              this.alreadyPaused = false;
              this.engine.paused = true;
            }
          }, this))
          .on('drag', _.bind(function() {
            var offset;

            this.anchorPos.x = this.yScale.invert(d3.event.x);
            this.anchorPos.y = this.yScale.invert(d3.event.y);

            this.rotation = 180 * Math.acos((this.anchorPos.x - this.pos.x) / this.offset) / Math.PI;

            offset = this.anchorPos.minus(this.pos).magnitude();

            if (offset > this.radius) {
              offset = this.radius;

              this.anchorPos.x = this.pos.x + (this.offset * Math.cos(this.rotation * Math.PI / 180));
              this.anchorPos.y = this.pos.y + (this.offset * Math.sin(this.rotation * Math.PI / 180));
            }

            this.offset = offset;
          }, this))
          .on('end', _.bind(function() {
            if (!this.engine.stopped && !this.alreadyPaused) {
              this.engine.paused = false;
            }

            this.dragStop();
          }, this))
      );

      this.centerElement.call(
        d3.drag()
          .on('start', _.bind(function() {
            var newX = this.xScale.invert(d3.event.x);
            var newY = this.yScale.invert(d3.event.y);

            if (this.engine.paused || this.alreadyPaused) {
              this.alreadyPaused = true;
            } else {
              this.alreadyPaused = false;
              this.engine.paused = true;
            }

            this.dragXOffset = newX - this.pos.x;
            this.dragYOffset = newY - this.pos.y;
          }, this))
          .on('drag', _.bind(function() {
            var newX = this.xScale.invert(d3.event.x) - this.dragXOffset;
            var newY = this.yScale.invert(d3.event.y) - this.dragYOffset;
            var armMax = this.engine.anchors[0].armLength + this.engine.anchors[1].armLength;
            var armMin = Math.max(this.engine.anchors[0].armLength, this.engine.anchors[1].armLength) - Math.min(this.engine.anchors[0].armLength, this.engine.anchors[1].armLength);
            var tempVector = this.pos.minus(this.otherAnchor.pos);
            var anchorDistance = tempVector.magnitude();

            armMax -= this.offset this.engine.anchors[0].offset + this.engine.anchors[1].offset;
            // armMin -= this.engine.anchors[0].offset + this.engine.anchors[1].offset;

            if (anchorDistance <= armMax && anchorDistance >= armMin) {
              this.pos.x = newX;
              this.pos.y = newY;
            } else {
              var pullDistance = tempVector.times((anchorDistance - armMax) / anchorDistance);
              this.pos.x -= pullDistance.x;
              this.pos.y -= pullDistance.y;

              this.anchorPos.x = this.pos.x + (this.offset * Math.cos(this.rotation * Math.PI / 180));
              this.anchorPos.y = this.pos.y + (this.offset * Math.sin(this.rotation * Math.PI / 180));

              this.centerElement
                .attr('cx', this.xScale(this.pos.x))
                .attr('cy', this.yScale(this.pos.y));

              this.anchorElement
                .attr('cx', this.xScale(this.anchorPos.x))
                .attr('cy', this.yScale(this.anchorPos.y));

              d3.event.sourceEvent.preventDefault();
              d3.event.sourceEvent.stopPropagation();
            }
          }, this))
          .on('end', _.bind(function() {
            if (!this.engine.stopped && !this.alreadyPaused) {
              this.engine.paused = false;
            }

            this.dragStop();
          }, this))
      );

      this.updateStyles();
    }
  }
}

export default Anchor;
