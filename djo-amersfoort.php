<?php
declare(strict_types=1);

namespace Grav\Theme;

use Grav\Common\Theme;

/**
 * Adds extra features for the DJO Amersfoort theme.
 *
 * @author Roelof Roos <github@roelof.io>
 * @license LGPL-3.0
 */
class DJOAmersfoort extends Theme
{
    public static function getSubscribedEvents()
    {
        return [
            'onThemeInitialized' => ['onThemeInitialized', 0]
        ];
    }

    public function onThemeInitialized()
    {
        # code...
    }
}
