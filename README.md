hapi-monk [![Build Status](https://travis-ci.org/wtcross/hapi-monk.svg?branch=master)](https://travis-ci.org/wtcross/hapi-monk)
=========

> A Hapi plugin for [monk](https://github.com/Automattic/monk)

## Overview

	npm install --save hapi-monk

This plugin simply exposes all `monk` database methods. It also exposes the created database `options` property. The point is to share the same connection across all plugins in a `Hapi` application.

### Options

| option | required | default                   | description                        |
|--------|----------|---------------------------|------------------------------------|
| url    | false    | mongodb://localhost:27017 | [MongoDB connection string](http://docs.mongodb.org/manual/reference/connection-string/)          |

### Example `manifest.json` 

```
{
	"pack" : {},

	"plugins" : {
		"hapi-monk" : {
			"url" : "$env.DATABASE_URL"
		}
	},

	"servers" : [
		{
			"host" : "$env.HOST",
			"port" : "$env.PORT"
		}
	]
}

```

## License
[MIT License](LICENSE)