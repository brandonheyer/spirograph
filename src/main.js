import $ from 'jQuery';
import _ from 'lodash';
import queryString from 'query-string';

import {Point} from '2d-engine';

import Engine from './engine/Engine';
import Anchor from './entity/Anchor';
import DrawPoint from './entity/DrawPoint';

var w = $(document).width();
var h = $(document).height();
var controls = $('.sp-inputs');
var controlInputs = {};

var settings = queryString.parse(location.hash.replace('#', ''));

var buttonStop;
var buttonStart;
var buttonClear;
var engine;
var firstAnchor;
var secondAnchor;
var drawPoint;

engine = new Engine(
  '.sp-canvas',
  w, h,
  8000, (8000 * h) / w,
  {
    firstArm: settings.firstArm || 2500,
    secondArm: settings.secondArm || 2500,
    trackFPS: true,
    displayFPS: $('.sp-fps')
  }
);

_.defaults(settings, {
  firstArm: 2500,
  secondArm: 2500,

  x1: 2500,
  y1: (engine.yScale.domain()[1] * .85),
  radius1: 500,
  offset1: 250,
  speed1: 10,

  x2: 5500,
  y2: (engine.yScale.domain()[1] * .85),
  radius2: 500,
  offset2: 250,
  speed2: 10,

  rotationSpeed: 1
});

_.each(settings, function(v, k) {
  var div = $('<div class="control"><label for=' + k + '">' + k + ':</label></div>');

  settings[k] = parseInt(v, 10);

  controlInputs[k] = $('<input type="text" id="' + k + '" value="' + v + '" />').appendTo(div);

  controls.append(div);
});


firstAnchor = new Anchor({
  xScale: engine.xScale,
  yScale: engine.yScale,
  startingPosition: new Point(settings.x1, settings.y1),
  radius: settings.radius1,
  offset: settings.offset1,
  speed: settings.speed1
});
engine.addAnchorEntity(firstAnchor);

secondAnchor = new Anchor({
  xScale: engine.xScale,
  yScale: engine.yScale,
  startingPosition: new Point(settings.x2, settings.y2),
  radius: settings.radius2,
  offset: settings.offset2,
  speed: settings.speed2
});
engine.addAnchorEntity(secondAnchor);

drawPoint = new DrawPoint({
  xScale: engine.xScale,
  yScale: engine.yScale,
  startingPosition: new Point(
    ((settings.x2 - settings.x1) / 2),
    engine.yScale.domain()[1] * .8
  ),
  speed: settings.rotationSpeed
});
engine.addDrawEntity(drawPoint);

location.hash = queryString.stringify(settings);

engine.start();
engine.paused = true;

buttonStop = $('.sp-button-stop').click(() => {
  buttonStart.attr('disabled', false);
  buttonClear.attr('disabled', false);

  buttonStop.attr('disabled', 'disabled');

  engine.paused = engine.stopped = true;
});

buttonStart = $('.sp-button-start').click(() => {
  buttonStop.attr('disabled', false);

  buttonStart.attr('disabled', 'disabled');
  buttonClear.attr('disabled', 'disabled');

  engine.paused = engine.stopped = false;
});

buttonClear = $('.sp-button-clear').click(() => {
  engine.clear();
});

$('.sp-inputs').on('change', () => {
  _.each(settings, function(v, selector) {
    settings[selector] = $('#' + selector).val();
    location.hash = queryString.stringify(settings);
  });

  engine.firstArm = settings.firstArm;
  engine.secondArm = settings.secondArm;

  firstAnchor.pos.x = settings.x1;
  firstAnchor.pos.x = settings.y1;

  secondAnchor.pos.x = settings.x2;
  secondAnchor.pos.y = settings.y2;



  settings.rotationSpeed = drawPoint;
});
