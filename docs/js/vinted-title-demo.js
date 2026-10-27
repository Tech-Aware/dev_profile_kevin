/* Interactive demonstration of the existing project's title rules.
 * Source: Tech-Aware/vinted-assistant-v1.0.0, commit 62d963a22302ca748693e796846c3bf1c00a3845.
 * TitleBuilder.gs and buildTitlePull from TitleEngine.gs are copied unchanged.
 * Demonstration data only. No AI request or photo analysis.
 */
(function () {
  'use strict';
  var Logger = { log: function () {} };
/**
 * TitleBuilder.gs - Fonctions utilitaires pour la construction des titres
 *
 * Port de domain/title_builder.py
 * Coupes normalisees en 3 categories : Skinny / Droit / Évasé
 */
var TitleBuilder = (function() {
  var SKU_PREFIX = '#';
  function normalizeStr(value) {
    if (value == null) return null;
    var s = String(value).trim();
    return s || null;
  }
  function normalizeFit(value) {
    if (!value) return null;
    var v = value.trim().toLowerCase();
    // Évasé first
    var evaseMarkers = ['bootcut', 'boot cut', 'flare', 'évasé', 'evase', 'curve', 'curvy', 'wide', 'baggy', 'loose', 'relaxed', 'barrel'];
    for (var k = 0; k < evaseMarkers.length; k++) {
      if (v.indexOf(evaseMarkers[k]) !== -1) return 'Évasé';
    }
    // Droit avant skinny/slim (pour capter "slim straight", "slim taper", etc.)
    var droitMarkers = ['straight', 'droit', 'mom', 'boyfriend', 'girlfriend', 'regular', 'tapered', 'taper'];
    for (var i = 0; i < droitMarkers.length; i++) {
      if (v.indexOf(droitMarkers[i]) !== -1) return 'Droit';
    }
    // Skinny / slim pur en dernier recours
    if (v.indexOf('slim') !== -1 || v.indexOf('skinny') !== -1) return 'Skinny';
    return value.trim();
  }
  function formatFitDisplay(fitOriginal, fitNormalized) {
    if (!fitNormalized) return null;
    // Règle stable : pour la coupe Droit, on affiche toujours
    // "Straight/Droit" afin de couvrir l'intention bilingue dans le titre,
    // les hashtags et la navigation Vinted, quel que soit fitOriginal.
    if (fitNormalized === 'Droit') return 'Straight/Droit';
    if (!fitOriginal) return fitNormalized;
    var standardLabels = ['skinny', 'droit', 'évasé'];
    var orig = fitOriginal.trim();
    if (standardLabels.indexOf(orig.toLowerCase()) !== -1) return fitNormalized;
    if (orig.toLowerCase() === fitNormalized.toLowerCase()) return fitNormalized;
    return orig + '/' + fitNormalized;
  }
  function sanitizeModelLabel(value) {
    if (!value) return null;
    var raw = value.trim();
    var fitMarkers = ['skinny', 'slim', 'straight', 'droit', 'boot', 'flare', 'évas', 'evase', 'curve', 'curvy', 'mom', 'boyfriend', 'girlfriend', 'wide', 'baggy', 'loose', 'relaxed', 'barrel', 'tapered', 'regular'];
    var dropMarkers = ['demi', 'cut'];
    var tokens = raw.replace(/[\/\-]/g, ' ').split(/\s+/);
    var cleaned = [];
    for (var i = 0; i < tokens.length; i++) {
      var tokenLow = tokens[i].toLowerCase();
      var isFit = fitMarkers.some(function(m) { return tokenLow.indexOf(m) !== -1; });
      var isDrop = dropMarkers.indexOf(tokenLow) !== -1;
      if (!isFit && !isDrop) {
        cleaned.push(tokens[i]);
      }
    }
    var result = cleaned.join(' ').trim();
    return result || null;
  }
  function normalizeGender(value) {
    if (!value) return null;
    var v = value.trim().toLowerCase();
    var female = ['f', 'femme', 'female', 'woman', 'women', 'girl'];
    var male = ['h', 'homme', 'male', 'man', 'men', 'boy'];
    if (female.indexOf(v) !== -1 || v.indexOf('fem') === 0 || v.indexOf('wom') === 0) return 'femme';
    if (male.indexOf(v) !== -1 || v.indexOf('hom') === 0 || v.indexOf('masc') === 0 || v.indexOf('men') === 0) return 'homme';
    return value.trim();
  }
  function safeJoin(parts) {
    return parts.filter(function(p) { return p && p.trim(); }).join(' ');
  }
  function normalizeGarmentType(value) {
    if (!value) return null;
    var low = value.trim().toLowerCase();
    if (low.indexOf('gilet') !== -1 || low.indexOf('cardi') !== -1) return 'Gilet';
    return 'Pull';
  }
  function formatColorsSegment(value) {
    if (!value) return null;
    var colors = [];
    if (Array.isArray(value)) { colors = value; } else { colors = String(value).replace(/\//g, ',').split(','); }
    var simplified = [];
    var seen = {};
    for (var i = 0; i < colors.length; i++) {
      var c = String(colors[i]).trim();
      if (!c) continue;
      var s = simplifyColorName_(c.toLowerCase());
      if (!s || seen[s]) continue;
      seen[s] = true;
      simplified.push(s);
    }
    if (simplified.length === 0) return null;
    if (simplified.length > 1) {
      simplified = simplified.filter(function(c) { return c !== 'multicolore'; });
      if (simplified.length === 0) simplified = ['multicolore'];
    }
    return simplified.slice(0, 2).join(', ');
  }
  function simplifyColorName_(color) {
    if (!color) return null;
    var base = color.trim().toLowerCase();
    var palettes = [
      [['bleu marine', 'navy', 'navy blue', 'marine'], 'marine'],
      [['bleu', 'blue', 'turquoise', 'petrole', 'pétrole', 'azur', 'cyan', 'ciel'], 'bleu'],
      [['noir', 'black'], 'noir'],
      [['blanc', 'white', 'ecru', 'écru', 'off-white', 'ivoire'], 'blanc'],
      [['gris', 'gray', 'grey', 'chiné', 'charcoal'], 'gris'],
      [['rouge', 'red', 'bordeaux'], 'rouge'],
      [['rose', 'pink', 'fuchsia'], 'rose'],
      [['vert', 'green', 'kaki', 'khaki', 'olive'], 'vert'],
      [['jaune', 'yellow', 'moutarde'], 'jaune'],
      [['orange', 'corail', 'coral'], 'orange'],
      [['beige', 'sable', 'sand', 'taupe'], 'beige'],
      [['marron', 'brown', 'chocolat'], 'marron'],
      [['violet', 'purple', 'lilas', 'lavande', 'prune'], 'violet']
    ];
    for (var i = 0; i < palettes.length; i++) {
      var keywords = palettes[i][0];
      var label = palettes[i][1];
      for (var j = 0; j < keywords.length; j++) {
        if (base.indexOf(keywords[j]) !== -1) return label;
      }
    }
    return base;
  }
  function formatMaterialSegment(material, cottonPercent, woolPercent) {
    var cottonValue = null;
    var woolValue = null;
    try { cottonValue = cottonPercent != null ? parseInt(cottonPercent) : null; } catch (e) {}
    try { woolValue = woolPercent != null ? parseInt(woolPercent) : null; } catch (e) {}
    var materialLabel = (material || '').trim().toLowerCase();
    var priorityMapping = {
      'cachemire': 'cachemire', 'cashmere': 'cachemire',
      'angora': 'angora', 'laine': 'laine', 'wool': 'laine',
      'lin': 'lin', 'linen': 'lin', 'satin': 'satin'
    };
    if (woolValue != null && woolValue > 0) return 'laine';
    for (var keyword in priorityMapping) {
      if (materialLabel.indexOf(keyword) !== -1) return priorityMapping[keyword];
    }
    if (cottonValue != null) {
      if (cottonValue >= 60) return cottonValue + '% coton';
      return 'coton';
    }
    if (materialLabel.indexOf('coton') !== -1 || materialLabel.indexOf('cotton') !== -1) return 'coton';
    return null;
  }
  function formatNeckline(neckline) {
    if (!neckline) return null;
    var neck = neckline.trim();
    if (neck.toLowerCase().indexOf('col') === 0) {
      var parts = neck.split(' ');
      neck = parts.length > 1 ? parts.slice(1).join(' ') : '';
    }
    neck = neck.trim();
    if (!neck) return null;
    return 'col ' + neck;
  }
  function normalizePullSize(value) {
    if (!value) return null;
    var raw = String(value).trim().toUpperCase().replace(/\s/g, '');
    if (raw.indexOf('/') !== -1) raw = raw.split('/')[0];
    if (raw.endsWith('P')) raw = raw.slice(0, -1);
    var numericMatch = raw.match(/^(\d+)X$/);
    if (numericMatch) {
      var count = parseInt(numericMatch[1]) + 1;
      return 'X'.repeat(count) + 'L';
    }
    if (raw === 'M') return 'M';
    var match = raw.match(/^(X{0,5})(S|L)$/);
    if (match) return match[1] + match[2];
    var allowed = ['XS', 'S', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXS', 'XXXXS'];
    if (allowed.indexOf(raw) !== -1) return raw;
    return raw || null;
  }
  function normalizeCarharttSize(value) {
    var raw = normalizeStr(value);
    if (!raw) return ['NC', 'nc'];
    var low = raw.toLowerCase().trim();
    var base = raw.toUpperCase();
    var sizeMap = {
      'xs': 'XS', 'extra small': 'XS', 'x-small': 'XS',
      'small': 'S', 's': 'S', 'medium': 'M', 'm': 'M',
      'large': 'L', 'l': 'L', 'x-large': 'XL', 'xl': 'XL',
      'xxl': 'XXL', '2xl': 'XXL', 'xxxl': 'XXXL', '3xl': 'XXXL'
    };
    // 1) Correspondance exacte d'abord (évite que "XL" soit reconnu comme "L"
    //    parce que la lettre 'l' apparaît dans "xl"). Indispensable pour les
    //    profils dont la grille de tailles va de XS à XXXL (short Adidas).
    if (sizeMap.hasOwnProperty(low)) {
      base = sizeMap[low];
    } else {
      // 2) Sinon, recherche par marqueur en testant des plus longs aux plus
      //    courts pour éviter les collisions ('xxxl' avant 'xxl' avant 'xl'
      //    avant 'l', 'x-large' avant 'large', 'extra small' avant 'small'…).
      var markers = Object.keys(sizeMap).sort(function(a, b) { return b.length - a.length; });
      for (var i = 0; i < markers.length; i++) {
        if (low.indexOf(markers[i]) !== -1) { base = sizeMap[markers[i]]; break; }
      }
    }
    var token = base.toLowerCase().replace(/\s/g, '') || 'nc';
    return [base, token];
  }
  function classifyRiseFromCm(riseCm) {
    if (riseCm == null) return null;
    var v;
    try { v = parseFloat(riseCm); } catch (e) { return null; }
    if (isNaN(v)) return null;
    if (v <= 20) return 'low';
    if (v >= 30) return 'high';
    return 'mid';
  }
  function normalizeRiseType(riseType, riseCm) {
    if (riseType) {
      var n = riseType.trim().toLowerCase();
      if (n.indexOf('basse') !== -1 || n.indexOf('low') !== -1) return 'low';
      if (n.indexOf('haute') !== -1 || n.indexOf('high') !== -1) return 'high';
      if (n.indexOf('moy') !== -1 || n.indexOf('mid') !== -1) return 'mid';
    }
    if (riseCm != null) return classifyRiseFromCm(riseCm);
    return null;
  }
  return {
    SKU_PREFIX: SKU_PREFIX,
    normalizeStr: normalizeStr,
    normalizeFit: normalizeFit,
    formatFitDisplay: formatFitDisplay,
    sanitizeModelLabel: sanitizeModelLabel,
    normalizeGender: normalizeGender,
    safeJoin: safeJoin,
    normalizeGarmentType: normalizeGarmentType,
    formatColorsSegment: formatColorsSegment,
    formatMaterialSegment: formatMaterialSegment,
    formatNeckline: formatNeckline,
    normalizePullSize: normalizePullSize,
    normalizeCarharttSize: normalizeCarharttSize,
    classifyRiseFromCm: classifyRiseFromCm,
    normalizeRiseType: normalizeRiseType
  };
})();

  function buildTitlePull(features) {
    try {
      var brand = TitleBuilder.normalizeStr(features.brand);
      var isVintage = features.is_vintage || false;
      if (!brand && !isVintage) isVintage = true;
      var garmentType = TitleBuilder.normalizeGarmentType(features.garment_type) || 'Pull';
      var rawGender = TitleBuilder.normalizeGender(TitleBuilder.normalizeStr(features.gender));
      var gender = 'femme';
      if (rawGender && rawGender.toLowerCase() !== 'femme') {
        // force femme
      } else if (rawGender) {
        gender = rawGender;
      }
      var size = TitleBuilder.normalizePullSize(TitleBuilder.normalizeStr(features.size));
      var neckline = TitleBuilder.formatNeckline(TitleBuilder.normalizeStr(features.neckline));
      var pattern = TitleBuilder.normalizeStr(features.pattern);
      var material = TitleBuilder.formatMaterialSegment(
        TitleBuilder.normalizeStr(features.material),
        features.cotton_percent,
        features.wool_percent
      );
      var colorsInput = features.main_colors || features.colors;
      var colorsSegment = TitleBuilder.formatColorsSegment(colorsInput);
      var sku = TitleBuilder.normalizeStr(features.sku);
      var skuStatus = TitleBuilder.normalizeStr(features.sku_status);
      var parts = [garmentType];
      var isPremium = features.is_premium || false;
      if (isVintage) {
        parts.push('Vintage');
      } else if (brand) {
        var brandFormatted = brand.toLowerCase().split(' ').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
        parts.push(brandFormatted);
        if (isPremium) parts.push('Premium');
      }
      if (gender) parts.push(gender);
      if (size) parts.push('taille ' + size);
      if (material) parts.push(material);
      if (colorsSegment) parts.push(colorsSegment);
      if (pattern) parts.push(pattern);
      if (neckline) parts.push(neckline);
      if (sku && skuStatus && skuStatus.toLowerCase() === 'ok') {
        parts.push(TitleBuilder.SKU_PREFIX + sku);
      }
      return TitleBuilder.safeJoin(parts);
    } catch (e) {
      Logger.log('buildTitlePull error: ' + e.message);
      return 'Pull Vintage';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var demo = document.querySelector('.title-demo');
    var fallback = document.querySelector('.demo-fallback');
    var garment = document.getElementById('demo-garment');
    var size = document.getElementById('demo-size');
    var color = document.getElementById('demo-color');
    var output = document.getElementById('demo-output');
    if (!demo || !fallback || !garment || !size || !color || !output) return;
    function updateTitle() {
      output.textContent = buildTitlePull({
        brand: 'Tommy Hilfiger', garment_type: garment.value,
        gender: 'femme', size: size.value, cotton_percent: 100,
        main_colors: [color.value], neckline: 'rond'
      });
    }
    updateTitle();
    demo.addEventListener('change', updateTitle);
    fallback.hidden = true;
    demo.hidden = false;
  });
})();
