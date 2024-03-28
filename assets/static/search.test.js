const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><div id="booksearch"></div>`);
global.window = dom.window;
global.document = dom.window.document;
const $ = require("jquery");

$.get = jest.fn();
$.post = jest.fn();
$.put = jest.fn();

global.$ = $;

const { requests, OpenLibrary } = require("./search.js");

describe("OpenLibrary API", () => {
  test("search function with car", () => {
    const callback = jest.fn();
    const mockResponse = {
      hits: {
        hits: [{ edition: { key: "2949702", cover_url: "http://covers.openlibrary.org/w/id/2949702-M.jpg" } }]
      }
    };

    $.get.mockImplementation((url, callback) => {
        const deferred = {
          done: function(fn) {
            fn(mockResponse);
            return deferred;
          }
        };
        callback(mockResponse);
        return deferred;
      });

    OpenLibrary.search("car", callback);

    expect(callback).toHaveBeenCalledWith(mockResponse.hits.hits);
  });
});