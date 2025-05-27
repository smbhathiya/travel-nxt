import { type Theme } from './theme';

/**
 * Utility to generate CSS variables from our theme
 */
export function generateThemeCSS(theme: Theme): string {
  const { light, dark } = theme;
  
  const lightVars = Object.entries(light)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case with -- prefix
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      return `  ${cssVarName}: ${value};`;
    })
    .join('\n');
    
  const darkVars = Object.entries(dark)
    .map(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      return `  ${cssVarName}: ${value};`;
    })
    .join('\n');
    
  return `:root {\n${lightVars}\n}\n\n.dark {\n${darkVars}\n}`;
}
