const units = {
  angle: {
    'degree (°)': 1,
    'radian (rad)': 0.0174532925,
    'gradian (grad)': 1.111111,
    'minute of arc (′)': 0.0166666667,
    'second of arc (″)': 0.000277777778,
    'turn': 360,
    'revolution': 360
  },
  acceleration: {
    'meter per second squared (m/s²)': 1,
    'mile per second squared (mi/s²)': 1609.344,
    'mile per minute per second (mi/(min·s))': 26.8244,
    'mile per hour per second (mi/(h·s))': 0.44704,
    'knot per second (kn/s)': 0.5144444,
    'foot per second squared (ft/s²)': 0.3048,
    'foot per minute per second (ft/(min·s))': 0.00508,
    'foot per hour per second (ft/(h·s))': 0.0000846667,
    'inch per second squared (in/s²)': 0.0254,
    'inch per minute per second (in/(min·s))': 0.000423333,
    'inch per hour per second (in/(h·s))': 0.00000705556,
    'centimeter per second squared (cm/s²)': 0.01,
    'galileo (Gal)': 0.01,
    'gravity (gn)': 9.80665
  },
  power: {
    'watt (W)': 1,
    'milliwatt (mW)': 0.001,
    'kilowatt (kW)': 1000,
    'megawatt (MW)': 1000000,
    'horsepower (hp)': 745.699872,
    'metric horsepower (mhp)': 735.49875,
    'electrical horsepower (ehp)': 746,
    'boiler horsepower (bhp)': 9809.5,
    'joules per second (J/s)': 1,
    'calories per hour (cal/h)': 0.001163,
    'kilocalories per hour (kcal/h)': 1.163,
    'british thermal units per hour (BTU/h)': 0.29307107,
    'british thermal units per second (BTU/s)': 1055.06,
    'foot-pounds per second': 1.3558179483314,
    'foot-pounds per minute': 0.0225969658055233,
    'tons of refrigeration': 3516.85
  },
  torque: {
    'newton metre (N·m)': 1,
    'meganewton metre (MN·m)': 1000000,
    'kilonewton metre (kN·m)': 1000,
    'millinewton metre (mN·m)': 0.001,
    'micronewton metre (μN·m)': 0.000001,
    'dyne centimetre (dyn·cm)': 0.0000001,
    'gram-force centimetre (gf·cm)': 0.0000980665,
    'kilogram-force metre (kgf·m)': 9.80665,
    'kilopond metre (kp·m)': 9.80665,
    'pound-force foot (lbf·ft)': 1.3558179483314,
    'pound-force inch (lbf·in)': 0.112984829027617,
    'ounce-force foot (ozf·ft)': 0.0847385737520876,
    'ounce-force inch (ozf·in)': 0.00706154781267396,
    'foot-pound force (ft·lb)': 1.3558179483314,
    'centimetre kilogram-force': 0.0980665
  },
  time: {
    millisecond: 1,
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2629800000,
    year: 31557600000,
  },
  length: {
    nanometer: 0.000000001,
    micrometer: 0.000001,
    millimeter: 0.001,
    centimeter: 0.01,
    decimeter: 0.1,
    meter: 1,
    kilometer: 1000,
    thou: 0.0000254,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    fathom: 1.8288,
    chain: 20.1168,
    furlong: 201.168,
    mile: 1609.34,
    'cable length': 185.2,
    'nautical mile': 1852,
    'nautical league': 5556,
    'astronomical unit': 149597870700,
    'light year': 9460730472580800,
    parsec: 30856775812799588
  },
  weight: {
    milligram: 0.001,
    gram: 1,
    carat: 0.2,
    grain: 0.06479891,
    hectogram: 10,
    pennyweight: 1.55517384,
    ounce: 28.349523125,
    'troy ounce': 31.1034768,
    'troy pound': 373.2417216,
    pound: 453.59237,
    kilogram: 1000,
    stone: 6350.29,
    'hundredweight (US)': 45359.237,
    'hundredweight (UK)': 50802.34544,
    'metric ton': 1000000,
    'ton (US)': 907184.7,
    'ton (UK)': 1016047
  },
  temperature: {
    kelvin: 'kelvin',
    celsius: 'celsius',
    fahrenheit: 'fahrenheit',
    rankine: 'rankine',
    reaumur: 'reaumur',
    romer: 'romer'
  },
  volume: {
    milliliter: 0.001,
    'metric teaspoon': 0.005,
    'teaspoon (US)': 0.00492892,
    'teaspoon (UK)': 0.00591939,
    centiliter: 0.01,
    'tablespoon (US)': 0.0147868,
    'metric tablespoon': 0.015,
    'cubic inch': 0.016387064,
    'tablespoon (UK)': 0.0177582,
    'fluid ounce (UK)': 0.0284130625,
    'fluid ounce (US)': 0.0295735156,
    deciliter: 0.1,
    'cup (US)': 0.236588125,
    'pint (US)': 0.473176473,
    'pint dry (US)': 0.5506104713575,
    'pint (UK)': 0.56826125,
    'quart (US)': 0.946352946,
    'quart dry (US)': 1.101220942715,
    'quart (UK)': 1.1365225,
    liter: 1,
    'pottle (US)': 1.89270589,
    'gallon (US)': 3.78541,
    'gallon (UK)': 4.54609,
    'cubic foot': 28.316846592,
    barrel: 158.98722,
    'cubic yard': 764.554857984,
    'cubic meter': 1000,
    'acre-foot': 1233481.83754752
  },
  area: {
    'square millimeter': 0.000001,
    'square centimeter': 0.0001,
    'square inch': 0.00064516,
    'square foot': 0.092903,
    'square yard': 0.836127,
    'square meter': 1,
    are: 100,
    acre: 4046.8564224,
    hectare: 10000,
    'square kilometer': 1000000,
    'square mile': 2589988.110336,
    township: 93239571.972096
  },
  speed: {
    'inches per second': 0.00254,
    'kilometers per hour': 0.277778,
    'feet per second': 0.3048,
    'miles per hour': 0.44704,
    knot: 0.514444,
    'meters per second': 1,
    'speed of light': 299792458
  },
  energy: {
    joule: 1,
    'foot-pound': 1.3558179483,
    calorie: 4.184,
    kilojoule: 1000,
    'watt-hour': 3600,
    kilocalorie: 4184,
    'kilowatt-hour': 3600000
  },
  force: {
    dyne: 0.00001,
    poundal: 0.138254954376,
    newton: 1,
    'pound-force': 4.4482216152605,
    'kilogram-force': 9.80665,
    kilonewton: 1000,
    kip: 4448.2216152605
  },
  pressure: {
    pascal: 1,
    'centimeter of water': 98.0665,
    torr: 133.32236842,
    'millimeter of mercury': 133.322387415,
    'inch of water': 248.843,
    kilopascal: 1000,
    'inch of mercury': 3386.389,
    psi: 6894.7572932,
    bar: 100000,
    atmosphere: 101325
  },
  data: {
    'bit (b)': 1,
    'nibble': 4,
    'byte (B)': 8,
    'kilobit (kbit)': 1000,
    'kibibit (Kibit)': 1024,
    'kilobyte (kB)': 8000,
    'kibibyte (KiB)': 8192,
    'megabit (Mbit)': 1000000,
    'mebibit (Mibit)': 1048576,
    'megabyte (MB)': 8000000,
    'mebibyte (MiB)': 8388608,
    'gigabit (Gbit)': 1000000000,
    'gibibit (Gibit)': 1073741824,
    'gigabyte (GB)': 8000000000,
    'gibibyte (GiB)': 8589934592,
    'terabit (Tbit)': 1000000000000,
    'tebibit (Tibit)': 1099511627776,
    'terabyte (TB)': 8000000000000,
    'tebibyte (TiB)': 8796093022208,
    'petabit (Pbit)': 1000000000000000,
    'pebibit (Pibit)': 1125899906842624,
    'petabyte (PB)': 8000000000000000,
    'pebibyte (PiB)': 9007199254740992,
    'exabit (Ebit)': 1000000000000000000,
    'exbibit (Eibit)': 1152921504606846976,
    'exabyte (EB)': 8000000000000000000,
    'exbibyte (EiB)': 9223372036854775808,
    'zettabit (Zbit)': 1000000000000000000000,
    'zebibit (Zibit)': 1180591620717411303424,
    'zettabyte (ZB)': 8000000000000000000000,
    'zebibyte (ZiB)': 9444732965739290427392,
    'yottabit (Ybit)': 1000000000000000000000000,
    'yobibit (Yibit)': 1208925819614629174706176,
    'yottabyte (YB)': 8000000000000000000000000,
    'yobibyte (YiB)': 9671406556917033397649408
  },
  datatransfer: {
    'bit per second (b/s)': 1,
    'byte per second (B/s)': 8,
    'kilobit per second (kbit/s)': 1000,
    'kibibit per second (Kibit/s)': 1024,
    'kilobyte per second (kB/s)': 8000,
    'kibibyte per second (KiB/s)': 8192,
    'megabit per second (Mbit/s)': 1000000,
    'mebibit per second (Mibit/s)': 1048576,
    'megabyte per second (MB/s)': 8000000,
    'mebibyte per second (MiB/s)': 8388608,
    'gigabit per second (Gbit/s)': 1000000000,
    'gibibit per second (Gibit/s)': 1073741824,
    'gigabyte per second (GB/s)': 8000000000,
    'gibibyte per second (GiB/s)': 8589934592,
    'terabit per second (Tbit/s)': 1000000000000,
    'tebibit per second (Tibit/s)': 1099511627776,
    'terabyte per second (TB/s)': 8000000000000,
    'tebibyte per second (TiB/s)': 8796093022208
  }
};

const categorySelect = document.getElementById('category');
const valueInput = document.getElementById('value');
const fromUnitSelect = document.getElementById('fromUnit');
const clearButton = document.getElementById('clear');
const resultsDiv = document.getElementById('results');
const formulaDiv = document.getElementById('formula');

function formatNumber(num, maxDecimals = 6) {
  return parseFloat(num.toFixed(maxDecimals)).toString();
}

