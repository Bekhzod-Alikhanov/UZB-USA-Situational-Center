/**
 * UN Comtrade UZ↔US bilateral trade — HS-6 granular structure.
 *
 * Pulled 2026-04-29 via the public preview endpoint
 *   https://comtradeapi.un.org/public/v1/preview/C/A/HS
 * for years 2021, 2022, 2023, 2024, 2025, both reporters (UZ=860 and US=842), both
 * flows (X=exports, M=imports). UZ has not yet reported 2025 to Comtrade
 * (typical reporting lag) — UZ-2025 totals therefore reflect partial /
 * mirror data only.
 *
 * All values in USD (raw, not millions). Source: `comtrade_hs6`.
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

/** Top 30 HS-6 codes for UZ exports (US-reported imports) by year. */
export const topUsImportsFromUzByYear: Record<number, Hs6Row[]> = {
  "2021": [
    {
      "hs6": "999999",
      "desc": "Commodities not specified according to kind",
      "valueUsd": 87755059
    },
    {
      "hs6": "710691",
      "desc": "Metals; silver, unwrought, (but not powder)",
      "valueUsd": 56969178
    },
    {
      "hs6": "740811",
      "desc": "Copper; wire, of refined copper, of which the maximum cross-sectional dimension exceeds 6mm",
      "valueUsd": 21676760
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 3515013
    },
    {
      "hs6": "711319",
      "desc": "Jewellery; of precious metal (excluding silver) whether or not plated or clad with precious metal, and parts thereof",
      "valueUsd": 2618356
    },
    {
      "hs6": "284440",
      "desc": "HS 284440",
      "valueUsd": 2124690
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 1829069
    },
    {
      "hs6": "810294",
      "desc": "Molybdenum; unwrought, including bars and rods obtained simply by sintering",
      "valueUsd": 1314256
    },
    {
      "hs6": "390120",
      "desc": "Ethylene polymers; in primary forms, polyethylene having a specific gravity of 0.94 or more",
      "valueUsd": 1260862
    },
    {
      "hs6": "390230",
      "desc": "Propylene, other olefin polymers; propylene copolymers in primary forms",
      "valueUsd": 1032053
    },
    {
      "hs6": "930630",
      "desc": "Ammunition; cartridges and parts thereof n.e.c. in heading no. 9306",
      "valueUsd": 999800
    },
    {
      "hs6": "121190",
      "desc": "Plants and parts (including seeds and fruits) n.e.c. in heading no. 1211, of a kind used primarily in perfumery, in pharmacy or for insecticidal, fungicidal or similar purposes, fresh, chilled, frozen or dried, whether or not cut, crushed or powdered",
      "valueUsd": 671360
    },
    {
      "hs6": "970600",
      "desc": "HS 970600",
      "valueUsd": 530221
    },
    {
      "hs6": "130212",
      "desc": "Vegetable saps and extracts; of liquorice",
      "valueUsd": 501000
    },
    {
      "hs6": "520513",
      "desc": "Cotton yarn; (not sewing thread), single, of uncombed fibres, 85% or more by weight of cotton, less than 232.56 but not less than 192.31 decitex (exceeding 43 but not exceeding 52 metric number), not for retail sale",
      "valueUsd": 473588
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 456528
    },
    {
      "hs6": "100630",
      "desc": "Cereals; rice, semi-milled or wholly milled, whether or not polished or glazed",
      "valueUsd": 437061
    },
    {
      "hs6": "630260",
      "desc": "Kitchen and toilet linen; of terry towelling or similar terry fabrics, of cotton",
      "valueUsd": 375234
    },
    {
      "hs6": "071333",
      "desc": "Vegetables, leguminous; kidney beans, including white pea beans (phaseolus vulgaris), shelled, whether or not skinned or split, dried",
      "valueUsd": 348121
    },
    {
      "hs6": "200599",
      "desc": "Vegetable preparations; vegetables and mixtures of vegetables n.e.c. in heading no. 2005, prepared or preserved otherwise than by vinegar or acetic acid, not frozen",
      "valueUsd": 330332
    },
    {
      "hs6": "570242",
      "desc": "Carpets and other textile floor coverings; woven, (not tufted or flocked), of man-made textile materials, of pile construction, made up, n.e.c. in item no. 5702.10 or 5702.20",
      "valueUsd": 315945
    },
    {
      "hs6": "071190",
      "desc": "Vegetables and mixed vegetables; n.e.c. in heading no. 0711, provisionally preserved but unsuitable in that state for immediate consumption",
      "valueUsd": 293941
    },
    {
      "hs6": "520523",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 232.56 but not less than 192.31 decitex (exceeding 43 but not exceeding 52 metric number), not for retail sale",
      "valueUsd": 284351
    },
    {
      "hs6": "200190",
      "desc": "Vegetable preparations; vegetables, fruit, nuts and other edible parts of plants, prepared or preserved by vinegar or acetic acid (excluding cucumbers and gherkins)",
      "valueUsd": 250143
    },
    {
      "hs6": "081310",
      "desc": "Fruit, edible; apricots, dried",
      "valueUsd": 239715
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 192073
    },
    {
      "hs6": "570110",
      "desc": "Carpets and other textile floor coverings; knotted, of wool or fine animal hair, whether or not made up",
      "valueUsd": 172189
    },
    {
      "hs6": "520522",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 714.29 but not less than 232.56 decitex (exceeding 14 but not exceeding 43 metric number), not for retail sale",
      "valueUsd": 166259
    },
    {
      "hs6": "520512",
      "desc": "Cotton yarn; (not sewing thread), single, of uncombed fibres, 85% or more by weight of cotton, less than 714.29 but not less than 232.56 decitex (exceeding 14 but not exceeding 43 metric number), not for retail sale",
      "valueUsd": 151547
    },
    {
      "hs6": "081340",
      "desc": "Fruit, edible; fruit n.e.c. in heading no. 0812, dried",
      "valueUsd": 122636
    }
  ],
  "2022": [
    {
      "hs6": "710692",
      "desc": "Metals; silver, semi-manufactured",
      "valueUsd": 24391274
    },
    {
      "hs6": "710691",
      "desc": "Metals; silver, unwrought, (but not powder)",
      "valueUsd": 11695901
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 3110969
    },
    {
      "hs6": "999999",
      "desc": "Commodities not specified according to kind",
      "valueUsd": 3110665
    },
    {
      "hs6": "071331",
      "desc": "Vegetables, leguminous; beans of the species vigna mungo (l.) hepper or vigna radiata (l.) wilczek, shelled, whether or not skinned or split, dried",
      "valueUsd": 2417324
    },
    {
      "hs6": "284443",
      "desc": "Radioactive elements, isotopes and compounds; other alloys, dispersions (including cermets), ceramic products and mixtures containing these elements, isotopes or compounds",
      "valueUsd": 2210855
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 1922575
    },
    {
      "hs6": "810294",
      "desc": "Molybdenum; unwrought, including bars and rods obtained simply by sintering",
      "valueUsd": 887007
    },
    {
      "hs6": "121190",
      "desc": "Plants and parts (including seeds and fruits) n.e.c. in heading no. 1211, of a kind used primarily in perfumery, in pharmacy or for insecticidal, fungicidal or similar purposes, fresh, chilled, frozen or dried, whether or not cut, crushed or powdered",
      "valueUsd": 775046
    },
    {
      "hs6": "711319",
      "desc": "Jewellery; of precious metal (excluding silver) whether or not plated or clad with precious metal, and parts thereof",
      "valueUsd": 671056
    },
    {
      "hs6": "820719",
      "desc": "Tools, interchangeable; rock drilling or earth boring tools, with working part (other than of cermets), whether or not power operated, including parts",
      "valueUsd": 664732
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 607634
    },
    {
      "hs6": "010619",
      "desc": "Mammals; live, other than primates, whales, dolphins, porpoises (mammals of the order Cetacea); manatees, dugongs (mammals of the order Sirenia); seals, sea lions, walruses (mammals of the suborder Pinnipedia), camels, other camelids, rabbits and hares",
      "valueUsd": 566205
    },
    {
      "hs6": "283325",
      "desc": "Sulphates; of copper",
      "valueUsd": 546500
    },
    {
      "hs6": "570242",
      "desc": "Carpets and other textile floor coverings; woven, (not tufted or flocked), of man-made textile materials, of pile construction, made up, n.e.c. in item no. 5702.10 or 5702.20",
      "valueUsd": 536424
    },
    {
      "hs6": "200599",
      "desc": "Vegetable preparations; vegetables and mixtures of vegetables n.e.c. in heading no. 2005, prepared or preserved otherwise than by vinegar or acetic acid, not frozen",
      "valueUsd": 479573
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 475240
    },
    {
      "hs6": "711620",
      "desc": "Stones; precious or semi-precious stones (natural, synthetic or reconstructed) articles of",
      "valueUsd": 399426
    },
    {
      "hs6": "392590",
      "desc": "Plastics; builders' ware, n.e.c. or included in heading no. 3925",
      "valueUsd": 381387
    },
    {
      "hs6": "130212",
      "desc": "Vegetable saps and extracts; of liquorice",
      "valueUsd": 350000
    },
    {
      "hs6": "200190",
      "desc": "Vegetable preparations; vegetables, fruit, nuts and other edible parts of plants, prepared or preserved by vinegar or acetic acid (excluding cucumbers and gherkins)",
      "valueUsd": 297936
    },
    {
      "hs6": "630260",
      "desc": "Kitchen and toilet linen; of terry towelling or similar terry fabrics, of cotton",
      "valueUsd": 273388
    },
    {
      "hs6": "110900",
      "desc": "Wheat gluten; whether or not dried",
      "valueUsd": 243000
    },
    {
      "hs6": "081340",
      "desc": "Fruit, edible; fruit n.e.c. in heading no. 0812, dried",
      "valueUsd": 206398
    },
    {
      "hs6": "520523",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 232.56 but not less than 192.31 decitex (exceeding 43 but not exceeding 52 metric number), not for retail sale",
      "valueUsd": 201482
    },
    {
      "hs6": "040900",
      "desc": "Honey; natural",
      "valueUsd": 197661
    },
    {
      "hs6": "520522",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 714.29 but not less than 232.56 decitex (exceeding 14 but not exceeding 43 metric number), not for retail sale",
      "valueUsd": 182795
    },
    {
      "hs6": "071190",
      "desc": "Vegetables and mixed vegetables; n.e.c. in heading no. 0711, provisionally preserved but unsuitable in that state for immediate consumption",
      "valueUsd": 179329
    },
    {
      "hs6": "520512",
      "desc": "Cotton yarn; (not sewing thread), single, of uncombed fibres, 85% or more by weight of cotton, less than 714.29 but not less than 232.56 decitex (exceeding 14 but not exceeding 43 metric number), not for retail sale",
      "valueUsd": 152800
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 143777
    }
  ],
  "2023": [
    {
      "hs6": "740811",
      "desc": "Copper; wire, of refined copper, of which the maximum cross-sectional dimension exceeds 6mm",
      "valueUsd": 43350881
    },
    {
      "hs6": "710692",
      "desc": "Metals; silver, semi-manufactured",
      "valueUsd": 32582015
    },
    {
      "hs6": "284443",
      "desc": "Radioactive elements, isotopes and compounds; other alloys, dispersions (including cermets), ceramic products and mixtures containing these elements, isotopes or compounds",
      "valueUsd": 2553169
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 2108322
    },
    {
      "hs6": "810294",
      "desc": "Molybdenum; unwrought, including bars and rods obtained simply by sintering",
      "valueUsd": 1632806
    },
    {
      "hs6": "710812",
      "desc": "Metals; gold, non-monetary, unwrought (but not powder)",
      "valueUsd": 1554176
    },
    {
      "hs6": "999999",
      "desc": "Commodities not specified according to kind",
      "valueUsd": 1440141
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 1270509
    },
    {
      "hs6": "110900",
      "desc": "Wheat gluten; whether or not dried",
      "valueUsd": 1123776
    },
    {
      "hs6": "610910",
      "desc": "T-shirts, singlets and other vests; of cotton, knitted or crocheted",
      "valueUsd": 1107326
    },
    {
      "hs6": "010619",
      "desc": "Mammals; live, other than primates, whales, dolphins, porpoises (mammals of the order Cetacea); manatees, dugongs (mammals of the order Sirenia); seals, sea lions, walruses (mammals of the suborder Pinnipedia), camels, other camelids, rabbits and hares",
      "valueUsd": 469458
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 432592
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 410242
    },
    {
      "hs6": "711620",
      "desc": "Stones; precious or semi-precious stones (natural, synthetic or reconstructed) articles of",
      "valueUsd": 389814
    },
    {
      "hs6": "081310",
      "desc": "Fruit, edible; apricots, dried",
      "valueUsd": 368703
    },
    {
      "hs6": "121190",
      "desc": "Plants and parts (including seeds and fruits) n.e.c. in heading no. 1211, of a kind used primarily in perfumery, in pharmacy or for insecticidal, fungicidal or similar purposes, fresh, chilled, frozen or dried, whether or not cut, crushed or powdered",
      "valueUsd": 362554
    },
    {
      "hs6": "840734",
      "desc": "Engines; reciprocating piston engines, of a kind used for the propulsion of vehicles of chapter 87, of a cylinder capacity exceeding 1000cc",
      "valueUsd": 313380
    },
    {
      "hs6": "071190",
      "desc": "Vegetables and mixed vegetables; n.e.c. in heading no. 0711, provisionally preserved but unsuitable in that state for immediate consumption",
      "valueUsd": 305845
    },
    {
      "hs6": "852550",
      "desc": "Transmission apparatus for radio-broadcasting or television, whether or not incorporating sound recording or reproducing apparatus, not incorporating reception apparatus",
      "valueUsd": 246986
    },
    {
      "hs6": "570242",
      "desc": "Carpets and other textile floor coverings; woven, (not tufted or flocked), of man-made textile materials, of pile construction, made up, n.e.c. in item no. 5702.10 or 5702.20",
      "valueUsd": 226013
    },
    {
      "hs6": "392590",
      "desc": "Plastics; builders' ware, n.e.c. or included in heading no. 3925",
      "valueUsd": 208786
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 198197
    },
    {
      "hs6": "151550",
      "desc": "Vegetable oils; sesame oil and its fractions, whether or not refined, but not chemically modified",
      "valueUsd": 162486
    },
    {
      "hs6": "611120",
      "desc": "Garments and clothing accessories; babies', of cotton, knitted or crocheted",
      "valueUsd": 159989
    },
    {
      "hs6": "080232",
      "desc": "Nuts, edible; walnuts, fresh or dried, shelled",
      "valueUsd": 141316
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 140665
    },
    {
      "hs6": "110319",
      "desc": "Cereal groats and meal; n.e.c. in heading no. 1103",
      "valueUsd": 137702
    },
    {
      "hs6": "760612",
      "desc": "Aluminium; plates, sheets and strip, thickness exceeding 0.2mm, alloys, rectangular (including square)",
      "valueUsd": 137133
    },
    {
      "hs6": "392410",
      "desc": "Plastics; tableware and kitchenware",
      "valueUsd": 114926
    },
    {
      "hs6": "710399",
      "desc": "Stones; precious (other than diamonds) and semi-precious stones, (other than rubies, sapphires and emeralds), worked other than simply sawn or roughly shaped, not strung, mounted or set",
      "valueUsd": 114241
    }
  ],
  "2024": [
    {
      "hs6": "999999",
      "desc": "Commodities not specified according to kind",
      "valueUsd": 7899293
    },
    {
      "hs6": "711292",
      "desc": "Waste and scrap of precious metals; of platinum, including metal clad with platinum but excluding sweepings containing other precious metals",
      "valueUsd": 6647619
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 3904333
    },
    {
      "hs6": "741110",
      "desc": "Copper; tubes and pipes, of refined copper",
      "valueUsd": 3228714
    },
    {
      "hs6": "760421",
      "desc": "Aluminium; alloys, hollow profiles",
      "valueUsd": 2655422
    },
    {
      "hs6": "810294",
      "desc": "Molybdenum; unwrought, including bars and rods obtained simply by sintering",
      "valueUsd": 2199071
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 2152912
    },
    {
      "hs6": "284443",
      "desc": "Radioactive elements, isotopes and compounds; other alloys, dispersions (including cermets), ceramic products and mixtures containing these elements, isotopes or compounds",
      "valueUsd": 2092926
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 1584895
    },
    {
      "hs6": "071331",
      "desc": "Vegetables, leguminous; beans of the species vigna mungo (l.) hepper or vigna radiata (l.) wilczek, shelled, whether or not skinned or split, dried",
      "valueUsd": 1461458
    },
    {
      "hs6": "610910",
      "desc": "T-shirts, singlets and other vests; of cotton, knitted or crocheted",
      "valueUsd": 902412
    },
    {
      "hs6": "970610",
      "desc": "Antiques; of an age exceeding 250 years",
      "valueUsd": 815720
    },
    {
      "hs6": "110319",
      "desc": "Cereal groats and meal; n.e.c. in heading no. 1103",
      "valueUsd": 748018
    },
    {
      "hs6": "121190",
      "desc": "Plants and parts (including seeds and fruits) n.e.c. in heading no. 1211, of a kind used primarily in perfumery, in pharmacy or for insecticidal, fungicidal or similar purposes, fresh, chilled, frozen or dried, whether or not cut, crushed or powdered",
      "valueUsd": 497920
    },
    {
      "hs6": "761090",
      "desc": "Aluminium; structures (excluding prefabricated buildings of heading no. 9406) and parts of structures, n.e.c. in heading no. 7610, plates, rods, profiles, tubes and the like",
      "valueUsd": 432859
    },
    {
      "hs6": "680610",
      "desc": "Slag wool, rock wool and similar mineral wools (including intermixtures thereof), in bulk, sheets or rolls",
      "valueUsd": 363779
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 350426
    },
    {
      "hs6": "392590",
      "desc": "Plastics; builders' ware, n.e.c. or included in heading no. 3925",
      "valueUsd": 349687
    },
    {
      "hs6": "854320",
      "desc": "Electrical machines and apparatus; signal generators",
      "valueUsd": 325842
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 271917
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 270997
    },
    {
      "hs6": "283325",
      "desc": "Sulphates; of copper",
      "valueUsd": 221499
    },
    {
      "hs6": "902110",
      "desc": "Orthopaedic or fracture appliances",
      "valueUsd": 218037
    },
    {
      "hs6": "081310",
      "desc": "Fruit, edible; apricots, dried",
      "valueUsd": 211453
    },
    {
      "hs6": "761010",
      "desc": "Aluminium; structures (excluding prefabricated buildings of heading no. 9406) and parts of structures, doors, windows and their frames and thresholds for doors",
      "valueUsd": 209923
    },
    {
      "hs6": "151800",
      "desc": "Animal, vegetable or microbial fats, oils and their fractions; boiled, oxidised, dehydrated or otherwise chemically modified, excluding those of heading no. 1516, inedible mixtures or preparations of fats, oils or their fractions, n.e.c. in chapter 15",
      "valueUsd": 205250
    },
    {
      "hs6": "200819",
      "desc": "Nuts and other seeds; whether or not containing added sugar, other sweetening matter or spirit (excluding ground-nuts except in mixtures)",
      "valueUsd": 182169
    },
    {
      "hs6": "081340",
      "desc": "Fruit, edible; fruit n.e.c. in heading no. 0812, dried",
      "valueUsd": 176535
    },
    {
      "hs6": "760820",
      "desc": "Aluminium; tubes and pipes, alloys",
      "valueUsd": 169712
    },
    {
      "hs6": "151550",
      "desc": "Vegetable oils; sesame oil and its fractions, whether or not refined, but not chemically modified",
      "valueUsd": 148436
    }
  ],
  "2025": [
    {
      "hs6": "711590",
      "desc": "Metal; precious or metal clad with precious metal, other than that of item no. 7115.10",
      "valueUsd": 424457272
    },
    {
      "hs6": "710692",
      "desc": "Metals; silver, semi-manufactured",
      "valueUsd": 76532264
    },
    {
      "hs6": "999999",
      "desc": "Commodities not specified according to kind",
      "valueUsd": 18170695
    },
    {
      "hs6": "710691",
      "desc": "Metals; silver, unwrought, (but not powder)",
      "valueUsd": 9863778
    },
    {
      "hs6": "760421",
      "desc": "Aluminium; alloys, hollow profiles",
      "valueUsd": 5656651
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 4876868
    },
    {
      "hs6": "810294",
      "desc": "Molybdenum; unwrought, including bars and rods obtained simply by sintering",
      "valueUsd": 4441682
    },
    {
      "hs6": "741110",
      "desc": "Copper; tubes and pipes, of refined copper",
      "valueUsd": 3300666
    },
    {
      "hs6": "284443",
      "desc": "Radioactive elements, isotopes and compounds; other alloys, dispersions (including cermets), ceramic products and mixtures containing these elements, isotopes or compounds",
      "valueUsd": 2842350
    },
    {
      "hs6": "270750",
      "desc": "Aromatic hydrocarbon mixtures; n.e.c. in heading no. 2707, of which 65% or more by volume (including losses) distils at 250 degrees Celsius by the ISO 3405 method (equivalent to the ASTM D 86 method)",
      "valueUsd": 2667643
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 2387749
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 2213467
    },
    {
      "hs6": "810297",
      "desc": "Molybdenum; waste and scrap",
      "valueUsd": 2157248
    },
    {
      "hs6": "081310",
      "desc": "Fruit, edible; apricots, dried",
      "valueUsd": 1492251
    },
    {
      "hs6": "071331",
      "desc": "Vegetables, leguminous; beans of the species vigna mungo (l.) hepper or vigna radiata (l.) wilczek, shelled, whether or not skinned or split, dried",
      "valueUsd": 1361601
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 1335853
    },
    {
      "hs6": "100630",
      "desc": "Cereals; rice, semi-milled or wholly milled, whether or not polished or glazed",
      "valueUsd": 1058771
    },
    {
      "hs6": "610910",
      "desc": "T-shirts, singlets and other vests; of cotton, knitted or crocheted",
      "valueUsd": 1012297
    },
    {
      "hs6": "340490",
      "desc": "Waxes; artificial and prepared, other than of polyethylene glycol",
      "valueUsd": 982839
    },
    {
      "hs6": "110319",
      "desc": "Cereal groats and meal; n.e.c. in heading no. 1103",
      "valueUsd": 981733
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 799674
    },
    {
      "hs6": "841899",
      "desc": "Refrigerating or freezing equipment; parts thereof, other than furniture",
      "valueUsd": 576204
    },
    {
      "hs6": "200819",
      "desc": "Nuts and other seeds; whether or not containing added sugar, other sweetening matter or spirit (excluding ground-nuts except in mixtures)",
      "valueUsd": 563735
    },
    {
      "hs6": "681599",
      "desc": "Stone articles and articles of other mineral substances; n.e.c. or included in heading no. 6815",
      "valueUsd": 421479
    },
    {
      "hs6": "760612",
      "desc": "Aluminium; plates, sheets and strip, thickness exceeding 0.2mm, alloys, rectangular (including square)",
      "valueUsd": 388226
    },
    {
      "hs6": "761090",
      "desc": "Aluminium; structures (excluding prefabricated buildings of heading no. 9406) and parts of structures, n.e.c. in heading no. 7610, plates, rods, profiles, tubes and the like",
      "valueUsd": 349609
    },
    {
      "hs6": "810197",
      "desc": "Tungsten (wolfram); waste and scrap",
      "valueUsd": 341025
    },
    {
      "hs6": "121190",
      "desc": "Plants and parts (including seeds and fruits) n.e.c. in heading no. 1211, of a kind used primarily in perfumery, in pharmacy or for insecticidal, fungicidal or similar purposes, fresh, chilled, frozen or dried, whether or not cut, crushed or powdered",
      "valueUsd": 313659
    },
    {
      "hs6": "220210",
      "desc": "Waters; including mineral and aerated, containing added sugar or other sweetening matter or flavoured",
      "valueUsd": 292342
    },
    {
      "hs6": "903180",
      "desc": "Instruments, appliances and machines; for measuring or checking n.e.c. in chapter 90",
      "valueUsd": 270067
    }
  ]
};

