export const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
};

const colorVariables = (themeColors) => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${
    themeColors.variables['medium-emphasis-opacity']
  })`;
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${
    themeColors.variables['disabled-opacity']
  })`;
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${
    themeColors.variables['border-opacity']
  })`;
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${
    themeColors.variables['high-emphasis-opacity']
  })`;

  return {themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor};
};

export const getAreaChartSplineConfig = (themeColors) => {
  const areaColors = {
    series3: '#ab7efd',
    series2: '#87CEFA',
    series1: '#00BFFF'
  };

  const {themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor} = colorVariables(themeColors);

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: {show: false}
    },
    tooltip: {shared: false},
    dataLabels: {enabled: false},
    stroke: {
      show: false,
      curve: 'straight'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',

      labels: {colors: themeSecondaryTextColor},
      markers: {
        offsetY: 1,
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },

    colors: [areaColors.series3, areaColors.series2, areaColors.series1],
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      show: true,
      borderColor: themeBorderColor,
      xaxis: {
        lines: {show: true}
      }
    },
    yaxis: {
      labels: {
        style: {colors: themeDisabledTextColor}
      }
    },
    xaxis: {
      axisBorder: {show: false},

      axisTicks: {color: themeBorderColor},
      crosshairs: {
        stroke: {color: themeBorderColor}
      },
      labels: {
        style: {colors: themeDisabledTextColor}
      },
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    }
  };
};
