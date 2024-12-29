const sass = require("sass");
const path = require("node:path");
const esbuild = require('esbuild');
//const Image = require("@11ty/eleventy-img");
const { configInsales } = require('./insales.11ty.js');
const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const { viteExternalsPlugin } = require('vite-plugin-externals');

module.exports = function( eleventyConfig ) {
    eleventyConfig.addPlugin(EleventyVitePlugin, {
        viteOptions: {
            plugins: [
                viteExternalsPlugin({
                    jquery: 'jQuery'
                })
            ]
        }

    });

    const dir = {
        input: "src",
        //output: "public",
        includes: "snippets",
        layouts: "layouts",
        assets: "media",
        widgets: "widget_types",
    }

    configLiquid( eleventyConfig, dir );
    configStyles( eleventyConfig, dir );
    configImages( eleventyConfig, dir );
    configScript( eleventyConfig, dir, [ './' + dir.input + '/js/theme.js' ] );

    configInsales( eleventyConfig, dir );

    return {
        dir
    }

}

function configScript( eleventyConfig, dir, entryPoints ) {
    eleventyConfig.addPassthroughCopy( dir.input + "/ts");
}

function configLiquid( eleventyConfig, dir ) {
    eleventyConfig.setLiquidOptions({
        //jsTruthy: true
      });

}

function configStyles( eleventyConfig, dir ) {
    eleventyConfig.addWatchTarget( 'build/icons/' );
    eleventyConfig.addPassthroughCopy( { 
        [ "build/icons" ]: dir.assets,
        [ "src/fonts" ]: dir.assets,
        [ "src/scss" ]: "/scss"
    } );
}

function configImages( eleventyConfig, dir ) {
    eleventyConfig.addPassthroughCopy( dir.input + '/uploads' );
    eleventyConfig.addPassthroughCopy( { 
        [ dir.input + "/i" ]: dir.assets,
    } );
}