/** Top 30 HS-6 codes for UZ imports (US-reported exports) by year. */
export const topUsExportsToUzByYear: Record<number, Hs6Row[]> = {
  "2021": [
    {
      "hs6": "999999",
      "desc": "Commodities not specified according to kind",
      "valueUsd": 244205630
    },
    {
      "hs6": "870410",
      "desc": "Vehicles; dumpers, designed for off-highway use, for transport of goods",
      "valueUsd": 20288052
    },
    {
      "hs6": "841199",
      "desc": "Turbines; parts of gas turbines (excluding turbo-jets and turbo-propellers)",
      "valueUsd": 17586401
    },
    {
      "hs6": "300220",
      "desc": "HS 300220",
      "valueUsd": 15637051
    },
    {
      "hs6": "401180",
      "desc": "Rubber; new pneumatic tyres, of a kind used on construction, mining or industrial handling vehicles and machines",
      "valueUsd": 15233720
    },
    {
      "hs6": "870324",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 3000cc",
      "valueUsd": 8521590
    },
    {
      "hs6": "841182",
      "desc": "Turbines; gas-turbines (excluding turbo-jets and turbo-propellers), of a power exceeding 5000kW",
      "valueUsd": 6106708
    },
    {
      "hs6": "843351",
      "desc": "Combine harvester-threshers",
      "valueUsd": 6074027
    },
    {
      "hs6": "847130",
      "desc": "Automatic data processing machines; portable, weighing not more than 10kg, consisting of at least a central processing unit, a keyboard and a display",
      "valueUsd": 3442065
    },
    {
      "hs6": "851712",
      "desc": "HS 851712",
      "valueUsd": 2403405
    },
    {
      "hs6": "300290",
      "desc": "Toxins, cultures of micro-organisms (excluding yeasts) and similar products",
      "valueUsd": 2125000
    },
    {
      "hs6": "841360",
      "desc": "Pumps; rotary positive displacement pumps, n.e.c. in heading no. 8413, for liquids",
      "valueUsd": 2050910
    },
    {
      "hs6": "847910",
      "desc": "Machinery and mechanical appliances; for public works, building or the like",
      "valueUsd": 1886539
    },
    {
      "hs6": "902219",
      "desc": "Apparatus based on the use of x-rays, including radiography or radiotherapy apparatus; for other than medical, surgical, dental or veterinary uses",
      "valueUsd": 1671304
    },
    {
      "hs6": "854370",
      "desc": "Electrical machines and apparatus; having individual functions, not specified or included elsewhere in this chapter, n.e.c. in heading no. 8543",
      "valueUsd": 1556361
    },
    {
      "hs6": "847150",
      "desc": "Units of automatic data processing machines; processing units other than those of item no. 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units or output units",
      "valueUsd": 1526663
    },
    {
      "hs6": "901812",
      "desc": "Medical, surgical instruments and appliances; ultrasonic scanning apparatus",
      "valueUsd": 1454131
    },
    {
      "hs6": "840219",
      "desc": "Boilers; vapour generating boilers, including hybrid boilers n.e.c. in heading no. 8402",
      "valueUsd": 1442901
    },
    {
      "hs6": "843041",
      "desc": "Boring or sinking machinery; self-propelled, n.e.c. in heading no. 8430",
      "valueUsd": 1351816
    },
    {
      "hs6": "392690",
      "desc": "Plastics; other articles n.e.c. in chapter 39",
      "valueUsd": 1336403
    },
    {
      "hs6": "901580",
      "desc": "Surveying equipment; articles n.e.c. in heading no. 9015, including hydrographic, oceanographic, hydrological, meteorological or geophysical instruments and appliances (excluding compasses)",
      "valueUsd": 1313444
    },
    {
      "hs6": "847190",
      "desc": "Magnetic or optical readers, machines for transcribing data onto data media in coded form and machines for processing such data, not elsewhere specified or included",
      "valueUsd": 1221708
    },
    {
      "hs6": "840999",
      "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
      "valueUsd": 1127797
    },
    {
      "hs6": "491199",
      "desc": "Printed matter; n.e.c. in heading no. 4911",
      "valueUsd": 1058038
    },
    {
      "hs6": "851762",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
      "valueUsd": 1009690
    },
    {
      "hs6": "382499",
      "desc": "Chemical products, mixtures and preparations; n.e.c. heading 3824",
      "valueUsd": 1004480
    },
    {
      "hs6": "851680",
      "desc": "Resistors; electric heating, other than those of heading no. 8545",
      "valueUsd": 918598
    },
    {
      "hs6": "870829",
      "desc": "Vehicles; parts and accessories, of bodies, other than safety seat belts",
      "valueUsd": 834175
    },
    {
      "hs6": "853110",
      "desc": "Signalling apparatus; electric, sound or visual, burglar or fire alarms and similar, other than those of heading no. 8512 or 8530",
      "valueUsd": 811235
    },
    {
      "hs6": "841490",
      "desc": "Pumps and compressors; parts, of air or vacuum pumps, air or other gas compressors and fans, ventilating or recycling hoods incorporating a fan",
      "valueUsd": 808327
    }
  ],
  "2022": [
    {
      "hs6": "300241",
      "desc": "Vaccines, toxins, cultures of micro-organisms (excluding yeasts) and similar products; for human medicine",
      "valueUsd": 92876494
    },
    {
      "hs6": "870324",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 3000cc",
      "valueUsd": 38961232
    },
    {
      "hs6": "999999",
      "desc": "Commodities not specified according to kind",
      "valueUsd": 32035794
    },
    {
      "hs6": "401180",
      "desc": "Rubber; new pneumatic tyres, of a kind used on construction, mining or industrial handling vehicles and machines",
      "valueUsd": 9275477
    },
    {
      "hs6": "850164",
      "desc": "Electric generators; AC generators, (alternators), other than photovoltaic generators, of an output exceeding 750kVA",
      "valueUsd": 5755420
    },
    {
      "hs6": "841360",
      "desc": "Pumps; rotary positive displacement pumps, n.e.c. in heading no. 8413, for liquids",
      "valueUsd": 5183888
    },
    {
      "hs6": "853710",
      "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
      "valueUsd": 3743130
    },
    {
      "hs6": "902219",
      "desc": "Apparatus based on the use of x-rays, including radiography or radiotherapy apparatus; for other than medical, surgical, dental or veterinary uses",
      "valueUsd": 3457424
    },
    {
      "hs6": "847910",
      "desc": "Machinery and mechanical appliances; for public works, building or the like",
      "valueUsd": 3140866
    },
    {
      "hs6": "854370",
      "desc": "Electrical machines and apparatus; having individual functions, not specified or included elsewhere in this chapter, n.e.c. in heading no. 8543",
      "valueUsd": 3087072
    },
    {
      "hs6": "847130",
      "desc": "Automatic data processing machines; portable, weighing not more than 10kg, consisting of at least a central processing unit, a keyboard and a display",
      "valueUsd": 2866374
    },
    {
      "hs6": "851714",
      "desc": "Telephone sets; other than smartphones, for cellular or other wireless networks",
      "valueUsd": 2408922
    },
    {
      "hs6": "901890",
      "desc": "Medical, surgical or dental instruments and appliances; n.e.c. in heading no. 9018",
      "valueUsd": 2137828
    },
    {
      "hs6": "870590",
      "desc": "Vehicles; break-down lorries, road-sweepers, spraying lorries, mobile workshops, mobile radiological units, and other special purpose vehicles n.e.c. in heading no. 8705",
      "valueUsd": 1971812
    },
    {
      "hs6": "870195",
      "desc": "Tractors; n.e.c. in heading no 8701 (other than tractors of heading no 8709); of an engine power exceeding 130kW",
      "valueUsd": 1913890
    },
    {
      "hs6": "901580",
      "desc": "Surveying equipment; articles n.e.c. in heading no. 9015, including hydrographic, oceanographic, hydrological, meteorological or geophysical instruments and appliances (excluding compasses)",
      "valueUsd": 1880730
    },
    {
      "hs6": "871690",
      "desc": "Trailers, semi-trailers and other vehicles not mechanically propelled; parts thereof for heading no. 8716",
      "valueUsd": 1720703
    },
    {
      "hs6": "903010",
      "desc": "Instruments and apparatus; for measuring or detecting ionising radiations",
      "valueUsd": 1655160
    },
    {
      "hs6": "841490",
      "desc": "Pumps and compressors; parts, of air or vacuum pumps, air or other gas compressors and fans, ventilating or recycling hoods incorporating a fan",
      "valueUsd": 1513743
    },
    {
      "hs6": "630900",
      "desc": "Clothing; worn, and other worn articles",
      "valueUsd": 1287040
    },
    {
      "hs6": "851762",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
      "valueUsd": 1254719
    },
    {
      "hs6": "853110",
      "desc": "Signalling apparatus; electric, sound or visual, burglar or fire alarms and similar, other than those of heading no. 8512 or 8530",
      "valueUsd": 1192477
    },
    {
      "hs6": "847141",
      "desc": "Automatic data processing machines; comprising in the same housing at least a central processing unit and an input and output unit, whether or not combined, n.e.c. in item no. 8471.30",
      "valueUsd": 1139753
    },
    {
      "hs6": "843390",
      "desc": "Harvesting machinery; parts, including parts of threshing machinery, straw or fodder balers and grass or hay mowers",
      "valueUsd": 1120401
    },
    {
      "hs6": "491199",
      "desc": "Printed matter; n.e.c. in heading no. 4911",
      "valueUsd": 1069019
    },
    {
      "hs6": "950450",
      "desc": "Games; video game consoles and machines, other than those of subheading 9504.30",
      "valueUsd": 1064425
    },
    {
      "hs6": "848340",
      "desc": "Gears and gearing; (not toothed wheels, chain sprockets and other transmission elements presented separately); ball or roller screws; gear boxes and other speed changers, including torque converters",
      "valueUsd": 1052163
    },
    {
      "hs6": "844519",
      "desc": "Textile machinery; n.e.c. in heading no. 8445, for preparing textile fibres",
      "valueUsd": 1037083
    },
    {
      "hs6": "902730",
      "desc": "Spectrometers, spectrophotometers and spectrographs; using optical radiations (UV, visible, IR)",
      "valueUsd": 1005218
    },
    {
      "hs6": "300490",
      "desc": "Medicaments; consisting of mixed or unmixed products n.e.c. in heading no. 3004, for therapeutic or prophylactic uses, packaged for retail sale",
      "valueUsd": 1002000
    }
  ],
  "2023": [
    {
      "hs6": "870324",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 3000cc",
      "valueUsd": 61303222
    },
    {
      "hs6": "840219",
      "desc": "Boilers; vapour generating boilers, including hybrid boilers n.e.c. in heading no. 8402",
      "valueUsd": 14926380
    },
    {
      "hs6": "853710",
      "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
      "valueUsd": 14707379
    },
    {
      "hs6": "401180",
      "desc": "Rubber; new pneumatic tyres, of a kind used on construction, mining or industrial handling vehicles and machines",
      "valueUsd": 10410924
    },
    {
      "hs6": "854370",
      "desc": "Electrical machines and apparatus; having individual functions, not specified or included elsewhere in this chapter, n.e.c. in heading no. 8543",
      "valueUsd": 9102291
    },
    {
      "hs6": "843810",
      "desc": "Machinery; industrial, for bakery and for the manufacture of macaroni, spaghetti or similar products",
      "valueUsd": 7656929
    },
    {
      "hs6": "841360",
      "desc": "Pumps; rotary positive displacement pumps, n.e.c. in heading no. 8413, for liquids",
      "valueUsd": 7225820
    },
    {
      "hs6": "841182",
      "desc": "Turbines; gas-turbines (excluding turbo-jets and turbo-propellers), of a power exceeding 5000kW",
      "valueUsd": 7000000
    },
    {
      "hs6": "851762",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
      "valueUsd": 6704592
    },
    {
      "hs6": "870895",
      "desc": "Vehicle parts; safety airbags with inflater system; parts thereof",
      "valueUsd": 5601608
    },
    {
      "hs6": "853225",
      "desc": "Electrical capacitors; fixed, dielectric of paper or plastics",
      "valueUsd": 3676968
    },
    {
      "hs6": "846229",
      "desc": "Machine-tools; bending, folding, straightening or flattening machines (including press brakes), for working metal, numerically controlled n.e.c. in item 84.62.2",
      "valueUsd": 3166830
    },
    {
      "hs6": "848180",
      "desc": "Taps, cocks, valves and similar appliances; for pipes, boiler shells, tanks, vats or the like, including thermostatically controlled valves",
      "valueUsd": 3020229
    },
    {
      "hs6": "847141",
      "desc": "Automatic data processing machines; comprising in the same housing at least a central processing unit and an input and output unit, whether or not combined, n.e.c. in item no. 8471.30",
      "valueUsd": 2552964
    },
    {
      "hs6": "481151",
      "desc": "Paper and paperboard; coated, impregnated or covered with plastics (excluding adhesives), bleached, weighing more than 150g/m2, other than goods of heading no. 4803, 4809, or 4810",
      "valueUsd": 2525955
    },
    {
      "hs6": "851714",
      "desc": "Telephone sets; other than smartphones, for cellular or other wireless networks",
      "valueUsd": 2286559
    },
    {
      "hs6": "870390",
      "desc": "Vehicles; for transport of persons (other than those of heading no. 8702) n.e.c. in heading no. 8703",
      "valueUsd": 2267981
    },
    {
      "hs6": "830120",
      "desc": "Locks; of a kind used for motor vehicles (key, combination or electrically operated), of base metal",
      "valueUsd": 2200449
    },
    {
      "hs6": "382219",
      "desc": "Reagents; diagnostic or laboratory reagents on a backing, prepared diagnostic or laboratory reagents whether or not on a backing, whether or not put up in the form of kits; n.e.c.in item 3822.1",
      "valueUsd": 2130762
    },
    {
      "hs6": "840999",
      "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
      "valueUsd": 2098011
    },
    {
      "hs6": "847150",
      "desc": "Units of automatic data processing machines; processing units other than those of item no. 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units or output units",
      "valueUsd": 2008531
    },
    {
      "hs6": "240120",
      "desc": "Tobacco; partly or wholly stemmed or stripped",
      "valueUsd": 1879809
    },
    {
      "hs6": "840991",
      "desc": "Engines; parts, suitable for use solely or principally with spark-ignition internal combustion piston engines (for other than aircraft)",
      "valueUsd": 1491272
    },
    {
      "hs6": "870130",
      "desc": "Tractors; track-laying",
      "valueUsd": 1399554
    },
    {
      "hs6": "470321",
      "desc": "Wood pulp; chemical wood pulp, soda or sulphate, (other than dissolving grades), semi-bleached or bleached, of coniferous wood",
      "valueUsd": 1262959
    },
    {
      "hs6": "841490",
      "desc": "Pumps and compressors; parts, of air or vacuum pumps, air or other gas compressors and fans, ventilating or recycling hoods incorporating a fan",
      "valueUsd": 1181760
    },
    {
      "hs6": "630900",
      "desc": "Clothing; worn, and other worn articles",
      "valueUsd": 1176270
    },
    {
      "hs6": "847130",
      "desc": "Automatic data processing machines; portable, weighing not more than 10kg, consisting of at least a central processing unit, a keyboard and a display",
      "valueUsd": 1173836
    },
    {
      "hs6": "870899",
      "desc": "Vehicle parts and accessories; n.e.c. in heading no. 8708",
      "valueUsd": 1147897
    },
    {
      "hs6": "847910",
      "desc": "Machinery and mechanical appliances; for public works, building or the like",
      "valueUsd": 1109120
    }
  ],
  "2024": [
    {
      "hs6": "854370",
      "desc": "Electrical machines and apparatus; having individual functions, not specified or included elsewhere in this chapter, n.e.c. in heading no. 8543",
      "valueUsd": 12934438
    },
    {
      "hs6": "841360",
      "desc": "Pumps; rotary positive displacement pumps, n.e.c. in heading no. 8413, for liquids",
      "valueUsd": 11448332
    },
    {
      "hs6": "853710",
      "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
      "valueUsd": 11384023
    },
    {
      "hs6": "841182",
      "desc": "Turbines; gas-turbines (excluding turbo-jets and turbo-propellers), of a power exceeding 5000kW",
      "valueUsd": 4542567
    },
    {
      "hs6": "840999",
      "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
      "valueUsd": 4175882
    },
    {
      "hs6": "840890",
      "desc": "Engines; compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of a kind used for other than marine propulsion or the vehicles of chapter 87",
      "valueUsd": 3290001
    },
    {
      "hs6": "854430",
      "desc": "Insulated electric conductors; ignition wiring sets and other wiring sets of a kind used in vehicles, aircraft or ships",
      "valueUsd": 3103318
    },
    {
      "hs6": "481151",
      "desc": "Paper and paperboard; coated, impregnated or covered with plastics (excluding adhesives), bleached, weighing more than 150g/m2, other than goods of heading no. 4803, 4809, or 4810",
      "valueUsd": 2706264
    },
    {
      "hs6": "850213",
      "desc": "Electric generating sets; with compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of an output exceeding 375kVA",
      "valueUsd": 2645579
    },
    {
      "hs6": "846249",
      "desc": "Machine-tools; punching, notching or nibbling machines (excluding presses) for flat products including combined punching and shearing machines, other than numerically controlled, for working metal",
      "valueUsd": 2347560
    },
    {
      "hs6": "846211",
      "desc": "Machine-tools; forging and die-forging machines (including presses), closed die forging machines, for working metal",
      "valueUsd": 2300000
    },
    {
      "hs6": "830120",
      "desc": "Locks; of a kind used for motor vehicles (key, combination or electrically operated), of base metal",
      "valueUsd": 2201721
    },
    {
      "hs6": "841199",
      "desc": "Turbines; parts of gas turbines (excluding turbo-jets and turbo-propellers)",
      "valueUsd": 2139670
    },
    {
      "hs6": "840790",
      "desc": "Engines; rotary internal combustion piston engines, for other than aircraft or marine propulsion",
      "valueUsd": 2082000
    },
    {
      "hs6": "851762",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
      "valueUsd": 2079353
    },
    {
      "hs6": "382219",
      "desc": "Reagents; diagnostic or laboratory reagents on a backing, prepared diagnostic or laboratory reagents whether or not on a backing, whether or not put up in the form of kits; n.e.c.in item 3822.1",
      "valueUsd": 1940433
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 1909613
    },
    {
      "hs6": "820719",
      "desc": "Tools, interchangeable; rock drilling or earth boring tools, with working part (other than of cermets), whether or not power operated, including parts",
      "valueUsd": 1895918
    },
    {
      "hs6": "844313",
      "desc": "Printing machinery; offset, n.e.c. in item no. 8443.1",
      "valueUsd": 1798510
    },
    {
      "hs6": "240120",
      "desc": "Tobacco; partly or wholly stemmed or stripped",
      "valueUsd": 1581648
    },
    {
      "hs6": "470321",
      "desc": "Wood pulp; chemical wood pulp, soda or sulphate, (other than dissolving grades), semi-bleached or bleached, of coniferous wood",
      "valueUsd": 1562775
    },
    {
      "hs6": "851714",
      "desc": "Telephone sets; other than smartphones, for cellular or other wireless networks",
      "valueUsd": 1501663
    },
    {
      "hs6": "847130",
      "desc": "Automatic data processing machines; portable, weighing not more than 10kg, consisting of at least a central processing unit, a keyboard and a display",
      "valueUsd": 1489445
    },
    {
      "hs6": "700910",
      "desc": "Glass; rear-view mirrors for vehicles",
      "valueUsd": 1482688
    },
    {
      "hs6": "870895",
      "desc": "Vehicle parts; safety airbags with inflater system; parts thereof",
      "valueUsd": 1482599
    },
    {
      "hs6": "491199",
      "desc": "Printed matter; n.e.c. in heading no. 4911",
      "valueUsd": 1459074
    },
    {
      "hs6": "847180",
      "desc": "Units of automatic data processing machines; n.e.c. in item no. 8471.50, 8471.60 or 8471.70",
      "valueUsd": 1392772
    },
    {
      "hs6": "840991",
      "desc": "Engines; parts, suitable for use solely or principally with spark-ignition internal combustion piston engines (for other than aircraft)",
      "valueUsd": 1361300
    },
    {
      "hs6": "020714",
      "desc": "Meat and edible offal; of fowls of the species Gallus domesticus, cuts and offal, frozen",
      "valueUsd": 1214068
    },
    {
      "hs6": "847150",
      "desc": "Units of automatic data processing machines; processing units other than those of item no. 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units or output units",
      "valueUsd": 1208576
    }
  ],
  "2025": [
    {
      "hs6": "841112",
      "desc": "Turbo-jets; of a thrust exceeding 25kN",
      "valueUsd": 8000000
    },
    {
      "hs6": "841121",
      "desc": "Turbo-propellers; of a power not exceeding 1100kW",
      "valueUsd": 6379476
    },
    {
      "hs6": "401180",
      "desc": "Rubber; new pneumatic tyres, of a kind used on construction, mining or industrial handling vehicles and machines",
      "valueUsd": 5760418
    },
    {
      "hs6": "841182",
      "desc": "Turbines; gas-turbines (excluding turbo-jets and turbo-propellers), of a power exceeding 5000kW",
      "valueUsd": 4886277
    },
    {
      "hs6": "841199",
      "desc": "Turbines; parts of gas turbines (excluding turbo-jets and turbo-propellers)",
      "valueUsd": 4161351
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 4001099
    },
    {
      "hs6": "851762",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
      "valueUsd": 3346721
    },
    {
      "hs6": "847180",
      "desc": "Units of automatic data processing machines; n.e.c. in item no. 8471.50, 8471.60 or 8471.70",
      "valueUsd": 2730299
    },
    {
      "hs6": "843351",
      "desc": "Combine harvester-threshers",
      "valueUsd": 2648000
    },
    {
      "hs6": "850213",
      "desc": "Electric generating sets; with compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of an output exceeding 375kVA",
      "valueUsd": 2558890
    },
    {
      "hs6": "840991",
      "desc": "Engines; parts, suitable for use solely or principally with spark-ignition internal combustion piston engines (for other than aircraft)",
      "valueUsd": 2425573
    },
    {
      "hs6": "850153",
      "desc": "Electric motors; AC motors, multi-phase, of an output exceeding 75kW",
      "valueUsd": 2163125
    },
    {
      "hs6": "700910",
      "desc": "Glass; rear-view mirrors for vehicles",
      "valueUsd": 2132619
    },
    {
      "hs6": "731815",
      "desc": "Iron or steel; threaded screws and bolts n.e.c. in item no. 7318.1, whether or not with their nuts or washers",
      "valueUsd": 2054236
    },
    {
      "hs6": "848180",
      "desc": "Taps, cocks, valves and similar appliances; for pipes, boiler shells, tanks, vats or the like, including thermostatically controlled valves",
      "valueUsd": 2048582
    },
    {
      "hs6": "392690",
      "desc": "Plastics; other articles n.e.c. in chapter 39",
      "valueUsd": 1997425
    },
    {
      "hs6": "848340",
      "desc": "Gears and gearing; (not toothed wheels, chain sprockets and other transmission elements presented separately); ball or roller screws; gear boxes and other speed changers, including torque converters",
      "valueUsd": 1988967
    },
    {
      "hs6": "820719",
      "desc": "Tools, interchangeable; rock drilling or earth boring tools, with working part (other than of cermets), whether or not power operated, including parts",
      "valueUsd": 1985399
    },
    {
      "hs6": "847330",
      "desc": "Machinery; parts and accessories (other than covers, carrying cases and the like) of the machines of heading no. 8471",
      "valueUsd": 1921628
    },
    {
      "hs6": "851769",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the transmission or reception of voice, images or other data (including wired/wireless networks), n.e.c. in item no. 8517.6",
      "valueUsd": 1845686
    },
    {
      "hs6": "293690",
      "desc": "Vitamins; n.e.c. in heading no. 2936, including natural concentrates",
      "valueUsd": 1775673
    },
    {
      "hs6": "271019",
      "desc": "Petroleum oils and oils from bituminous minerals, not containing biodiesel, not crude, not waste oils; preparations n.e.c, containing by weight 70% or more of petroleum oils or oils from bituminous minerals; not light oils and preparations",
      "valueUsd": 1665051
    },
    {
      "hs6": "470321",
      "desc": "Wood pulp; chemical wood pulp, soda or sulphate, (other than dissolving grades), semi-bleached or bleached, of coniferous wood",
      "valueUsd": 1639998
    },
    {
      "hs6": "842230",
      "desc": "Machinery; for filling, closing, sealing, capsuling or labelling bottles, cans, bags or other containers, machinery for aerating beverages",
      "valueUsd": 1588400
    },
    {
      "hs6": "847150",
      "desc": "Units of automatic data processing machines; processing units other than those of item no. 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units or output units",
      "valueUsd": 1462042
    },
    {
      "hs6": "841490",
      "desc": "Pumps and compressors; parts, of air or vacuum pumps, air or other gas compressors and fans, ventilating or recycling hoods incorporating a fan",
      "valueUsd": 1410871
    },
    {
      "hs6": "830120",
      "desc": "Locks; of a kind used for motor vehicles (key, combination or electrically operated), of base metal",
      "valueUsd": 1401567
    },
    {
      "hs6": "481151",
      "desc": "Paper and paperboard; coated, impregnated or covered with plastics (excluding adhesives), bleached, weighing more than 150g/m2, other than goods of heading no. 4803, 4809, or 4810",
      "valueUsd": 1270604
    },
    {
      "hs6": "844332",
      "desc": "Printing, copying, and facsimile machines; single-function printing, copying or facsimile machines, capable of connecting to an automatic data processing machine or to a network",
      "valueUsd": 1261619
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 1255508
    }
  ]
};

