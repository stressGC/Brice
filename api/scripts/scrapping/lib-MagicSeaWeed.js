"use strict";

const scrapeSurfAreas = (spotListSelector) => {
  const wrapper = document.querySelector(spotListSelector);
  const surfAreasWrapper = wrapper.children;
  const surfAreas = Array.from(surfAreasWrapper).map((e) => {
    return {
      url: e.href,
      name: e.title,
    };
  });
  return surfAreas;
};

module.exports = {
  scrapeSurfAreas,
};