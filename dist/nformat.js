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
   
   if ((decPadLength || decValue > 0) && fractionDigits > 0) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbG9jYWxlcy9hbGwuanMiLCJzcmMvbmZvcm1hdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBcImVuXCI6IHtcbiAgICBcImFyZ3NcIjogW1xuICAgICAgXCIsXCIsXG4gICAgICBcIi5cIixcbiAgICAgIDAsXG4gICAgICBcIlwiXG4gICAgXSxcbiAgICBcImVxdWFsc1wiOiBcInRoXCJcbiAgfSxcbiAgXCJkZVwiOiB7XG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIFwiLlwiLFxuICAgICAgXCIsXCIsXG4gICAgICAwLFxuICAgICAgXCIgXCJcbiAgICBdLFxuICAgIFwiZXF1YWxzXCI6IFwicm9cIlxuICB9LFxuICBcImZyXCI6IHtcbiAgICBcImFyZ3NcIjogW1xuICAgICAgXCIgXCIsXG4gICAgICBcIixcIixcbiAgICAgIDAsXG4gICAgICBcIiBcIlxuICAgIF1cbiAgfSxcbiAgXCJlc1wiOiB7XG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIFwiIFwiLFxuICAgICAgXCIsXCIsXG4gICAgICAwLFxuICAgICAgXCJcIlxuICAgIF0sXG4gICAgXCJlcXVhbHNcIjogXCJicixiZ1wiXG4gIH0sXG4gIFwiaXRcIjoge1xuICAgIFwiYXJnc1wiOiBbXG4gICAgICBcIi5cIixcbiAgICAgIFwiLFwiLFxuICAgICAgMCxcbiAgICAgIFwiXCJcbiAgICBdLFxuICAgIFwiZXF1YWxzXCI6IFwibmwscHQsaW4sbWtcIlxuICB9LFxuICBcInRyXCI6IHtcbiAgICBcImFyZ3NcIjogW1xuICAgICAgXCIuXCIsXG4gICAgICBcIixcIixcbiAgICAgIDEsXG4gICAgICBcIlwiXG4gICAgXVxuICB9XG59OyIsInZhciBpMThuID0gcmVxdWlyZShcIi4vbG9jYWxlcy9hbGxcIik7XG5cblxuLy8gUGFkIFJpZ2h0XG5mdW5jdGlvbiBwYWRSaWdodCggc3RyaW5nLCBsZW5ndGgsIGNoYXJhY3RlciApIHtcbiAgaWYgKHN0cmluZy5sZW5ndGggPCBsZW5ndGgpIHtcbiAgICByZXR1cm4gc3RyaW5nICsgQXJyYXkobGVuZ3RoIC0gc3RyaW5nLmxlbmd0aCArIDEpLmpvaW4oY2hhcmFjdGVyIHx8IFwiMFwiKTtcbiAgfVxuICByZXR1cm4gc3RyaW5nO1xufVxuICBcbi8vIFBhZCBMZWZ0XG5mdW5jdGlvbiBwYWRMZWZ0KCBzdHJpbmcsIGxlbmd0aCwgY2hhcmFjdGVyICkge1xuICBpZiAoc3RyaW5nLmxlbmd0aCA8IGxlbmd0aCkge1xuICAgIHJldHVybiBBcnJheShsZW5ndGggLSBzdHJpbmcubGVuZ3RoICsgMSkuam9pbihjaGFyYWN0ZXIgfHwgXCIwXCIpICsgc3RyaW5nO1xuICB9XG4gIHJldHVybiBzdHJpbmc7XG59XG4gIFxuICBcbmZ1bmN0aW9uIHRvUHJlY2lzaW9uKG4sIHNpZykge1xuICBpZiAobiAhPT0gMCkge1xuICAgIHZhciBtdWx0ID0gTWF0aC5wb3coMTAsIHNpZyAtIE1hdGguZmxvb3IoTWF0aC5sb2cobikgLyBNYXRoLkxOMTApIC0gMSk7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobiAqIG11bHQpIC8gbXVsdDtcbiAgfVxuICByZXR1cm4gbjtcbn1cbiAgXG5mdW5jdGlvbiBnZXRMb2NhbGVEYXRhKGxvY2FsZSkge1xuICBpZiAoaTE4bltsb2NhbGVdKSB7XG4gICAgcmV0dXJuIGkxOG5bbG9jYWxlXTtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gaTE4bikge1xuICAgIGlmIChpMThuW2tleV0uZXF1YWxzICYmIGkxOG5ba2V5XS5lcXVhbHMuc3BsaXQoXCIsXCIpLmluZGV4T2YobG9jYWxlKSA+PSAwKSB7XG4gICAgICByZXR1cm4gaTE4bltrZXldO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0TG9jYWxlcyhsb2NhbGUpIHtcbiAgdmFyIGxvY2FsZXMgPSBbXTtcbiAgT2JqZWN0LmtleXMoaTE4bikuZm9yRWFjaChmdW5jdGlvbihsb2NhbGUpIHtcbiAgICBsb2NhbGVzLnB1c2gobG9jYWxlKTtcbiAgICBsb2NhbGVzID0gbG9jYWxlcy5jb25jYXQoaTE4bltsb2NhbGVdLmVxdWFscyAmJiBpMThuW2xvY2FsZV0uZXF1YWxzLnNwbGl0KC9cXHMqLFxccyovKSB8fCBbXSk7XG4gIH0pO1xuICByZXR1cm4gbG9jYWxlcztcbn1cblxudmFyIHBhdHRlcm5SZWdleCA9IG5ldyBSZWdFeHAoL15cXHMqKCV8XFx3Kik/KFsjMF0qKD86KCwpWyMwXSspKikoPzooXFwuKShbIzBdKykpPyglfFxcdyopP1xccyokLyk7XG4gIFxuZnVuY3Rpb24gZm9ybWF0KG51bWJlciwgcGF0dGVybiwgbG9jYWxlKSB7XG4gIHZhciBsb2NhbGVEYXRhO1xuICAgXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gPT09IFwic3RyaW5nXCIgJiYgYXJndW1lbnRzW2ldLm1hdGNoKC9bYS16XXsyfS8pKSB7XG4gICAgICBsb2NhbGVEYXRhID0gZ2V0TG9jYWxlRGF0YShhcmd1bWVudHNbaV0pO1xuICAgICAgYXJndW1lbnRzW2ldID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXR0ZXJuID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgfVxuICAgIFxuICBpZiAoIWxvY2FsZURhdGEpIHtcbiAgICBsb2NhbGVEYXRhID0gZ2V0TG9jYWxlRGF0YSgnZW4nKTtcbiAgfSBcbiAgIFxuICBwYXR0ZXJuID0gcGF0dGVybiB8fCBcIiMsIyMjLiNcIjtcbiAgIFxuICB2YXJcbiAgICBhcmdzID0gbG9jYWxlRGF0YS5hcmdzLFxuICAgIHN0eWxlID0gXCJkZWNpbWFsXCIsXG4gICAgdXNlR3JvdXBpbmcgPSBmYWxzZSxcbiAgICBncm91cGluZ1doaXRlc3BhY2UgPSBcIiBcIiB8fCBcIlxcdTAwQTBcIixcbiAgICBncm91cGluZ1NlcGFyYXRvciA9IGFyZ3NbMF0sXG4gICAgcmFkaXggPSBhcmdzWzFdLFxuICAgIGxlYWRpbmdVbml0ID0gYXJnc1syXSxcbiAgICB1bml0U3BhY2UgPSBhcmdzWzNdID8gXCJcXHUwMEEwXCIgOiBcIlwiLFxuICAgIGxlbmd0aCA9IG51bWJlci50b1N0cmluZygpLmxlbmd0aCxcbiAgICBzaWduaWZpY2FudERpZ2l0cyA9IC0xO1xuICAgICBcbiAgICAgdmFyIHBhdHRlcm5NYXRjaCA9IHBhdHRlcm5SZWdleC5leGVjKHBhdHRlcm4pO1xuICAgICBcbiAgICAgdmFyIGludFBhdHRlcm5TdHJpbmcgPSBwYXR0ZXJuTWF0Y2ggJiYgcGF0dGVybk1hdGNoWzJdLnJlcGxhY2UoLywvZywgXCJcIikgfHwgXCJcIjtcbiAgICAgdmFyIGludFBhZE1hdGNoID0gaW50UGF0dGVyblN0cmluZyA/IGludFBhdHRlcm5TdHJpbmcubWF0Y2goL14wKi8pIDogbnVsbDtcbiAgICAgXG4gICAgIHZhciBpbnRQYWRMZW5ndGggPSBpbnRQYWRNYXRjaCA/IGludFBhZE1hdGNoWzBdLmxlbmd0aCA6IDA7XG4gICAgIFxuICAgICB2YXIgZGVjUGF0dGVyblN0cmluZyA9IHBhdHRlcm5NYXRjaFs1XSB8fCBcIlwiO1xuICAgICBcbiAgICAgdmFyIGRlY1BhZE1hdGNoID0gZGVjUGF0dGVyblN0cmluZyA/IGRlY1BhdHRlcm5TdHJpbmcubWF0Y2goLzAqJC8pIDogbnVsbDtcbiAgICAgdmFyIGRlY1BhZExlbmd0aCA9IGRlY1BhZE1hdGNoID8gZGVjUGFkTWF0Y2hbMF0ubGVuZ3RoIDogMDtcbiAgICAgXG4gICAgIHZhciBmcmFjdGlvbkRpZ2l0cyA9IGRlY1BhdHRlcm5TdHJpbmcubGVuZ3RoIHx8IDA7XG4gICAgIFxuICAgICB2YXIgc2lnbmlmaWNhbnRGcmFjdGlvbkRpZ2l0cyA9IGRlY1BhdHRlcm5TdHJpbmcubGVuZ3RoIC0gZGVjUGFkTGVuZ3RoO1xuICAgICB2YXIgc2lnbmlmaWNhbnREaWdpdHMgPSAoaW50UGF0dGVyblN0cmluZy5sZW5ndGggLSBpbnRQYWRMZW5ndGgpICsgZnJhY3Rpb25EaWdpdHM7XG4gICAgIFxuICAgICB2YXIgaXNOZWdhdGl2ZSA9IG51bWJlciA8IDAgPyB0cnVlIDogMDtcbiAgICAgXG4gICAgIG51bWJlciA9IE1hdGguYWJzKG51bWJlcik7XG4gICAgIFxuICAgICBzdHlsZSA9IHBhdHRlcm5NYXRjaFsxXSB8fCBwYXR0ZXJuTWF0Y2hbcGF0dGVybk1hdGNoLmxlbmd0aCAtIDFdID8gXCJwZXJjZW50XCIgOiBzdHlsZTtcbiAgICAgdXNlR3JvdXBpbmcgPSBwYXR0ZXJuTWF0Y2hbM10gPyB0cnVlIDogdXNlR3JvdXBpbmc7XG4gICAgIFxuICAgICB1bml0ID0gc3R5bGUgPT09IFwicGVyY2VudFwiID8gXCIlXCIgOiBzdHlsZSA9PT0gXCJjdXJyZW5jeVwiID8gY3VycmVuY3kgOiBcIlwiO1xuICAgICBcbiAgICAgc2lnbmlmaWNhbnREaWdpdHMgPSBNYXRoLmZsb29yKG51bWJlcikudG9TdHJpbmcoKS5sZW5ndGggKyBmcmFjdGlvbkRpZ2l0cztcbiAgICAgaWYgKGZyYWN0aW9uRGlnaXRzID4gMCAmJiBzaWduaWZpY2FudERpZ2l0cyA+IDApIHtcbiAgICAgICBudW1iZXIgPSBwYXJzZUZsb2F0KHRvUHJlY2lzaW9uKG51bWJlciwgc2lnbmlmaWNhbnREaWdpdHMpLnRvU3RyaW5nKCkpO1xuICAgICB9XG4gICAgIFxuICAgICBpZiAoc3R5bGUgPT09ICdwZXJjZW50Jykge1xuICAgICAgIG51bWJlciA9IG51bWJlciAqIDEwMDtcbiAgICAgfVxuICAgICBcbiAgIHZhclxuICAgICBpbnRWYWx1ZSA9IHBhcnNlSW50KG51bWJlciksXG4gICAgIGRlY1ZhbHVlID0gcGFyc2VGbG9hdCgobnVtYmVyIC0gaW50VmFsdWUpLnRvUHJlY2lzaW9uKDEyKSk7XG4gICBcbiAgIHZhciBkZWNTdHJpbmcgPSBkZWNWYWx1ZS50b1N0cmluZygpO1xuICAgXG4gICBkZWNTdHJpbmcgPSBkZWNWYWx1ZS50b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKTtcbiAgIGRlY1N0cmluZyA9IGRlY1N0cmluZy5yZXBsYWNlKC9eMFxcLi8sIFwiXCIpO1xuICAgZGVjU3RyaW5nID0gZGVjU3RyaW5nLnJlcGxhY2UoLzAqJC8sIFwiXCIpO1xuICAgZGVjU3RyaW5nID0gZGVjU3RyaW5nID8gZGVjU3RyaW5nIDogZnJhY3Rpb25EaWdpdHMgPiAwID8gXCIwXCIgOiBcIlwiO1xuICAgXG4gICBpZiAoZGVjUGFkTGVuZ3RoKSB7XG4gICAgIGRlY1N0cmluZyA9IHBhZFJpZ2h0KGRlY1N0cmluZywgZnJhY3Rpb25EaWdpdHMsIFwiMFwiKTtcbiAgIH1cbiAgIFxuICAgaWYgKChkZWNQYWRMZW5ndGggfHzCoGRlY1ZhbHVlID4gMCkgJiYgZnJhY3Rpb25EaWdpdHMgPiAwKSB7XG4gICAgIGRlY1N0cmluZyA9IHJhZGl4ICsgZGVjU3RyaW5nO1xuICAgfSBlbHNlIHtcbiAgICAgZGVjU3RyaW5nID0gXCJcIjtcbiAgICAgaW50VmFsdWUgPSBNYXRoLnJvdW5kKG51bWJlcik7XG4gICB9XG4gICBcbiAgIHZhciBpbnRTdHJpbmcgPSBpbnRWYWx1ZS50b1N0cmluZygpO1xuICAgXG4gICBpZiAoaW50UGFkTGVuZ3RoID4gMCkge1xuICAgICBpbnRTdHJpbmcgPSBwYWRMZWZ0KGludFN0cmluZywgaW50UGF0dGVyblN0cmluZy5sZW5ndGgsIFwiMFwiKTtcbiAgIH1cbiAgIFxuICAgaWYgKHVzZUdyb3VwaW5nKSB7XG4gICAgIGludFN0cmluZyA9IGludFN0cmluZy5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBncm91cGluZ1NlcGFyYXRvci5yZXBsYWNlKC9cXHMvZywgZ3JvdXBpbmdXaGl0ZXNwYWNlKSB8fCBcIixcIik7XG4gICB9XG5cbiAgIHZhciBudW1TdHJpbmcgPSAoaXNOZWdhdGl2ZSA/IFwiLVwiIDogXCJcIikgKyBpbnRTdHJpbmcgKyBkZWNTdHJpbmc7XG4gICAgIFxuICAgcmV0dXJuIHVuaXQgPyBsZWFkaW5nVW5pdCA/IHVuaXQgKyB1bml0U3BhY2UgKyBudW1TdHJpbmcgOiBudW1TdHJpbmcgKyB1bml0U3BhY2UgKyB1bml0IDogbnVtU3RyaW5nO1xuIH1cblxuZnVuY3Rpb24gaXNMb2NhbGUobG9jYWxlKSB7XG4gIHJldHVybiAodHlwZW9mIGxvY2FsZSA9PT0gXCJzdHJpbmdcIiAmJiBsb2NhbGUubWF0Y2goL1thLXpdezJ9LykpO1xufVxuXG5mdW5jdGlvbiBkZXRlY3Qoc3RyaW5nLCBwYXR0ZXJuLCBsb2NhbGUpIHtcblxuICB2YXIgaW5wdXRQYXR0ZXJuID0gbnVsbDtcbiAgZm9yICh2YXIgYSA9IDE7IGEgPCBhcmd1bWVudHMubGVuZ3RoOyBhKyspIHtcbiAgICB2YXIgYXJnID0gYXJndW1lbnRzW2FdO1xuICAgIGlmIChhcmcgaW5zdGFuY2VvZiBBcnJheSB8fCBpc0xvY2FsZShhcmcpKSB7XG4gICAgICBsb2NhbGUgPSBhcmc7XG4gICAgfSBlbHNlIGlmICghaW5wdXRQYXR0ZXJuKSB7XG4gICAgICBpbnB1dFBhdHRlcm4gPSBhcmc7XG4gICAgfVxuICB9XG4gIHBhdHRlcm4gPSBpbnB1dFBhdHRlcm47XG4gIFxuICB2YXIgbG9jYWxlcyA9IGxvY2FsZSBpbnN0YW5jZW9mIEFycmF5ID8gbG9jYWxlIDogbG9jYWxlID8gW2xvY2FsZV0gOiBPYmplY3Qua2V5cyhpMThuKTtcbiAgXG4gIHZhciBwYXR0ZXJuTWF0Y2g7XG4gIHZhciBwYXR0ZXJuVW5pdDtcbiAgIFxuICBpZiAocGF0dGVybikge1xuICAgIHBhdHRlcm5NYXRjaCA9IHBhdHRlcm5SZWdleC5leGVjKHBhdHRlcm4pO1xuICAgIHBhdHRlcm5Vbml0ID0gcGF0dGVybk1hdGNoID8gcGF0dGVybk1hdGNoWzFdIHx8IHBhdHRlcm5NYXRjaFtwYXR0ZXJuTWF0Y2gubGVuZ3RoIC0gMV0gOiBudWxsO1xuICB9XG4gIFxuICB2YXIgcmVzdWx0cyA9IGxvY2FsZXMubWFwKGZ1bmN0aW9uKGxvY2FsZSkge1xuICAgIFxuICAgICB2YXIgbG9jYWxlRGF0YSA9IGdldExvY2FsZURhdGEobG9jYWxlKTtcbiAgICAgXG4gICAgIHZhciByZXN1bHQgPSB7bG9jYWxlOiBsb2NhbGUsIHBhdHRlcm46IHBhdHRlcm4sIHJlbGV2YW5jZTogMH07XG4gICAgIHZhciB2YWx1ZSA9IE5hTjtcbiAgICAgXG4gICAgIGlmIChsb2NhbGVEYXRhKSB7XG4gICAgICAgdmFyIGFyZ3MgPSBsb2NhbGVEYXRhLmFyZ3M7XG4gICAgICAgXG4gICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgIFxuICAgICAgICAgdmFyIG51bWJlclJlZ2V4UGFydCA9IFwiKFtcXCstXT9cXFxcZCooPzpcIiArIGFyZ3NbMF0ucmVwbGFjZSgvXFwuLywgXCJcXFxcLlwiKS5yZXBsYWNlKC9cXHMvLCBcIlxcXFxzXCIpICsgXCJcXFxcZHszfSkqKSg/OlwiICsgYXJnc1sxXS5yZXBsYWNlKC9cXC4vZywgXCJcXFxcLlwiKSArIFwiKFxcXFxkKikpP1wiO1xuICAgICAgICAgdmFyIGxlYWRpbmdVbml0ID0gYXJnc1syXTtcbiAgICAgICAgIHZhciB1bml0U3BhY2UgPSBhcmdzWzNdO1xuICAgICAgICAgdmFyIHVuaXRTcGFjZVJlZ2V4UGFydCA9IFwiXCIgKyB1bml0U3BhY2UucmVwbGFjZSgvXFxzLywgXCJcXFxcc1wiKSArIFwiXCI7XG4gICAgICAgICB2YXIgdW5pdFJlZ2V4UGFydCA9IFwiKCV8W1xcdypdKVwiO1xuICAgICAgICAgdmFyIG51bWJlclJlZ2V4ID0gbnVtYmVyUmVnZXhQYXJ0LCBtYXRjaE51bUluZGV4ID0gMSwgbWF0Y2hVbml0SW5kZXggPSAzO1xuICAgICAgICAgXG4gICAgICAgICB2YXIgZGV0ZWN0ZWRQYXR0ZXJuO1xuICAgICAgICAgXG4gICAgICAgICBpZiAobGVhZGluZ1VuaXQpIHtcbiAgICAgICAgICAgbnVtYmVyUmVnZXggPSBcIig/OlwiICsgdW5pdFJlZ2V4UGFydCArIHVuaXRTcGFjZVJlZ2V4UGFydCArIFwiKT9cIiArIG51bWJlclJlZ2V4UGFydDtcbiAgICAgICAgICAgbWF0Y2hOdW1JbmRleCA9IDI7XG4gICAgICAgICAgIG1hdGNoVW5pdEluZGV4ID0gMTtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIG51bWJlclJlZ2V4ID0gbnVtYmVyUmVnZXhQYXJ0ICsgXCIoPzpcIiArIHVuaXRTcGFjZVJlZ2V4UGFydCArIHVuaXRSZWdleFBhcnQgKyBcIik/XCI7XG4gICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqXCIgKyBudW1iZXJSZWdleCArIFwiXFxcXHMqJFwiKTtcbiAgICAgICAgIHZhciBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgIFxuICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgIFxuICAgICAgICAgICB2YXIgaW50U3RyaW5nID0gbWF0Y2hbbWF0Y2hOdW1JbmRleF07XG4gICAgICAgICAgIHZhciBub3JtYWxpemVkSW50U3RyaW5nID0gaW50U3RyaW5nLnJlcGxhY2UobmV3IFJlZ0V4cChhcmdzWzBdLnJlcGxhY2UoL1xcLi8sIFwiXFxcXC5cIikucmVwbGFjZSgvXFxzLywgXCJcXFxcc1wiKSwgXCJnXCIpLCBcIlwiKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgIHZhciBkZWNTdHJpbmcgPSBtYXRjaFttYXRjaE51bUluZGV4ICsgMV0gfHwgXCJcIjtcbiAgICAgICAgICAgdmFyIHVuaXRNYXRjaCA9IG1hdGNoW21hdGNoVW5pdEluZGV4XTtcbiAgICAgICAgICAgXG4gICAgICAgICAgIGlmIChwYXR0ZXJuICYmICghcGF0dGVyblVuaXQgJiYgdW5pdE1hdGNoKSkge1xuICAgICAgICAgICAgIC8vIEludmFsaWQgYmVjYXVzZSBvZiB1bml0XG4gICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgfVxuICAgICAgICAgICBcbiAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KG5vcm1hbGl6ZWRJbnRTdHJpbmcgKyAoZGVjU3RyaW5nID8gXCIuXCIgKyBkZWNTdHJpbmcgOiBcIlwiKSk7XG4gICAgICAgICAgIFxuICAgICAgICAgICBpZiAodW5pdE1hdGNoICYmIHVuaXRNYXRjaCA9PT0gXCIlXCIpIHtcbiAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoKHZhbHVlIC8gMTAwKS50b1ByZWNpc2lvbigxMikpO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIFxuICAgICAgICAgICByZXN1bHQucmVsZXZhbmNlID0gbWF0Y2guZmlsdGVyKGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgICB9KS5sZW5ndGggKiAxMCArIHZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoO1xuICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgIHZhciBkZXRlY3RlZFBhdHRlcm4gPSBcIlwiO1xuICAgICAgICAgICBpZiAoIXBhdHRlcm4pIHtcbiAgICAgICAgICAgICBkZXRlY3RlZFBhdHRlcm4gPSBcIiNcIjtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICAvL2lmICh2YWx1ZSA+PSAxMDAwICYmIGludFN0cmluZy5pbmRleE9mKGFyZ3NbMF0pID49IDApIHtcbiAgICAgICAgICAgICAgIGRldGVjdGVkUGF0dGVybiA9IFwiIywjIyNcIjtcbiAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICBpZiAoZGVjU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgZGV0ZWN0ZWRQYXR0ZXJuKz0gXCIuXCIgKyAobmV3IEFycmF5KGRlY1N0cmluZy5sZW5ndGggKyAxKSkuam9pbiggXCIjXCIgKTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgaWYgKHVuaXRNYXRjaCAmJiB1bml0TWF0Y2ggPT09IFwiJVwiKSB7XG4gICAgICAgICAgICAgICBkZXRlY3RlZFBhdHRlcm4rPSBcIiVcIjtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgcmVzdWx0LnBhdHRlcm4gPSBkZXRlY3RlZFBhdHRlcm47XG4gICAgICAgICAgICAgXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICB9XG4gICAgIH1cbiAgICAgcmVzdWx0LnZhbHVlID0gdmFsdWU7XG4gICAgIHJldHVybiByZXN1bHQ7XG4gICB9KS5maWx0ZXIoZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgIHJldHVybiAhaXNOYU4ocmVzdWx0LnZhbHVlKTtcbiAgIH0pO1xuICAgXG4gICAvLyBVbmlxdWUgdmFsdWVzXG4gICB2YXIgZmlsdGVyZWRWYWx1ZXMgPSBbXTtcbiAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgaWYgKGZpbHRlcmVkVmFsdWVzLmluZGV4T2YocmVzdWx0LnZhbHVlKSA8IDApIHtcbiAgICAgICBmaWx0ZXJlZFZhbHVlcy5wdXNoKHJlc3VsdC52YWx1ZSk7XG4gICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgfVxuICAgfSk7XG4gICByZXN1bHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICByZXR1cm4gYS5yZWxldmFuY2UgPCBiLnJlbGV2YW5jZTtcbiAgIH0pO1xuXG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5cblxuLyogSW50ZXJmYWNlICovXG5mdW5jdGlvbiBuZm9ybWF0KG51bWJlciwgcGF0dGVybiwgbG9jYWxlKSB7XG4gIHJldHVybiBmb3JtYXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cbiBcbm5mb3JtYXQucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcsIHBhdHRlcm4sIGxvY2FsZSkge1xuICByZXR1cm4gZGV0ZWN0LmNhbGwodGhpcywgc3RyaW5nLCBwYXR0ZXJuLCBsb2NhbGUpLm1hcChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9KVswXTtcbn07XG5cbm5mb3JtYXQuZGV0ZWN0ID0gZnVuY3Rpb24obnVtYmVyLCBzdHJpbmcsIHBhdHRlcm4sIGxvY2FsZSkge1xuICBpZiAodHlwZW9mIG51bWJlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBDYW5ub3QgYWNjdXJhdGVseSBkZXRlcm1pbmUgcGF0dGVybiBhbmQgbG9jYWxlXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGRldGVjdC5jYWxsKHRoaXMsIHN0cmluZywgcGF0dGVybiwgbG9jYWxlKS5maWx0ZXIoZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBudW1iZXIgIT09ICdudW1iZXInIHx8IHJlc3VsdC52YWx1ZSA9PT0gbnVtYmVyO1xuICB9KS5tYXAoZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvY2FsZTogcmVzdWx0LmxvY2FsZSxcbiAgICAgIHBhdHRlcm46IHJlc3VsdC5wYXR0ZXJuXG4gICAgfTtcbiAgfSlbMF07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbmZvcm1hdDsiXX0=