/** Top 30 HS-6 codes — UZ-reporter view of exports to US. */
export const topUzExportsToUsByYear: Record<number, Hs6Row[]> = {
  "2021": [
    {
      "hs6": "880330",
      "desc": "HS 880330",
      "valueUsd": 4027869.99
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 2633982
    },
    {
      "hs6": "711319",
      "desc": "Jewellery; of precious metal (excluding silver) whether or not plated or clad with precious metal, and parts thereof",
      "valueUsd": 2618233
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 1954989
    },
    {
      "hs6": "841112",
      "desc": "Turbo-jets; of a thrust exceeding 25kN",
      "valueUsd": 1580836
    },
    {
      "hs6": "271019",
      "desc": "Petroleum oils and oils from bituminous minerals, not containing biodiesel, not crude, not waste oils; preparations n.e.c, containing by weight 70% or more of petroleum oils or oils from bituminous minerals; not light oils and preparations",
      "valueUsd": 1422200.99
    },
    {
      "hs6": "853710",
      "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
      "valueUsd": 1059230
    },
    {
      "hs6": "630260",
      "desc": "Kitchen and toilet linen; of terry towelling or similar terry fabrics, of cotton",
      "valueUsd": 652606
    },
    {
      "hs6": "130212",
      "desc": "Vegetable saps and extracts; of liquorice",
      "valueUsd": 462720
    },
    {
      "hs6": "570242",
      "desc": "Carpets and other textile floor coverings; woven, (not tufted or flocked), of man-made textile materials, of pile construction, made up, n.e.c. in item no. 5702.10 or 5702.20",
      "valueUsd": 429976
    },
    {
      "hs6": "520513",
      "desc": "Cotton yarn; (not sewing thread), single, of uncombed fibres, 85% or more by weight of cotton, less than 232.56 but not less than 192.31 decitex (exceeding 43 but not exceeding 52 metric number), not for retail sale",
      "valueUsd": 341539
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 241397
    },
    {
      "hs6": "392590",
      "desc": "Plastics; builders' ware, n.e.c. or included in heading no. 3925",
      "valueUsd": 234054
    },
    {
      "hs6": "081310",
      "desc": "Fruit, edible; apricots, dried",
      "valueUsd": 209983.99
    },
    {
      "hs6": "880320",
      "desc": "HS 880320",
      "valueUsd": 181047
    },
    {
      "hs6": "520512",
      "desc": "Cotton yarn; (not sewing thread), single, of uncombed fibres, 85% or more by weight of cotton, less than 714.29 but not less than 232.56 decitex (exceeding 14 but not exceeding 43 metric number), not for retail sale",
      "valueUsd": 179361
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 141931.99
    },
    {
      "hs6": "520523",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 232.56 but not less than 192.31 decitex (exceeding 43 but not exceeding 52 metric number), not for retail sale",
      "valueUsd": 137324
    },
    {
      "hs6": "520522",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 714.29 but not less than 232.56 decitex (exceeding 14 but not exceeding 43 metric number), not for retail sale",
      "valueUsd": 133436
    },
    {
      "hs6": "610910",
      "desc": "T-shirts, singlets and other vests; of cotton, knitted or crocheted",
      "valueUsd": 121357
    },
    {
      "hs6": "271600",
      "desc": "Electrical energy",
      "valueUsd": 116140.85
    },
    {
      "hs6": "151550",
      "desc": "Vegetable oils; sesame oil and its fractions, whether or not refined, but not chemically modified",
      "valueUsd": 78962
    },
    {
      "hs6": "040490",
      "desc": "Dairy produce; natural milk constituents (excluding whey), whether or not containing added sugar or other sweetening matter, n.e.c. in chapter 04",
      "valueUsd": 76956.98
    },
    {
      "hs6": "670300",
      "desc": "Human hair, dressed, thinned, bleached or otherwise worked; wool or other animal hair or other textile materials, prepared for use in making wigs or the like",
      "valueUsd": 73180.99
    },
    {
      "hs6": "610442",
      "desc": "Dresses; women's or girls', of cotton, knitted or crocheted",
      "valueUsd": 69651
    },
    {
      "hs6": "611120",
      "desc": "Garments and clothing accessories; babies', of cotton, knitted or crocheted",
      "valueUsd": 63961
    },
    {
      "hs6": "760612",
      "desc": "Aluminium; plates, sheets and strip, thickness exceeding 0.2mm, alloys, rectangular (including square)",
      "valueUsd": 63885
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 61802
    },
    {
      "hs6": "600622",
      "desc": "Fabrics; knitted or crocheted fabrics, other than those of headings 60.01 to 60.04, of cotton, dyed",
      "valueUsd": 53009
    },
    {
      "hs6": "611020",
      "desc": "Jerseys, pullovers, cardigans, waistcoats and similar articles; of cotton, knitted or crocheted",
      "valueUsd": 51028
    }
  ],
  "2022": [
    {
      "hs6": "841112",
      "desc": "Turbo-jets; of a thrust exceeding 25kN",
      "valueUsd": 4793351
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 2172756
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 1167787
    },
    {
      "hs6": "110900",
      "desc": "Wheat gluten; whether or not dried",
      "valueUsd": 920122
    },
    {
      "hs6": "271019",
      "desc": "Petroleum oils and oils from bituminous minerals, not containing biodiesel, not crude, not waste oils; preparations n.e.c, containing by weight 70% or more of petroleum oils or oils from bituminous minerals; not light oils and preparations",
      "valueUsd": 905559.8
    },
    {
      "hs6": "711319",
      "desc": "Jewellery; of precious metal (excluding silver) whether or not plated or clad with precious metal, and parts thereof",
      "valueUsd": 671891
    },
    {
      "hs6": "880320",
      "desc": "HS 880320",
      "valueUsd": 600074
    },
    {
      "hs6": "570242",
      "desc": "Carpets and other textile floor coverings; woven, (not tufted or flocked), of man-made textile materials, of pile construction, made up, n.e.c. in item no. 5702.10 or 5702.20",
      "valueUsd": 511905
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 431331
    },
    {
      "hs6": "840734",
      "desc": "Engines; reciprocating piston engines, of a kind used for the propulsion of vehicles of chapter 87, of a cylinder capacity exceeding 1000cc",
      "valueUsd": 321007
    },
    {
      "hs6": "392590",
      "desc": "Plastics; builders' ware, n.e.c. or included in heading no. 3925",
      "valueUsd": 283596
    },
    {
      "hs6": "130212",
      "desc": "Vegetable saps and extracts; of liquorice",
      "valueUsd": 264480
    },
    {
      "hs6": "040900",
      "desc": "Honey; natural",
      "valueUsd": 184952
    },
    {
      "hs6": "271600",
      "desc": "Electrical energy",
      "valueUsd": 174883.451
    },
    {
      "hs6": "520523",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 232.56 but not less than 192.31 decitex (exceeding 43 but not exceeding 52 metric number), not for retail sale",
      "valueUsd": 164936
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 161908.99
    },
    {
      "hs6": "520513",
      "desc": "Cotton yarn; (not sewing thread), single, of uncombed fibres, 85% or more by weight of cotton, less than 232.56 but not less than 192.31 decitex (exceeding 43 but not exceeding 52 metric number), not for retail sale",
      "valueUsd": 138670
    },
    {
      "hs6": "010619",
      "desc": "Mammals; live, other than primates, whales, dolphins, porpoises (mammals of the order Cetacea); manatees, dugongs (mammals of the order Sirenia); seals, sea lions, walruses (mammals of the suborder Pinnipedia), camels, other camelids, rabbits and hares",
      "valueUsd": 120962.99
    },
    {
      "hs6": "040490",
      "desc": "Dairy produce; natural milk constituents (excluding whey), whether or not containing added sugar or other sweetening matter, n.e.c. in chapter 04",
      "valueUsd": 116512.99
    },
    {
      "hs6": "902610",
      "desc": "Instruments and apparatus; for measuring or checking the flow or level of liquids",
      "valueUsd": 114972
    },
    {
      "hs6": "670300",
      "desc": "Human hair, dressed, thinned, bleached or otherwise worked; wool or other animal hair or other textile materials, prepared for use in making wigs or the like",
      "valueUsd": 113390.98
    },
    {
      "hs6": "610910",
      "desc": "T-shirts, singlets and other vests; of cotton, knitted or crocheted",
      "valueUsd": 101942
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 95878
    },
    {
      "hs6": "611120",
      "desc": "Garments and clothing accessories; babies', of cotton, knitted or crocheted",
      "valueUsd": 94335
    },
    {
      "hs6": "081340",
      "desc": "Fruit, edible; fruit n.e.c. in heading no. 0812, dried",
      "valueUsd": 91992.99
    },
    {
      "hs6": "090422",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, crushed or ground",
      "valueUsd": 87248
    },
    {
      "hs6": "080232",
      "desc": "Nuts, edible; walnuts, fresh or dried, shelled",
      "valueUsd": 80979.99
    },
    {
      "hs6": "520522",
      "desc": "Cotton yarn; (not sewing thread), single, of combed fibres, 85% or more by weight of cotton, less than 714.29 but not less than 232.56 decitex (exceeding 14 but not exceeding 43 metric number), not for retail sale",
      "valueUsd": 80717
    },
    {
      "hs6": "071331",
      "desc": "Vegetables, leguminous; beans of the species vigna mungo (l.) hepper or vigna radiata (l.) wilczek, shelled, whether or not skinned or split, dried",
      "valueUsd": 78683
    },
    {
      "hs6": "170490",
      "desc": "Sugar confectionery; (excluding chewing gum, including white chocolate), not containing cocoa",
      "valueUsd": 71112
    }
  ],
  "2023": [
    {
      "hs6": "740811",
      "desc": "Copper; wire, of refined copper, of which the maximum cross-sectional dimension exceeds 6mm",
      "valueUsd": 26647200
    },
    {
      "hs6": "271019",
      "desc": "Petroleum oils and oils from bituminous minerals, not containing biodiesel, not crude, not waste oils; preparations n.e.c, containing by weight 70% or more of petroleum oils or oils from bituminous minerals; not light oils and preparations",
      "valueUsd": 24090552.7
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 1845834.99
    },
    {
      "hs6": "610910",
      "desc": "T-shirts, singlets and other vests; of cotton, knitted or crocheted",
      "valueUsd": 1251126
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 1219094.99
    },
    {
      "hs6": "110900",
      "desc": "Wheat gluten; whether or not dried",
      "valueUsd": 704240
    },
    {
      "hs6": "100630",
      "desc": "Cereals; rice, semi-milled or wholly milled, whether or not polished or glazed",
      "valueUsd": 530271
    },
    {
      "hs6": "853710",
      "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
      "valueUsd": 331553
    },
    {
      "hs6": "854320",
      "desc": "Electrical machines and apparatus; signal generators",
      "valueUsd": 315543
    },
    {
      "hs6": "841899",
      "desc": "Refrigerating or freezing equipment; parts thereof, other than furniture",
      "valueUsd": 277043
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 258510.99
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 243869
    },
    {
      "hs6": "081310",
      "desc": "Fruit, edible; apricots, dried",
      "valueUsd": 240005.98
    },
    {
      "hs6": "070993",
      "desc": "Vegetables; pumpkins, squash and gourds (Cucurbita spp.), fresh or chilled",
      "valueUsd": 193788
    },
    {
      "hs6": "392590",
      "desc": "Plastics; builders' ware, n.e.c. or included in heading no. 3925",
      "valueUsd": 191060
    },
    {
      "hs6": "040490",
      "desc": "Dairy produce; natural milk constituents (excluding whey), whether or not containing added sugar or other sweetening matter, n.e.c. in chapter 04",
      "valueUsd": 185841.98
    },
    {
      "hs6": "760612",
      "desc": "Aluminium; plates, sheets and strip, thickness exceeding 0.2mm, alloys, rectangular (including square)",
      "valueUsd": 162818
    },
    {
      "hs6": "200819",
      "desc": "Nuts and other seeds; whether or not containing added sugar, other sweetening matter or spirit (excluding ground-nuts except in mixtures)",
      "valueUsd": 157136
    },
    {
      "hs6": "151511",
      "desc": "Vegetable oils; linseed oil and its fractions, crude, not chemically modified",
      "valueUsd": 155773
    },
    {
      "hs6": "151550",
      "desc": "Vegetable oils; sesame oil and its fractions, whether or not refined, but not chemically modified",
      "valueUsd": 150475
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 149422.99
    },
    {
      "hs6": "130212",
      "desc": "Vegetable saps and extracts; of liquorice",
      "valueUsd": 132240
    },
    {
      "hs6": "080232",
      "desc": "Nuts, edible; walnuts, fresh or dried, shelled",
      "valueUsd": 127870.99
    },
    {
      "hs6": "570242",
      "desc": "Carpets and other textile floor coverings; woven, (not tufted or flocked), of man-made textile materials, of pile construction, made up, n.e.c. in item no. 5702.10 or 5702.20",
      "valueUsd": 107875
    },
    {
      "hs6": "854430",
      "desc": "Insulated electric conductors; ignition wiring sets and other wiring sets of a kind used in vehicles, aircraft or ships",
      "valueUsd": 99950
    },
    {
      "hs6": "670420",
      "desc": "Wigs, false beards, eyebrows and eyelashes, switches and the like and other articles n.e.c.; of human hair",
      "valueUsd": 97745.98
    },
    {
      "hs6": "170490",
      "desc": "Sugar confectionery; (excluding chewing gum, including white chocolate), not containing cocoa",
      "valueUsd": 94134.98
    },
    {
      "hs6": "852859",
      "desc": "Monitors other than cathode-ray tube; n.e.c. in subheading 8528.52, whether or not colour",
      "valueUsd": 87000
    },
    {
      "hs6": "611120",
      "desc": "Garments and clothing accessories; babies', of cotton, knitted or crocheted",
      "valueUsd": 82599
    },
    {
      "hs6": "880730",
      "desc": "Aircraft and spacecraft; parts of aeroplanes, helicopters or unmanned aircraft n.e.c. in heading no. 8807",
      "valueUsd": 80653.99
    }
  ],
  "2024": [
    {
      "hs6": "271019",
      "desc": "Petroleum oils and oils from bituminous minerals, not containing biodiesel, not crude, not waste oils; preparations n.e.c, containing by weight 70% or more of petroleum oils or oils from bituminous minerals; not light oils and preparations",
      "valueUsd": 113722307.99
    },
    {
      "hs6": "880240",
      "desc": "Aeroplanes and other aircraft, except unmanned; of an unladen weight exceeding 15,000kg",
      "valueUsd": 10552090
    },
    {
      "hs6": "760421",
      "desc": "Aluminium; alloys, hollow profiles",
      "valueUsd": 6294602.99
    },
    {
      "hs6": "711292",
      "desc": "Waste and scrap of precious metals; of platinum, including metal clad with platinum but excluding sweepings containing other precious metals",
      "valueUsd": 5706100
    },
    {
      "hs6": "760429",
      "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
      "valueUsd": 5024669.99
    },
    {
      "hs6": "271220",
      "desc": "Paraffin wax; containing by weight less than 0.75% of oil, obtained by synthesis or by other processes, whether or not coloured",
      "valueUsd": 4198886
    },
    {
      "hs6": "071290",
      "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
      "valueUsd": 1718373
    },
    {
      "hs6": "090421",
      "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
      "valueUsd": 1610091
    },
    {
      "hs6": "610910",
      "desc": "T-shirts, singlets and other vests; of cotton, knitted or crocheted",
      "valueUsd": 857016
    },
    {
      "hs6": "100630",
      "desc": "Cereals; rice, semi-milled or wholly milled, whether or not polished or glazed",
      "valueUsd": 843741
    },
    {
      "hs6": "741110",
      "desc": "Copper; tubes and pipes, of refined copper",
      "valueUsd": 664582
    },
    {
      "hs6": "681599",
      "desc": "Stone articles and articles of other mineral substances; n.e.c. or included in heading no. 6815",
      "valueUsd": 524732.99
    },
    {
      "hs6": "080620",
      "desc": "Fruit, edible; grapes, dried",
      "valueUsd": 393494
    },
    {
      "hs6": "040490",
      "desc": "Dairy produce; natural milk constituents (excluding whey), whether or not containing added sugar or other sweetening matter, n.e.c. in chapter 04",
      "valueUsd": 351172
    },
    {
      "hs6": "841899",
      "desc": "Refrigerating or freezing equipment; parts thereof, other than furniture",
      "valueUsd": 329414
    },
    {
      "hs6": "854320",
      "desc": "Electrical machines and apparatus; signal generators",
      "valueUsd": 327234
    },
    {
      "hs6": "392590",
      "desc": "Plastics; builders' ware, n.e.c. or included in heading no. 3925",
      "valueUsd": 320695
    },
    {
      "hs6": "200819",
      "desc": "Nuts and other seeds; whether or not containing added sugar, other sweetening matter or spirit (excluding ground-nuts except in mixtures)",
      "valueUsd": 306315.99
    },
    {
      "hs6": "081310",
      "desc": "Fruit, edible; apricots, dried",
      "valueUsd": 226060.98
    },
    {
      "hs6": "570242",
      "desc": "Carpets and other textile floor coverings; woven, (not tufted or flocked), of man-made textile materials, of pile construction, made up, n.e.c. in item no. 5702.10 or 5702.20",
      "valueUsd": 170612
    },
    {
      "hs6": "040900",
      "desc": "Honey; natural",
      "valueUsd": 157428
    },
    {
      "hs6": "010620",
      "desc": "Reptiles; live (including snakes and turtles)",
      "valueUsd": 130200
    },
    {
      "hs6": "340490",
      "desc": "Waxes; artificial and prepared, other than of polyethylene glycol",
      "valueUsd": 127093
    },
    {
      "hs6": "841191",
      "desc": "Turbines; parts of turbo-jets and turbo-propellers",
      "valueUsd": 118894
    },
    {
      "hs6": "880720",
      "desc": "Aircraft and spacecraft; under-carriages and parts thereof",
      "valueUsd": 104412
    },
    {
      "hs6": "760612",
      "desc": "Aluminium; plates, sheets and strip, thickness exceeding 0.2mm, alloys, rectangular (including square)",
      "valueUsd": 102599
    },
    {
      "hs6": "081320",
      "desc": "Fruit, edible; prunes, dried",
      "valueUsd": 101582.99
    },
    {
      "hs6": "130219",
      "desc": "Vegetable saps and extracts; n.e.c. in item no. 1302.1",
      "valueUsd": 101504
    },
    {
      "hs6": "220299",
      "desc": "Non-alcoholic beverages; other than non-alcoholic beer, n.e.c. in item no. 2202.10, not including fruit, nut or vegetable juices of heading no. 2009",
      "valueUsd": 101051
    },
    {
      "hs6": "902730",
      "desc": "Spectrometers, spectrophotometers and spectrographs; using optical radiations (UV, visible, IR)",
      "valueUsd": 97750
    }
  ],
  "2025": []
};

