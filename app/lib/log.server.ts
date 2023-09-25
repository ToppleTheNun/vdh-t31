import { cyan, green, red, yellow } from "kleur/colors";

export const tags = {
  error: red("vdh-t31:error"),
  warn: yellow("vdh-t31:warn"),
  debug: green("vdh-t31:debug"),
  info: cyan("vdh-t31:info"),
};

export const info = (message: any, ...optionalParams: any[]) => {
  console.info(`${tags.info} ${message}`, ...optionalParams);
};
export const error = (message: any, ...optionalParams: any[]) => {
  console.error(`${tags.error} ${message}`, ...optionalParams);
};
export const warn = (message: any, ...optionalParams: any[]) => {
  console.log(`${tags.warn} ${message}`, ...optionalParams);
};
export const debug = (message: any, ...optionalParams: any[]) => {
  console.log(`${tags.debug} ${message}`, ...optionalParams);
};
