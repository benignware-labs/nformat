(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nformat = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  "en": {
    "args": [
      ",",
      ".",
      0,
      ""
    ],
    "equals": "th"
  },
  "de": {
    "args": [
      ".",
      ",",
      0,
      " "
    ],
    "equals": "ro"
  },
  "fr": {
    "args": [
      " ",
      ",",
      0,
      " "
    ]
  },
  "es": {
    "args": [
      " ",
      ",",
      0,
      ""
    ],
    "equals": "br,bg"
  },
  "it": {
    "args": [
      ".",
      ",",
      0,
      ""
    ],
    "equals": "nl,pt,in,mk"
  },
  "tr": {
    "args": [
      ".",
      ",",
      1,
      ""
    ]
  }
};
},{}],2:[function(require,module,exports){
var i18n = require("./locales/all");


// Pad Right
function padRight( string, length, character ) {
  if (string.length < length) {
    return string + Array(length - string.length + 1).join(character || "0");
  }
  return string;
}
  
// Pad Left
function padLeft( string, length, character ) {
  if (string.length < length) {
    return Array(length - string.length + 1).join(character || "0") + string;
  }
  return string;
}
  
  
function toPrecision(n, sig) {
  if (n !== 0) {
    var mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
    return Math.round(n * mult) / mult;
  }
  return n;
}
  
function getLocaleData(locale) {
  if (i18n[locale]) {
    return i18n[locale];
  }
  for (var key in i18n) {
    if (i18n[key].equals && i18n[key].equals.split(",").indexOf(locale) >= 0) {
      return i18n[key];
    }
  };
}

function getLocales(locale) {
  var locales = [];
  Object.keys(i18n).forEach(function(locale) {
    locales.push(locale);
    locales = locales.concat(i18n[locale].equals && i18n[locale].equals.split(/\s*,\s*/) || []);
  });
  return locales;
}

var patternRegex = new RegExp(/^\s*(%|\w*)?([#0]*(?:(,)[#0]+)*)(?:(\.)([#0]+))?(%|\w*)?\s*$/);
  
function format(number, pattern, locale) {
  var localeData;
   
  for (var i = 1; i < arguments.length; i++) {
    if (typeof arguments[i] === "string" && arguments[i].match(/[a-z]{2}/)) {
      localeData = getLocaleData(arguments[i]);
      arguments[i] = undefined;
    } else {
      pattern = arguments[i];
    }
  }
    
  if (!localeData) {
    localeData = getLocaleData('en');
  } 
   
  pattern = pattern || "#,###.#";
   
  var
    args = localeData.args,
    style = "decimal",
    useGrouping = false,
    groupingWhitespace = " " || "\u00A0",
    groupingSeparator = args[0],
    radix = args[1],
    leadingUnit = args[2],
    unitSpace = args[3] ? "\u00A0" : "",
    length = number.toString().length,
    significantDigits = -1;
     
     var patternMatch = patternRegex.exec(pattern);
     
     var intPatternString = patternMatch && patternMatch[2].replace(/,/g, "") || "";
     var intPadMatch = intPatternString ? intPatternString.match(/^0*/) : null;
     
     var intPadLength = intPadMatch ? intPadMatch[0].length : 0;
     
     var decPatternString = patternMatch[5] || "";
     
     var decPadMatch = decPatternString ? decPatternString.match(/0*$/) : null;
     var decPadLength = decPadMatch ? decPadMatch[0].length : 0;
     
     var fractionDigits = decPatternString.length || 0;
     
     var significantFractionDigits = decPatternString.length - decPadLength;
     var significantDigits = (intPatternString.length - intPadLength) + fractionDigits;
     
     var isNegative = number < 0 ? true : 0;
     
     number = Math.abs(number);
     
     style = patternMatch[1] || patternMatch[patternMatch.length - 1] ? "percent" : style;
     useGrouping = patternMatch[3] ? true : useGrouping;
     
     unit = style === "percent" ? "%" : style === "currency" ? currency : "";
     
     significantDigits = Math.floor(number).toString().length + fractionDigits;
     if (fractionDigits > 0 && significantDigits > 0) {
       number = parseFloat(toPrecision(number, significantDigits).toString());
     }
     
     if (style === 'percent') {
       number = number * 100;
     }
     
   var
     intValue = parseInt(number),
     decValue = parseFloat((number - intValue).toPrecision(12));
   
   var decString = decValue.toString();
   
   decString = decValue.toFixed(fractionDigits);
   decString = decString.replace(/^0\./, "");
   decString = decString.replace(/0*$/, "");
   decString = decString ? decString : fractionDigits > 0 ? "0" : "";
   
   if (decPadLength) {
     decString = padRight(decString, fractionDigits, "0");
   }
   
   if ((decPadLength || decValue > 0) && fractionDigits > 0) {
     decString = radix + decString;
   } else {
     decString = "";
     intValue = Math.round(number);
   }
   
   var intString = intValue.toString();
   
   if (intPadLength > 0) {
     intString = padLeft(intString, intPatternString.length, "0");
   }
   
   if (useGrouping) {
     intString = intString.replace(/\B(?=(\d{3})+(?!\d))/g, groupingSeparator.replace(/\s/g, groupingWhitespace) || ",");
   }

   var numString = (isNegative ? "-" : "") + intString + decString;
     
   return unit ? leadingUnit ? unit + unitSpace + numString : numString + unitSpace + unit : numString;
 }

function isLocale(locale) {
  return (typeof locale === "string" && locale.match(/[a-z]{2}/));
}

function detect(string, pattern, locale) {

  var inputPattern = null;
  for (var a = 1; a < arguments.length; a++) {
    var arg = arguments[a];
    if (arg instanceof Array || isLocale(arg)) {
      locale = arg;
    } else if (!inputPattern) {
      inputPattern = arg;
    }
  }
  pattern = inputPattern;
  
  var locales = locale instanceof Array ? locale : locale ? [locale] : Object.keys(i18n);
  
  var patternMatch;
  var patternUnit;
   
  if (pattern) {
    patternMatch = patternRegex.exec(pattern);
    patternUnit = patternMatch ? patternMatch[1] || patternMatch[patternMatch.length - 1] : null;
  }
  
  var results = locales.map(function(locale) {
    
     var localeData = getLocaleData(locale);
     
     var result = {locale: locale, pattern: pattern, relevance: 0};
     var value = NaN;
     
     if (localeData) {
       var args = localeData.args;
       
       if (args) {
         
         var numberRegexPart = "([\+-]?\\d*(?:" + args[0].replace(/\./, "\\.").replace(/\s/, "\\s") + "\\d{3})*)(?:" + args[1].replace(/\./g, "\\.") + "(\\d*))?";
         var leadingUnit = args[2];
         var unitSpace = args[3];
         var unitSpaceRegexPart = "" + unitSpace.replace(/\s/, "\\s") + "";
         var unitRegexPart = "(%|[\w*])";
         var numberRegex = numberRegexPart, matchNumIndex = 1, matchUnitIndex = 3;
         
         var detectedPattern;
         
         if (leadingUnit) {
           numberRegex = "(?:" + unitRegexPart + unitSpaceRegexPart + ")?" + numberRegexPart;
           matchNumIndex = 2;
           matchUnitIndex = 1;
         } else {
           numberRegex = numberRegexPart + "(?:" + unitSpaceRegexPart + unitRegexPart + ")?";
         }
         
         var regex = new RegExp("^\\s*" + numberRegex + "\\s*$");
         var match = regex.exec(string);
         
         if (match) {
           
           var intString = match[matchNumIndex];
           var normalizedIntString = intString.replace(new RegExp(args[0].replace(/\./, "\\.").replace(/\s/, "\\s"), "g"), "");
           
           var decString = match[matchNumIndex + 1] || "";
           var unitMatch = match[matchUnitIndex];
           
           if (pattern && (!patternUnit && unitMatch)) {
             // Invalid because of unit
             return result;
           }
           
           value = parseFloat(normalizedIntString + (decString ? "." + decString : ""));
           
           if (unitMatch && unitMatch === "%") {
             value = parseFloat((value / 100).toPrecision(12));
           }
           
           result.relevance = match.filter(function(match) {
             return match;
           }).length * 10 + value.toString().length;
           
           
           var detectedPattern = "";
           if (!pattern) {
             detectedPattern = "#";
             
             //if (value >= 1000 && intString.indexOf(args[0]) >= 0) {
               detectedPattern = "#,###";
             //}
             
             if (decString.length) {
               detectedPattern+= "." + (new Array(decString.length + 1)).join( "#" );
             }
             
             if (unitMatch && unitMatch === "%") {
               detectedPattern+= "%";
             }
             result.pattern = detectedPattern;
             
           }
           
         }
         
       }
     }
     result.value = value;
     return result;
   }).filter(function(result) {
     return !isNaN(result.value);
   });
   
   // Unique values
   var filteredValues = [];
   results = results.filter(function(result) {
     if (filteredValues.indexOf(result.value) < 0) {
       filteredValues.push(result.value);
       return result;
     }
   });
   results.sort(function(a, b) {
     return a.relevance < b.relevance;
   });

  return results;
}



/* Interface */
function nformat(number, pattern, locale) {
  return format.apply(this, arguments);
}
 
nformat.parse = function(string, pattern, locale) {
  return detect.call(this, string, pattern, locale).map(function(result) {
    return result.value;
  })[0];
};

nformat.detect = function(number, string, pattern, locale) {
  if (typeof number === 'undefined') {
    // Cannot accurately determine pattern and locale
    return null;
  }
  return detect.call(this, string, pattern, locale).filter(function(result) {
    return typeof number !== 'number' || result.value === number;
  }).map(function(result) {
    return {
      locale: result.locale,
      pattern: result.pattern
    };
  })[0];
};


module.exports = nformat;
},{"./locales/all":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbG9jYWxlcy9hbGwuanMiLCJzcmMvbmZvcm1hdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcImVuXCI6IHtcbiAgICBcImFyZ3NcIjogW1xuICAgICAgXCIsXCIsXG4gICAgICBcIi5cIixcbiAgICAgIDAsXG4gICAgICBcIlwiXG4gICAgXSxcbiAgICBcImVxdWFsc1wiOiBcInRoXCJcbiAgfSxcbiAgXCJkZVwiOiB7XG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIFwiLlwiLFxuICAgICAgXCIsXCIsXG4gICAgICAwLFxuICAgICAgXCIgXCJcbiAgICBdLFxuICAgIFwiZXF1YWxzXCI6IFwicm9cIlxuICB9LFxuICBcImZyXCI6IHtcbiAgICBcImFyZ3NcIjogW1xuICAgICAgXCIgXCIsXG4gICAgICBcIixcIixcbiAgICAgIDAsXG4gICAgICBcIiBcIlxuICAgIF1cbiAgfSxcbiAgXCJlc1wiOiB7XG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIFwiIFwiLFxuICAgICAgXCIsXCIsXG4gICAgICAwLFxuICAgICAgXCJcIlxuICAgIF0sXG4gICAgXCJlcXVhbHNcIjogXCJicixiZ1wiXG4gIH0sXG4gIFwiaXRcIjoge1xuICAgIFwiYXJnc1wiOiBbXG4gICAgICBcIi5cIixcbiAgICAgIFwiLFwiLFxuICAgICAgMCxcbiAgICAgIFwiXCJcbiAgICBdLFxuICAgIFwiZXF1YWxzXCI6IFwibmwscHQsaW4sbWtcIlxuICB9LFxuICBcInRyXCI6IHtcbiAgICBcImFyZ3NcIjogW1xuICAgICAgXCIuXCIsXG4gICAgICBcIixcIixcbiAgICAgIDEsXG4gICAgICBcIlwiXG4gICAgXVxuICB9XG59OyIsInZhciBpMThuID0gcmVxdWlyZShcIi4vbG9jYWxlcy9hbGxcIik7XG5cblxuLy8gUGFkIFJpZ2h0XG5mdW5jdGlvbiBwYWRSaWdodCggc3RyaW5nLCBsZW5ndGgsIGNoYXJhY3RlciApIHtcbiAgaWYgKHN0cmluZy5sZW5ndGggPCBsZW5ndGgpIHtcbiAgICByZXR1cm4gc3RyaW5nICsgQXJyYXkobGVuZ3RoIC0gc3RyaW5nLmxlbmd0aCArIDEpLmpvaW4oY2hhcmFjdGVyIHx8IFwiMFwiKTtcbiAgfVxuICByZXR1cm4gc3RyaW5nO1xufVxuICBcbi8vIFBhZCBMZWZ0XG5mdW5jdGlvbiBwYWRMZWZ0KCBzdHJpbmcsIGxlbmd0aCwgY2hhcmFjdGVyICkge1xuICBpZiAoc3RyaW5nLmxlbmd0aCA8IGxlbmd0aCkge1xuICAgIHJldHVybiBBcnJheShsZW5ndGggLSBzdHJpbmcubGVuZ3RoICsgMSkuam9pbihjaGFyYWN0ZXIgfHwgXCIwXCIpICsgc3RyaW5nO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG4gIFxuICBcbmZ1bmN0aW9uIHRvUHJlY2lzaW9uKG4sIHNpZykge1xuICBpZiAobiAhPT0gMCkge1xuICAgIHZhciBtdWx0ID0gTWF0aC5wb3coMTAsIHNpZyAtIE1hdGguZmxvb3IoTWF0aC5sb2cobikgLyBNYXRoLkxOMTApIC0gMSk7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobiAqIG11bHQpIC8gbXVsdDtcbiAgfVxuICByZXR1cm4gbjtcbn1cbiAgXG5mdW5jdGlvbiBnZXRMb2NhbGVEYXRhKGxvY2FsZSkge1xuICBpZiAoaTE4bltsb2NhbGVdKSB7XG4gICAgcmV0dXJuIGkxOG5bbG9jYWxlXTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gaTE4bikge1xuICAgIGlmIChpMThuW2tleV0uZXF1YWxzICYmIGkxOG5ba2V5XS5lcXVhbHMuc3BsaXQoXCIsXCIpLmluZGV4T2YobG9jYWxlKSA+PSAwKSB7XG4gICAgICByZXR1cm4gaTE4bltrZXldO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9jYWxlcyhsb2NhbGUpIHtcbiAgdmFyIGxvY2FsZXMgPSBbXTtcbiAgT2JqZWN0LmtleXMoaTE4bikuZm9yRWFjaChmdW5jdGlvbihsb2NhbGUpIHtcbiAgICBsb2NhbGVzLnB1c2gobG9jYWxlKTtcbiAgICBsb2NhbGVzID0gbG9jYWxlcy5jb25jYXQoaTE4bltsb2NhbGVdLmVxdWFscyAmJiBpMThuW2xvY2FsZV0uZXF1YWxzLnNwbGl0KC9cXHMqLFxccyovKSB8fCBbXSk7XG4gIH0pO1xuICByZXR1cm4gbG9jYWxlcztcbn1cblxudmFyIHBhdHRlcm5SZWdleCA9IG5ldyBSZWdFeHAoL15cXHMqKCV8XFx3Kik/KFsjMF0qKD86KCwpWyMwXSspKikoPzooXFwuKShbIzBdKykpPyglfFxcdyopP1xccyokLyk7XG4gIFxuZnVuY3Rpb24gZm9ybWF0KG51bWJlciwgcGF0dGVybiwgbG9jYWxlKSB7XG4gIHZhciBsb2NhbGVEYXRhO1xuICAgXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09IFwic3RyaW5nXCIgJiYgYXJndW1lbnRzW2ldLm1hdGNoKC9bYS16XXsyfS8pKSB7XG4gICAgICBsb2NhbGVEYXRhID0gZ2V0TG9jYWxlRGF0YShhcmd1bWVudHNbaV0pO1xuICAgICAgYXJndW1lbnRzW2ldID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXR0ZXJuID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgfVxuICAgIFxuICBpZiAoIWxvY2FsZURhdGEpIHtcbiAgICBsb2NhbGVEYXRhID0gZ2V0TG9jYWxlRGF0YSgnZW4nKTtcbiAgfSBcbiAgIFxuICBwYXR0ZXJuID0gcGF0dGVybiB8fCBcIiMsIyMjLiNcIjtcbiAgIFxuICB2YXJcbiAgICBhcmdzID0gbG9jYWxlRGF0YS5hcmdzLFxuICAgIHN0eWxlID0gXCJkZWNpbWFsXCIsXG4gICAgdXNlR3JvdXBpbmcgPSBmYWxzZSxcbiAgICBncm91cGluZ1doaXRlc3BhY2UgPSBcIiBcIiB8fCBcIlxcdTAwQTBcIixcbiAgICBncm91cGluZ1NlcGFyYXRvciA9IGFyZ3NbMF0sXG4gICAgcmFkaXggPSBhcmdzWzFdLFxuICAgIGxlYWRpbmdVbml0ID0gYXJnc1syXSxcbiAgICB1bml0U3BhY2UgPSBhcmdzWzNdID8gXCJcXHUwMEEwXCIgOiBcIlwiLFxuICAgIGxlbmd0aCA9IG51bWJlci50b1N0cmluZygpLmxlbmd0aCxcbiAgICBzaWduaWZpY2FudERpZ2l0cyA9IC0xO1xuICAgICBcbiAgICAgdmFyIHBhdHRlcm5NYXRjaCA9IHBhdHRlcm5SZWdleC5leGVjKHBhdHRlcm4pO1xuICAgICBcbiAgICAgdmFyIGludFBhdHRlcm5TdHJpbmcgPSBwYXR0ZXJuTWF0Y2ggJiYgcGF0dGVybk1hdGNoWzJdLnJlcGxhY2UoLywvZywgXCJcIikgfHwgXCJcIjtcbiAgICAgdmFyIGludFBhZE1hdGNoID0gaW50UGF0dGVyblN0cmluZyA/IGludFBhdHRlcm5TdHJpbmcubWF0Y2goL14wKi8pIDogbnVsbDtcbiAgICAgXG4gICAgIHZhciBpbnRQYWRMZW5ndGggPSBpbnRQYWRNYXRjaCA/IGludFBhZE1hdGNoWzBdLmxlbmd0aCA6IDA7XG4gICAgIFxuICAgICB2YXIgZGVjUGF0dGVyblN0cmluZyA9IHBhdHRlcm5NYXRjaFs1XSB8fCBcIlwiO1xuICAgICBcbiAgICAgdmFyIGRlY1BhZE1hdGNoID0gZGVjUGF0dGVyblN0cmluZyA/IGRlY1BhdHRlcm5TdHJpbmcubWF0Y2goLzAqJC8pIDogbnVsbDtcbiAgICAgdmFyIGRlY1BhZExlbmd0aCA9IGRlY1BhZE1hdGNoID8gZGVjUGFkTWF0Y2hbMF0ubGVuZ3RoIDogMDtcbiAgICAgXG4gICAgIHZhciBmcmFjdGlvbkRpZ2l0cyA9IGRlY1BhdHRlcm5TdHJpbmcubGVuZ3RoIHx8IDA7XG4gICAgIFxuICAgICB2YXIgc2lnbmlmaWNhbnRGcmFjdGlvbkRpZ2l0cyA9IGRlY1BhdHRlcm5TdHJpbmcubGVuZ3RoIC0gZGVjUGFkTGVuZ3RoO1xuICAgICB2YXIgc2lnbmlmaWNhbnREaWdpdHMgPSAoaW50UGF0dGVyblN0cmluZy5sZW5ndGggLSBpbnRQYWRMZW5ndGgpICsgZnJhY3Rpb25EaWdpdHM7XG4gICAgIFxuICAgICB2YXIgaXNOZWdhdGl2ZSA9IG51bWJlciA8IDAgPyB0cnVlIDogMDtcbiAgICAgXG4gICAgIG51bWJlciA9IE1hdGguYWJzKG51bWJlcik7XG4gICAgIFxuICAgICBzdHlsZSA9IHBhdHRlcm5NYXRjaFsxXSB8fCBwYXR0ZXJuTWF0Y2hbcGF0dGVybk1hdGNoLmxlbmd0aCAtIDFdID8gXCJwZXJjZW50XCIgOiBzdHlsZTtcbiAgICAgdXNlR3JvdXBpbmcgPSBwYXR0ZXJuTWF0Y2hbM10gPyB0cnVlIDogdXNlR3JvdXBpbmc7XG4gICAgIFxuICAgICB1bml0ID0gc3R5bGUgPT09IFwicGVyY2VudFwiID8gXCIlXCIgOiBzdHlsZSA9PT0gXCJjdXJyZW5jeVwiID8gY3VycmVuY3kgOiBcIlwiO1xuICAgICBcbiAgICAgc2lnbmlmaWNhbnREaWdpdHMgPSBNYXRoLmZsb29yKG51bWJlcikudG9TdHJpbmcoKS5sZW5ndGggKyBmcmFjdGlvbkRpZ2l0cztcbiAgICAgaWYgKGZyYWN0aW9uRGlnaXRzID4gMCAmJiBzaWduaWZpY2FudERpZ2l0cyA+IDApIHtcbiAgICAgICBudW1iZXIgPSBwYXJzZUZsb2F0KHRvUHJlY2lzaW9uKG51bWJlciwgc2lnbmlmaWNhbnREaWdpdHMpLnRvU3RyaW5nKCkpO1xuICAgICB9XG4gICAgIFxuICAgICBpZiAoc3R5bGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgIG51bWJlciA9IG51bWJlciAqIDEwMDtcbiAgICAgfVxuICAgICBcbiAgIHZhclxuICAgICBpbnRWYWx1ZSA9IHBhcnNlSW50KG51bWJlciksXG4gICAgIGRlY1ZhbHVlID0gcGFyc2VGbG9hdCgobnVtYmVyIC0gaW50VmFsdWUpLnRvUHJlY2lzaW9uKDEyKSk7XG4gICBcbiAgIHZhciBkZWNTdHJpbmcgPSBkZWNWYWx1ZS50b1N0cmluZygpO1xuICAgXG4gICBkZWNTdHJpbmcgPSBkZWNWYWx1ZS50b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKTtcbiAgIGRlY1N0cmluZyA9IGRlY1N0cmluZy5yZXBsYWNlKC9eMFxcLi8sIFwiXCIpO1xuICAgZGVjU3RyaW5nID0gZGVjU3RyaW5nLnJlcGxhY2UoLzAqJC8sIFwiXCIpO1xuICAgZGVjU3RyaW5nID0gZGVjU3RyaW5nID8gZGVjU3RyaW5nIDogZnJhY3Rpb25EaWdpdHMgPiAwID8gXCIwXCIgOiBcIlwiO1xuICAgXG4gICBpZiAoZGVjUGFkTGVuZ3RoKSB7XG4gICAgIGRlY1N0cmluZyA9IHBhZFJpZ2h0KGRlY1N0cmluZywgZnJhY3Rpb25EaWdpdHMsIFwiMFwiKTtcbiAgIH1cbiAgIFxuICAgaWYgKChkZWNQYWRMZW5ndGggfHwgZGVjVmFsdWUgPiAwKSAmJiBmcmFjdGlvbkRpZ2l0cyA+IDApIHtcbiAgICAgZGVjU3RyaW5nID0gcmFkaXggKyBkZWNTdHJpbmc7XG4gICB9IGVsc2Uge1xuICAgICBkZWNTdHJpbmcgPSBcIlwiO1xuICAgICBpbnRWYWx1ZSA9IE1hdGgucm91bmQobnVtYmVyKTtcbiAgIH1cbiAgIFxuICAgdmFyIGludFN0cmluZyA9IGludFZhbHVlLnRvU3RyaW5nKCk7XG4gICBcbiAgIGlmIChpbnRQYWRMZW5ndGggPiAwKSB7XG4gICAgIGludFN0cmluZyA9IHBhZExlZnQoaW50U3RyaW5nLCBpbnRQYXR0ZXJuU3RyaW5nLmxlbmd0aCwgXCIwXCIpO1xuICAgfVxuICAgXG4gICBpZiAodXNlR3JvdXBpbmcpIHtcbiAgICAgaW50U3RyaW5nID0gaW50U3RyaW5nLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIGdyb3VwaW5nU2VwYXJhdG9yLnJlcGxhY2UoL1xccy9nLCBncm91cGluZ1doaXRlc3BhY2UpIHx8IFwiLFwiKTtcbiAgIH1cblxuICAgdmFyIG51bVN0cmluZyA9IChpc05lZ2F0aXZlID8gXCItXCIgOiBcIlwiKSArIGludFN0cmluZyArIGRlY1N0cmluZztcbiAgICAgXG4gICByZXR1cm4gdW5pdCA/IGxlYWRpbmdVbml0ID8gdW5pdCArIHVuaXRTcGFjZSArIG51bVN0cmluZyA6IG51bVN0cmluZyArIHVuaXRTcGFjZSArIHVuaXQgOiBudW1TdHJpbmc7XG4gfVxuXG5mdW5jdGlvbiBpc0xvY2FsZShsb2NhbGUpIHtcbiAgcmV0dXJuICh0eXBlb2YgbG9jYWxlID09PSBcInN0cmluZ1wiICYmIGxvY2FsZS5tYXRjaCgvW2Etel17Mn0vKSk7XG59XG5cbmZ1bmN0aW9uIGRldGVjdChzdHJpbmcsIHBhdHRlcm4sIGxvY2FsZSkge1xuXG4gIHZhciBpbnB1dFBhdHRlcm4gPSBudWxsO1xuICBmb3IgKHZhciBhID0gMTsgYSA8IGFyZ3VtZW50cy5sZW5ndGg7IGErKykge1xuICAgIHZhciBhcmcgPSBhcmd1bWVudHNbYV07XG4gICAgaWYgKGFyZyBpbnN0YW5jZW9mIEFycmF5IHx8IGlzTG9jYWxlKGFyZykpIHtcbiAgICAgIGxvY2FsZSA9IGFyZztcbiAgICB9IGVsc2UgaWYgKCFpbnB1dFBhdHRlcm4pIHtcbiAgICAgIGlucHV0UGF0dGVybiA9IGFyZztcbiAgICB9XG4gIH1cbiAgcGF0dGVybiA9IGlucHV0UGF0dGVybjtcbiAgXG4gIHZhciBsb2NhbGVzID0gbG9jYWxlIGluc3RhbmNlb2YgQXJyYXkgPyBsb2NhbGUgOiBsb2NhbGUgPyBbbG9jYWxlXSA6IE9iamVjdC5rZXlzKGkxOG4pO1xuICBcbiAgdmFyIHBhdHRlcm5NYXRjaDtcbiAgdmFyIHBhdHRlcm5Vbml0O1xuICAgXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgcGF0dGVybk1hdGNoID0gcGF0dGVyblJlZ2V4LmV4ZWMocGF0dGVybik7XG4gICAgcGF0dGVyblVuaXQgPSBwYXR0ZXJuTWF0Y2ggPyBwYXR0ZXJuTWF0Y2hbMV0gfHwgcGF0dGVybk1hdGNoW3BhdHRlcm5NYXRjaC5sZW5ndGggLSAxXSA6IG51bGw7XG4gIH1cbiAgXG4gIHZhciByZXN1bHRzID0gbG9jYWxlcy5tYXAoZnVuY3Rpb24obG9jYWxlKSB7XG4gICAgXG4gICAgIHZhciBsb2NhbGVEYXRhID0gZ2V0TG9jYWxlRGF0YShsb2NhbGUpO1xuICAgICBcbiAgICAgdmFyIHJlc3VsdCA9IHtsb2NhbGU6IGxvY2FsZSwgcGF0dGVybjogcGF0dGVybiwgcmVsZXZhbmNlOiAwfTtcbiAgICAgdmFyIHZhbHVlID0gTmFOO1xuICAgICBcbiAgICAgaWYgKGxvY2FsZURhdGEpIHtcbiAgICAgICB2YXIgYXJncyA9IGxvY2FsZURhdGEuYXJncztcbiAgICAgICBcbiAgICAgICBpZiAoYXJncykge1xuICAgICAgICAgXG4gICAgICAgICB2YXIgbnVtYmVyUmVnZXhQYXJ0ID0gXCIoW1xcKy1dP1xcXFxkKig/OlwiICsgYXJnc1swXS5yZXBsYWNlKC9cXC4vLCBcIlxcXFwuXCIpLnJlcGxhY2UoL1xccy8sIFwiXFxcXHNcIikgKyBcIlxcXFxkezN9KSopKD86XCIgKyBhcmdzWzFdLnJlcGxhY2UoL1xcLi9nLCBcIlxcXFwuXCIpICsgXCIoXFxcXGQqKSk/XCI7XG4gICAgICAgICB2YXIgbGVhZGluZ1VuaXQgPSBhcmdzWzJdO1xuICAgICAgICAgdmFyIHVuaXRTcGFjZSA9IGFyZ3NbM107XG4gICAgICAgICB2YXIgdW5pdFNwYWNlUmVnZXhQYXJ0ID0gXCJcIiArIHVuaXRTcGFjZS5yZXBsYWNlKC9cXHMvLCBcIlxcXFxzXCIpICsgXCJcIjtcbiAgICAgICAgIHZhciB1bml0UmVnZXhQYXJ0ID0gXCIoJXxbXFx3Kl0pXCI7XG4gICAgICAgICB2YXIgbnVtYmVyUmVnZXggPSBudW1iZXJSZWdleFBhcnQsIG1hdGNoTnVtSW5kZXggPSAxLCBtYXRjaFVuaXRJbmRleCA9IDM7XG4gICAgICAgICBcbiAgICAgICAgIHZhciBkZXRlY3RlZFBhdHRlcm47XG4gICAgICAgICBcbiAgICAgICAgIGlmIChsZWFkaW5nVW5pdCkge1xuICAgICAgICAgICBudW1iZXJSZWdleCA9IFwiKD86XCIgKyB1bml0UmVnZXhQYXJ0ICsgdW5pdFNwYWNlUmVnZXhQYXJ0ICsgXCIpP1wiICsgbnVtYmVyUmVnZXhQYXJ0O1xuICAgICAgICAgICBtYXRjaE51bUluZGV4ID0gMjtcbiAgICAgICAgICAgbWF0Y2hVbml0SW5kZXggPSAxO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgbnVtYmVyUmVnZXggPSBudW1iZXJSZWdleFBhcnQgKyBcIig/OlwiICsgdW5pdFNwYWNlUmVnZXhQYXJ0ICsgdW5pdFJlZ2V4UGFydCArIFwiKT9cIjtcbiAgICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIl5cXFxccypcIiArIG51bWJlclJlZ2V4ICsgXCJcXFxccyokXCIpO1xuICAgICAgICAgdmFyIG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICAgICAgICAgXG4gICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgXG4gICAgICAgICAgIHZhciBpbnRTdHJpbmcgPSBtYXRjaFttYXRjaE51bUluZGV4XTtcbiAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnRTdHJpbmcgPSBpbnRTdHJpbmcucmVwbGFjZShuZXcgUmVnRXhwKGFyZ3NbMF0ucmVwbGFjZSgvXFwuLywgXCJcXFxcLlwiKS5yZXBsYWNlKC9cXHMvLCBcIlxcXFxzXCIpLCBcImdcIiksIFwiXCIpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgdmFyIGRlY1N0cmluZyA9IG1hdGNoW21hdGNoTnVtSW5kZXggKyAxXSB8fCBcIlwiO1xuICAgICAgICAgICB2YXIgdW5pdE1hdGNoID0gbWF0Y2hbbWF0Y2hVbml0SW5kZXhdO1xuICAgICAgICAgICBcbiAgICAgICAgICAgaWYgKHBhdHRlcm4gJiYgKCFwYXR0ZXJuVW5pdCAmJiB1bml0TWF0Y2gpKSB7XG4gICAgICAgICAgICAgLy8gSW52YWxpZCBiZWNhdXNlIG9mIHVuaXRcbiAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICB9XG4gICAgICAgICAgIFxuICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQobm9ybWFsaXplZEludFN0cmluZyArIChkZWNTdHJpbmcgPyBcIi5cIiArIGRlY1N0cmluZyA6IFwiXCIpKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgIGlmICh1bml0TWF0Y2ggJiYgdW5pdE1hdGNoID09PSBcIiVcIikge1xuICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCgodmFsdWUgLyAxMDApLnRvUHJlY2lzaW9uKDEyKSk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICAgIHJlc3VsdC5yZWxldmFuY2UgPSBtYXRjaC5maWx0ZXIoZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgIH0pLmxlbmd0aCAqIDEwICsgdmFsdWUudG9TdHJpbmcoKS5sZW5ndGg7XG4gICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICAgdmFyIGRldGVjdGVkUGF0dGVybiA9IFwiXCI7XG4gICAgICAgICAgIGlmICghcGF0dGVybikge1xuICAgICAgICAgICAgIGRldGVjdGVkUGF0dGVybiA9IFwiI1wiO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgIC8vaWYgKHZhbHVlID49IDEwMDAgJiYgaW50U3RyaW5nLmluZGV4T2YoYXJnc1swXSkgPj0gMCkge1xuICAgICAgICAgICAgICAgZGV0ZWN0ZWRQYXR0ZXJuID0gXCIjLCMjI1wiO1xuICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgIGlmIChkZWNTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICBkZXRlY3RlZFBhdHRlcm4rPSBcIi5cIiArIChuZXcgQXJyYXkoZGVjU3RyaW5nLmxlbmd0aCArIDEpKS5qb2luKCBcIiNcIiApO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICBpZiAodW5pdE1hdGNoICYmIHVuaXRNYXRjaCA9PT0gXCIlXCIpIHtcbiAgICAgICAgICAgICAgIGRldGVjdGVkUGF0dGVybis9IFwiJVwiO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICByZXN1bHQucGF0dGVybiA9IGRldGVjdGVkUGF0dGVybjtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgfVxuICAgICAgICAgICBcbiAgICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgIH1cbiAgICAgfVxuICAgICByZXN1bHQudmFsdWUgPSB2YWx1ZTtcbiAgICAgcmV0dXJuIHJlc3VsdDtcbiAgIH0pLmZpbHRlcihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgcmV0dXJuICFpc05hTihyZXN1bHQudmFsdWUpO1xuICAgfSk7XG4gICBcbiAgIC8vIFVuaXF1ZSB2YWx1ZXNcbiAgIHZhciBmaWx0ZXJlZFZhbHVlcyA9IFtdO1xuICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICBpZiAoZmlsdGVyZWRWYWx1ZXMuaW5kZXhPZihyZXN1bHQudmFsdWUpIDwgMCkge1xuICAgICAgIGZpbHRlcmVkVmFsdWVzLnB1c2gocmVzdWx0LnZhbHVlKTtcbiAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICB9XG4gICB9KTtcbiAgIHJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgIHJldHVybiBhLnJlbGV2YW5jZSA8IGIucmVsZXZhbmNlO1xuICAgfSk7XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cblxuXG4vKiBJbnRlcmZhY2UgKi9cbmZ1bmN0aW9uIG5mb3JtYXQobnVtYmVyLCBwYXR0ZXJuLCBsb2NhbGUpIHtcbiAgcmV0dXJuIGZvcm1hdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuIFxubmZvcm1hdC5wYXJzZSA9IGZ1bmN0aW9uKHN0cmluZywgcGF0dGVybiwgbG9jYWxlKSB7XG4gIHJldHVybiBkZXRlY3QuY2FsbCh0aGlzLCBzdHJpbmcsIHBhdHRlcm4sIGxvY2FsZSkubWFwKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH0pWzBdO1xufTtcblxubmZvcm1hdC5kZXRlY3QgPSBmdW5jdGlvbihudW1iZXIsIHN0cmluZywgcGF0dGVybiwgbG9jYWxlKSB7XG4gIGlmICh0eXBlb2YgbnVtYmVyID09PSAndW5kZWZpbmVkJykge1xuICAgIC8vIENhbm5vdCBhY2N1cmF0ZWx5IGRldGVybWluZSBwYXR0ZXJuIGFuZCBsb2NhbGVcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gZGV0ZWN0LmNhbGwodGhpcywgc3RyaW5nLCBwYXR0ZXJuLCBsb2NhbGUpLmZpbHRlcihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICByZXR1cm4gdHlwZW9mIG51bWJlciAhPT0gJ251bWJlcicgfHwgcmVzdWx0LnZhbHVlID09PSBudW1iZXI7XG4gIH0pLm1hcChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9jYWxlOiByZXN1bHQubG9jYWxlLFxuICAgICAgcGF0dGVybjogcmVzdWx0LnBhdHRlcm5cbiAgICB9O1xuICB9KVswXTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZm9ybWF0OyJdfQ==
