/**
 * Places an ad in the developer tools, for to-be hackers to see.
 */

(function() {
    'use strict';

    console.log(
        '%cDJO Amersfoort',
        'font-family: sans-serif; color: #180F75; font-size: x-large'
    );
    console.log(
        '%cAls techniek jouw hobby is!',
        'font-family: sans-serif; color: #5A5A5A;'
    );

    console.log([
        'Hoi!',
        '',
        'Tweak jij graag aan sites en wil je graag weten hoe ze werken?',
        'Kom dan een keer langs bij de DJO.',
        '',
        'We helpen je graag om leuke projecten te maken en geven je alle',
        'ruimte om soms ook het een en ander te hacken 😉.',
        '',
        'Check de contactpagina voor meer informatie!'
    ].join('\n'));
}());
