<?php
declare(strict_types=1);
/**
 * Part of DJO theme, adds extra markdown methods
 *
 * @author RocketTheme
 * @license MIT
 * @author Roelof Roos <github@roelof.io>
 */

namespace Grav\Theme\DJO;

use Grav\Common\Grav;
use Grav\Common\Markdown\Parsedown;
use Grav\Common\Markdown\ParsedownExtra;

class TwigExtension extends \Twig_Extension
{
    protected $grav;
    protected $config;
    protected $parserCache = [];

    /**
     * TwigExtension constructor.
     */
    public function __construct()
    {
        $this->grav = Grav::instance();
        $this->config = $this->grav['config'];
    }

    /**
     * Returns a cached markdown parser
     *
     * @return [type] [description]
     */
    protected function getMarkdownParser() : \Parsedown
    {
        $page = $this->grav['page'];
        $pagePath = $page->filePath();
        $defaults = $this->config->get('system.pages.markdown');

        if (isset($this->parserCache[$pagePath])) {
            return $this->parserCache[$pagePath];
        }

        // Initialize the preferred variant of Parsedown
        if ($defaults['extra']) {
            $parsedown = new ParsedownExtra($page, $defaults);
        } else {
            $parsedown = new Parsedown($page, $defaults);
        }

        $this->parserCache[$pagePath] = $parsedown;

        return $parsedown;
    }

    /**
     * @param $string
     *
     * @return mixed|string
     */
    public function markdownFilter(string $string): string
    {
        return $this->getMarkdownParser()->line($string);
    }

    /**
     * Build a lead + content set
     *
     * @param  string $content
     * @param  string $separator
     * @return array
     */
    public function buildLead(
        string $content,
        string $separator,
        $firstInline = true,
        $secondInline = false
    ) : array {
        $bits = explode($separator, $content, 2);
        $markdown = $this->getMarkdownParser();

        $m1 = [$markdown, $firstInline ? 'line' : 'parse'];
        $m2 = [$markdown, $secondInline ? 'line' : 'parse'];

        if (count($bits) === 2) {
            return [
                call_user_func($m1, trim($bits[0])),
                call_user_func($m2, trim($bits[1]))
            ];
        } else {
            return [
                null,
                call_user_func($m2, $content)
            ];
        }
    }

    /**
     * Return a list of all filters.
     *
     * @return array
     */
    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('markdown_line', [$this, 'markdownFilter'])
        ];
    }

    /**
     * Return a list of all functions.
     *
     * @return array
     */
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('build_lead', [$this, 'buildLead'])
        ];
    }

    /**
     * Returns extension name.
     *
     * @return string
     */
    public function getName()
    {
        return 'DJOAmersfoort Twig Extension';
    }
}
