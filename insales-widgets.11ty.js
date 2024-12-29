const { Value, TagToken, Context, Emitter, TopLevelToken, evalToken, Hash, BlockMode, Tag } = require( 'liquidjs' );
const fs = require('fs');
const path = require('path');
const sass = require('sass');

let widgetTypes = {};
let widgetTypesFolder = null

module.exports.configInsalesWidgets = function ( eleventyConfig, dir ) {
    widgetTypesFolder = dir.input + "/" + dir.widgets;

    eleventyConfig.addWatchTarget( widgetTypesFolder );
   
    eleventyConfig.addLiquidTag("widget", (liquidEngine) => {
        return WidgetDropTag;
    });

    eleventyConfig.addShortcode("widgets_assets", function (data) {
        const pageUrl = this.page.url;
        const style = getWidgetStyles( pageUrl );

        return `
        <!-- widgets_assets -->
        <link href="/insales/microAlert.css" rel="stylesheet" type="text/css" />
        <link href="/insales/jquery.modal.css" rel="stylesheet" type="text/css" />
        <link href="/insales/core-css.css" rel="stylesheet" type="text/css" />
        
        <style>
            ${ style }
        </style>
        <!-- /widgets_assets -->
        `;
    });

    /* 
        Adds wrapper 
        <div class="layout">
            <div class="layout__content">
            </div>
        </div>
    */
    eleventyConfig.addPairedShortcode("wrapwidget", function(content, widgetTypeHandle) { 
        return `
            <!-- wrapwidget: ${ widgetTypeHandle } -->
            <div class="layout widget-type_${ widgetTypeHandle }">
                <div class="layout__content">
                ${ content }
                </div>
            </div>
            <!-- /wrapwidget: ${ widgetTypeHandle } -->
        `;
    });
}

class WidgetDropTag extends Tag {
    constructor(token, remainTokens, liquid) {
        super(token, remainTokens, liquid)
        const { tokenizer } = token;
        this.widgetDrop = tokenizer.readValue();
        this.hash = new Hash(tokenizer.remaining(), false)
    }
    *render(ctx, emitter) {
        //const widgetTypesFolder = WidgetDropTag.widgetTypesFolder;

        const { liquid, hash } = this

        const widgetDrop = (yield evalToken(this.widgetDrop, ctx));
        const widgetTypeHandle = typeof(widgetDrop) == 'string' ? widgetDrop : widgetDrop.widget_type_handle;

        const liquidPath = path.join( __dirname, widgetTypesFolder, widgetTypeHandle, 'snippet.liquid' );

        try {
            fs.accessSync(liquidPath);
        } catch (e) {
            return `<!-- widget "${ widgetTypeHandle }" not found! -->`;
        }

        const content = fs.readFileSync(liquidPath, 'utf8');
        const template = `
            <!-- widget: ${ widgetTypeHandle } -->
            <div class="layout widget-type_${ widgetTypeHandle }">
                <div class="layout__content">
                ${ content }
                </div>
            </div>
            <!-- /widget: ${ widgetTypeHandle } -->
        `;

        

        const saved = ctx.saveRegister('blocks', 'blockMode');
        ctx.setRegister('blocks', {});
        ctx.setRegister('blockMode', 0 /*BlockMode.OUTPUT*/);
        const scope = (yield hash.render(ctx));
        ctx.push( scope );

        const templates = (yield liquid.parse(template)) 
        yield liquid.renderer.renderTemplates(templates, ctx, emitter)

       
        ctx.pop();
        ctx.restoreRegister(saved);

        const pageUrl = (yield ctx.get(['page', 'url']));

        //equeue widget styles
        const pageWidgets = widgetTypes[pageUrl] || (widgetTypes[pageUrl] = new Set());
        pageWidgets.add( widgetTypeHandle );

    }
};

function getWidgetStyles(pageUrl) {
    let style = '';

    const pageWidgets = widgetTypes[pageUrl];

    if (!pageWidgets) return '';

    const wtypes = [...pageWidgets];

    for (const widgetTypeHandle of wtypes) {
        const snippetPath = path.join( __dirname, widgetTypesFolder, widgetTypeHandle, 'snippet.scss' );
        try {
            fs.accessSync(snippetPath);
        } catch (e) {
            console.warn(`[insales-widget]: snippet.scss not found for ${widgetTypeHandle}`);

            //maybe widget type was removed during the development
            pageWidgets.delete(widgetTypeHandle); 
            continue;
        }
        
        style += `
            .widget-type_${ widgetTypeHandle } {
                ${ fs.readFileSync(snippetPath) }
            }
        `
    }

    return sass.compileString(style).css;

}