function parseFeetInches(input) {
  const patterns = [
    /^\s*(\d+(?:\.\d+)?)\s*['′]\s*(\d+(?:\.\d+)?)\s*["″]?\s*$/,
    /^\s*(\d+(?:\.\d+)?)\s*['′]\s*(\d+(?:\.\d+)?)\s*$/,
    /^\s*(\d+(?:\.\d+)?)\s*ft\s*(\d+(?:\.\d+)?)\s*in\s*$/i
  ];
  
  for (let pattern of patterns) {
    const match = input.trim().match(pattern);
    if (match) {
      const feet = parseFloat(match[1]);
      const inches = parseFloat(match[2]);
      return feet + (inches / 12);
    }
  }
  
  return null;
}

function metersToFeetInches(meters) {
  const totalFeet = meters / 0.3048;
  const feet = Math.floor(totalFeet);
  const inches = Math.round((totalFeet - feet) * 12);
  return `${feet}' ${inches}"`;
}

function formatTimeComponents(milliseconds) {
  if (milliseconds < 1000) {
    return '';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  
  let remaining = milliseconds;
  const parts = [];
  
  const years = Math.floor(remaining / 31557600000);
  if (years > 0) {
    parts.push(`${years}y`);
    remaining -= years * 31557600000;
  }
  
  const months = Math.floor(remaining / 2629800000);
  if (months > 0) {
    parts.push(`${months}mo`);
    remaining -= months * 2629800000;
  }
  
  const weeks = Math.floor(remaining / 604800000);
  if (weeks > 0) {
    parts.push(`${weeks}w`);
    remaining -= weeks * 604800000;
  }
  
  const days = Math.floor(remaining / 86400000);
  if (days > 0) {
    parts.push(`${days}d`);
    remaining -= days * 86400000;
  }
  
  const hours = Math.floor(remaining / 3600000);
  if (hours > 0) {
    parts.push(`${hours}h`);
    remaining -= hours * 3600000;
  }
  
  const minutes = Math.floor(remaining / 60000);
  if (minutes > 0) {
    parts.push(`${minutes}m`);
    remaining -= minutes * 60000;
  }
  
  const seconds = Math.floor(remaining / 1000);
  if (seconds > 0) {
    parts.push(`${seconds}s`);
    remaining -= seconds * 1000;
  }
  
  const ms = Math.floor(remaining);
  if (ms > 0) {
    parts.push(`${ms}ms`);
  }
  
  return parts.join(' ');
}

function convertTemperature(value, fromUnit, toUnit) {
  let celsius;
  
  if (fromUnit === 'celsius') {
    celsius = value;
  } else if (fromUnit === 'fahrenheit') {
    celsius = (value - 32) * 5/9;
  } else if (fromUnit === 'kelvin') {
    celsius = value - 273.15;
  } else if (fromUnit === 'rankine') {
    celsius = (value - 491.67) * 5/9;
  } else if (fromUnit === 'reaumur') {
    celsius = value * 1.25;
  } else if (fromUnit === 'romer') {
    celsius = (value - 7.5) * 40/21;
  }
  
  if (toUnit === 'celsius') {
    return celsius;
  } else if (toUnit === 'fahrenheit') {
    return celsius * 9/5 + 32;
  } else if (toUnit === 'kelvin') {
    return celsius + 273.15;
  } else if (toUnit === 'rankine') {
    return celsius * 9/5 + 491.67;
  } else if (toUnit === 'reaumur') {
    return celsius * 0.8;
  } else if (toUnit === 'romer') {
    return celsius * 21/40 + 7.5;
  }
}

function getTemperatureFormula(fromUnit, toUnit) {
  const formulas = {
    'celsius-fahrenheit': '°F = (°C × 9/5) + 32',
    'fahrenheit-celsius': '°C = (°F - 32) × 5/9',
    'celsius-kelvin': 'K = °C + 273.15',
    'kelvin-celsius': '°C = K - 273.15',
    'fahrenheit-kelvin': 'K = (°F - 32) × 5/9 + 273.15',
    'kelvin-fahrenheit': '°F = (K - 273.15) × 9/5 + 32',
    'celsius-rankine': '°Ra = °C × 9/5 + 491.67',
    'rankine-celsius': '°C = (°Ra - 491.67) × 5/9',
    'celsius-reaumur': '°Ré = °C × 0.8',
    'reaumur-celsius': '°C = °Ré × 1.25',
    'celsius-romer': '°Rø = °C × 21/40 + 7.5',
    'romer-celsius': '°C = (°Rø - 7.5) × 40/21'
  };
  return formulas[`${fromUnit}-${toUnit}`] || '';
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyFraction(numerator, denominator) {
  if (denominator === 0) return { numerator: 0, denominator: 1, whole: 0 };
  
  const sign = (numerator * denominator < 0) ? -1 : 1;
  numerator = Math.abs(numerator);
  denominator = Math.abs(denominator);
  
  const whole = Math.floor(numerator / denominator);
  numerator = numerator % denominator;
  
  if (numerator === 0) {
    return { numerator: 0, denominator: 1, whole: sign * whole };
  }
  
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  
  return { 
    numerator: sign * numerator, 
    denominator: denominator, 
    whole: sign * whole 
  };
}

function parseFraction(str) {
  str = str.trim();
  
  const mixedPattern = /^(-?\d+)\s+(\d+)\/(\d+)$/;
  const mixedMatch = str.match(mixedPattern);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const num = parseInt(mixedMatch[2]);
    const den = parseInt(mixedMatch[3]);
    const sign = whole < 0 ? -1 : 1;
    return {
      numerator: sign * (Math.abs(whole) * den + num),
      denominator: den
    };
  }
  
  const fractionPattern = /^(-?\d+)\/(\d+)$/;
  const fractionMatch = str.match(fractionPattern);
  if (fractionMatch) {
    return {
      numerator: parseInt(fractionMatch[1]),
      denominator: parseInt(fractionMatch[2])
    };
  }
  
  const decimalPattern = /^-?\d*\.?\d+$/;
  if (decimalPattern.test(str)) {
    const num = parseFloat(str);
    const decimalStr = str.includes('.') ? str.split('.')[1] : '';
    const decimalPlaces = decimalStr.length;
    const denominator = Math.pow(10, decimalPlaces);
    return {
      numerator: Math.round(num * denominator),
      denominator: denominator
    };
  }
  
  return null;
}

function addFractions(f1, f2) {
  const numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
}

function subtractFractions(f1, f2) {
  const numerator = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
}

function multiplyFractions(f1, f2) {
  const numerator = f1.numerator * f2.numerator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
}

function divideFractions(f1, f2) {
  const numerator = f1.numerator * f2.denominator;
  const denominator = f1.denominator * f2.numerator;
  return simplifyFraction(numerator, denominator);
}

function formatFraction(frac) {
  const decimal = (frac.whole * frac.denominator + frac.numerator) / frac.denominator;
  const improperNumerator = frac.whole * frac.denominator + frac.numerator;
  
  if (frac.numerator === 0) {
    return `${frac.whole} or ${formatNumber(decimal)}`;
  }
  
  const improperDisplay = `<span class="fraction-display"><sup>${improperNumerator}</sup><span class="fraction-line"></span><sub>${frac.denominator}</sub></span>`;
  
  if (frac.whole === 0) {
    return `${improperDisplay} or ${formatNumber(decimal)}`;
  }
  
  const mixedDisplay = `${frac.whole} <span class="fraction-display"><sup>${Math.abs(frac.numerator)}</sup><span class="fraction-line"></span><sub>${frac.denominator}</sub></span>`;
  
  return `${mixedDisplay} = ${improperDisplay} or ${formatNumber(decimal)}`;
}

function calculateFraction() {
  const input = document.getElementById('fractionInput').value.trim();
  const resultsDiv = document.getElementById('fractionResults');
  
  if (!input) {
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('show');
    return;
  }
  
  const singleFrac = parseFraction(input);
  if (singleFrac && !input.match(/[+\-x×*÷\/\/]/)) {
    const result = simplifyFraction(singleFrac.numerator, singleFrac.denominator);
    resultsDiv.innerHTML = `
      <div class="fraction-result">
        <div class="result-label">Result:</div>
        <div class="result-value">${formatFraction(result)}</div>
      </div>
    `;
    resultsDiv.classList.add('show');
    return;
  }
  
  const tokens = input.split(/(\s*[+\-x×*÷]\s*|\/\/)/);
  const cleanTokens = tokens.filter(t => t.trim() !== '');
  
  if (cleanTokens.length < 3) {
    resultsDiv.innerHTML = `
      <div class="fraction-result error">
        Invalid input. Examples: 3/4, 3/4 + 5/6, 3/4 // 5/6, 5 2/3 x 3 4/3
      </div>
    `;
    resultsDiv.classList.add('show');
    return;
  }
  
  let result = parseFraction(cleanTokens[0]);
  if (!result) {
    resultsDiv.innerHTML = `
      <div class="fraction-result error">
        Invalid input. Examples: 3/4, 3/4 + 5/6, 3/4 // 5/6, 5 2/3 x 3 4/3
      </div>
    `;
    resultsDiv.classList.add('show');
    return;
  }
  
  result = simplifyFraction(result.numerator, result.denominator);
  
  for (let i = 1; i < cleanTokens.length; i += 2) {
    const operator = cleanTokens[i].trim();
    const nextFrac = parseFraction(cleanTokens[i + 1]);
    
    if (!nextFrac) {
      resultsDiv.innerHTML = `
        <div class="fraction-result error">
          Invalid input. Examples: 3/4, 3/4 + 5/6, 3/4 // 5/6, 5 2/3 x 3 4/3
        </div>
      `;
      resultsDiv.classList.add('show');
      return;
    }
    
    const f1 = {
      numerator: result.whole * result.denominator + result.numerator,
      denominator: result.denominator
    };
    
    if (operator === '+') {
      result = addFractions(f1, nextFrac);
    } else if (operator === '-') {
      result = subtractFractions(f1, nextFrac);
    } else if (operator === 'x' || operator === '×' || operator === '*') {
      result = multiplyFractions(f1, nextFrac);
    } else if (operator === '÷' || operator === '//') {
      result = divideFractions(f1, nextFrac);
    }
  }
  
  resultsDiv.innerHTML = `
    <div class="fraction-result">
      <div class="result-label">Result:</div>
      <div class="result-value">${formatFraction(result)}</div>
    </div>
  `;
  resultsDiv.classList.add('show');
}

function calculateTipAmount() {
  const subtotalInput = parseFloat(document.getElementById('subtotalInput').value) || 0;
  const totalBillInput = parseFloat(document.getElementById('totalBill').value) || 0;
  const taxRateInput = parseFloat(document.getElementById('taxRate').value) || 0;
  const taxAmountInput = parseFloat(document.getElementById('taxAmount').value) || 0;
  const tipPercent = parseFloat(document.getElementById('tipPercent').value) || 0;
  const splitCount = parseInt(document.getElementById('splitCount').value) || 1;
  const doNotTipOnTax = document.getElementById('doNotTipOnTax').checked;
  const roundUp = document.getElementById('roundUp').checked;
  
  let subtotal = subtotalInput;
  let taxAmount = taxAmountInput;
  let taxRate = taxRateInput;
  let totalBill = totalBillInput;
  
  if (subtotalInput > 0 && taxRateInput > 0 && taxAmountInput === 0) {
    taxAmount = (subtotalInput * taxRateInput) / 100;
    document.getElementById('taxAmount').value = taxAmount.toFixed(2);
  }
  
  if (subtotalInput > 0 && taxAmountInput > 0 && taxRateInput === 0) {
    taxRate = (taxAmountInput / subtotalInput) * 100;
    document.getElementById('taxRate').value = taxRate.toFixed(3);
  }
  
  if (subtotalInput > 0 && (taxAmountInput > 0 || taxRateInput > 0) && totalBillInput === 0) {
    if (taxAmountInput === 0 && taxRateInput > 0) {
      taxAmount = (subtotalInput * taxRateInput) / 100;
    }
    totalBill = subtotalInput + taxAmount;
    document.getElementById('totalBill').value = totalBill.toFixed(2);
  }
  
  if (totalBillInput > 0 && taxAmountInput > 0 && subtotalInput === 0) {
    subtotal = totalBillInput - taxAmountInput;
    document.getElementById('subtotalInput').value = subtotal.toFixed(2);
    if (subtotal > 0) {
      taxRate = (taxAmountInput / subtotal) * 100;
      document.getElementById('taxRate').value = taxRate.toFixed(3);
    }
  }
  
  if (totalBillInput > 0 && subtotalInput > 0 && taxAmountInput === 0) {
    taxAmount = totalBillInput - subtotalInput;
    document.getElementById('taxAmount').value = taxAmount.toFixed(2);
    if (subtotalInput > 0) {
      taxRate = (taxAmount / subtotalInput) * 100;
      document.getElementById('taxRate').value = taxRate.toFixed(3);
    }
  }
  
  if (totalBill === 0 && subtotal === 0) {
    document.getElementById('tipResults').innerHTML = '';
    document.getElementById('tipResults').classList.remove('show');
    return;
  }
  
  if (totalBill === 0) {
    totalBill = subtotal + taxAmount;
  }
  if (subtotal === 0) {
    subtotal = totalBill - taxAmount;
  }
  
  if (taxRate === 0 && subtotal > 0 && taxAmount > 0) {
    taxRate = (taxAmount / subtotal) * 100;
  }
  
  let tipBase = doNotTipOnTax ? subtotal : totalBill;
  let tipAmount = (tipBase * tipPercent) / 100;
  let totalWithTip = totalBill + tipAmount;
  
  let roundingAmount = 0;
  if (roundUp) {
    const rounded = Math.ceil(totalWithTip);
    roundingAmount = rounded - totalWithTip;
    totalWithTip = rounded;
  }
  
  const tipPerPerson = tipAmount / splitCount;
  const totalPerPerson = totalWithTip / splitCount;
  
  let resultsHTML = '<div class="tip-results-content">';
  
  if (splitCount > 1) {
    resultsHTML += `
      <div class="answer-section">
        <div class="answer-item">
          <span>Tip Each Person:</span>
          <span class="amount">$ ${tipPerPerson.toFixed(2)}</span>
        </div>
        <div class="answer-item">
          <span>Total Each Person:</span>
          <span class="amount">$ ${totalPerPerson.toFixed(2)}</span>
        </div>
      </div>
      <div class="divider"></div>
    `;
  }
  
  resultsHTML += `
    <div class="summary-item">
      <span>Tip Total:</span>
      <span class="amount">$ ${tipAmount.toFixed(2)}</span>
    </div>
    <div class="summary-item">
      <span>Total (Bill + Tip):</span>
      <span class="amount">$ ${totalWithTip.toFixed(2)}</span>
    </div>
    <div class="divider"></div>
    <div class="calculation-summary">
      <div class="calc-item">
        <span>Subtotal:</span>
        <span class="amount">$ ${subtotal.toFixed(2)}</span>
      </div>
      <div class="calc-item">
        <span>+ Tax:</span>
        <span class="amount">$ ${taxAmount.toFixed(2)}</span>
      </div>
      <div class="calc-item">
        <span>Tax Rate:</span>
        <span class="amount">${taxRate.toFixed(3)}%</span>
      </div>
      <div class="calc-divider"></div>
      <div class="calc-item">
        <span>Total Bill:</span>
        <span class="amount">$ ${totalBill.toFixed(2)}</span>
      </div>
      <div class="calc-divider"></div>
      <div class="calc-item">
        <span>+ Tip on ${doNotTipOnTax ? 'Subtotal' : 'Total'}:</span>
        <span class="amount">$ ${tipAmount.toFixed(2)}</span>
      </div>
  `;
  
  if (roundUp && roundingAmount > 0) {
    resultsHTML += `
      <div class="calc-item">
        <span>+ Rounding:</span>
        <span class="amount">$ ${roundingAmount.toFixed(2)}</span>
      </div>
    `;
  }
  
  resultsHTML += `
      <div class="calc-divider"></div>
      <div class="calc-item total">
        <span>Total Amount:</span>
        <span class="amount">$ ${totalWithTip.toFixed(2)}</span>
      </div>
    </div>
  `;
  
  resultsHTML += '</div>';
  
  document.getElementById('tipResults').innerHTML = resultsHTML;
  document.getElementById('tipResults').classList.add('show');
}

function clearTipCalculator() {
  document.getElementById('subtotalInput').value = '';
  document.getElementById('totalBill').value = '';
  document.getElementById('taxRate').value = '';
  document.getElementById('taxAmount').value = '';
  document.getElementById('tipPercent').value = '15';
  document.getElementById('splitCount').value = '1';
  document.getElementById('doNotTipOnTax').checked = false;
  document.getElementById('roundUp').checked = false;
  document.getElementById('tipResults').innerHTML = '';
  document.getElementById('tipResults').classList.remove('show');
  document.getElementById('subtotalInput').focus();
}

let calcCurrentValue = '0';
let calcPreviousValue = '';
let calcOperation = null;
let calcWaitingForOperand = false;

function updateCalcDisplay(value) {
  document.getElementById('calcDisplay').value = value;
}

function clearCalc() {
  calcCurrentValue = '0';
  calcPreviousValue = '';
  calcOperation = null;
  calcWaitingForOperand = false;
  updateCalcDisplay(calcCurrentValue);
  document.getElementById('calcInput').value = '';
}

function inputDigit(digit) {
  if (calcWaitingForOperand) {
    calcCurrentValue = String(digit);
    calcWaitingForOperand = false;
  } else {
    const parsed = parseScientificNotation(calcCurrentValue);
    if (parsed !== null) {
      calcCurrentValue = String(parsed) + digit;
    } else {
      calcCurrentValue = calcCurrentValue === '0' ? String(digit) : calcCurrentValue + digit;
    }
  }
  updateCalcDisplay(calcCurrentValue);
}

function inputDecimal() {
  if (calcWaitingForOperand) {
    calcCurrentValue = '0.';
    calcWaitingForOperand = false;
  } else if (calcCurrentValue.indexOf('.') === -1) {
    calcCurrentValue += '.';
  }
  updateCalcDisplay(calcCurrentValue);
}

function toggleSign() {
  const value = parseFloat(calcCurrentValue);
  calcCurrentValue = String(value * -1);
  updateCalcDisplay(calcCurrentValue);
}

function inputPercent() {
  const value = parseFloat(calcCurrentValue);
  
  if (calcOperation && calcPreviousValue !== '') {
    const prev = parseFloat(calcPreviousValue);
    
    if (calcOperation === 'add' || calcOperation === 'subtract') {
      calcCurrentValue = String(prev * (value / 100));
    } else if (calcOperation === 'multiply' || calcOperation === 'divide') {
      calcCurrentValue = String(value / 100);
    }
  } else {
    calcCurrentValue = String(value / 100);
  }
  
  updateCalcDisplay(calcCurrentValue);
}

function inputPi() {
  calcCurrentValue = String(Math.PI);
  calcWaitingForOperand = true;
  updateCalcDisplay(calcCurrentValue);
}

function calculateSquareRoot() {
  const value = parseFloat(calcCurrentValue);
  if (value < 0) {
    calcCurrentValue = 'Error';
  } else {
    calcCurrentValue = String(Math.sqrt(value));
  }
  calcWaitingForOperand = true;
  updateCalcDisplay(calcCurrentValue);
}

function roundToDecimals(decimals) {
  const value = parseFloat(calcCurrentValue);
  calcCurrentValue = String(value.toFixed(decimals));
  updateCalcDisplay(calcCurrentValue);
}

function performOperation(nextOperation) {
  let inputValue = parseFloat(calcCurrentValue);
  
  const sciValue = parseScientificNotation(calcCurrentValue);
  if (sciValue !== null) {
    inputValue = sciValue;
  }

  if (calcPreviousValue === '') {
    calcPreviousValue = inputValue;
  } else if (calcOperation) {
    let currentValue = calcPreviousValue;
    const newValue = inputValue;
    let result;

    switch (calcOperation) {
      case 'add':
        result = currentValue + newValue;
        break;
      case 'subtract':
        result = currentValue - newValue;
        break;
      case 'multiply':
        result = currentValue * newValue;
        break;
      case 'divide':
        result = newValue === 0 ? 'Error' : currentValue / newValue;
        break;
      case 'power':
        result = Math.pow(currentValue, newValue);
        break;
      default:
        return;
    }

    if (result === 'Error' || !isFinite(result)) {
      calcCurrentValue = 'Error';
      calcPreviousValue = '';
      calcOperation = null;
      calcWaitingForOperand = false;
      updateCalcDisplay(calcCurrentValue);
      return;
    }

    calcCurrentValue = String(result);
    calcPreviousValue = result;
  }

  calcWaitingForOperand = true;
  calcOperation = nextOperation;
  updateCalcDisplay(calcCurrentValue);
}

let tapeEntries = [];
let tapeTotal = 0;
let tapeMode = 'off';

function updateTapeDisplay() {
  const tapeDisplay = document.getElementById('tapeDisplay');
  const tapeEntriesDiv = document.getElementById('tapeEntries');
  const tapeTotalSpan = document.getElementById('tapeTotal');
  
  if (tapeMode === 'off') {
      tapeDisplay.style.display = 'none';
      updateLastTapeEntry();
      return;
  }
  
  tapeDisplay.style.display = 'block';
  
  let maxDecimals = Math.max(2, getMaxDecimalPlaces());
  maxDecimals = Math.min(maxDecimals, 6);
  
  tapeEntriesDiv.innerHTML = '';
  
  tapeEntries.forEach((entry, index) => {
      const entryDiv = document.createElement('div');
      entryDiv.className = `tape-entry ${index % 2 === 0 ? 'row-dark' : 'row-gray'}`;
      
      const opSymbol = {
          'add': '+',
          'subtract': '-',
          'multiply': '×',
          'divide': '÷'
      }[entry.operation] || entry.operation;
      
      const isSubtraction = entry.operation === 'subtract';
      const valueClass = isSubtraction ? 'tape-entry-value negative' : 'tape-entry-value';
      
      const roundedValue = Math.round(entry.value * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
      const roundedSubtotal = Math.round(entry.subtotal * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
      
      const displayValue = isSubtraction 
          ? `-${roundedValue.toFixed(maxDecimals)}` 
          : roundedValue.toFixed(maxDecimals);
      
      const subtotalClass = entry.subtotal < 0 ? 'tape-entry-subtotal negative' : 'tape-entry-subtotal';
      
      entryDiv.innerHTML = `
          <div class="tape-entry-num">${index + 1}.</div>
          <div class="tape-entry-op">${opSymbol}</div>
          <div class="${valueClass}">${displayValue}</div>
          <div class="${subtotalClass}">${roundedSubtotal.toFixed(maxDecimals)}</div>
      `;
      
      tapeEntriesDiv.appendChild(entryDiv);
  });
  
  const roundedTotal = Math.round(tapeTotal * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  tapeTotalSpan.textContent = roundedTotal.toFixed(maxDecimals);
  
  if (tapeTotal < 0) {
      tapeTotalSpan.style.color = '#ff4444';
  } else {
      tapeTotalSpan.style.color = 'var(--accent-color)';
  }
  
  updateLastTapeEntry();
}

async function loadTapeFromStorage() {
  try {
    const result = await browser.storage.local.get(['tapeEntries', 'tapeTotal', 'tapeMode']);
    
    if (result.tapeEntries && result.tapeEntries.length > 0) {
      tapeEntries = result.tapeEntries;
      tapeTotal = result.tapeTotal || 0;
      
      if (result.tapeMode && result.tapeMode !== 'off') {
        const tapeModeSelect = document.getElementById('tapeMode');
        if (tapeModeSelect) {
          tapeModeSelect.value = result.tapeMode;
          tapeMode = result.tapeMode;
          updateOperatorHighlight();
        }
      }
      
      updateTapeDisplay();
      updateLastTapeEntry();
    }
  } catch (e) {
    console.error('Error loading tape:', e);
  }
}

async function saveTapeToStorage() {
  try {
    await browser.storage.local.set({
      tapeEntries: tapeEntries,
      tapeTotal: tapeTotal,
      tapeMode: tapeMode
    });
  } catch (e) {
    console.error('Error saving tape:', e);
  }
}

function addTapeEntry(operation, value) {
  if (tapeEntries.length >= 300) {
      alert('Tape limit of 300 entries reached. Please reset.');
      return;
  }
  
  let newSubtotal = tapeTotal;
  
  switch (operation) {
      case 'add':
          newSubtotal += value;
          break;
      case 'subtract':
          newSubtotal -= value;
          break;
      case 'multiply':
          newSubtotal *= value;
          break;
      case 'divide':
          if (value !== 0) {
              newSubtotal /= value;
          } else {
              newSubtotal = 0;
          }
          break;
  }
  
  tapeTotal = newSubtotal;
  
  tapeEntries.push({
      operation: operation,
      value: value,
      subtotal: tapeTotal
  });
  
  saveTapeToStorage();
  
  updateTapeDisplay();
  updateCalcDisplay(String(tapeTotal));
  updateLastTapeEntry();
}

function getMaxDecimalPlaces() {
  let maxDecimals = 0;
  
  tapeEntries.forEach(entry => {
      const valueStr = entry.value.toString();
      const subtotalStr = entry.subtotal.toString();
      
      if (valueStr.includes('.')) {
          const decimals = valueStr.split('.')[1].length;
          maxDecimals = Math.max(maxDecimals, decimals);
      }
      
      if (subtotalStr.includes('.')) {
          const decimals = subtotalStr.split('.')[1].length;
          maxDecimals = Math.max(maxDecimals, decimals);
      }
  });
  
  return maxDecimals;
}

function updateLastTapeEntry() {
  const lastEntryEl = document.getElementById('lastTapeEntry');
  
  if (!lastEntryEl) return;
  
  if (tapeMode === 'off' || tapeEntries.length === 0) {
      lastEntryEl.textContent = '';
      return;
  }
  
  const lastEntry = tapeEntries[tapeEntries.length - 1];
  const entryNum = tapeEntries.length;
  const maxDecimals = Math.max(2, getMaxDecimalPlaces());
  
  const opSymbol = {
      'add': '+',
      'subtract': '-',
      'multiply': '×',
      'divide': '÷'
  }[lastEntry.operation] || lastEntry.operation;
  
  const valueStr = lastEntry.operation === 'subtract' 
      ? `-${lastEntry.value.toFixed(maxDecimals)}`
      : lastEntry.value.toFixed(maxDecimals);
  
  lastEntryEl.textContent = `${entryNum}. ${opSymbol} ${valueStr}`;
}

function resetTape() {
  tapeEntries = [];
  tapeTotal = 0;
  
  browser.storage.local.set({ 
    tapeEntries: [], 
    tapeTotal: 0,
    tapeMode: 'off'
  }).catch(e => console.error('Error clearing tape:', e));
  
  const tapeModeSelect = document.getElementById('tapeMode');
  if (tapeModeSelect) {
    tapeModeSelect.value = 'off';
    tapeMode = 'off';
  }
  
  updateTapeDisplay();
  updateOperatorHighlight();
  calcCurrentValue = '0';
  updateCalcDisplay(calcCurrentValue);
}

function updateOperatorHighlight() {
  document.querySelectorAll('.calc-btn.operator').forEach(btn => {
    btn.classList.remove('tape-active');
  });
  
  document.querySelectorAll('.calc-btn[data-action="equals"]').forEach(btn => {
    btn.classList.remove('tape-active');
  });
  
  document.querySelectorAll('.calc-btn[data-value="."]').forEach(btn => {
    btn.classList.remove('tape-active');
  });
  
  if (tapeMode === 'add') {
    document.querySelector('[data-action="add"]').classList.add('tape-active');
  } else if (tapeMode === 'subtract') {
    document.querySelector('[data-action="subtract"]').classList.add('tape-active');
  } else if (tapeMode === 'multiply') {
    document.querySelector('[data-action="multiply"]').classList.add('tape-active');
  } else if (tapeMode === 'divide') {
    document.querySelector('[data-action="divide"]').classList.add('tape-active');
  } else if (tapeMode === 'auto') {
    document.querySelector('[data-action="equals"]').classList.add('tape-active');
  } else if (tapeMode === 'autodecimal') {
    document.querySelector('[data-action="equals"]').classList.add('tape-active');
    document.querySelector('[data-value="."]').classList.add('tape-active');
  }
}

function getPrimeFactors(n) {
  const factors = [];
  let divisor = 2;
  
  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  
  return factors;
}

function getAllFactors(n) {
  const factors = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) {
        factors.push(n / i);
      }
    }
  }
  return factors.sort((a, b) => a - b);
}

function getPrimeFactorsWithExponents(factors) {
  const countMap = {};
  factors.forEach(factor => {
    countMap[factor] = (countMap[factor] || 0) + 1;
  });
  
  return Object.entries(countMap).map(([prime, count]) => ({
    prime: parseInt(prime),
    count: count
  }));
}

function formatExponential(factorsWithExp) {
  return factorsWithExp.map(({prime, count}) => {
    if (count === 1) {
      return `${prime}`;
    } else {
      return `${prime}<sup>${count}</sup>`;
    }
  }).join(' × ');
}

function getGCF(numbers) {
  if (numbers.length === 0) return null;
  if (numbers.length === 1) return numbers[0];
  
  const allFactorizations = numbers.map(n => getPrimeFactors(n));
  
  const commonFactors = [];
  const firstFactorization = allFactorizations[0];
  
  for (let factor of firstFactorization) {
    let appearsInAll = true;
    const tempFactorizations = allFactorizations.map(f => [...f]);
    
    for (let i = 0; i < tempFactorizations.length; i++) {
      const index = tempFactorizations[i].indexOf(factor);
      if (index === -1) {
        appearsInAll = false;
        break;
      }
      tempFactorizations[i].splice(index, 1);
    }
    
    if (appearsInAll) {
      commonFactors.push(factor);
      for (let i = 0; i < allFactorizations.length; i++) {
        const index = allFactorizations[i].indexOf(factor);
        if (index !== -1) {
          allFactorizations[i].splice(index, 1);
        }
      }
    }
  }
  
  if (commonFactors.length === 0) return 1;
  
  return commonFactors.reduce((a, b) => a * b, 1);
}

function getLCM(numbers) {
  const allPrimeFactorizations = numbers.map(n => getPrimeFactorsWithExponents(getPrimeFactors(n)));
  
  const primeMap = {};
  
  allPrimeFactorizations.forEach(factorization => {
    factorization.forEach(({prime, count}) => {
      if (!primeMap[prime] || primeMap[prime] < count) {
        primeMap[prime] = count;
      }
    });
  });
  
  const sortedPrimes = Object.keys(primeMap).map(p => parseInt(p)).sort((a, b) => a - b);
  
  const formulaParts = sortedPrimes.map(prime => {
    const count = primeMap[prime];
    return `${prime}<sup>${count}</sup>`;
  });
  
  let lcmValue = 1;
  sortedPrimes.forEach(prime => {
    lcmValue *= Math.pow(prime, primeMap[prime]);
  });
  
  return {
    formula: formulaParts.join(' × ') + ` = ${lcmValue}`,
    value: lcmValue
  };
}

function calculatePrimeFactorization() {
  const input = document.getElementById('primeInput').value.trim();
  const resultsDiv = document.getElementById('primeResults');
  
  if (!input) {
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('show');
    return;
  }
  
  let numbers = [];
  
  if (input.includes(',')) {
    numbers = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
  } else {
    numbers = input.split(/\s+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
  }
  
  if (numbers.length === 0) {
    resultsDiv.innerHTML = '<div class="prime-section"><div class="prime-label" style="color: #ff6b6b;">Please enter valid positive integers.</div></div>';
    resultsDiv.classList.add('show');
    return;
  }
  
  let html = '';
  
  numbers.forEach(num => {
    const primeFactors = getPrimeFactors(num);
    const allFactors = getAllFactors(num);
    const factorsWithExp = getPrimeFactorsWithExponents(primeFactors);
    const uniquePrimes = [...new Set(primeFactors)];
    
    html += `<div class="prime-section">`;
    html += `<div class="prime-number-title">Number: ${num}</div>`;
    
    html += `<div class="prime-item">`;
    html += `<span class="prime-label">Prime Factorization:</span>`;
    html += `<span class="prime-value">${primeFactors.join(' × ')}</span>`;
    html += `</div>`;
    
    html += `<div class="prime-item">`;
    html += `<span class="prime-label">Exponential Form:</span>`;
    html += `<span class="prime-value">${formatExponential(factorsWithExp)}</span>`;
    html += `</div>`;
    
    html += `<div class="prime-item">`;
    html += `<span class="prime-label">All Factors:</span>`;
    html += `<span class="prime-value">${allFactors.join(', ')}</span>`;
    html += `</div>`;
    
    html += `<div class="prime-item">`;
    html += `<span class="prime-label">Unique Prime Factors:</span>`;
    uniquePrimes.forEach((prime, index) => {
      html += `<span class="prime-value">Prime[${index + 1}] = ${prime}</span>`;
      if (index < uniquePrimes.length - 1) html += ', ';
    });
    html += `</div>`;
    
    html += `</div>`;
  });
  
  if (numbers.length > 1) {
    const gcf = getGCF(numbers);
    const allFactorizations = numbers.map(n => ({
      num: n,
      factors: getPrimeFactors(n)
    }));
    
    html += `<div class="gcf-section">`;
    html += `<div class="gcf-title">Greatest Common Factor (GCF)</div>`;
    html += `<div class="gcf-calculation">Prime factorizations:</div>`;
    
    allFactorizations.forEach(({num, factors}) => {
      html += `<div class="gcf-calculation">${factors.join(' × ')} = ${num}</div>`;
    });
    
    const gcfFactors = getPrimeFactors(gcf);
    if (gcf > 1) {
      html += `<div class="gcf-calculation">common prime factors are ${gcfFactors.join(' and ')}</div>`;
      html += `<div class="gcf-calculation">greatest common factor is ${gcfFactors.join(' × ')} = ${gcf}</div>`;
    } else {
      html += `<div class="gcf-calculation">There are no common prime factors</div>`;
    }
    
    html += `<div class="gcf-result">GCF(${numbers.join(', ')}) = ${gcf}</div>`;
    html += `</div>`;
    
    const lcmData = getLCM(numbers);
    html += `<div class="gcf-section">`;
    html += `<div class="gcf-title">Least Common Multiple (LCM)</div>`;
    html += `<div class="gcf-calculation">${lcmData.formula}</div>`;
    html += `<div class="gcf-result">LCM(${numbers.join(', ')}) = ${lcmData.value}</div>`;
    html += `</div>`;
  }
  
  resultsDiv.innerHTML = html;
  resultsDiv.classList.add('show');
}

function clearPrimeCalculator() {
  document.getElementById('primeInput').value = '';
  document.getElementById('primeResults').innerHTML = '';
  document.getElementById('primeResults').classList.remove('show');
  document.getElementById('primeInput').focus();
}

function toScientificNotation(num) {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  let exponent = Math.floor(Math.log10(absNum));
  let coefficient = absNum / Math.pow(10, exponent);
  
  if (coefficient >= 10) {
    coefficient /= 10;
    exponent += 1;
  } else if (coefficient < 1 && coefficient !== 0) {
    coefficient *= 10;
    exponent -= 1;
  }
  
  const coeffStr = coefficient.toPrecision(6).replace(/\.?0+$/, '');
  
  if (exponent === 0) {
    return `${sign}${coeffStr}`;
  }
  
  return `${sign}${coeffStr} × 10^${exponent}`;
}

function parseScientificNotation(str) {
  const sciPattern = /^(-?\d+\.?\d*)\s*[×x*]\s*10\s*\^\s*(-?\d+)$/i;
  const match = str.match(sciPattern);
  
  if (match) {
    const coefficient = parseFloat(match[1]);
    const exponent = parseInt(match[2]);
    return coefficient * Math.pow(10, exponent);
  }
  
  return null;
}

function parseTimeString(str) {
  str = str.trim();
  
  const units = {
    'y': 31557600000,
    'mo': 2629800000,
    'w': 604800000,
    'd': 86400000,
    'h': 3600000,
    'm': 60000,
    's': 1000,
    'ms': 1
  };
  
  let totalMs = 0;
  const pattern = /(\d+(?:\.\d+)?)\s*(y|mo|w|d|h|m|s|ms)/g;
  let match;
  
  while ((match = pattern.exec(str)) !== null) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    
    if (units[unit]) {
      totalMs += value * units[unit];
    }
  }
  
  return totalMs;
}

function formatTimeOutput(milliseconds) {
  if (milliseconds === 0) return '0ms';
  
  const isNegative = milliseconds < 0;
  milliseconds = Math.abs(milliseconds);
  
  const units = [
    { name: 'y', ms: 31557600000 },
    { name: 'mo', ms: 2629800000 },
    { name: 'w', ms: 604800000 },
    { name: 'd', ms: 86400000 },
    { name: 'h', ms: 3600000 },
    { name: 'm', ms: 60000 },
    { name: 's', ms: 1000 },
    { name: 'ms', ms: 1 }
  ];
  
  const parts = [];
  let remaining = milliseconds;
  
  for (const unit of units) {
    if (remaining >= unit.ms) {
      const count = Math.floor(remaining / unit.ms);
      parts.push(`${count}${unit.name}`);
      remaining -= count * unit.ms;
    }
  }
  
  return (isNegative ? '-' : '') + parts.join(' ');
}

function calculateTimeExpression() {
  const input = document.getElementById('timeCalcInput').value.trim();
  const resultsDiv = document.getElementById('timeCalcResults');
  
  if (!input) {
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('show');
    return;
  }
  
  try {
    const hasOperator = /[+\-*/x×]|\/\//.test(input);
    
    if (!hasOperator) {
      const result = parseTimeString(input);
      
      if (result === 0) {
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('show');
        return;
      }
      
      const formatted = formatTimeOutput(result);
      const totalYears = (result / 31557600000).toFixed(2);
      const totalMonths = (result / 2629800000).toFixed(2);
      const totalWeeks = (result / 604800000).toFixed(2);
      const totalDays = (result / 86400000).toFixed(2);
      const totalHours = (result / 3600000).toFixed(2);
      const totalMinutes = (result / 60000).toFixed(2);
      const totalSeconds = (result / 1000).toFixed(2);
      
      resultsDiv.innerHTML = `
        <div class="time-calc-result">
          <div class="time-result-label">Result:</div>
          <div class="time-result-value">${formatted}</div>
          <div class="time-breakdown">
            = ${totalYears} years<br>
            = ${totalMonths} months<br>
            = ${totalWeeks} weeks<br>
            = ${totalDays} days<br>
            = ${totalHours} hours<br>
            = ${totalMinutes} minutes<br>
            = ${totalSeconds} seconds<br>
            = ${result.toLocaleString()} milliseconds
          </div>
        </div>
      `;
      resultsDiv.classList.add('show');
      return;
    }

    const tokens = input.split(/\s*([+\-x×*]|\/\/)\s*/);    
    const cleanTokens = tokens.filter(t => t.trim() !== '');
    
    if (cleanTokens.length < 3) {
      resultsDiv.innerHTML = '';
      resultsDiv.classList.remove('show');
      return;
    }
    
    let result = parseTimeString(cleanTokens[0]);
    
    for (let i = 1; i < cleanTokens.length; i += 2) {
      const operator = cleanTokens[i].trim();
      const nextToken = cleanTokens[i + 1];
      
      if (operator === '*' || operator === 'x' || operator === '×' || operator === '/' || operator === '//') {
              const numericValue = parseFloat(nextToken);
              if (!isNaN(numericValue)) {
                if (operator === '*' || operator === 'x' || operator === '×') {
                  result *= numericValue;
                } else {
                  result /= numericValue;
                }
              } else {
                const operand = parseTimeString(nextToken);
                if (operator === '*' || operator === 'x' || operator === '×') {
                  result *= (operand / 1000);
                } else {
                  result /= (operand / 1000);
                }
              }
      } else {
        const operand = parseTimeString(nextToken);
        
        switch (operator) {
          case '+':
            result += operand;
            break;
          case '-':
            result -= operand;
            break;
        }
      }
    }
    
    const formatted = formatTimeOutput(result);
    const totalYears = (result / 31557600000).toFixed(2);
        const totalMonths = (result / 2629800000).toFixed(2);
        const totalWeeks = (result / 604800000).toFixed(2);
        const totalDays = (result / 86400000).toFixed(2);
        const totalHours = (result / 3600000).toFixed(2);
        const totalMinutes = (result / 60000).toFixed(2);
        const totalSeconds = (result / 1000).toFixed(2);
        
        resultsDiv.innerHTML = `
          <div class="time-calc-result">
            <div class="time-result-label">Result:</div>
            <div class="time-result-value">${formatted}</div>
            <div class="time-breakdown">
              = ${totalYears} years<br>
              = ${totalMonths} months<br>
              = ${totalWeeks} weeks<br>
              = ${totalDays} days<br>
              = ${totalHours} hours<br>
              = ${totalMinutes} minutes<br>
              = ${totalSeconds} seconds<br>
              = ${result.toLocaleString()} milliseconds
            </div>
          </div>
        `;
    resultsDiv.classList.add('show');
    
  } catch (e) {
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('show');
  }
}

function clearTimeCalculator() {
  document.getElementById('timeCalcInput').value = '';
  document.getElementById('timeCalcResults').innerHTML = '';
  document.getElementById('timeCalcResults').classList.remove('show');
  document.getElementById('timeCalcInput').focus();
}

function populateReferenceSheet() {
  const multiples101El = document.getElementById('multiples101');
  const multiples1001El = document.getElementById('multiples1001');
  const multiples10001El = document.getElementById('multiples10001');
  const multiples100001El = document.getElementById('multiples100001');
  const perfectCubesEl = document.getElementById('perfectCubes');
  
  if (multiples101El.children.length > 0) {
    return;
  }
  
  for (let i = 1; i <= 990; i++) {
    const product = i * 101;
    const productStr = product.toString();
    const div = document.createElement('div');
    div.className = 'reference-grid-item';
    
    let formattedProduct = '';
    
    if (productStr.length === 3) {
      formattedProduct = productStr.slice(0, -1) + '<span class="product">' + productStr.slice(-1) + '</span>';
    } else if (productStr.length === 4) {
      formattedProduct = productStr.slice(0, -2) + '<span class="product">' + productStr.slice(-2) + '</span>';
    } else if (productStr.length === 5) {
      formattedProduct = '<span class="product">' + productStr[0] + '</span>' + 
                         productStr.slice(1, -2) + 
                         '<span class="product">' + productStr.slice(-2) + '</span>';
    } else {
      formattedProduct = productStr;
    }
    
    div.innerHTML = formattedProduct;
    multiples101El.appendChild(div);
  }

  
  for (let i = 1; i <= 999; i++) {
    const product = i * 1001;
    const productStr = product.toString();
    const div = document.createElement('div');
    div.className = 'reference-grid-item';
    
    let formattedProduct = '';
    
    if (productStr.length === 4) {
      formattedProduct = productStr.slice(0, -1) + '<span class="product">' + productStr.slice(-1) + '</span>';
    } else if (productStr.length === 5) {
      formattedProduct = productStr.slice(0, -2) + '<span class="product">' + productStr.slice(-2) + '</span>';
    } else if (productStr.length === 6) {
      formattedProduct = productStr.slice(0, -3) + '<span class="product">' + productStr.slice(-3) + '</span>';
    } else {
      formattedProduct = productStr;
    }
    
    div.innerHTML = formattedProduct;
    multiples1001El.appendChild(div);
  }

  
  for (let i = 1; i <= 999; i++) {
    const product = i * 10001;
    const productStr = product.toString();
    const div = document.createElement('div');
    div.className = 'reference-grid-item';
    
    let formattedProduct = '';
    
    if (productStr.length === 5) {
      formattedProduct = productStr.slice(0, -1) + '<span class="product">' + productStr.slice(-1) + '</span>';
    } else if (productStr.length === 6) {
      formattedProduct = productStr.slice(0, -2) + '<span class="product">' + productStr.slice(-2) + '</span>';
    } else if (productStr.length === 7) {
      formattedProduct = productStr.slice(0, -3) + '<span class="product">' + productStr.slice(-3) + '</span>';
    } else {
      formattedProduct = productStr;
    }
    
    div.innerHTML = formattedProduct;
    multiples10001El.appendChild(div);
  }
  
  for (let i = 1; i <= 999; i++) {
    const product = i * 100001;
    const productStr = product.toString();
    const div = document.createElement('div');
    div.className = 'reference-grid-item';
    
    let formattedProduct = '';
    
    if (productStr.length === 6) {
      formattedProduct = productStr.slice(0, -1) + '<span class="product">' + productStr.slice(-1) + '</span>';
    } else if (productStr.length === 7) {
      formattedProduct = productStr.slice(0, -2) + '<span class="product">' + productStr.slice(-2) + '</span>';
    } else if (productStr.length === 8) {
      // For 8 digits: 99900999 -> 99900 + 999 (first 5 digits, last 3 in orange)
      formattedProduct = productStr.slice(0, -3) + '<span class="product">' + productStr.slice(-3) + '</span>';
    } else {
      formattedProduct = productStr;
    }
    
    div.innerHTML = formattedProduct;
    multiples100001El.appendChild(div);
  }
  
  for (let i = 1; i <= 50; i++) {
    const cube = i ** 3;
    const div = document.createElement('div');
    div.className = 'reference-grid-item';
    div.innerHTML = `<div class="cube-formula">${i}<sup>3</sup></div><div class="cube-result">${cube.toLocaleString()}</div>`;
    perfectCubesEl.appendChild(div);
  }
  
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
  
  document.getElementById('primeNumbers').textContent = primes.join(' ');
}

function initBasicCalc() {
  clearCalc();
  
  let lastOperation = null;
  let lastOperand = null;
  let displayExpression = '';
  
  const calcInputEl = document.getElementById('calcInput');
  const tapeModeSelect = document.getElementById('tapeMode');
  
  tapeModeSelect.addEventListener('change', () => {
    tapeMode = tapeModeSelect.value;
    updateOperatorHighlight();
    updateTapeDisplay();
    saveTapeToStorage();
  });
  
  document.getElementById('resetTape').addEventListener('click', resetTape);
  
  const buttons = document.querySelectorAll('.calc-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const value = button.dataset.value;
      
      if (value !== undefined) {
        if (value === '.') {
          inputDecimal();
          if (calcWaitingForOperand) {
            displayExpression = '0.';
          } else {
            displayExpression += '.';
          }
        } else {
          inputDigit(value);
          if (calcWaitingForOperand) {
            displayExpression = value;
          } else {
            displayExpression += value;
          }
        }
        calcInputEl.value = displayExpression;
      } else if (action) {
        switch (action) {
          case 'ac':
            clearCalc();
            lastOperation = null;
            lastOperand = null;
            displayExpression = '';
            calcInputEl.value = '';
            break;
          case 'scientific':
            const value = parseFloat(calcCurrentValue);
            if (!isNaN(value) && value !== 0) {
              const sciNotation = toScientificNotation(value);
              calcCurrentValue = sciNotation;
              updateCalcDisplay(calcCurrentValue);
            }
            break;
          case 'plusminus':
            toggleSign();
            break;
          case 'percent':
            displayExpression += '%';
            calcInputEl.value = displayExpression;
            inputPercent();
            break;
          case 'pi':
            inputPi();
            break;
          case 'sqrt':
            calculateSquareRoot();
            break;
          case 'round2':
            roundToDecimals(2);
            displayExpression = calcCurrentValue;
            calcInputEl.value = displayExpression;
            break;
          case 'round0':
            roundToDecimals(0);
            displayExpression = calcCurrentValue;
            calcInputEl.value = displayExpression;
            break;
          case 'add':
            performOperation(action);
            displayExpression += ' + ';
            calcInputEl.value = displayExpression;
            break;
          case 'subtract':
            performOperation(action);
            displayExpression += ' - ';
            calcInputEl.value = displayExpression;
            break;
          case 'multiply':
            performOperation(action);
            displayExpression += ' × ';
            calcInputEl.value = displayExpression;
            break;
          case 'divide':
            performOperation(action);
            displayExpression += ' ÷ ';
            calcInputEl.value = displayExpression;
            break;
          case 'power':
            performOperation(action);
            displayExpression += ' ^ ';
            calcInputEl.value = displayExpression;
            break;
          case 'equals':
            if (calcOperation && !calcWaitingForOperand) {
              lastOperation = calcOperation;
              lastOperand = parseFloat(calcCurrentValue);
            }
            
            if (!calcOperation && lastOperation && lastOperand !== null) {
              calcPreviousValue = parseFloat(calcCurrentValue);
              calcOperation = lastOperation;
              calcWaitingForOperand = false;
              calcCurrentValue = String(lastOperand);
            }
            
            performOperation(null);
            calcOperation = null;
            calcPreviousValue = '';
            calcWaitingForOperand = true;
            displayExpression = calcCurrentValue;
            break;
        }
      }
    });
  });
  
  const calcKeyHandler = (e) => {
    if (document.getElementById('basicCalcSection').style.display === 'none') return;
    
    if (e.key === 'Escape' || e.key === 'c' || e.key === 'C' || e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      clearCalc();
      lastOperation = null;
      lastOperand = null;
      displayExpression = '';
      calcInputEl.value = '';
      return;
    }
    
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      inputDigit(e.key);
      if (calcWaitingForOperand) {
        displayExpression = e.key;
      } else {
        displayExpression += e.key;
      }
      calcInputEl.value = displayExpression;
    }
    else if (e.key === '.') {
      e.preventDefault();
      inputDecimal();
      if (calcWaitingForOperand) {
        displayExpression = '0.';
      } else {
        displayExpression += '.';
      }
      calcInputEl.value = displayExpression;
    }
    else if (e.key === '+') {
      e.preventDefault();
      performOperation('add');
      displayExpression += ' + ';
      calcInputEl.value = displayExpression;
    }
    else if (e.key === '-') {
      e.preventDefault();
      performOperation('subtract');
      displayExpression += ' - ';
      calcInputEl.value = displayExpression;
    }
    else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
      e.preventDefault();
      performOperation('multiply');
      displayExpression += ' × ';
      calcInputEl.value = displayExpression;
    }
    else if (e.key === '/') {
      e.preventDefault();
      performOperation('divide');
      displayExpression += ' ÷ ';
      calcInputEl.value = displayExpression;
    }
    else if (e.key === '^' || e.key === 'y' || e.key === 'Y') {
      e.preventDefault();
      performOperation('power');
      displayExpression += ' ^ ';
      calcInputEl.value = displayExpression;
    }
    else if (e.key === '%') {
      e.preventDefault();
      displayExpression += '%';
      calcInputEl.value = displayExpression;
      inputPercent();
    }
    else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      calculateSquareRoot();
    }
    else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      
      if (tapeMode !== 'off' && tapeMode !== 'auto' && tapeMode !== 'autodecimal') {
        const value = parseFloat(calcCurrentValue);
        if (!isNaN(value)) {
          addTapeEntry(tapeMode, value);
          calcCurrentValue = '0';
          calcWaitingForOperand = false;
          displayExpression = '';
          calcInputEl.value = '';
          return;
        }
      } else if (tapeMode === 'auto' || tapeMode === 'autodecimal') {
        let value = parseFloat(calcCurrentValue);
        if (tapeMode === 'autodecimal') {
          value = value / 100;
        }
        if (!isNaN(value)) {
          const operation = calcOperation || 'add';
          addTapeEntry(operation, value);
          calcCurrentValue = '0';
          calcWaitingForOperand = false;
          calcOperation = null;
          calcPreviousValue = '';
          displayExpression = '';
          calcInputEl.value = '';
          return;
        }
      }
      
      if (calcOperation && !calcWaitingForOperand) {
        lastOperation = calcOperation;
        lastOperand = parseFloat(calcCurrentValue);
      }
      
      if (!calcOperation && lastOperation && lastOperand !== null) {
        calcPreviousValue = parseFloat(calcCurrentValue);
        calcOperation = lastOperation;
        calcWaitingForOperand = false;
        calcCurrentValue = String(lastOperand);
      }
      
      performOperation(null);
      calcOperation = null;
      calcPreviousValue = '';
      calcWaitingForOperand = true;
      displayExpression = calcCurrentValue;
    }
  };
  
  // document.addEventListener('keydown', calcKeyHandler);
  document.getElementById('calcInput').addEventListener('keydown', calcKeyHandler);
  
  setTimeout(() => {
    loadTapeFromStorage();
  }, 100);
}