/** Top 30 HS-6 codes — UZ-reporter view of imports from US. */
export const topUzImportsFromUsByYear: Record<number, Hs6Row[]> = {
  "2021": [
    {
      "hs6": "300220",
      "desc": "HS 300220",
      "valueUsd": 19125324
    },
    {
      "hs6": "300490",
      "desc": "Medicaments; consisting of mixed or unmixed products n.e.c. in heading no. 3004, for therapeutic or prophylactic uses, packaged for retail sale",
      "valueUsd": 15834450.99
    },
    {
      "hs6": "020714",
      "desc": "Meat and edible offal; of fowls of the species Gallus domesticus, cuts and offal, frozen",
      "valueUsd": 6972563.98
    },
    {
      "hs6": "540333",
      "desc": "Yarn, artificial; filament, monofilament (less than 67 decitex), of cellulose acetate, single, not for retail sale, not sewing thread",
      "valueUsd": 5856101.99
    },
    {
      "hs6": "840999",
      "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
      "valueUsd": 3697894.94
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 3592509.5
    },
    {
      "hs6": "843390",
      "desc": "Harvesting machinery; parts, including parts of threshing machinery, straw or fodder balers and grass or hay mowers",
      "valueUsd": 3562891.42
    },
    {
      "hs6": "300420",
      "desc": "Medicaments; containing antibiotics (other than penicillins, streptomycins or their derivatives), for therapeutic or prophylactic uses, packaged for retail sale",
      "valueUsd": 3226655
    },
    {
      "hs6": "271019",
      "desc": "Petroleum oils and oils from bituminous minerals, not containing biodiesel, not crude, not waste oils; preparations n.e.c, containing by weight 70% or more of petroleum oils or oils from bituminous minerals; not light oils and preparations",
      "valueUsd": 2418867.96
    },
    {
      "hs6": "210120",
      "desc": "Extracts, essences and concentrates; of tea or mate, and preparations with a basis of these extracts, essences or concentrates or with a basis of tea or mate",
      "valueUsd": 2072238
    },
    {
      "hs6": "848490",
      "desc": "Gasket sets or assortments of gaskets and similar joints; dissimilar in composition, put up in pouches, envelopes or similar packings",
      "valueUsd": 1652377.95
    },
    {
      "hs6": "392690",
      "desc": "Plastics; other articles n.e.c. in chapter 39",
      "valueUsd": 1565168.99
    },
    {
      "hs6": "320611",
      "desc": "Colouring matter; pigments and preparations based on titanium dioxide, containing 80% or more by weight of titanium dioxide calculated on the dry matter",
      "valueUsd": 1529863
    },
    {
      "hs6": "240120",
      "desc": "Tobacco; partly or wholly stemmed or stripped",
      "valueUsd": 1449245
    },
    {
      "hs6": "392069",
      "desc": "Plastics; plates, sheets, film, foil and strip (not self-adhesive), of polyesters n.e.c. in heading no. 3920, non-cellular and not reinforced, laminated, supported or similarly combined with other materials",
      "valueUsd": 1056718
    },
    {
      "hs6": "382200",
      "desc": "HS 382200",
      "valueUsd": 962434.96
    },
    {
      "hs6": "300449",
      "desc": "Medicaments; containing alkaloids or their derivatives; other than ephedrine, pseudoephedrine (INN) or norephedrine or their salts; for therapeutic or prophylactic uses, packaged for retail sale",
      "valueUsd": 929374
    },
    {
      "hs6": "390140",
      "desc": "Ethylene polymers; in primary forms, ethylene-alpha-olefin copolymers, having a specific gravity of less than 0.94",
      "valueUsd": 821920
    },
    {
      "hs6": "870840",
      "desc": "Vehicle parts; gear boxes and parts thereof",
      "valueUsd": 759919.98
    },
    {
      "hs6": "870899",
      "desc": "Vehicle parts and accessories; n.e.c. in heading no. 8708",
      "valueUsd": 665737.97
    },
    {
      "hs6": "340319",
      "desc": "Lubricating preparations; (other than for the treatment of textile and similar materials), containing less than 70% (by weight) of petroleum oils or oils obtained from bituminous minerals",
      "valueUsd": 664753
    },
    {
      "hs6": "401693",
      "desc": "Rubber; vulcanised (other than hard rubber), gaskets, washers and other seals, of non-cellular rubber",
      "valueUsd": 605874.96
    },
    {
      "hs6": "300230",
      "desc": "HS 300230",
      "valueUsd": 576464.3
    },
    {
      "hs6": "732690",
      "desc": "Iron or steel; articles n.e.c. in heading 7326",
      "valueUsd": 546082.97
    },
    {
      "hs6": "842199",
      "desc": "Machinery; parts for filtering or purifying liquids or gases",
      "valueUsd": 529850.95
    },
    {
      "hs6": "848390",
      "desc": "Transmission components; toothed wheels, chain sprockets and other transmission elements presented separately; parts",
      "valueUsd": 500255.98
    },
    {
      "hs6": "830249",
      "desc": "Mountings, fittings and similar articles; suitable for other than buildings or furniture, of base metal",
      "valueUsd": 498651.99
    },
    {
      "hs6": "630612",
      "desc": "Tarpaulins, awnings and sunblinds; of synthetic fibres",
      "valueUsd": 478095
    },
    {
      "hs6": "300439",
      "desc": "Medicaments; containing hormones (but not insulin), adrenal cortex hormones or antibiotics, for therapeutic or prophylactic uses, packaged for retail sale",
      "valueUsd": 476659
    },
    {
      "hs6": "300432",
      "desc": "Medicaments; containing corticosteroid hormones, their derivatives or structural analogues (but not containing antibiotics), for therapeutic or prophylactic uses, packaged for retail sale",
      "valueUsd": 474731
    }
  ],
  "2022": [
    {
      "hs6": "300490",
      "desc": "Medicaments; consisting of mixed or unmixed products n.e.c. in heading no. 3004, for therapeutic or prophylactic uses, packaged for retail sale",
      "valueUsd": 24729485
    },
    {
      "hs6": "870324",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 3000cc",
      "valueUsd": 20311501.99
    },
    {
      "hs6": "841182",
      "desc": "Turbines; gas-turbines (excluding turbo-jets and turbo-propellers), of a power exceeding 5000kW",
      "valueUsd": 7297062
    },
    {
      "hs6": "840219",
      "desc": "Boilers; vapour generating boilers, including hybrid boilers n.e.c. in heading no. 8402",
      "valueUsd": 6491420
    },
    {
      "hs6": "842240",
      "desc": "Machinery; for packing or wrapping",
      "valueUsd": 5370513
    },
    {
      "hs6": "540333",
      "desc": "Yarn, artificial; filament, monofilament (less than 67 decitex), of cellulose acetate, single, not for retail sale, not sewing thread",
      "valueUsd": 5311917
    },
    {
      "hs6": "870323",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 1500 but not over 3000cc",
      "valueUsd": 5165293.61
    },
    {
      "hs6": "847910",
      "desc": "Machinery and mechanical appliances; for public works, building or the like",
      "valueUsd": 3823210
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 3804499.99
    },
    {
      "hs6": "841199",
      "desc": "Turbines; parts of gas turbines (excluding turbo-jets and turbo-propellers)",
      "valueUsd": 2727121.99
    },
    {
      "hs6": "210120",
      "desc": "Extracts, essences and concentrates; of tea or mate, and preparations with a basis of these extracts, essences or concentrates or with a basis of tea or mate",
      "valueUsd": 2019427
    },
    {
      "hs6": "842951",
      "desc": "Front-end shovel loaders",
      "valueUsd": 1757000
    },
    {
      "hs6": "470321",
      "desc": "Wood pulp; chemical wood pulp, soda or sulphate, (other than dissolving grades), semi-bleached or bleached, of coniferous wood",
      "valueUsd": 1227212.99
    },
    {
      "hs6": "848340",
      "desc": "Gears and gearing; (not toothed wheels, chain sprockets and other transmission elements presented separately); ball or roller screws; gear boxes and other speed changers, including torque converters",
      "valueUsd": 1192217.99
    },
    {
      "hs6": "854130",
      "desc": "Electrical apparatus; thyristors, diacs and triacs, other than photosensitive devices",
      "valueUsd": 1169044
    },
    {
      "hs6": "240120",
      "desc": "Tobacco; partly or wholly stemmed or stripped",
      "valueUsd": 1110397
    },
    {
      "hs6": "382200",
      "desc": "HS 382200",
      "valueUsd": 1072301.99
    },
    {
      "hs6": "732690",
      "desc": "Iron or steel; articles n.e.c. in heading 7326",
      "valueUsd": 1000953.99
    },
    {
      "hs6": "902750",
      "desc": "Instruments and apparatus; using optical radiations (UV, visible, IR), (other than spectrometers, spectrophotometers and spectrographs)",
      "valueUsd": 735297
    },
    {
      "hs6": "961210",
      "desc": "Ribbons; for typewriters and the like, inked or otherwise prepared, for giving impressions, whether or not on spools or in cartridges",
      "valueUsd": 724641.17
    },
    {
      "hs6": "853890",
      "desc": "Electrical apparatus; parts suitable for use solely or principally with the apparatus of heading no. 8535, 8536 or 8537",
      "valueUsd": 667894.98
    },
    {
      "hs6": "300450",
      "desc": "Medicaments; containing vitamins or their derivatives, for therapeutic or prophylactic use, packaged for retail sale",
      "valueUsd": 663062
    },
    {
      "hs6": "853710",
      "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
      "valueUsd": 594566
    },
    {
      "hs6": "220830",
      "desc": "Whiskies",
      "valueUsd": 561517
    },
    {
      "hs6": "842449",
      "desc": "Mechanical appliances; agricultural or horticultural sprayers; other than portable sprayers",
      "valueUsd": 554815
    },
    {
      "hs6": "847410",
      "desc": "Machines; for sorting, screening, separating or washing earth, stone, ores or other mineral substances",
      "valueUsd": 551223
    },
    {
      "hs6": "851822",
      "desc": "Loudspeakers; multiple, mounted in the same enclosure",
      "valueUsd": 537019
    },
    {
      "hs6": "848310",
      "desc": "Transmission shafts (including cam shafts and crank shafts) and cranks",
      "valueUsd": 519929
    },
    {
      "hs6": "870830",
      "desc": "Vehicle parts; brakes, servo-brakes and parts thereof",
      "valueUsd": 483867.98
    },
    {
      "hs6": "401693",
      "desc": "Rubber; vulcanised (other than hard rubber), gaskets, washers and other seals, of non-cellular rubber",
      "valueUsd": 476702.99
    }
  ],
  "2023": [
    {
      "hs6": "870324",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 3000cc",
      "valueUsd": 86766392.98
    },
    {
      "hs6": "880240",
      "desc": "Aeroplanes and other aircraft, except unmanned; of an unladen weight exceeding 15,000kg",
      "valueUsd": 40000000
    },
    {
      "hs6": "870323",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 1500 but not over 3000cc",
      "valueUsd": 26644644.99
    },
    {
      "hs6": "847190",
      "desc": "Magnetic or optical readers, machines for transcribing data onto data media in coded form and machines for processing such data, not elsewhere specified or included",
      "valueUsd": 18997496
    },
    {
      "hs6": "870840",
      "desc": "Vehicle parts; gear boxes and parts thereof",
      "valueUsd": 15480289.96
    },
    {
      "hs6": "841480",
      "desc": "Pumps and compressors; for air, vacuum or gas, n.e.c. in heading no. 8414",
      "valueUsd": 11437614.99
    },
    {
      "hs6": "841330",
      "desc": "Pumps; fuel, lubricating or cooling medium pumps for internal combustion piston engines",
      "valueUsd": 7813358.95
    },
    {
      "hs6": "870360",
      "desc": "Vehicles; with both spark-ignition internal combustion piston engine and electric motor for propulsion, capable of being charged by plugging to external source of electric power",
      "valueUsd": 6893171.99
    },
    {
      "hs6": "840734",
      "desc": "Engines; reciprocating piston engines, of a kind used for the propulsion of vehicles of chapter 87, of a cylinder capacity exceeding 1000cc",
      "valueUsd": 5789062
    },
    {
      "hs6": "840991",
      "desc": "Engines; parts, suitable for use solely or principally with spark-ignition internal combustion piston engines (for other than aircraft)",
      "valueUsd": 4457937
    },
    {
      "hs6": "903180",
      "desc": "Instruments, appliances and machines; for measuring or checking n.e.c. in chapter 90",
      "valueUsd": 4455043.99
    },
    {
      "hs6": "470321",
      "desc": "Wood pulp; chemical wood pulp, soda or sulphate, (other than dissolving grades), semi-bleached or bleached, of coniferous wood",
      "valueUsd": 4118083.98
    },
    {
      "hs6": "901540",
      "desc": "Surveying equipment; photogrammetrical surveying instruments and appliances",
      "valueUsd": 4083496
    },
    {
      "hs6": "020714",
      "desc": "Meat and edible offal; of fowls of the species Gallus domesticus, cuts and offal, frozen",
      "valueUsd": 3520188
    },
    {
      "hs6": "903010",
      "desc": "Instruments and apparatus; for measuring or detecting ionising radiations",
      "valueUsd": 3457019.98
    },
    {
      "hs6": "847410",
      "desc": "Machines; for sorting, screening, separating or washing earth, stone, ores or other mineral substances",
      "valueUsd": 3350956
    },
    {
      "hs6": "843860",
      "desc": "Machinery; industrial, for the preparation of fruits, nuts or vegetables",
      "valueUsd": 3177838
    },
    {
      "hs6": "901813",
      "desc": "Medical, surgical instruments and appliances; magnetic resonance imaging apparatus",
      "valueUsd": 3000000
    },
    {
      "hs6": "851762",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
      "valueUsd": 2735980.97
    },
    {
      "hs6": "870894",
      "desc": "Vehicle parts; steering wheels, steering columns and steering boxes; parts thereof",
      "valueUsd": 2426243.95
    },
    {
      "hs6": "842951",
      "desc": "Front-end shovel loaders",
      "valueUsd": 1898251
    },
    {
      "hs6": "840999",
      "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
      "valueUsd": 1808685.98
    },
    {
      "hs6": "847150",
      "desc": "Units of automatic data processing machines; processing units other than those of item no. 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units or output units",
      "valueUsd": 1681343.96
    },
    {
      "hs6": "853110",
      "desc": "Signalling apparatus; electric, sound or visual, burglar or fire alarms and similar, other than those of heading no. 8512 or 8530",
      "valueUsd": 1572825.97
    },
    {
      "hs6": "847910",
      "desc": "Machinery and mechanical appliances; for public works, building or the like",
      "valueUsd": 1393418
    },
    {
      "hs6": "732690",
      "desc": "Iron or steel; articles n.e.c. in heading 7326",
      "valueUsd": 1352656.99
    },
    {
      "hs6": "848340",
      "desc": "Gears and gearing; (not toothed wheels, chain sprockets and other transmission elements presented separately); ball or roller screws; gear boxes and other speed changers, including torque converters",
      "valueUsd": 1257453.97
    },
    {
      "hs6": "841191",
      "desc": "Turbines; parts of turbo-jets and turbo-propellers",
      "valueUsd": 1252931.99
    },
    {
      "hs6": "870850",
      "desc": "Vehicle parts; drive-axles with differential, whether or not provided with other transmission components, and non-driving axles; parts thereof",
      "valueUsd": 1158408.99
    },
    {
      "hs6": "847170",
      "desc": "Units of automatic data processing machines; storage units",
      "valueUsd": 1099164.97
    }
  ],
  "2024": [
    {
      "hs6": "880240",
      "desc": "Aeroplanes and other aircraft, except unmanned; of an unladen weight exceeding 15,000kg",
      "valueUsd": 93000000
    },
    {
      "hs6": "847150",
      "desc": "Units of automatic data processing machines; processing units other than those of item no. 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units or output units",
      "valueUsd": 23468097.97
    },
    {
      "hs6": "870324",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 3000cc",
      "valueUsd": 22068589.98
    },
    {
      "hs6": "841480",
      "desc": "Pumps and compressors; for air, vacuum or gas, n.e.c. in heading no. 8414",
      "valueUsd": 16296763
    },
    {
      "hs6": "841330",
      "desc": "Pumps; fuel, lubricating or cooling medium pumps for internal combustion piston engines",
      "valueUsd": 14050128.97
    },
    {
      "hs6": "854370",
      "desc": "Electrical machines and apparatus; having individual functions, not specified or included elsewhere in this chapter, n.e.c. in heading no. 8543",
      "valueUsd": 9030191
    },
    {
      "hs6": "870323",
      "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 1500 but not over 3000cc",
      "valueUsd": 8569909.99
    },
    {
      "hs6": "851762",
      "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
      "valueUsd": 7269543.98
    },
    {
      "hs6": "901540",
      "desc": "Surveying equipment; photogrammetrical surveying instruments and appliances",
      "valueUsd": 6245989.99
    },
    {
      "hs6": "540333",
      "desc": "Yarn, artificial; filament, monofilament (less than 67 decitex), of cellulose acetate, single, not for retail sale, not sewing thread",
      "valueUsd": 6129347.99
    },
    {
      "hs6": "850153",
      "desc": "Electric motors; AC motors, multi-phase, of an output exceeding 75kW",
      "valueUsd": 6111000
    },
    {
      "hs6": "470321",
      "desc": "Wood pulp; chemical wood pulp, soda or sulphate, (other than dissolving grades), semi-bleached or bleached, of coniferous wood",
      "valueUsd": 6002405.98
    },
    {
      "hs6": "840999",
      "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
      "valueUsd": 5371182.98
    },
    {
      "hs6": "210690",
      "desc": "Food preparations; n.e.c. in item no. 2106.10",
      "valueUsd": 5200306.99
    },
    {
      "hs6": "841112",
      "desc": "Turbo-jets; of a thrust exceeding 25kN",
      "valueUsd": 5026500
    },
    {
      "hs6": "020714",
      "desc": "Meat and edible offal; of fowls of the species Gallus domesticus, cuts and offal, frozen",
      "valueUsd": 4589706.99
    },
    {
      "hs6": "847190",
      "desc": "Magnetic or optical readers, machines for transcribing data onto data media in coded form and machines for processing such data, not elsewhere specified or included",
      "valueUsd": 4316018
    },
    {
      "hs6": "870894",
      "desc": "Vehicle parts; steering wheels, steering columns and steering boxes; parts thereof",
      "valueUsd": 4057684.98
    },
    {
      "hs6": "481151",
      "desc": "Paper and paperboard; coated, impregnated or covered with plastics (excluding adhesives), bleached, weighing more than 150g/m2, other than goods of heading no. 4803, 4809, or 4810",
      "valueUsd": 3565133
    },
    {
      "hs6": "840890",
      "desc": "Engines; compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of a kind used for other than marine propulsion or the vehicles of chapter 87",
      "valueUsd": 3502187
    },
    {
      "hs6": "847410",
      "desc": "Machines; for sorting, screening, separating or washing earth, stone, ores or other mineral substances",
      "valueUsd": 3296755
    },
    {
      "hs6": "847170",
      "desc": "Units of automatic data processing machines; storage units",
      "valueUsd": 3066863.99
    },
    {
      "hs6": "903010",
      "desc": "Instruments and apparatus; for measuring or detecting ionising radiations",
      "valueUsd": 2960290
    },
    {
      "hs6": "382219",
      "desc": "Reagents; diagnostic or laboratory reagents on a backing, prepared diagnostic or laboratory reagents whether or not on a backing, whether or not put up in the form of kits; n.e.c.in item 3822.1",
      "valueUsd": 2916299.99
    },
    {
      "hs6": "870895",
      "desc": "Vehicle parts; safety airbags with inflater system; parts thereof",
      "valueUsd": 2755433.99
    },
    {
      "hs6": "840820",
      "desc": "Engines; compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of a kind used for the propulsion of vehicles of chapter 87",
      "valueUsd": 2740472
    },
    {
      "hs6": "870840",
      "desc": "Vehicle parts; gear boxes and parts thereof",
      "valueUsd": 2260180.99
    },
    {
      "hs6": "848340",
      "desc": "Gears and gearing; (not toothed wheels, chain sprockets and other transmission elements presented separately); ball or roller screws; gear boxes and other speed changers, including torque converters",
      "valueUsd": 2074895.98
    },
    {
      "hs6": "844332",
      "desc": "Printing, copying, and facsimile machines; single-function printing, copying or facsimile machines, capable of connecting to an automatic data processing machine or to a network",
      "valueUsd": 2066837.99
    },
    {
      "hs6": "844313",
      "desc": "Printing machinery; offset, n.e.c. in item no. 8443.1",
      "valueUsd": 1989000
    }
  ],
  "2025": []
};

