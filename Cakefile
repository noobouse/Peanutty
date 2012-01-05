fs = require('fs')
{spawn, exec} = require('child_process')

task 'build:index', 'Build the static index page', ->
    client = './src/client'
    
    wings = require("#{client}/js/lib/node_modules/wings/lib/wings.js")
    
    templates = ({
            src: "templates/#{name}",
            text: fs.readFileSync("#{client}/templates/#{name}")
        } for name in fs.readdirSync("#{client}/templates") when name != 'base.html' and (/\.html$/.test(name) or /\.coffee$/.test(name))) 

    overwriteFonts =
        """
        @font-face {
          font-family: 'Mingl Icons';
          src: url('src/client/css/fonts/icons-webfont.eot');
          src: url('src/client/css/fonts/icons-webfont.eot?#iefix') format('embedded-opentype'), url('src/client/css/fonts/icons-webfont.woff') format('woff'), url('src/client/css/fonts/icons-webfont.ttf') format('truetype'), url('src/client/css/fonts/icons-webfont.svg#MinglIcons') format('svg');
          font-weight: normal;
          font-style: normal;
        }
        /* Museo: A font by Jos Buivenga (exljbris) -> www.exljbris.com */@font-face {
          font-family: 'Museo';
          src: url('src/client/css/fonts/museo500-regular-webfont.eot');
          src: url('src/client/css/fonts/museo500-regular-webfont.eot?#iefix') format('embedded-opentype'), url('src/client/css/fonts/museo500-regular-webfont.woff') format('woff'), url('src/client/css/fonts/museo500-regular-webfont.ttf') format('truetype'), url('src/client/css/fonts/museo500-regular-webfont.svg#webfontnuwysBIH') format('svg');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Museo';
          src: url('src/client/css/fonts/museo300-regular-webfont.eot');
          src: url('src/client/css/fonts/museo300-regular-webfont.eot?#iefix') format('embedded-opentype'), url('src/client/css/fonts/museo300-regular-webfont.woff') format('woff'), url('src/client/css/fonts/museo300-regular-webfont.ttf') format('truetype'), url('src/client/css/fonts/museo300-regular-webfont.svg#webfontMmwAEq4Z') format('svg');
          font-weight: lighter;
          font-style: normal;
        }
        @font-face {
          font-family: 'Museo';
          src: url('src/client/css/fonts/museo700-regular-webfont.eot');
          src: url('src/client/css/fonts/museo700-regular-webfont.eot?#iefix') format('embedded-opentype'), url('src/client/css/fonts/museo700-regular-webfont.woff') format('woff'), url('src/client/css/fonts/museo700-regular-webfont.ttf') format('truetype'), url('src/client/css/fonts/museo700-regular-webfont.svg#webfonthvYIakly') format('svg');
          font-weight: bold;
          font-style: normal;
        }
        @font-face {
          font-family: 'Museo Sans';
          src: url('src/client/css/fonts/museosans500-webfont.eot');
          src: url('src/client/css/fonts/museosans500-webfont.eot?#iefix') format('embedded-opentype'), url('src/client/css/fonts/museosans500-webfont.woff') format('woff'), url('src/client/css/fonts/museosans500-webfont.ttf') format('truetype'), url('src/client/css/fonts/museosans500-webfont.svg#webfont1H1968T3') format('svg');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Museo Sans';
          src: url('src/client/css/fonts/museosans500_italic-webfont.eot');
          src: url('src/client/css/fonts/museosans500-italic-webfont.eot?#iefix') format('embedded-opentype'), url('src/client/css/fonts/museosans500_italic-webfont.woff') format('woff'), url('src/client/css/fonts/museosans500_italic-webfont.ttf') format('truetype'), url('src/client/css/fonts/museosans500_italic-webfont.svg#webfontq2OnKNVm') format('svg');
          font-weight: normal;
          font-style: italic;
        }
        """

    base = wings.renderTemplate(fs.readFileSync("index_template.html", 'utf-8'), {
        templates: templates
        overwriteFonts: overwriteFonts
    })
    
    fs.writeFileSync("index.html", base)
    

