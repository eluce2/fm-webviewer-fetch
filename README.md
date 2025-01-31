# fm-webviewer-fetch

## Sponsored by [Proof+Geist](https://www.proofgeist.com/)

## Usage

You can load it directly from the unpkg cdn

```
//latest version
<script src="https://unpkg.com/fmw-webviewer-fetch" crossorigin></script>
```

once loaded you can find the methods on the `fmwUtils` global object

or if you are using a bundler like webpack, you can install from npm

`npm install fm-webviewer-fetch`

and then import

`import {fetch} from 'fm-webviewer-fetch`

## Highlights

This is a fetch replacement for calling a FileMaker script and getting a promise back in return. Or you can use callback if you want instead.

## Script Requirement

In order to get the script results back to Javascript, the script has to follow callback convention.  See example file the examples folder.

## FileMaker Version Support

FileMaker 19 only
Windows will use IE 11 as the web viewer engine and therefor requiring polly filling fetch. Many app frameworks like create react app have ways to do this. You can try one like this if you don't

https://github.com/taylorhakes/promise-polyfill

## API

[Generated API Docs](/api.md)