/** HS-2 chapter aggregation for 2024 — US-reported imports from UZ. */
export const hs2_2024_usImports: Hs2Row[] = [
  {
    "hs2": "99",
    "desc": "Commodities not specified according to kind",
    "valueUsd": 7899293
  },
  {
    "hs2": "76",
    "desc": "Aluminium and articles thereof",
    "valueUsd": 7422381
  },
  {
    "hs2": "71",
    "desc": "Natural, cultured pearls; precious, semi-precious stones; precious metals, metals clad with precious metal, and articles thereof; imitation jewellery; coin",
    "valueUsd": 6666823
  },
  {
    "hs2": "07",
    "desc": "Vegetables and certain roots and tubers; edible",
    "valueUsd": 3655613
  },
  {
    "hs2": "74",
    "desc": "Copper and articles thereof",
    "valueUsd": 3228714
  },
  {
    "hs2": "28",
    "desc": "Inorganic chemicals; organic and inorganic compounds of precious metals; of rare earth metals, of radio-active elements and of isotopes",
    "valueUsd": 2314425
  },
  {
    "hs2": "81",
    "desc": "Metals; n.e.c., cermets and articles thereof",
    "valueUsd": 2199071
  },
  {
    "hs2": "09",
    "desc": "Coffee, tea, mate and spices",
    "valueUsd": 1628440
  },
  {
    "hs2": "08",
    "desc": "Fruit and nuts, edible; peel of citrus fruit or melons",
    "valueUsd": 939445
  },
  {
    "hs2": "61",
    "desc": "Apparel and clothing accessories; knitted or crocheted",
    "valueUsd": 910014
  },
  {
    "hs2": "97",
    "desc": "Works of art; collectors' pieces and antiques",
    "valueUsd": 848685
  },
  {
    "hs2": "11",
    "desc": "Products of the milling industry; malt, starches, inulin, wheat gluten",
    "valueUsd": 748018
  },
  {
    "hs2": "85",
    "desc": "Electrical machinery and equipment and parts thereof; sound recorders and reproducers; television image and sound recorders and reproducers, parts and accessories of such articles",
    "valueUsd": 612484
  },
  {
    "hs2": "12",
    "desc": "Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit, industrial or medicinal plants; straw and fodder",
    "valueUsd": 541928
  },
  {
    "hs2": "39",
    "desc": "Plastics and articles thereof",
    "valueUsd": 528573
  },
  {
    "hs2": "15",
    "desc": "Animal, vegetable or microbial fats and oils and their cleavage products; prepared edible fats; animal or vegetable waxes",
    "valueUsd": 492731
  },
  {
    "hs2": "01",
    "desc": "Animals; live",
    "valueUsd": 484225
  },
  {
    "hs2": "68",
    "desc": "Stone, plaster, cement, asbestos, mica or similar materials; articles thereof",
    "valueUsd": 452550
  },
  {
    "hs2": "20",
    "desc": "Preparations of vegetables, fruit, nuts or other parts of plants",
    "valueUsd": 351758
  },
  {
    "hs2": "90",
    "desc": "Optical, photographic, cinematographic, measuring, checking, medical or surgical instruments and apparatus; parts and accessories",
    "valueUsd": 341024
  },
  {
    "hs2": "21",
    "desc": "Miscellaneous edible preparations",
    "valueUsd": 287728
  },
  {
    "hs2": "84",
    "desc": "Machinery and mechanical appliances, boilers, nuclear reactors; parts thereof",
    "valueUsd": 248181
  },
  {
    "hs2": "22",
    "desc": "Beverages, spirits and vinegar",
    "valueUsd": 203294
  },
  {
    "hs2": "57",
    "desc": "Carpets and other textile floor coverings",
    "valueUsd": 202629
  },
  {
    "hs2": "63",
    "desc": "Textiles, made up articles; sets; worn clothing and worn textile articles; rags",
    "valueUsd": 182309
  },
  {
    "hs2": "62",
    "desc": "Apparel and clothing accessories; not knitted or crocheted",
    "valueUsd": 175732
  },
  {
    "hs2": "04",
    "desc": "Dairy produce; birds' eggs; natural honey; edible products of animal origin, not elsewhere specified or included",
    "valueUsd": 159655
  },
  {
    "hs2": "49",
    "desc": "Printed books, newspapers, pictures and other products of the printing industry; manuscripts, typescripts and plans",
    "valueUsd": 97579
  },
  {
    "hs2": "67",
    "desc": "Feathers and down, prepared; and articles made of feather or of down; artificial flowers; articles of human hair",
    "valueUsd": 86136
  },
  {
    "hs2": "34",
    "desc": "Soap, organic surface-active agents; washing, lubricating, polishing or scouring preparations; artificial or prepared waxes, candles and similar articles, modelling pastes, dental waxes and dental preparations with a basis of plaster",
    "valueUsd": 85180
  },
  {
    "hs2": "13",
    "desc": "Lac; gums, resins and other vegetable saps and extracts",
    "valueUsd": 71640
  },
  {
    "hs2": "17",
    "desc": "Sugars and sugar confectionery",
    "valueUsd": 55280
  },
  {
    "hs2": "19",
    "desc": "Preparations of cereals, flour, starch or milk; pastrycooks' products",
    "valueUsd": 52903
  },
  {
    "hs2": "88",
    "desc": "Aircraft, spacecraft, and parts thereof",
    "valueUsd": 49850
  },
  {
    "hs2": "40",
    "desc": "Rubber and articles thereof",
    "valueUsd": 43398
  },
  {
    "hs2": "94",
    "desc": "Furniture; bedding, mattresses, mattress supports, cushions and similar stuffed furnishings; lamps and lighting fittings, n.e.c.; illuminated signs, illuminated name-plates and the like; prefabricated buildings",
    "valueUsd": 29104
  },
  {
    "hs2": "73",
    "desc": "Iron or steel articles",
    "valueUsd": 23686
  },
  {
    "hs2": "69",
    "desc": "Ceramic products",
    "valueUsd": 16855
  },
  {
    "hs2": "95",
    "desc": "Toys, games and sports requisites; parts and accessories thereof",
    "valueUsd": 16672
  },
  {
    "hs2": "87",
    "desc": "Vehicles; other than railway or tramway rolling stock, and parts and accessories thereof",
    "valueUsd": 10489
  },
  {
    "hs2": "59",
    "desc": "Textile fabrics; impregnated, coated, covered or laminated; textile articles of a kind suitable for industrial use",
    "valueUsd": 7855
  },
  {
    "hs2": "83",
    "desc": "Metal; miscellaneous products of base metal",
    "valueUsd": 6239
  },
  {
    "hs2": "29",
    "desc": "Organic chemicals",
    "valueUsd": 5532
  },
  {
    "hs2": "64",
    "desc": "Footwear; gaiters and the like; parts of such articles",
    "valueUsd": 5257
  },
  {
    "hs2": "44",
    "desc": "Wood and articles of wood; wood charcoal",
    "valueUsd": 5001
  },
  {
    "hs2": "30",
    "desc": "Pharmaceutical products",
    "valueUsd": 4801
  },
  {
    "hs2": "42",
    "desc": "Articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles of animal gut (other than silk-worm gut)",
    "valueUsd": 3824
  },
  {
    "hs2": "50",
    "desc": "Silk",
    "valueUsd": 3131
  },
  {
    "hs2": "48",
    "desc": "Paper and paperboard; articles of paper pulp, of paper or paperboard",
    "valueUsd": 2607
  },
  {
    "hs2": "52",
    "desc": "Cotton",
    "valueUsd": 400
  }
];