task 'build:client', 'Build the development environment', ->
    source = './src/client'
    target = './build/client'
    fs.mkdir target, 0755, (err) ->
        buildClientJS source, target, () ->
            buildClientCSS source, target, () ->
                buildClientHTML source, target, () ->
                    console.log('Success')


task 'build:ender', 'Build the ender compiled library', ->
    lib = 'src/client/js/lib'

    cmds = [
        "cd #{lib}",
        
        'rm -rf node_modules',
        
        'npm install --dev',
        'npm install https://github.com/amccollum/bonzo/tarball/master'
    
        ['node_modules/.bin/ender', 'build',
         'es5-basic', 'domready', 'sel', 'bonzo', 'bean',
         'morpheus', 'reqwest', 'hashchange', 'route', '~/Src/coffee-box2d',
         'timeout', 'upload', 'wings', 'jar', 'ender-json'].join(' '),
         
         'cd -',
    ]

    console.log(cmds.join(' && '))
    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'build:client-test', 'Build the test environment', ->
    source = 'src/client-test'
    target = 'build/client-test'
    client = 'src/client'
    
    cmds = [
        "mkdir -p #{target}"
        "cake build:client",
        "ln -sf ../client #{target}",
        "ln -sf ../../#{source}/css #{target}",
        "ln -sf ../../#{source}/extra #{target}",
        "ln -sf ../../#{source}/package.json #{target}",
        "coffee --compile --output #{target}/views-tests #{source}/views-tests/*.coffee",

        "cd #{target}",
        '(test -e node_modules || npm install .)',
        'cd -',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err

        buildClientTestHarness(source, target, client)
    

task 'build:server-test', 'Build the server tests', ->
    source = 'src/server-test'
    target = 'build/server-test'
    
    cmds = [
        "mkdir -p #{target}"
        "cake build:server",
        "ln -sf ../../#{source}/package.json #{target}",
        "coffee --compile --bare --output #{target} #{source}/*.coffee",
        "coffee --compile --bare --output #{target}/mock #{source}/mock/*.coffee",
        "coffee --compile --bare --output #{target}/mock/node_modules #{source}/mock/node_modules/*.coffee",
        "coffee --compile --bare --output #{target}/lib #{source}/lib/*.coffee",
        "coffee --compile --bare --output #{target}/api-tests #{source}/api-tests/*.coffee",

        "cd #{target}",
        'npm install .',
        'ln -sf ender-vows node_modules/vows',
        'cd -',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'build:static', 'Compile all the client-side static files', ->
    target = 'build/static'
    cmds = [
        "mkdir -p #{target}"
        "cake build:client",
        'python -m external/snowpack',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'build:server', 'Compile server .coffee files to .js', ->
    source = 'src/server'
    target = 'build/server'
    
    cmds = [
        "mkdir -p #{target}"
        "coffee --compile --bare --output #{target} #{source}/*.coffee",
        "coffee --compile --bare --output #{target}/lib #{source}/lib/*.coffee",
        # "coffee --compile --bare --output #{target}/api #{source}/api/*.coffee",
        "ln -sf ../../#{source}/package.json #{target}",
        "cd #{target}",
        'npm install',
        'cd -',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'run:server', 'Compile server .coffee files to .js', ->
    config = 'config'
    serverTarget = 'build/server'
    
    cmds = [
        "nginx -c $PWD/#{config}/nginx/nginx.conf -s quit; nginx -c $PWD/#{config}/nginx/nginx.conf",
        
        'cd ~/Src/riak/rel/riak/bin',
        './riak stop; ./riak start',
        'cd -',
        
        "cd #{serverTarget}",
        'node server.js',
        'cd -',
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'run:server-test', 'Run all server tests', ->
    target = 'build/server-test'
    
    cmds = [
        "#{target}/node_modules/.bin/vows --spec #{target}/*-test.js #{target}/*-tests/*-test.js",
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


task 'stop:server', 'Compile server .coffee files to .js', ->
    config = 'config'
    target = 'build/server'
    cmds = [
        "sudo nginx -s stop",
        "riak stop",
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err


buildClientJS = (source, target, callback) ->
    cmds = [
        "mkdir -p #{target}/js",
        "mkdir -p #{target}/js/views",
        
        "coffee --compile --bare --output #{target}/js #{source}/js/*.coffee",
        "coffee --compile --bare --output #{target}/js/views #{source}/js/views/*.coffee",
    
        "(test -e #{source}/js/lib/ender.js || cake build:ender)",
        "ln -sf ../../../#{source}/js/lib #{target}/js/",
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err
        callback() if callback
                    
                    
buildClientCSS = (source, target, callback) ->
    cmds = [
        "mkdir -p #{target}/css",
        "lessc #{source}/css/all.less #{target}/css/all.css",
    ]
    
    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err
        callback() if callback
                    

buildClientHTML = (source, target, callback) ->
    wings = require("#{source}/js/lib/node_modules/wings/lib/wings.js")
    
    stylesheets = ("css/#{sheet}" for sheet in [
        'all.css',
    ])

    views =  ("views/#{name.replace('.coffee', '.js')}" for name in fs.readdirSync("#{source}/js/views"))

    scripts = ("js/#{script}" for script in [
        'lib/ender.js',
        'lib/ace/ace-uncompressed-noconflict.js',
        'lib/ace/mode-coffee-uncompressed-noconflict.js',
        'lib/coffee-script.js',
        
        views...,
        
        'init.js',
        'util.js',
    ])
    
    # templates = ({
    #         src: "templates/#{name}",
    #         text: fs.readFileSync("#{source}/templates/#{name}")
    #     } for name in fs.readdirSync("#{source}/templates") when name != 'base.html' and /\.html$/.test(name))

    base = wings.renderTemplate(fs.readFileSync("#{source}/templates/base.html", 'utf-8'), {
            favicon: "favicon.png",
            stylesheets: stylesheets,
            scripts: scripts,
            templates: []
    })

    
    fs.writeFileSync("#{target}/base.html", base)

    cmds = [
        "ln -sf ../../#{source}/templates #{target}/",
        "ln -sf ../../#{source}/favicon.png #{target}/",
    ]

    exec cmds.join(' && '), (err, stdout, stderr) ->
        console.log(stdout + stderr) if (stdout or stderr)
        throw err if err
        callback() if callback
                            
buildClientTestHarness = (source, target, client) ->
    wings = require("#{client}/js/lib/node_modules/wings/lib/wings.js")
    
    stylesheets = ("css/#{sheet}" for sheet in [
        'vows.css',
    ])

    views = ("client/js/views/#{name.replace('.coffee', '.js')}" for name in fs.readdirSync("#{client}/js/views"))
    tests = ("views-tests/#{name.replace('.coffee', '.js')}" for name in fs.readdirSync("#{source}/views-tests"))

    scripts = [
        'node_modules/node-compat/lib/node-compat.js',
        'node_modules/ender-vows/lib/vows.js',
        'client/js/lib/ender.js',
        
        views...,
        tests...,
    ]
    
    templates = ({
            src: "templates/#{name}",
            text: fs.readFileSync("#{client}/templates/#{name}")
        } for name in fs.readdirSync("#{client}/templates") when name != 'base.html' and /\.html$/.test(name))

        base = wings.renderTemplate(fs.readFileSync("#{source}/index.html", 'utf-8'), {
            favicon: "favicon.png",
            stylesheets: stylesheets,
            scripts: scripts,
            templates: templates
        }
    )
    
    fs.writeFileSync("#{target}/index.html", base)
                            
