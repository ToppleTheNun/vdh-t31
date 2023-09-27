import { isPresent } from "~/typeGuards";

const baseWowheadUrl = "https://wowhead.com/";
const ptrWowheadUrl = "https://ptr.wowhead.com/";
const ptr2WowheadUrl = "https://ptr2.wowhead.com/";

export enum Version {
  LIVE = "",
  PTR = "ptr",
  PTR2 = "ptr-2",
}

export const item = (id: number, version: Version = Version.LIVE): string => {
  switch (version) {
    case Version.LIVE:
      return `${baseWowheadUrl}item=${id}`;
    case Version.PTR:
      return `${ptrWowheadUrl}item=${id}`;
    case Version.PTR2:
      return `${ptr2WowheadUrl}item=${id}`;
  }
};

export const itemData = (id: number, version: Version = Version.LIVE): string =>
  [`item=${id}`, getDomain(version)].filter(isPresent).join("&");

export const spell = (id: number, version: Version = Version.LIVE): string => {
  switch (version) {
    case Version.LIVE:
      return `${baseWowheadUrl}spell=${id}`;
    case Version.PTR:
      return `${ptrWowheadUrl}spell=${id}`;
    case Version.PTR2:
      return `${ptr2WowheadUrl}spell=${id}`;
  }
};

export const spellData = (
  id: number,
  version: Version = Version.LIVE,
): string => [`spell=${id}`, getDomain(version)].filter(isPresent).join("&");

const getDomain = (version: Version): string | null => {
  switch (version) {
    case Version.PTR:
      return "domain=ptr";
    case Version.PTR2:
      return "domain=ptr2";
    default:
      return null;
  }
};
