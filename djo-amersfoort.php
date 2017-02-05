<?php
declare(strict_types=1);

namespace Grav\Theme;

use Grav\Common\Grav;
use Grav\Common\Config\Config;
use Grav\Common\Theme;
use Grav\Theme\DJO\TwigExtension;
use Grav\Common\Twig\Twig as GravTwig;

/**
 * Adds extra features for the DJO Amersfoort theme.
 *
 * @author Roelof Roos <github@roelof.io>
 * @license LGPL-3.0
 */
class DJOAmersfoort extends Theme
{
    public function __construct(Grav $grav, Config $config, $name)
    {
        parent::__construct($grav, $config, $name);
        spl_autoload_register([$this, 'autoloadClass']);
    }

    public static function getSubscribedEvents()
    {
        return [
            'onTwigExtensions' => ['onTwigExtensions', 0]
        ];
    }

    /**
     * Add a dead-simple PSR-4 compliant autoloader
     *
     * @param  string $class Classname to load
     * @return boolean       always false
     */
    public function autoloadClass($class)
    {
        /** @var UniformResourceLocator $locator */
        $locator = $this->grav['locator'];

        $prefix = "Grav\\Theme\\DJO";
        if (false !== strpos($class, $prefix)) {
            // Remove prefix from class
            $class = substr($class, strlen($prefix) + 1);

            // Convert to path
            $class = str_replace('\\', '/', $class);
            $file = $locator->findResource("theme://src/{$class}.php");

            // Load class
            if (file_exists($file)) {
                require_once $file;
            }
        }

        return false;
    }

    /**
     * Add our TwigExtension to Twig
     */
    public function onTwigExtensions()
    {
        $twig = $this->grav['twig'];
        if ($twig instanceof GravTwig) {
            $twig = $twig->twig();
        }

        $twig->addExtension(new TwigExtension);
    }
}
