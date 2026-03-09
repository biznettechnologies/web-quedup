const { EleventyEdgePlugin, getVersion } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig){
  eleventyConfig.addPlugin(EleventyEdgePlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // eleventyConfig.addPassthroughCopy("src/css/");
  // eleventyConfig.addPassthroughCopy("src/css/smart-app-banner.css");
  eleventyConfig.addPassthroughCopy("src/css/owl.carousel.min.css");
  eleventyConfig.addPassthroughCopy("src/css/owl.theme.default.min.css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addCollection("page", function(collections) {
    return collections.getFilteredByTag("page").sort(function(a, b) {
      return a.data.order - b.data.order;
    });
  });
  
  eleventyConfig.addGlobalData("config", () => {
    return { version: getVersion() };
  });

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
}