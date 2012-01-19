(function() {
  var ball, bucket, bucketBottom, cannon, cannonControl, title;
  var _this = this, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  level.name = 'simple_bucket';

  Peanutty.createEnvironment();

  peanutty.setScale(25 * (peanutty.canvas.width() / 835));

  peanutty.createGround({
    x: 400,
    y: 400,
    width: 100,
    height: 10
  });

  ball = peanutty.createBall({
    x: 400,
    y: 440,
    radius: 20,
    drawData: {
      color: new b2d.Common.b2Color(0, 0, 0.8),
      alpha: 0.8
    }
  });

  bucket = peanutty.createPoly({
    fixtureDefs: [
      peanutty.polyFixtureDef({
        path: [
          {
            x: 600,
            y: 280
          }, {
            x: 610,
            y: 280
          }, {
            x: 610,
            y: 180
          }, {
            x: 600,
            y: 180
          }
        ]
      }), peanutty.polyFixtureDef({
        path: [
          {
            x: 610,
            y: 190
          }, {
            x: 700,
            y: 190
          }, {
            x: 700,
            y: 180
          }, {
            x: 610,
            y: 180
          }
        ],
        userData: {
          bottom: true
        }
      }), peanutty.polyFixtureDef({
        path: [
          {
            x: 700,
            y: 280
          }, {
            x: 710,
            y: 280
          }, {
            x: 710,
            y: 180
          }, {
            x: 700,
            y: 180
          }
        ]
      })
    ],
    static: true
  });

  bucketBottom = peanutty.searchObjectList({
    object: bucket.GetFixtureList(),
    searchFunction: function(fixture) {
      return (fixture.GetUserData() != null) && fixture.GetUserData().bottom;
    },
    limit: 1
  })[0];

  peanutty.addContactListener({
    listener: function(contact) {
      var fixtures, success, _ref;
      if (level.elements.success != null) return;
      fixtures = [contact.GetFixtureA(), contact.GetFixtureB()];
      if ((_ref = ball.GetFixtureList(), __indexOf.call(fixtures, _ref) >= 0) && __indexOf.call(fixtures, bucketBottom) >= 0) {
        success = level.elements.success = $(document.createElement("DIV"));
        success.css({
          textAlign: 'center',
          position: 'absolute',
          top: '180px',
          left: "" + (peanutty.canvas.width() * 6 / 11)
        });
        success.html("<h4>Success! Nice Job!</h4>\n<p>\n    Got a creative solution? \n    Let me know: \n    <a href='http://twitter.com/jaredcosulich' target='_blank'>@jaredcosulich</a>\n</p>\n <p>On to the <a href='#level/a_little_code'>next level ></a>...</p>\n<p>\n    ... or <a href='#create'>create your own level!<a> \n</p>");
        return level.canvasContainer.append(success);
      }
    }
  });

  title = level.elements.title = $(document.createElement("DIV"));

  title.css({
    width: '500px',
    textAlign: 'center',
    fontSize: '20pt',
    position: 'absolute',
    top: '20px',
    left: "" + ((peanutty.canvas.width() / 2) - 250) + "px"
  });

  title.html("Get the Blue Ball in to the Bucket");

  level.canvasContainer.append(title);

  peanutty.createGround({
    x: 60,
    y: 20,
    width: 100,
    height: 10
  });

  peanutty.createBall({
    x: 80,
    y: 40,
    radius: 15,
    static: true
  });

  cannon = peanutty.createBox({
    x: 70,
    y: 80,
    width: 60,
    height: 20,
    static: true
  });

  cannon.SetPositionAndAngle(cannon.GetPosition(), Math.PI * 3 / 4);

  cannonControl = level.elements.cannonControl = $(document.createElement("DIV"));

  cannonControl.css({
    fontSize: '12pt',
    position: 'absolute',
    top: '60px',
    left: "20px"
  });

  cannonControl.html("<h5>Cannon Controls</h5>\n<p>Angle: <input id='cannon_angle' type='text' style='width: 2em' value=45 />&deg;</p>\n<p>Force: <input id='cannon_force' type='text' style='width: 2em' value=10 /></p>\n<a id='fire_cannon' class=\"btn error\">\n    Fire Cannon!\n</a>\n<a id='try_again' class=\"btn primary\" style='display: none;'>\n    Try Again\n</a>    ");

  level.canvasContainer.append(cannonControl);

  level.fireCannon = function(_arg) {
    var angle, cannonball, force, x, y;
    angle = _arg.angle, force = _arg.force;
    cannonball = peanutty.createBall({
      x: 125,
      y: 133,
      radius: 10,
      density: 50,
      drawData: {
        color: new b2d.Common.b2Color(0.1, 0.1, 0.1),
        alpha: 0.8
      }
    });
    x = Math.cos(Math.PI / (180 / angle)) * force;
    y = -1 * Math.sin(Math.PI / (180 / angle)) * force;
    return cannonball.SetLinearVelocity(new b2d.Common.Math.b2Vec2(x, y));
  };

  level.find('#fire_cannon').bind('click', function() {
    peanutty.addToScript({
      command: "level.fireCannon\n    angle: " + (level.find('#cannon_angle').val()) + "\n    force: " + (level.find('#cannon_force').val()),
      time: 0
    });
    level.find('#fire_cannon').hide();
    return level.find('#try_again').show();
  });

  level.find('#try_again').bind('click', function() {
    var angleVal, forceVal;
    angleVal = level.find('#cannon_angle').val();
    forceVal = level.find('#cannon_force').val();
    level.reset();
    level.find('#cannon_angle').val(angleVal);
    level.find('#cannon_force').val(forceVal);
    level.find('#try_again').hide();
    return level.find('#fire_cannon').show();
  });

  peanutty.sign('@jaredcosulich', 'jaredcosulich');

}).call(this);