async function loadPreferences() {
  try {
    const result = await browser.storage.local.get(['lastCategory', 'lastUnits', 'lastValue']);
    
    if (result.lastCategory) {
      categorySelect.value = result.lastCategory;
    }
    
    const category = categorySelect.value;
    
    if (category === 'basiccalc') {
      document.getElementById('converterSection').style.display = 'none';
      document.getElementById('basicCalcSection').style.display = 'block';
      document.getElementById('fractionSection').style.display = 'none';
      document.getElementById('tipSection').style.display = 'none';
      document.getElementById('primeSection').style.display = 'none';
      document.getElementById('timeCalcSection').style.display = 'none';
      document.getElementById('referenceSection').style.display = 'none';
    } else if (category === 'fraction') {
      document.getElementById('converterSection').style.display = 'none';
      document.getElementById('basicCalcSection').style.display = 'none';
      document.getElementById('fractionSection').style.display = 'block';
      document.getElementById('tipSection').style.display = 'none';
      document.getElementById('primeSection').style.display = 'none';
      document.getElementById('timeCalcSection').style.display = 'none';
      document.getElementById('referenceSection').style.display = 'none';
      
      if (result.lastValue !== undefined) {
        document.getElementById('fractionInput').value = result.lastValue;
        if (result.lastValue) {
          calculateFraction();
        }
      }
    } else if (category === 'tipcalc') {
      document.getElementById('converterSection').style.display = 'none';
      document.getElementById('basicCalcSection').style.display = 'none';
      document.getElementById('fractionSection').style.display = 'none';
      document.getElementById('tipSection').style.display = 'block';
      document.getElementById('primeSection').style.display = 'none';
      document.getElementById('timeCalcSection').style.display = 'none';
      document.getElementById('referenceSection').style.display = 'none';
    } else if (category === 'reference') {
      document.getElementById('converterSection').style.display = 'none';
      document.getElementById('basicCalcSection').style.display = 'none';
      document.getElementById('fractionSection').style.display = 'none';
      document.getElementById('tipSection').style.display = 'none';
      document.getElementById('primeSection').style.display = 'none';
      document.getElementById('timeCalcSection').style.display = 'none';
      document.getElementById('referenceSection').style.display = 'block';
      populateReferenceSheet();
    } else if (category === 'prime') {
      document.getElementById('converterSection').style.display = 'none';
      document.getElementById('basicCalcSection').style.display = 'none';
      document.getElementById('fractionSection').style.display = 'none';
      document.getElementById('tipSection').style.display = 'none';
      document.getElementById('timeCalcSection').style.display = 'none';
      document.getElementById('primeSection').style.display = 'block';
      document.getElementById('referenceSection').style.display = 'none';
    } else if (category === 'timecalc') {
      document.getElementById('converterSection').style.display = 'none';
      document.getElementById('basicCalcSection').style.display = 'none';
      document.getElementById('fractionSection').style.display = 'none';
      document.getElementById('tipSection').style.display = 'none';
      document.getElementById('primeSection').style.display = 'none';
      document.getElementById('referenceSection').style.display = 'none';
      document.getElementById('timeCalcSection').style.display = 'block';
    } else {
      // Converter categories
      document.getElementById('converterSection').style.display = 'block';
      document.getElementById('basicCalcSection').style.display = 'none';
      document.getElementById('fractionSection').style.display = 'none';
      document.getElementById('tipSection').style.display = 'none';
      document.getElementById('primeSection').style.display = 'none';
      document.getElementById('timeCalcSection').style.display = 'none';
      document.getElementById('referenceSection').style.display = 'none';
      
      populateUnits();
      
      if (result.lastUnits && result.lastUnits[category]) {
        fromUnitSelect.value = result.lastUnits[category];
      }
      
      if (result.lastValue !== undefined) {
        valueInput.value = result.lastValue;
        if (result.lastValue) {
          convert();
        }
      }
    }
    
  } catch (e) {
    console.error('Error loading preferences:', e);
  }
}