/** HS-2 chapter aggregation for 2024 — US-reported exports to UZ. */
export const hs2_2024_usExports: Hs2Row[] = [
  {
    "hs2": "84",
    "desc": "Machinery and mechanical appliances, boilers, nuclear reactors; parts thereof",
    "valueUsd": 60308620
  },
  {
    "hs2": "85",
    "desc": "Electrical machinery and equipment and parts thereof; sound recorders and reproducers; television image and sound recorders and reproducers, parts and accessories of such articles",
    "valueUsd": 46313752
  },
  {
    "hs2": "87",
    "desc": "Vehicles; other than railway or tramway rolling stock, and parts and accessories thereof",
    "valueUsd": 6808342
  },
  {
    "hs2": "48",
    "desc": "Paper and paperboard; articles of paper pulp, of paper or paperboard",
    "valueUsd": 2828521
  },
  {
    "hs2": "83",
    "desc": "Metal; miscellaneous products of base metal",
    "valueUsd": 2672172
  },
  {
    "hs2": "38",
    "desc": "Chemical products n.e.c.",
    "valueUsd": 2432705
  },
  {
    "hs2": "82",
    "desc": "Tools, implements, cutlery, spoons and forks, of base metal; parts thereof, of base metal",
    "valueUsd": 2150584
  },
  {
    "hs2": "39",
    "desc": "Plastics and articles thereof",
    "valueUsd": 2044739
  },
  {
    "hs2": "73",
    "desc": "Iron or steel articles",
    "valueUsd": 2016954
  },
  {
    "hs2": "21",
    "desc": "Miscellaneous edible preparations",
    "valueUsd": 2003541
  },
  {
    "hs2": "29",
    "desc": "Organic chemicals",
    "valueUsd": 1786302
  },
  {
    "hs2": "24",
    "desc": "Tobacco and manufactured tobacco substitutes; products, whether or not containing nicotine, intended for inhalation without combustion; other nicotine containing products intended for the intake of nicotine into the human body",
    "valueUsd": 1652798
  },
  {
    "hs2": "02",
    "desc": "Meat and edible meat offal",
    "valueUsd": 1591115
  },
  {
    "hs2": "47",
    "desc": "Pulp of wood or other fibrous cellulosic material; recovered (waste and scrap) paper or paperboard",
    "valueUsd": 1562775
  },
  {
    "hs2": "49",
    "desc": "Printed books, newspapers, pictures and other products of the printing industry; manuscripts, typescripts and plans",
    "valueUsd": 1541673
  },
  {
    "hs2": "70",
    "desc": "Glass and glassware",
    "valueUsd": 1519612
  },
  {
    "hs2": "40",
    "desc": "Rubber and articles thereof",
    "valueUsd": 1246667
  },
  {
    "hs2": "33",
    "desc": "Essential oils and resinoids; perfumery, cosmetic or toilet preparations",
    "valueUsd": 1204057
  },
  {
    "hs2": "27",
    "desc": "Mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral waxes",
    "valueUsd": 905400
  },
  {
    "hs2": "07",
    "desc": "Vegetables and certain roots and tubers; edible",
    "valueUsd": 793055
  },
  {
    "hs2": "35",
    "desc": "Albuminoidal substances; modified starches; glues; enzymes",
    "valueUsd": 779802
  },
  {
    "hs2": "62",
    "desc": "Apparel and clothing accessories; not knitted or crocheted",
    "valueUsd": 706744
  },
  {
    "hs2": "76",
    "desc": "Aluminium and articles thereof",
    "valueUsd": 447519
  },
  {
    "hs2": "30",
    "desc": "Pharmaceutical products",
    "valueUsd": 437720
  },
  {
    "hs2": "32",
    "desc": "Tanning or dyeing extracts; tannins and their derivatives; dyes, pigments and other colouring matter; paints, varnishes; putty, other mastics; inks",
    "valueUsd": 403246
  },
  {
    "hs2": "08",
    "desc": "Fruit and nuts, edible; peel of citrus fruit or melons",
    "valueUsd": 391560
  },
  {
    "hs2": "12",
    "desc": "Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit, industrial or medicinal plants; straw and fodder",
    "valueUsd": 305285
  },
  {
    "hs2": "34",
    "desc": "Soap, organic surface-active agents; washing, lubricating, polishing or scouring preparations; artificial or prepared waxes, candles and similar articles, modelling pastes, dental waxes and dental preparations with a basis of plaster",
    "valueUsd": 300416
  },
  {
    "hs2": "15",
    "desc": "Animal, vegetable or microbial fats and oils and their cleavage products; prepared edible fats; animal or vegetable waxes",
    "valueUsd": 288587
  },
  {
    "hs2": "64",
    "desc": "Footwear; gaiters and the like; parts of such articles",
    "valueUsd": 268816
  },
  {
    "hs2": "10",
    "desc": "Cereals",
    "valueUsd": 262334
  },
  {
    "hs2": "01",
    "desc": "Animals; live",
    "valueUsd": 222989
  },
  {
    "hs2": "11",
    "desc": "Products of the milling industry; malt, starches, inulin, wheat gluten",
    "valueUsd": 216844
  },
  {
    "hs2": "05",
    "desc": "Animal originated products; not elsewhere specified or included",
    "valueUsd": 180232
  },
  {
    "hs2": "63",
    "desc": "Textiles, made up articles; sets; worn clothing and worn textile articles; rags",
    "valueUsd": 165012
  },
  {
    "hs2": "28",
    "desc": "Inorganic chemicals; organic and inorganic compounds of precious metals; of rare earth metals, of radio-active elements and of isotopes",
    "valueUsd": 150685
  },
  {
    "hs2": "23",
    "desc": "Food industries, residues and wastes thereof; prepared animal fodder",
    "valueUsd": 126367
  },
  {
    "hs2": "58",
    "desc": "Fabrics; special woven fabrics, tufted textile fabrics, lace, tapestries, trimmings, embroidery",
    "valueUsd": 123350
  },
  {
    "hs2": "81",
    "desc": "Metals; n.e.c., cermets and articles thereof",
    "valueUsd": 118821
  },
  {
    "hs2": "18",
    "desc": "Cocoa and cocoa preparations",
    "valueUsd": 102384
  },
  {
    "hs2": "25",
    "desc": "Salt; sulphur; earths, stone; plastering materials, lime and cement",
    "valueUsd": 81298
  },
  {
    "hs2": "75",
    "desc": "Nickel and articles thereof",
    "valueUsd": 81057
  },
  {
    "hs2": "42",
    "desc": "Articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles of animal gut (other than silk-worm gut)",
    "valueUsd": 56489
  },
  {
    "hs2": "09",
    "desc": "Coffee, tea, mate and spices",
    "valueUsd": 55000
  },
  {
    "hs2": "86",
    "desc": "Railway, tramway locomotives, rolling-stock and parts thereof; railway or tramway track fixtures and fittings and parts thereof; mechanical (including electro-mechanical) traffic signalling equipment of all kinds",
    "valueUsd": 46860
  },
  {
    "hs2": "43",
    "desc": "Furskins and artificial fur; manufactures thereof",
    "valueUsd": 42600
  },
  {
    "hs2": "72",
    "desc": "Iron and steel",
    "valueUsd": 30525
  },
  {
    "hs2": "69",
    "desc": "Ceramic products",
    "valueUsd": 29770
  },
  {
    "hs2": "19",
    "desc": "Preparations of cereals, flour, starch or milk; pastrycooks' products",
    "valueUsd": 18688
  },
  {
    "hs2": "71",
    "desc": "Natural, cultured pearls; precious, semi-precious stones; precious metals, metals clad with precious metal, and articles thereof; imitation jewellery; coin",
    "valueUsd": 18313
  },
  {
    "hs2": "04",
    "desc": "Dairy produce; birds' eggs; natural honey; edible products of animal origin, not elsewhere specified or included",
    "valueUsd": 18000
  },
  {
    "hs2": "61",
    "desc": "Apparel and clothing accessories; knitted or crocheted",
    "valueUsd": 13313
  },
  {
    "hs2": "59",
    "desc": "Textile fabrics; impregnated, coated, covered or laminated; textile articles of a kind suitable for industrial use",
    "valueUsd": 10378
  },
  {
    "hs2": "68",
    "desc": "Stone, plaster, cement, asbestos, mica or similar materials; articles thereof",
    "valueUsd": 8563
  },
  {
    "hs2": "52",
    "desc": "Cotton",
    "valueUsd": 2693
  }
];

