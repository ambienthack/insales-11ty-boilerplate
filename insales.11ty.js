const { Value, TagToken, Context, Emitter, TopLevelToken, evalToken, Hash, BlockMode } = require( 'liquidjs' );
const fs = require('fs');
const path = require('path');
const { configInsalesWidgets } = require('./insales-widgets.11ty.js')

module.exports.configInsales = function ( eleventyConfig, dir ) {
    defaultStyles( eleventyConfig, dir )
    
    configInsalesWidgets(eleventyConfig, dir );
        
    eleventyConfig.addShortcode("yield", () => {
        return '<!-- yield -->';
    });

    eleventyConfig.addPairedShortcode('paginate', (content) => {
        return '<!-- paginate -->';
    });

    eleventyConfig.addFilter("global_stylesheet_tag", globalStylesheetTag);
    eleventyConfig.addFilter("image_url", (s) => s);
    eleventyConfig.addFilter("add_param", (s) => s);
    eleventyConfig.addFilter("editable", (s) => s);

    eleventyConfig.addFilter("money", formatMoney);
    eleventyConfig.addFilter("asset_url", locateAsset);
    eleventyConfig.addFilter("asset_url_if_exists", locateAsset);
    eleventyConfig.addFilter("file_url", locateUpload);
}

function formatMoney( value ) {
    let s = value + "";
    s = s.padStart(3 - s.length % 3 + s.length, ' ');
    return s.match(/.{3}/g).join(' ') + ' ₽';
}

function globalStylesheetTag( filename ) {
    return `<link rel="stylesheet" href="/insales/${filename}.css" media="screen" />`;
}

function locateUpload( filename ) {
    return '/uploads/'+filename;
}

function locateAsset( filename ) {
    // const ext = filename.split('.').pop();
    // if ( ext == 'js' ) return '/js/'+filename;
    // if ( ext == 'css' ) return '/css/'+filename;
    return '/media/'+filename;
}

function defaultStyles( eleventyConfig, dir ) {
    eleventyConfig.addPassthroughCopy( dir.input + '/insales' );
    // eleventyConfig.addPassthroughCopy( { 
    //     [ "src/insales" ]: dir.assets,
    // } );
}