async function savePreferences() {
  try {
    const result = await browser.storage.local.get(['lastUnits']);
    const lastUnits = result.lastUnits || {};
    lastUnits[categorySelect.value] = fromUnitSelect.value;
    
    await browser.storage.local.set({
      lastCategory: categorySelect.value,
      lastUnits: lastUnits,
      lastValue: valueInput.value
    });
  } catch (e) {
    console.error('Error saving preferences:', e);
  }
}

function populateUnits() {
  const category = categorySelect.value;
  const unitList = Object.keys(units[category]);
  
  fromUnitSelect.innerHTML = '';
  unitList.forEach(unit => {
    const option = document.createElement('option');
    option.value = unit;
    option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
    fromUnitSelect.appendChild(option);
  });
  
  updatePlaceholder();
}

function updatePlaceholder() {
  const category = categorySelect.value;
  const fromUnit = fromUnitSelect.value;
  
  if (category === 'length' && fromUnit === 'foot') {
    valueInput.placeholder = "5' 11\" = 5 feet 11 inches";
  } else {
    valueInput.placeholder = "Enter value";
  }
}

function convert() {
  const category = categorySelect.value;
  const fromUnit = fromUnitSelect.value;
  let value;
  
  if (category === 'length' && fromUnit === 'foot') {
    const feetInches = parseFeetInches(valueInput.value);
    if (feetInches !== null) {
      value = feetInches;
    } else {
      value = parseFloat(valueInput.value);
    }
  } else {
    value = parseFloat(valueInput.value);
  }
  
  if (isNaN(value) || valueInput.value === '') {
    resultsDiv.innerHTML = '';
    formulaDiv.innerHTML = '';
    resultsDiv.classList.remove('show');
    formulaDiv.classList.remove('show');
    document.getElementById('timeComponentsDisplay')?.remove();
    return;
  }
  
  resultsDiv.innerHTML = '';
  formulaDiv.innerHTML = '';
  document.getElementById('timeComponentsDisplay')?.remove();
  
  if (category === 'temperature') {
    const unitList = Object.keys(units[category]);
    unitList.forEach(toUnit => {
      if (toUnit !== fromUnit) {
        const result = convertTemperature(value, fromUnit, toUnit);
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
          <span class="result-unit">${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}:</span>
          <span class="result-value">${formatNumber(result, 2)}</span>
        `;
        resultsDiv.appendChild(resultItem);
      }
    });
    
    const firstOtherUnit = Object.keys(units[category]).find(u => u !== fromUnit);
    const formula = getTemperatureFormula(fromUnit, firstOtherUnit);
    formulaDiv.innerHTML = `<div class="formula-title">Formula:</div>${formula}`;
    
  } else {
    const baseValue = value * units[category][fromUnit];
    
    if (category === 'datatransfer') {
      const bitsPerSecond = baseValue;
      const bytesPerSecond = bitsPerSecond / 8;
      const bytesPerMinute = bytesPerSecond * 60;
      const bytesPerHour = bytesPerSecond * 3600;
      const bytesPerDay = bytesPerSecond * 86400;
      
      const summaryItem = document.createElement('div');
      summaryItem.className = 'transfer-summary';
      summaryItem.innerHTML = `
        <div class="summary-row">
          ${formatNumber(bytesPerSecond / 1000)} <strong>kB/s</strong> | 
          ${formatNumber(bytesPerMinute / 1000)} <strong>kB/m</strong> | 
          ${formatNumber(bytesPerHour / 1000)} <strong>kB/h</strong> | 
          ${formatNumber(bytesPerDay / 1000)} <strong>kB/d</strong>
        </div>
        <div class="summary-row">
          ${formatNumber(bytesPerSecond / 1000000)} <strong>MB/s</strong> | 
          ${formatNumber(bytesPerMinute / 1000000)} <strong>MB/m</strong> | 
          ${formatNumber(bytesPerHour / 1000000)} <strong>MB/h</strong> | 
          ${formatNumber(bytesPerDay / 1000000)} <strong>MB/d</strong>
        </div>
        <div class="summary-row">
          ${formatNumber(bytesPerSecond / 1000000000)} <strong>GB/s</strong> | 
          ${formatNumber(bytesPerMinute / 1000000000)} <strong>GB/m</strong> | 
          ${formatNumber(bytesPerHour / 1000000000)} <strong>GB/h</strong> | 
          ${formatNumber(bytesPerDay / 1000000000)} <strong>GB/d</strong>
        </div>
      `;
      resultsDiv.appendChild(summaryItem);
    }
    
    const unitList = Object.keys(units[category]);
    
    if (category === 'time') {
      const timeComponents = formatTimeComponents(baseValue);
      
      if (timeComponents) {
        const componentsDisplay = document.createElement('div');
        componentsDisplay.id = 'timeComponentsDisplay';
        componentsDisplay.style.cssText = `
          color: var(--accent-color);
          font-size: 0.9rem;
          margin-top: 8px;
          margin-bottom: 8px;
          padding: 8px;
          background: var(--bg-secondary);
          border-radius: 4px;
        `;
        componentsDisplay.textContent = timeComponents;
        
        const fromUnitRow = document.querySelector('.input-row:has(#fromUnit)');
        if (fromUnitRow) {
          fromUnitRow.parentNode.insertBefore(componentsDisplay, fromUnitRow.nextSibling);
        }
      }
    }
    
    unitList.forEach(toUnit => {
          if (toUnit !== fromUnit) {
            const result = baseValue / units[category][toUnit];
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            let displayValue;
            if (category === 'length' && (fromUnit === 'centimeter' || fromUnit === 'meter') && toUnit === 'foot') {
              const meters = baseValue;
              const feetInches = metersToFeetInches(meters);
              displayValue = `(${feetInches}) ${formatNumber(result)}`;
            } else {
              displayValue = formatNumber(result);
            }
            
            resultItem.innerHTML = `
              <span class="result-unit">${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}:</span>
              <span class="result-value">${displayValue}</span>
            `;
            resultsDiv.appendChild(resultItem);
          }
        });
        
    const firstOtherUnit = unitList.find(u => u !== fromUnit);
    const fromBase = units[category][fromUnit];
    const toBase = units[category][firstOtherUnit];
    const conversionFactor = formatNumber(fromBase / toBase);
    
    formulaDiv.innerHTML = `
      <div class="formula-title">Formula:</div>
      ${firstOtherUnit} = ${fromUnit} × ${conversionFactor}
      <br><small>(All conversions use their respective conversion factors to the base unit)</small>
    `;
  }
  
  resultsDiv.classList.add('show');
  formulaDiv.classList.add('show');
  
  savePreferences();
}

function clearAll() {
  valueInput.value = '';
  resultsDiv.innerHTML = '';
  formulaDiv.innerHTML = '';
  resultsDiv.classList.remove('show');
  formulaDiv.classList.remove('show');
  savePreferences();
  valueInput.focus();
}

fromUnitSelect.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    categorySelect.focus();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    valueInput.focus();
  }
});

fromUnitSelect.addEventListener('change', () => {
  updatePlaceholder();
  savePreferences();
  if (valueInput.value) {
    convert();
  }
});

categorySelect.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (categorySelect.value === 'basiccalc') {
      document.getElementById('calcInput').focus();
    } else if (categorySelect.value === 'fraction') {
      document.getElementById('fractionInput').focus();
    } else if (categorySelect.value === 'tipcalc') {
      document.getElementById('subtotalInput').focus();
    } else if (categorySelect.value === 'prime') {
      document.getElementById('primeInput').focus();
    } else {
      valueInput.focus();
    }
  }
});

categorySelect.addEventListener('change', () => {
  const category = categorySelect.value;
  
  if (category === 'basiccalc') {
    document.getElementById('converterSection').style.display = 'none';
    document.getElementById('basicCalcSection').style.display = 'block';
    document.getElementById('fractionSection').style.display = 'none';
    document.getElementById('tipSection').style.display = 'none';
    document.getElementById('primeSection').style.display = 'none';
    document.getElementById('referenceSection').style.display = 'none';
    document.getElementById('calcInput').focus();
    savePreferences();
  } else if (category === 'fraction') {
    document.getElementById('converterSection').style.display = 'none';
    document.getElementById('basicCalcSection').style.display = 'none';
    document.getElementById('fractionSection').style.display = 'block';
    document.getElementById('tipSection').style.display = 'none';
    document.getElementById('primeSection').style.display = 'none';
    document.getElementById('referenceSection').style.display = 'none';
    document.getElementById('fractionInput').focus();
    savePreferences();
  } else if (category === 'timecalc') {
    document.getElementById('converterSection').style.display = 'none';
    document.getElementById('basicCalcSection').style.display = 'none';
    document.getElementById('fractionSection').style.display = 'none';
    document.getElementById('tipSection').style.display = 'none';
    document.getElementById('primeSection').style.display = 'none';
    document.getElementById('referenceSection').style.display = 'none';
    document.getElementById('timeCalcSection').style.display = 'block';
    document.getElementById('timeCalcInput').focus();
    savePreferences();  
  } else if (category === 'tipcalc') {
    document.getElementById('converterSection').style.display = 'none';
    document.getElementById('basicCalcSection').style.display = 'none';
    document.getElementById('fractionSection').style.display = 'none';
    document.getElementById('tipSection').style.display = 'block';
    document.getElementById('primeSection').style.display = 'none';
    document.getElementById('referenceSection').style.display = 'none';
    document.getElementById('subtotalInput').focus();
    savePreferences();
  } else if (category === 'prime') {
    document.getElementById('converterSection').style.display = 'none';
    document.getElementById('basicCalcSection').style.display = 'none';
    document.getElementById('fractionSection').style.display = 'none';
    document.getElementById('tipSection').style.display = 'none';
    document.getElementById('referenceSection').style.display = 'none';
    document.getElementById('primeSection').style.display = 'block';
    document.getElementById('primeInput').focus();
    savePreferences();
  } else if (category === 'reference') {
    document.getElementById('converterSection').style.display = 'none';
    document.getElementById('basicCalcSection').style.display = 'none';
    document.getElementById('fractionSection').style.display = 'none';
    document.getElementById('tipSection').style.display = 'none';
    document.getElementById('primeSection').style.display = 'none';
    document.getElementById('timeCalcSection').style.display = 'none';
    document.getElementById('referenceSection').style.display = 'block';
    savePreferences();
  } else {
    document.getElementById('converterSection').style.display = 'block';
    document.getElementById('basicCalcSection').style.display = 'none';
    document.getElementById('fractionSection').style.display = 'none';
    document.getElementById('tipSection').style.display = 'none';
    document.getElementById('primeSection').style.display = 'none';
    document.getElementById('referenceSection').style.display = 'none';
    
    populateUnits();
    
    browser.storage.local.get(['lastUnits']).then(result => {
      if (result.lastUnits && result.lastUnits[categorySelect.value]) {
        fromUnitSelect.value = result.lastUnits[categorySelect.value];
        updatePlaceholder();
      }
    });
    
    savePreferences();
    
    if (valueInput.value) {
      convert();
    }
  }
});

valueInput.addEventListener('input', () => {
  convert();
});

clearButton.addEventListener('click', clearAll);

document.getElementById('tipPlus').addEventListener('click', () => {
  const input = document.getElementById('tipPercent');
  input.value = parseInt(input.value || 0) + 1;
  calculateTipAmount();
});

document.getElementById('tipMinus').addEventListener('click', () => {
  const input = document.getElementById('tipPercent');
  const newValue = parseInt(input.value || 0) - 1;
  input.value = Math.max(0, newValue);
  calculateTipAmount();
});

document.getElementById('splitPlus').addEventListener('click', () => {
  const input = document.getElementById('splitCount');
  input.value = parseInt(input.value || 1) + 1;
  calculateTipAmount();
});

document.getElementById('splitMinus').addEventListener('click', () => {
  const input = document.getElementById('splitCount');
  const newValue = parseInt(input.value || 1) - 1;
  input.value = Math.max(1, newValue);
  calculateTipAmount();
});

document.getElementById('timeCalcInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculateTimeExpression();
  }
});

document.getElementById('subtotalInput').addEventListener('input', calculateTipAmount);
document.getElementById('totalBill').addEventListener('input', calculateTipAmount);
document.getElementById('taxRate').addEventListener('input', calculateTipAmount);
document.getElementById('taxAmount').addEventListener('input', calculateTipAmount);
document.getElementById('tipPercent').addEventListener('input', calculateTipAmount);
document.getElementById('splitCount').addEventListener('input', calculateTipAmount);
document.getElementById('doNotTipOnTax').addEventListener('change', calculateTipAmount);
document.getElementById('roundUp').addEventListener('change', calculateTipAmount);

document.getElementById('clearTip').addEventListener('click', clearTipCalculator);
document.getElementById('primeInput').addEventListener('input', calculatePrimeFactorization);
document.getElementById('clearPrime').addEventListener('click', clearPrimeCalculator);
document.getElementById('timeCalcInput').addEventListener('input', calculateTimeExpression);
document.getElementById('clearTimeCalc').addEventListener('click', clearTimeCalculator);

document.getElementById('fractionInput').addEventListener('input', calculateFraction);
document.getElementById('clearFraction').addEventListener('click', () => {
  document.getElementById('fractionInput').value = '';
  document.getElementById('fractionResults').innerHTML = '';
  document.getElementById('fractionResults').classList.remove('show');
  document.getElementById('fractionInput').focus();
});

populateReferenceSheet();
initBasicCalc();
loadPreferences();

setTimeout(() => {
    loadTapeFromStorage();
}, 100);