/** HS-2 chapter aggregation for 2025 — US-reported imports from UZ. */
export const hs2_2025_usImports: Hs2Row[] = [
  {
    "hs2": "71",
    "desc": "Natural, cultured pearls; precious, semi-precious stones; precious metals, metals clad with precious metal, and articles thereof; imitation jewellery; coin",
    "valueUsd": 510861163
  },
  {
    "hs2": "99",
    "desc": "Commodities not specified according to kind",
    "valueUsd": 18170695
  },
  {
    "hs2": "76",
    "desc": "Aluminium and articles thereof",
    "valueUsd": 11319414
  },
  {
    "hs2": "81",
    "desc": "Metals; n.e.c., cermets and articles thereof",
    "valueUsd": 7126916
  },
  {
    "hs2": "07",
    "desc": "Vegetables and certain roots and tubers; edible",
    "valueUsd": 3700721
  },
  {
    "hs2": "74",
    "desc": "Copper and articles thereof",
    "valueUsd": 3329003
  },
  {
    "hs2": "08",
    "desc": "Fruit and nuts, edible; peel of citrus fruit or melons",
    "valueUsd": 2930837
  },
  {
    "hs2": "28",
    "desc": "Inorganic chemicals; organic and inorganic compounds of precious metals; of rare earth metals, of radio-active elements and of isotopes",
    "valueUsd": 2884600
  },
  {
    "hs2": "27",
    "desc": "Mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral waxes",
    "valueUsd": 2667643
  },
  {
    "hs2": "09",
    "desc": "Coffee, tea, mate and spices",
    "valueUsd": 2435852
  },
  {
    "hs2": "21",
    "desc": "Miscellaneous edible preparations",
    "valueUsd": 1356383
  },
  {
    "hs2": "61",
    "desc": "Apparel and clothing accessories; knitted or crocheted",
    "valueUsd": 1212417
  },
  {
    "hs2": "10",
    "desc": "Cereals",
    "valueUsd": 1073675
  },
  {
    "hs2": "34",
    "desc": "Soap, organic surface-active agents; washing, lubricating, polishing or scouring preparations; artificial or prepared waxes, candles and similar articles, modelling pastes, dental waxes and dental preparations with a basis of plaster",
    "valueUsd": 982839
  },
  {
    "hs2": "11",
    "desc": "Products of the milling industry; malt, starches, inulin, wheat gluten",
    "valueUsd": 981733
  },
  {
    "hs2": "20",
    "desc": "Preparations of vegetables, fruit, nuts or other parts of plants",
    "valueUsd": 919928
  },
  {
    "hs2": "84",
    "desc": "Machinery and mechanical appliances, boilers, nuclear reactors; parts thereof",
    "valueUsd": 752389
  },
  {
    "hs2": "12",
    "desc": "Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit, industrial or medicinal plants; straw and fodder",
    "valueUsd": 555931
  },
  {
    "hs2": "62",
    "desc": "Apparel and clothing accessories; not knitted or crocheted",
    "valueUsd": 542992
  },
  {
    "hs2": "68",
    "desc": "Stone, plaster, cement, asbestos, mica or similar materials; articles thereof",
    "valueUsd": 530275
  },
  {
    "hs2": "22",
    "desc": "Beverages, spirits and vinegar",
    "valueUsd": 457224
  },
  {
    "hs2": "90",
    "desc": "Optical, photographic, cinematographic, measuring, checking, medical or surgical instruments and apparatus; parts and accessories",
    "valueUsd": 435146
  },
  {
    "hs2": "39",
    "desc": "Plastics and articles thereof",
    "valueUsd": 392881
  },
  {
    "hs2": "97",
    "desc": "Works of art; collectors' pieces and antiques",
    "valueUsd": 365398
  },
  {
    "hs2": "85",
    "desc": "Electrical machinery and equipment and parts thereof; sound recorders and reproducers; television image and sound recorders and reproducers, parts and accessories of such articles",
    "valueUsd": 344332
  },
  {
    "hs2": "15",
    "desc": "Animal, vegetable or microbial fats and oils and their cleavage products; prepared edible fats; animal or vegetable waxes",
    "valueUsd": 296787
  },
  {
    "hs2": "63",
    "desc": "Textiles, made up articles; sets; worn clothing and worn textile articles; rags",
    "valueUsd": 254745
  },
  {
    "hs2": "57",
    "desc": "Carpets and other textile floor coverings",
    "valueUsd": 221664
  },
  {
    "hs2": "31",
    "desc": "Fertilizers",
    "valueUsd": 178400
  },
  {
    "hs2": "04",
    "desc": "Dairy produce; birds' eggs; natural honey; edible products of animal origin, not elsewhere specified or included",
    "valueUsd": 177820
  },
  {
    "hs2": "35",
    "desc": "Albuminoidal substances; modified starches; glues; enzymes",
    "valueUsd": 109580
  },
  {
    "hs2": "19",
    "desc": "Preparations of cereals, flour, starch or milk; pastrycooks' products",
    "valueUsd": 103913
  },
  {
    "hs2": "67",
    "desc": "Feathers and down, prepared; and articles made of feather or of down; artificial flowers; articles of human hair",
    "valueUsd": 99286
  },
  {
    "hs2": "17",
    "desc": "Sugars and sugar confectionery",
    "valueUsd": 87600
  },
  {
    "hs2": "01",
    "desc": "Animals; live",
    "valueUsd": 77993
  },
  {
    "hs2": "94",
    "desc": "Furniture; bedding, mattresses, mattress supports, cushions and similar stuffed furnishings; lamps and lighting fittings, n.e.c.; illuminated signs, illuminated name-plates and the like; prefabricated buildings",
    "valueUsd": 45732
  },
  {
    "hs2": "73",
    "desc": "Iron or steel articles",
    "valueUsd": 34566
  },
  {
    "hs2": "40",
    "desc": "Rubber and articles thereof",
    "valueUsd": 29687
  },
  {
    "hs2": "23",
    "desc": "Food industries, residues and wastes thereof; prepared animal fodder",
    "valueUsd": 29598
  },
  {
    "hs2": "49",
    "desc": "Printed books, newspapers, pictures and other products of the printing industry; manuscripts, typescripts and plans",
    "valueUsd": 24457
  },
  {
    "hs2": "70",
    "desc": "Glass and glassware",
    "valueUsd": 23875
  },
  {
    "hs2": "83",
    "desc": "Metal; miscellaneous products of base metal",
    "valueUsd": 13874
  },
  {
    "hs2": "13",
    "desc": "Lac; gums, resins and other vegetable saps and extracts",
    "valueUsd": 13465
  },
  {
    "hs2": "87",
    "desc": "Vehicles; other than railway or tramway rolling stock, and parts and accessories thereof",
    "valueUsd": 11235
  },
  {
    "hs2": "50",
    "desc": "Silk",
    "valueUsd": 6831
  },
  {
    "hs2": "32",
    "desc": "Tanning or dyeing extracts; tannins and their derivatives; dyes, pigments and other colouring matter; paints, varnishes; putty, other mastics; inks",
    "valueUsd": 6228
  },
  {
    "hs2": "18",
    "desc": "Cocoa and cocoa preparations",
    "valueUsd": 4210
  },
  {
    "hs2": "64",
    "desc": "Footwear; gaiters and the like; parts of such articles",
    "valueUsd": 3897
  },
  {
    "hs2": "65",
    "desc": "Headgear and parts thereof",
    "valueUsd": 2464
  },
  {
    "hs2": "58",
    "desc": "Fabrics; special woven fabrics, tufted textile fabrics, lace, tapestries, trimmings, embroidery",
    "valueUsd": 2207
  },
  {
    "hs2": "69",
    "desc": "Ceramic products",
    "valueUsd": 2019
  },
  {
    "hs2": "59",
    "desc": "Textile fabrics; impregnated, coated, covered or laminated; textile articles of a kind suitable for industrial use",
    "valueUsd": 1644
  },
  {
    "hs2": "42",
    "desc": "Articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles of animal gut (other than silk-worm gut)",
    "valueUsd": 1048
  }
];

/** HS-2 chapter aggregation for 2025 — US-reported exports to UZ. */
export const hs2_2025_usExports: Hs2Row[] = [
  {
    "hs2": "84",
    "desc": "Machinery and mechanical appliances, boilers, nuclear reactors; parts thereof",
    "valueUsd": 67202387
  },
  {
    "hs2": "85",
    "desc": "Electrical machinery and equipment and parts thereof; sound recorders and reproducers; television image and sound recorders and reproducers, parts and accessories of such articles",
    "valueUsd": 20187552
  },
  {
    "hs2": "40",
    "desc": "Rubber and articles thereof",
    "valueUsd": 6625731
  },
  {
    "hs2": "21",
    "desc": "Miscellaneous edible preparations",
    "valueUsd": 4303844
  },
  {
    "hs2": "73",
    "desc": "Iron or steel articles",
    "valueUsd": 3803755
  },
  {
    "hs2": "39",
    "desc": "Plastics and articles thereof",
    "valueUsd": 3164105
  },
  {
    "hs2": "29",
    "desc": "Organic chemicals",
    "valueUsd": 2980612
  },
  {
    "hs2": "70",
    "desc": "Glass and glassware",
    "valueUsd": 2378924
  },
  {
    "hs2": "83",
    "desc": "Metal; miscellaneous products of base metal",
    "valueUsd": 2189787
  },
  {
    "hs2": "82",
    "desc": "Tools, implements, cutlery, spoons and forks, of base metal; parts thereof, of base metal",
    "valueUsd": 2178238
  },
  {
    "hs2": "38",
    "desc": "Chemical products n.e.c.",
    "valueUsd": 1718681
  },
  {
    "hs2": "27",
    "desc": "Mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral waxes",
    "valueUsd": 1673175
  },
  {
    "hs2": "47",
    "desc": "Pulp of wood or other fibrous cellulosic material; recovered (waste and scrap) paper or paperboard",
    "valueUsd": 1639998
  },
  {
    "hs2": "02",
    "desc": "Meat and edible meat offal",
    "valueUsd": 1512928
  },
  {
    "hs2": "48",
    "desc": "Paper and paperboard; articles of paper pulp, of paper or paperboard",
    "valueUsd": 1433786
  },
  {
    "hs2": "07",
    "desc": "Vegetables and certain roots and tubers; edible",
    "valueUsd": 1255508
  },
  {
    "hs2": "33",
    "desc": "Essential oils and resinoids; perfumery, cosmetic or toilet preparations",
    "valueUsd": 1202520
  },
  {
    "hs2": "24",
    "desc": "Tobacco and manufactured tobacco substitutes; products, whether or not containing nicotine, intended for inhalation without combustion; other nicotine containing products intended for the intake of nicotine into the human body",
    "valueUsd": 1097877
  },
  {
    "hs2": "76",
    "desc": "Aluminium and articles thereof",
    "valueUsd": 1072807
  },
  {
    "hs2": "05",
    "desc": "Animal originated products; not elsewhere specified or included",
    "valueUsd": 1037515
  },
  {
    "hs2": "35",
    "desc": "Albuminoidal substances; modified starches; glues; enzymes",
    "valueUsd": 952699
  },
  {
    "hs2": "62",
    "desc": "Apparel and clothing accessories; not knitted or crocheted",
    "valueUsd": 813217
  },
  {
    "hs2": "12",
    "desc": "Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit, industrial or medicinal plants; straw and fodder",
    "valueUsd": 658506
  },
  {
    "hs2": "71",
    "desc": "Natural, cultured pearls; precious, semi-precious stones; precious metals, metals clad with precious metal, and articles thereof; imitation jewellery; coin",
    "valueUsd": 619047
  },
  {
    "hs2": "49",
    "desc": "Printed books, newspapers, pictures and other products of the printing industry; manuscripts, typescripts and plans",
    "valueUsd": 543571
  },
  {
    "hs2": "63",
    "desc": "Textiles, made up articles; sets; worn clothing and worn textile articles; rags",
    "valueUsd": 464720
  },
  {
    "hs2": "18",
    "desc": "Cocoa and cocoa preparations",
    "valueUsd": 462679
  },
  {
    "hs2": "75",
    "desc": "Nickel and articles thereof",
    "valueUsd": 425861
  },
  {
    "hs2": "30",
    "desc": "Pharmaceutical products",
    "valueUsd": 396798
  },
  {
    "hs2": "34",
    "desc": "Soap, organic surface-active agents; washing, lubricating, polishing or scouring preparations; artificial or prepared waxes, candles and similar articles, modelling pastes, dental waxes and dental preparations with a basis of plaster",
    "valueUsd": 392495
  },
  {
    "hs2": "28",
    "desc": "Inorganic chemicals; organic and inorganic compounds of precious metals; of rare earth metals, of radio-active elements and of isotopes",
    "valueUsd": 359807
  },
  {
    "hs2": "42",
    "desc": "Articles of leather; saddlery and harness; travel goods, handbags and similar containers; articles of animal gut (other than silk-worm gut)",
    "valueUsd": 344614
  },
  {
    "hs2": "32",
    "desc": "Tanning or dyeing extracts; tannins and their derivatives; dyes, pigments and other colouring matter; paints, varnishes; putty, other mastics; inks",
    "valueUsd": 331374
  },
  {
    "hs2": "64",
    "desc": "Footwear; gaiters and the like; parts of such articles",
    "valueUsd": 268381
  },
  {
    "hs2": "01",
    "desc": "Animals; live",
    "valueUsd": 172590
  },
  {
    "hs2": "08",
    "desc": "Fruit and nuts, edible; peel of citrus fruit or melons",
    "valueUsd": 172402
  },
  {
    "hs2": "61",
    "desc": "Apparel and clothing accessories; knitted or crocheted",
    "valueUsd": 158523
  },
  {
    "hs2": "13",
    "desc": "Lac; gums, resins and other vegetable saps and extracts",
    "valueUsd": 126432
  },
  {
    "hs2": "81",
    "desc": "Metals; n.e.c., cermets and articles thereof",
    "valueUsd": 110030
  },
  {
    "hs2": "10",
    "desc": "Cereals",
    "valueUsd": 98340
  },
  {
    "hs2": "03",
    "desc": "Fish and crustaceans, molluscs and other aquatic invertebrates",
    "valueUsd": 93314
  },
  {
    "hs2": "68",
    "desc": "Stone, plaster, cement, asbestos, mica or similar materials; articles thereof",
    "valueUsd": 70460
  },
  {
    "hs2": "59",
    "desc": "Textile fabrics; impregnated, coated, covered or laminated; textile articles of a kind suitable for industrial use",
    "valueUsd": 66183
  },
  {
    "hs2": "55",
    "desc": "Man-made staple fibres",
    "valueUsd": 54722
  },
  {
    "hs2": "69",
    "desc": "Ceramic products",
    "valueUsd": 39745
  },
  {
    "hs2": "72",
    "desc": "Iron and steel",
    "valueUsd": 33980
  },
  {
    "hs2": "74",
    "desc": "Copper and articles thereof",
    "valueUsd": 31676
  },
  {
    "hs2": "65",
    "desc": "Headgear and parts thereof",
    "valueUsd": 29978
  },
  {
    "hs2": "25",
    "desc": "Salt; sulphur; earths, stone; plastering materials, lime and cement",
    "valueUsd": 26208
  },
  {
    "hs2": "11",
    "desc": "Products of the milling industry; malt, starches, inulin, wheat gluten",
    "valueUsd": 19401
  },
  {
    "hs2": "37",
    "desc": "Photographic or cinematographic goods",
    "valueUsd": 4850
  },
  {
    "hs2": "22",
    "desc": "Beverages, spirits and vinegar",
    "valueUsd": 3744
  },
  {
    "hs2": "44",
    "desc": "Wood and articles of wood; wood charcoal",
    "valueUsd": 3000
  }
];

