#Tasty web Apps with the Baker

Baker is an opinionated web application metaframework that helps you build great web applications. Baker is based on [Grunt.js](http://gruntjs.com/), [Backbone.js](http://backbonejs.org/) and [Marionette](http://marionettejs.com/).   

Baker is made and heavily used by people from [The Bakery](http://thebakery.io) 

## A few things Baker does for you

- keeps your javascript neat and sane with [jshint](http://www.jshint.com/)
- turns your SASS into CSS 
- gives you js modular goodness with [require.js](http://requirejs.org/) 
- tests your application with [karma](http://karma-runner.github.io/0.10/index.html)
- manages third party dependencies with [bower](http://bower.io/)
- automatically reloads your browser when your code changes
- deploys your application straight to Amazon S3 
- manages development, staging and production settings

###Bootstrap your project

- Get [Grunt.js 0.4+](http://gruntjs.com/) and [Bower](http://bower.io/)

```
npm install -g grunt-cli bower 
```

- Grab the latest baker release [here](https://github.com/thebakeryio/baker/releases/tag/1.0.0)

- Install development dependencies for the Baker, do the following

```
npm install 
```

- Provide your AWS credentials

```
touch aws.json
```

Your aws.json file should have the following content

```
{
	"AWSAccessKeyId": "YOUR-AWS-ACCESS-KEY",
	"AWSSecretKey": "YOUR-AWS-SECRET-KEY",
	"AWSRegion" : "AWS-REGION-WHERE-YOUR-BUCKET-IS",
	"stagingBucket": "NAME-OF-YOUR-STAGING-BUCKET",
	"productionBucket": "NAME-OF-YOUR-PRODUCTION-BUCKET"
}
```

- Ask baker to get all third party libraries


```
grunt init
```  

###Run the app (http://localhost:9001)

```
grunt 
```

###Manage settings

app/scripts/settings contains a collection of settings modules used in your application

```
app/scripts/settings/base.js - common settings reused in all the environments
app/scripts/settings/settings.js - local development settings
app/scripts/settings/stage.js - staging settings
app/scripts/settings/prod.js - production settings
```

###Test

```
grunt test
```

###Build

Baker supports 2 types of builds: staging and production

```
grunt staging-build
grunt production-build
```

after successful build ```dist``` folder will contain your application 

###S3 deploy

Amazon S3 is a great place to keep your web application. Refer to this [excellent article](http://chadthompson.me/2013/05/06/static-web-hosting-with-amazon-s3/) for more details. We also recommend you set a policy on your static hosting bucket to keep all your static content publicly available automagically  

```
{
	"Version": "2008-10-17",
	"Statement": [
		{
			"Sid": "AllowPublicRead",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::NAME-OF-YOUR-BUCKET/*"
		}
	]
}
```

You can deploy both staging and production versions of your app using Baker

```
grunt stage
grunt deploy
```

##Problems/Questions/Suggestions

[Say hi](mailto:hi@thebakery.io)

===

Happy baking!
