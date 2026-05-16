/**
 * UN Comtrade UZ-US bilateral trade slices.
 *
 * Generated from the original consolidated Comtrade export so lazy UI
 * components can import only the dataset they render.
 */

export interface Hs6Row {
  hs6: string;
  desc: string;
  valueUsd: number;
}

export interface MirrorRow {
  hs6: string;
  desc: string;
  /** UZ reports as exporter to US. */
  uzExportsToUs: number;
  /** US reports as importer from UZ. */
  usImportsFromUz: number;
  /** UZ reports as importer from US. */
  uzImportsFromUs: number;
  /** US reports as exporter to UZ. */
  usExportsToUz: number;
}

export interface Hs2Row {
  hs2: string;
  desc: string;
  valueUsd: number;
}

export interface Hs6Trend {
  hs6: string;
  desc: string;
  series: Record<number, number>;
}