/** Mirror discrepancy table for 2024 — top-40 codes by either-side trade value. */
export const mirror2024: MirrorRow[] = [
  {
    "hs6": "271019",
    "desc": "Petroleum oils and oils from bituminous minerals, not containing biodiesel, not crude, not waste oils; preparations n.e.c, containing by weight 70% or more of petroleum oils or oils from bituminous minerals; not light oils and preparations",
    "uzExportsToUs": 113722307.99,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 456999,
    "usExportsToUz": 901114
  },
  {
    "hs6": "880240",
    "desc": "Aeroplanes and other aircraft, except unmanned; of an unladen weight exceeding 15,000kg",
    "uzExportsToUs": 10552090,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 93000000,
    "usExportsToUz": 0
  },
  {
    "hs6": "847150",
    "desc": "Units of automatic data processing machines; processing units other than those of item no. 8471.41 or 8471.49, whether or not containing in the same housing one or two of the following types of unit: storage units, input units or output units",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 23468097.97,
    "usExportsToUz": 1208576
  },
  {
    "hs6": "870324",
    "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 3000cc",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 22068589.98,
    "usExportsToUz": 972804
  },
  {
    "hs6": "841480",
    "desc": "Pumps and compressors; for air, vacuum or gas, n.e.c. in heading no. 8414",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 16296763,
    "usExportsToUz": 60591
  },
  {
    "hs6": "841330",
    "desc": "Pumps; fuel, lubricating or cooling medium pumps for internal combustion piston engines",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 14050128.97,
    "usExportsToUz": 22006
  },
  {
    "hs6": "854370",
    "desc": "Electrical machines and apparatus; having individual functions, not specified or included elsewhere in this chapter, n.e.c. in heading no. 8543",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 9030191,
    "usExportsToUz": 12934438
  },
  {
    "hs6": "841360",
    "desc": "Pumps; rotary positive displacement pumps, n.e.c. in heading no. 8413, for liquids",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 354677.99,
    "usExportsToUz": 11448332
  },
  {
    "hs6": "853710",
    "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
    "uzExportsToUs": 69500,
    "usImportsFromUz": 6825,
    "uzImportsFromUs": 0,
    "usExportsToUz": 11384023
  },
  {
    "hs6": "870323",
    "desc": "Vehicles; with only spark-ignition internal combustion reciprocating piston engine, cylinder capacity over 1500 but not over 3000cc",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 8569909.99,
    "usExportsToUz": 1089784
  },
  {
    "hs6": "999999",
    "desc": "Commodities not specified according to kind",
    "uzExportsToUs": 0,
    "usImportsFromUz": 7899293,
    "uzImportsFromUs": 0,
    "usExportsToUz": 0
  },
  {
    "hs6": "851762",
    "desc": "Communication apparatus (excluding telephone sets or base stations); machines for the reception, conversion and transmission or regeneration of voice, images or other data, including switching and routing apparatus",
    "uzExportsToUs": 15570,
    "usImportsFromUz": 14478,
    "uzImportsFromUs": 7269543.98,
    "usExportsToUz": 2079353
  },
  {
    "hs6": "711292",
    "desc": "Waste and scrap of precious metals; of platinum, including metal clad with platinum but excluding sweepings containing other precious metals",
    "uzExportsToUs": 5706100,
    "usImportsFromUz": 6647619,
    "uzImportsFromUs": 0,
    "usExportsToUz": 0
  },
  {
    "hs6": "760421",
    "desc": "Aluminium; alloys, hollow profiles",
    "uzExportsToUs": 6294602.99,
    "usImportsFromUz": 2655422,
    "uzImportsFromUs": 0,
    "usExportsToUz": 0
  },
  {
    "hs6": "901540",
    "desc": "Surveying equipment; photogrammetrical surveying instruments and appliances",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 6245989.99,
    "usExportsToUz": 0
  },
  {
    "hs6": "540333",
    "desc": "Yarn, artificial; filament, monofilament (less than 67 decitex), of cellulose acetate, single, not for retail sale, not sewing thread",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 6129347.99,
    "usExportsToUz": 0
  },
  {
    "hs6": "850153",
    "desc": "Electric motors; AC motors, multi-phase, of an output exceeding 75kW",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 6111000,
    "usExportsToUz": 1186668
  },
  {
    "hs6": "470321",
    "desc": "Wood pulp; chemical wood pulp, soda or sulphate, (other than dissolving grades), semi-bleached or bleached, of coniferous wood",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 6002405.98,
    "usExportsToUz": 1562775
  },
  {
    "hs6": "840999",
    "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
    "uzExportsToUs": 39634,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 5371182.98,
    "usExportsToUz": 4175882
  },
  {
    "hs6": "210690",
    "desc": "Food preparations; n.e.c. in item no. 2106.10",
    "uzExportsToUs": 11820,
    "usImportsFromUz": 271917,
    "uzImportsFromUs": 5200306.99,
    "usExportsToUz": 1909613
  },
  {
    "hs6": "841112",
    "desc": "Turbo-jets; of a thrust exceeding 25kN",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 5026500,
    "usExportsToUz": 0
  },
  {
    "hs6": "760429",
    "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
    "uzExportsToUs": 5024669.99,
    "usImportsFromUz": 3904333,
    "uzImportsFromUs": 0,
    "usExportsToUz": 2860
  },
  {
    "hs6": "020714",
    "desc": "Meat and edible offal; of fowls of the species Gallus domesticus, cuts and offal, frozen",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 4589706.99,
    "usExportsToUz": 1214068
  },
  {
    "hs6": "841182",
    "desc": "Turbines; gas-turbines (excluding turbo-jets and turbo-propellers), of a power exceeding 5000kW",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 0,
    "usExportsToUz": 4542567
  },
  {
    "hs6": "847190",
    "desc": "Magnetic or optical readers, machines for transcribing data onto data media in coded form and machines for processing such data, not elsewhere specified or included",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 4316018,
    "usExportsToUz": 113483
  },
  {
    "hs6": "271220",
    "desc": "Paraffin wax; containing by weight less than 0.75% of oil, obtained by synthesis or by other processes, whether or not coloured",
    "uzExportsToUs": 4198886,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 0,
    "usExportsToUz": 0
  },
  {
    "hs6": "870894",
    "desc": "Vehicle parts; steering wheels, steering columns and steering boxes; parts thereof",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 4057684.98,
    "usExportsToUz": 0
  },
  {
    "hs6": "481151",
    "desc": "Paper and paperboard; coated, impregnated or covered with plastics (excluding adhesives), bleached, weighing more than 150g/m2, other than goods of heading no. 4803, 4809, or 4810",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 3565133,
    "usExportsToUz": 2706264
  },
  {
    "hs6": "840890",
    "desc": "Engines; compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of a kind used for other than marine propulsion or the vehicles of chapter 87",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 3502187,
    "usExportsToUz": 3290001
  },
  {
    "hs6": "847410",
    "desc": "Machines; for sorting, screening, separating or washing earth, stone, ores or other mineral substances",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 3296755,
    "usExportsToUz": 0
  },
  {
    "hs6": "741110",
    "desc": "Copper; tubes and pipes, of refined copper",
    "uzExportsToUs": 664582,
    "usImportsFromUz": 3228714,
    "uzImportsFromUs": 892,
    "usExportsToUz": 0
  },
  {
    "hs6": "854430",
    "desc": "Insulated electric conductors; ignition wiring sets and other wiring sets of a kind used in vehicles, aircraft or ships",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 0,
    "usExportsToUz": 3103318
  },
  {
    "hs6": "847170",
    "desc": "Units of automatic data processing machines; storage units",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 3066863.99,
    "usExportsToUz": 67016
  },
  {
    "hs6": "903010",
    "desc": "Instruments and apparatus; for measuring or detecting ionising radiations",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 2960290,
    "usExportsToUz": 0
  },
  {
    "hs6": "382219",
    "desc": "Reagents; diagnostic or laboratory reagents on a backing, prepared diagnostic or laboratory reagents whether or not on a backing, whether or not put up in the form of kits; n.e.c.in item 3822.1",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 2916299.99,
    "usExportsToUz": 1940433
  },
  {
    "hs6": "870895",
    "desc": "Vehicle parts; safety airbags with inflater system; parts thereof",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 2755433.99,
    "usExportsToUz": 1482599
  },
  {
    "hs6": "840820",
    "desc": "Engines; compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of a kind used for the propulsion of vehicles of chapter 87",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 2740472,
    "usExportsToUz": 0
  },
  {
    "hs6": "850213",
    "desc": "Electric generating sets; with compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of an output exceeding 375kVA",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 838157,
    "usExportsToUz": 2645579
  },
  {
    "hs6": "846249",
    "desc": "Machine-tools; punching, notching or nibbling machines (excluding presses) for flat products including combined punching and shearing machines, other than numerically controlled, for working metal",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 0,
    "usExportsToUz": 2347560
  },
  {
    "hs6": "846211",
    "desc": "Machine-tools; forging and die-forging machines (including presses), closed die forging machines, for working metal",
    "uzExportsToUs": 0,
    "usImportsFromUz": 0,
    "uzImportsFromUs": 0,
    "usExportsToUz": 2300000
  }
];

/** 5-year trend for the 2024 top-10 UZ export codes (US-reported imports). */
export const trendTopUsImports: Hs6Trend[] = [
  {
    "hs6": "999999",
    "desc": "Commodities not specified according to kind",
    "series": {
      "2021": 87755059,
      "2022": 3110665,
      "2023": 1440141,
      "2024": 7899293,
      "2025": 18170695
    }
  },
  {
    "hs6": "711292",
    "desc": "Waste and scrap of precious metals; of platinum, including metal clad with platinum but excluding sweepings containing other precious metals",
    "series": {
      "2021": 0,
      "2022": 0,
      "2023": 0,
      "2024": 6647619,
      "2025": 0
    }
  },
  {
    "hs6": "760429",
    "desc": "Aluminium; alloys, bars, rods and profiles, other than hollow",
    "series": {
      "2021": 0,
      "2022": 607634,
      "2023": 140665,
      "2024": 3904333,
      "2025": 4876868
    }
  },
  {
    "hs6": "741110",
    "desc": "Copper; tubes and pipes, of refined copper",
    "series": {
      "2021": 0,
      "2022": 0,
      "2023": 0,
      "2024": 3228714,
      "2025": 3300666
    }
  },
  {
    "hs6": "760421",
    "desc": "Aluminium; alloys, hollow profiles",
    "series": {
      "2021": 0,
      "2022": 0,
      "2023": 0,
      "2024": 2655422,
      "2025": 5656651
    }
  },
  {
    "hs6": "810294",
    "desc": "Molybdenum; unwrought, including bars and rods obtained simply by sintering",
    "series": {
      "2021": 1314256,
      "2022": 887007,
      "2023": 1632806,
      "2024": 2199071,
      "2025": 4441682
    }
  },
  {
    "hs6": "071290",
    "desc": "Vegetables; mixtures of vegetables n.e.c. in heading no. 0712, whole, cut, sliced, broken or in powder but not further prepared, dried",
    "series": {
      "2021": 1829069,
      "2022": 3110969,
      "2023": 2108322,
      "2024": 2152912,
      "2025": 2213467
    }
  },
  {
    "hs6": "284443",
    "desc": "Radioactive elements, isotopes and compounds; other alloys, dispersions (including cermets), ceramic products and mixtures containing these elements, isotopes or compounds",
    "series": {
      "2021": 0,
      "2022": 2210855,
      "2023": 2553169,
      "2024": 2092926,
      "2025": 2842350
    }
  },
  {
    "hs6": "090421",
    "desc": "Spices; fruits of the genus Capsicum or Pimenta, dried, neither crushed nor ground",
    "series": {
      "2021": 3515013,
      "2022": 1922575,
      "2023": 1270509,
      "2024": 1584895,
      "2025": 2387749
    }
  },
  {
    "hs6": "071331",
    "desc": "Vegetables, leguminous; beans of the species vigna mungo (l.) hepper or vigna radiata (l.) wilczek, shelled, whether or not skinned or split, dried",
    "series": {
      "2021": 0,
      "2022": 2417324,
      "2023": 19289,
      "2024": 1461458,
      "2025": 1361601
    }
  }
];

/** 5-year trend for the 2024 top-10 UZ import codes (US-reported exports). */
export const trendTopUsExports: Hs6Trend[] = [
  {
    "hs6": "854370",
    "desc": "Electrical machines and apparatus; having individual functions, not specified or included elsewhere in this chapter, n.e.c. in heading no. 8543",
    "series": {
      "2021": 1556361,
      "2022": 3087072,
      "2023": 9102291,
      "2024": 12934438,
      "2025": 0
    }
  },
  {
    "hs6": "841360",
    "desc": "Pumps; rotary positive displacement pumps, n.e.c. in heading no. 8413, for liquids",
    "series": {
      "2021": 2050910,
      "2022": 5183888,
      "2023": 7225820,
      "2024": 11448332,
      "2025": 820923
    }
  },
  {
    "hs6": "853710",
    "desc": "Boards, panels, consoles, desks and other bases; for electric control or the distribution of electricity, (other than switching apparatus of heading no. 8517), for a voltage not exceeding 1000 volts",
    "series": {
      "2021": 747780,
      "2022": 3743130,
      "2023": 14707379,
      "2024": 11384023,
      "2025": 0
    }
  },
  {
    "hs6": "841182",
    "desc": "Turbines; gas-turbines (excluding turbo-jets and turbo-propellers), of a power exceeding 5000kW",
    "series": {
      "2021": 6106708,
      "2022": 0,
      "2023": 7000000,
      "2024": 4542567,
      "2025": 4886277
    }
  },
  {
    "hs6": "840999",
    "desc": "Engines; parts for internal combustion piston engines (excluding spark-ignition)",
    "series": {
      "2021": 1127797,
      "2022": 679317,
      "2023": 2098011,
      "2024": 4175882,
      "2025": 647713
    }
  },
  {
    "hs6": "840890",
    "desc": "Engines; compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of a kind used for other than marine propulsion or the vehicles of chapter 87",
    "series": {
      "2021": 0,
      "2022": 0,
      "2023": 299973,
      "2024": 3290001,
      "2025": 178582
    }
  },
  {
    "hs6": "854430",
    "desc": "Insulated electric conductors; ignition wiring sets and other wiring sets of a kind used in vehicles, aircraft or ships",
    "series": {
      "2021": 278723,
      "2022": 258056,
      "2023": 980315,
      "2024": 3103318,
      "2025": 0
    }
  },
  {
    "hs6": "481151",
    "desc": "Paper and paperboard; coated, impregnated or covered with plastics (excluding adhesives), bleached, weighing more than 150g/m2, other than goods of heading no. 4803, 4809, or 4810",
    "series": {
      "2021": 0,
      "2022": 0,
      "2023": 2525955,
      "2024": 2706264,
      "2025": 1270604
    }
  },
  {
    "hs6": "850213",
    "desc": "Electric generating sets; with compression-ignition internal combustion piston engines (diesel or semi-diesel engines), of an output exceeding 375kVA",
    "series": {
      "2021": 0,
      "2022": 0,
      "2023": 0,
      "2024": 2645579,
      "2025": 2558890
    }
  },
  {
    "hs6": "846249",
    "desc": "Machine-tools; punching, notching or nibbling machines (excluding presses) for flat products including combined punching and shearing machines, other than numerically controlled, for working metal",
    "series": {
      "2021": 0,
      "2022": 0,
      "2023": 0,
      "2024": 2347560,
      "2025": 0
    }
  }
];

/** Annual totals as reported by UZ side. */
export const comtradeAnnualUzReporter: Record<number, { exportsToUs: number; importsFromUs: number }> = {
  "2021": {
    "exportsToUs": 20173096.39,
    "importsFromUs": 100203997.15999998
  },
  "2022": {
    "exportsToUs": 16552078.051000003,
    "importsFromUs": 121088345.84999989
  },
  "2023": {
    "exportsToUs": 61734204.41000001,
    "importsFromUs": 318093567.7000009
  },
  "2024": {
    "exportsToUs": 157537189.73000014,
    "importsFromUs": 338101183.72000074
  },
  "2025": {
    "exportsToUs": 0,
    "importsFromUs": 0
  }
};

/** Annual totals as reported by US side. */
export const comtradeAnnualUsReporter: Record<number, { exportsToUz: number; importsFromUz: number }> = {
  "2021": {
    "exportsToUz": 401627442,
    "importsFromUz": 189145447
  },
  "2022": {
    "exportsToUz": 272674484,
    "importsFromUz": 61036309
  },
  "2023": {
    "exportsToUz": 236446356,
    "importsFromUz": 96774310
  },
  "2024": {
    "exportsToUz": 149895644,
    "importsFromUz": 44409142
  },
  "2025": {
    "exportsToUz": 137009077,
    "importsFromUz": 578195212
  }
};

export const comtradeMeta = {
  source: "UN Comtrade preview API (public, no auth)",
  sourceId: "comtrade_hs6" as const,
  endpoint: "https://comtradeapi.un.org/public/v1/preview/C/A/HS",
  fetched_at: "2026-04-29",
  classificationCode: "H6",
  reporters: { uz: 860, us: 842 },
  yearsCovered: [2021,2022,2023,2024,2025],
  uzReporting2025: false,
  is_demo: false,
};
