import $ from 'jQuery';

import {Point} from '2d-engine';

import Engine from './engine/Engine';
import Anchor from './entity/Anchor';
import DrawPoint from './entity/DrawPoint';

var w = $(document).width();
var h = $(document).height();

var engine = new Engine(
  '.sp-canvas',
  w, h,
  8000, (8000 * h) / w,
  {
    firstArm: 2200,
    secondArm: 2900
  }
);

engine.addAnchorEntity(new Anchor({
  xScale: engine.xScale,
  yScale: engine.yScale,
  startingPosition: new Point(2500, engine.yScale.domain()[1] * .85),
  radius: 800,
  offset: 700,
  speed: 50
}));

engine.addAnchorEntity(new Anchor({
  xScale: engine.xScale,
  yScale: engine.yScale,
  startingPosition: new Point(5500, engine.yScale.domain()[1] * .85),
  radius: 100,
  offset: 80,
  speed: 50
}));

engine.addDrawEntity(new DrawPoint({
  xScale: engine.xScale,
  yScale: engine.yScale,
  startingPosition: new Point(6000, engine.yScale.domain()[1] * .8),
  speed: 1
}));

engine.fps = $('.sp-fps');
engine.start();
