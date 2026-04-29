/**
 * Trade Map (ITC) deep-view for 2024 — UZ↔US bilateral product trade.
 *
 * Trade Map computes ready-to-use indicators that Comtrade does not:
 *   • Share (%)               — code's share of partner-level total
 *   • Growth Value 5Y (%)     — CAGR over the trailing 5 years
 *   • Growth Quantity 5Y (%)  — same for physical units
 *   • Unit Value (USD)        — average unit price
 * Russian product labels come straight from the Trade Map UI export
 * (the user is logged in via the UZ statistics-agency account).
 *
 * Source: `trademap_itc`. Refreshed 2026-04-29 from user-exported XLSX.
 * Residual code 999999 ("not specified") filtered.
 */
export interface TrademapProduct2024 {
  /** HS-6 (or HS-4 for older series) code. */
  hs: string;
  /** Russian product label as exported. */
  labelRu: string;
  /** USD value (raw, not thousands). */
  valueUsd: number;
  /** Quantity in the dominant unit (Trade Map mixes units; quantity may be null). */
  quantity: number | null;
  /** Average unit value, USD. */
  unitValueUsd: number | null;
  /** Share of partner-level annual total, percent. */
  sharePct: number;
  /** Compound 5-year growth in value, percent (null if not computable). */
  growth5yValuePct: number | null;
  /** Compound 5-year growth in physical quantity, percent. */
  growth5yQuantityPct: number | null;
}

/** Top-40 UZ exports to US in 2024 (residual 999999 excluded). */
export const uzExportsToUs2024Top: TrademapProduct2024[] = [
  {
    "hs": "271019",
    "labelRu": "Прочие дистилляты и продукты",
    "valueUsd": 113722000,
    "quantity": 204860,
    "unitValueUsd": 555.1205701454652,
    "sharePct": 30.393867880404425,
    "growth5yValuePct": null,
    "growth5yQuantityPct": 499
  },
  {
    "hs": "880240",
    "labelRu": "Самолеты и прочие летательные аппараты, с массой пустого снаряженного  аппарата более 15 000 кг",
    "valueUsd": 10552000,
    "quantity": 8,
    "unitValueUsd": 1319000,
    "sharePct": 9.083396460298877,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "760421",
    "labelRu": "Профили полые из алюминиевых сплавов",
    "valueUsd": 6295000,
    "quantity": 1540,
    "unitValueUsd": 4087.6623376623374,
    "sharePct": 23.57413024753773,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "711292",
    "labelRu": "Прочие отходы платины, включая металл, плакированный платиной, но исключая отходы, содержащие другие драгоценные металлы",
    "valueUsd": 5706000,
    "quantity": 70,
    "unitValueUsd": 81514.28571428571,
    "sharePct": 44.70035252643948,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "760429",
    "labelRu": "Прочие прутки и профили из алюминиевых сплавов",
    "valueUsd": 5025000,
    "quantity": 1308,
    "unitValueUsd": 3841.743119266055,
    "sharePct": 34.41545099650709,
    "growth5yValuePct": null,
    "growth5yQuantityPct": 261
  },
  {
    "hs": "271220",
    "labelRu": "Парафин с содержанием масел менее 0,75 мас %",
    "valueUsd": 4199000,
    "quantity": 10165,
    "unitValueUsd": 413.0841121495327,
    "sharePct": 10.118559930599066,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "071290",
    "labelRu": "Прочие овощи и овощные смеси, сушеные, целые, нарезанные кусками, ломтиками, измельченные или в виде порошка, но не подвергнутые дальнейшей обработке",
    "valueUsd": 1718000,
    "quantity": 489,
    "unitValueUsd": 3513.2924335378325,
    "sharePct": 7.800227014755959,
    "growth5yValuePct": -3,
    "growth5yQuantityPct": -14
  },
  {
    "hs": "090421",
    "labelRu": "Плоды рода capsicum или рода pimenta сушеные, недробленые и немолотые",
    "valueUsd": 1610000,
    "quantity": 321,
    "unitValueUsd": 5015.576323987539,
    "sharePct": 31.71164073271617,
    "growth5yValuePct": -14,
    "growth5yQuantityPct": -20
  },
  {
    "hs": "610910",
    "labelRu": "Майки, фуфайки с рукавами и прочие нательные фуфайки трикотажные, из хлопчатобумажной пряжи, машинного или ручного вязания",
    "valueUsd": 857000,
    "quantity": 26,
    "unitValueUsd": 32961.53846153846,
    "sharePct": 0.2863185184937708,
    "growth5yValuePct": 159,
    "growth5yQuantityPct": null
  },
  {
    "hs": "100630",
    "labelRu": "Полуобрушенный или полностью обрушенный рис, полированный или неполированный, глазированный или неглазированный",
    "valueUsd": 844000,
    "quantity": 269,
    "unitValueUsd": 3137.546468401487,
    "sharePct": 61.605839416058394,
    "growth5yValuePct": 101,
    "growth5yQuantityPct": -7
  },
  {
    "hs": "741110",
    "labelRu": "Трубы и трубки из рафинированной меди",
    "valueUsd": 665000,
    "quantity": 72,
    "unitValueUsd": 9236.111111111111,
    "sharePct": 0.265138829083138,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "681599",
    "labelRu": "Изделия из камня или других минеральных веществ (включая углеродные волокна, изделия из углеродных волокон и изделия из торфа), в другом месте не поименованные или не включенные:прочие",
    "valueUsd": 525000,
    "quantity": 221,
    "unitValueUsd": 2375.5656108597286,
    "sharePct": 11.768661735036988,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "080620",
    "labelRu": "Виноград сушеный",
    "valueUsd": 393000,
    "quantity": 156,
    "unitValueUsd": 2519.230769230769,
    "sharePct": 0.5018708416872055,
    "growth5yValuePct": 49,
    "growth5yQuantityPct": 26
  },
  {
    "hs": "040490",
    "labelRu": "Прочие молочные продукты с добавлением или без добавления сахара или других подслащивающих веществ",
    "valueUsd": 351000,
    "quantity": 27,
    "unitValueUsd": 13000,
    "sharePct": 94.86486486486487,
    "growth5yValuePct": 50,
    "growth5yQuantityPct": 31
  },
  {
    "hs": "841899",
    "labelRu": "Прочие части холодильников, морозильников и прочего холодильного или морозильного оборудования электрического или других типов",
    "valueUsd": 329000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 29.140832595217006,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "854320",
    "labelRu": "Машины электрические и аппаратура, имеющие индивидуальные функции, в другом месте данной группы не поименованные или не включенные, генераторы сигналов",
    "valueUsd": 327000,
    "quantity": 1762,
    "unitValueUsd": 185.58456299659477,
    "sharePct": 73.64864864864865,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "392590",
    "labelRu": "Прочие детали строительные из пластмасс",
    "valueUsd": 321000,
    "quantity": 105,
    "unitValueUsd": 3057.1428571428573,
    "sharePct": 3.19912298186167,
    "growth5yValuePct": 6,
    "growth5yQuantityPct": 13
  },
  {
    "hs": "200819",
    "labelRu": "Прочие орехи и семена, включая смеси, приготовленные или консервированные иным способом",
    "valueUsd": 306000,
    "quantity": 65,
    "unitValueUsd": 4707.692307692308,
    "sharePct": 2.311527421060583,
    "growth5yValuePct": 157,
    "growth5yQuantityPct": 114
  },
  {
    "hs": "081310",
    "labelRu": "Абрикосы сушеные",
    "valueUsd": 226000,
    "quantity": 59,
    "unitValueUsd": 3830.508474576271,
    "sharePct": 1.2903225806451613,
    "growth5yValuePct": 39,
    "growth5yQuantityPct": 25
  },
  {
    "hs": "570242",
    "labelRu": "Прочие ворсовые готовые ковры из химических текстильных материалов",
    "valueUsd": 171000,
    "quantity": 40,
    "unitValueUsd": 4275,
    "sharePct": 1.163819505887157,
    "growth5yValuePct": -13,
    "growth5yQuantityPct": null
  },
  {
    "hs": "040900",
    "labelRu": "Мед натуральный",
    "valueUsd": 157000,
    "quantity": 52,
    "unitValueUsd": 3019.230769230769,
    "sharePct": 91.27906976744185,
    "growth5yValuePct": -21,
    "growth5yQuantityPct": 13
  },
  {
    "hs": "010620",
    "labelRu": "Прочие живые животные: рептилии (включая змей и черепах)",
    "valueUsd": 130000,
    "quantity": 18300,
    "unitValueUsd": 7.103825136612022,
    "sharePct": 35.61643835616438,
    "growth5yValuePct": 0,
    "growth5yQuantityPct": -4
  },
  {
    "hs": "340490",
    "labelRu": "Прочие воски искусственные и готовые воски",
    "valueUsd": 127000,
    "quantity": 115,
    "unitValueUsd": 1104.3478260869565,
    "sharePct": 2.3475046210720887,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "841191",
    "labelRu": "Части турбореактивных или турбовинтовых двигателей",
    "valueUsd": 119000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 99.16666666666667,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "880320",
    "labelRu": "Части летательных аппаратов товарной позиции 8801 или 8802:              шасси и их части",
    "valueUsd": 104000,
    "quantity": 5,
    "unitValueUsd": 20800,
    "sharePct": 7.509025270758123,
    "growth5yValuePct": -20,
    "growth5yQuantityPct": null
  },
  {
    "hs": "760612",
    "labelRu": "Плиты, листы, полосы или ленты прямоугольные (включая квадратные), толщиной более 0,2 мм, из алюминиевых сплавов",
    "valueUsd": 103000,
    "quantity": 25,
    "unitValueUsd": 4120,
    "sharePct": 2.104617899468737,
    "growth5yValuePct": 6,
    "growth5yQuantityPct": 3
  },
  {
    "hs": "081320",
    "labelRu": "Чернослив сушеный",
    "valueUsd": 102000,
    "quantity": 30,
    "unitValueUsd": 3400,
    "sharePct": 0.2614580129191018,
    "growth5yValuePct": 210,
    "growth5yQuantityPct": 134
  },
  {
    "hs": "130219",
    "labelRu": "Прочие растительные соки и экстракты",
    "valueUsd": 102000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 85.71428571428571,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "220299",
    "labelRu": "Прочие воды, включая минер-е и газир-е, сод. добавки сахара или вкусо-ароматических веществ, и пр. безалког. напитки, за исключением  фрукт-х или овощных соков товарной позиции 2009",
    "valueUsd": 101000,
    "quantity": 122,
    "unitValueUsd": 827.8688524590164,
    "sharePct": 2.9343404997094713,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "902730",
    "labelRu": "Спектрометры, спектрофотометры и спектрографы, основанные на действии оптического излучения (ультрафиолетового, видимой части спектра, инфракрасного)",
    "valueUsd": 98000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 20.8067940552017,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "200190",
    "labelRu": "Прочие овощи, фрукты, орехи и другие съедобные части растений, приготовленные или консервированные c добавлением уксуса или уксусной кислоты",
    "valueUsd": 97000,
    "quantity": 128,
    "unitValueUsd": 757.8125,
    "sharePct": 6.67584308327598,
    "growth5yValuePct": null,
    "growth5yQuantityPct": 156
  },
  {
    "hs": "080232",
    "labelRu": "Орехи грецкие без скорлупы свежие или сушеные",
    "valueUsd": 94000,
    "quantity": 17,
    "unitValueUsd": 5529.411764705882,
    "sharePct": 0.2993725914838052,
    "growth5yValuePct": null,
    "growth5yQuantityPct": 50
  },
  {
    "hs": "071331",
    "labelRu": "Фасоль видов vinga mungo (l.) hepper или vinga radiata(l.) wilczek сушеная, лущеная, очищенная от семенной кожуры или неочищенная, колотая или неколотая",
    "valueUsd": 91000,
    "quantity": 52,
    "unitValueUsd": 1750,
    "sharePct": 0.0697072296355308,
    "growth5yValuePct": null,
    "growth5yQuantityPct": 87
  },
  {
    "hs": "830249",
    "labelRu": "Крепежная арматура, фурнитура и аналогичные детали прочие, прочие",
    "valueUsd": 86000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 92.47311827956989,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "151211",
    "labelRu": "Масло подсолнечное или сафлоровое сырое",
    "valueUsd": 79000,
    "quantity": 70,
    "unitValueUsd": 1128.5714285714287,
    "sharePct": 0.5575945793337098,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "070993",
    "labelRu": "Тыквы, кабачки и прочие овощи семейства тыквенных (cucurbita spp.) свежие или охлажденные",
    "valueUsd": 77000,
    "quantity": 20,
    "unitValueUsd": 3850,
    "sharePct": 5.712166172106825,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "151550",
    "labelRu": "Масло кунжутное и его фракции",
    "valueUsd": 77000,
    "quantity": 14,
    "unitValueUsd": 5500,
    "sharePct": 95.06172839506173,
    "growth5yValuePct": null,
    "growth5yQuantityPct": 24
  },
  {
    "hs": "170490",
    "labelRu": "Прочие кондитерские изделия из сахара (включая белый шоколад), не содержащие какао",
    "valueUsd": 71000,
    "quantity": 21,
    "unitValueUsd": 3380.9523809523807,
    "sharePct": 1.1188150015757958,
    "growth5yValuePct": 125,
    "growth5yQuantityPct": 66
  },
  {
    "hs": "220110",
    "labelRu": "Воды минеральные и газированные",
    "valueUsd": 70000,
    "quantity": 94,
    "unitValueUsd": 744.6808510638298,
    "sharePct": 11.308562197092083,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "853710",
    "labelRu": "Пульты, панели, консоли, столы, распределительные щиты и основания для электрической аппаратуры на напряжение не более 1000 в",
    "valueUsd": 70000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 0.9543285616905249,
    "growth5yValuePct": 52,
    "growth5yQuantityPct": null
  }
];

/** Top-40 US exports to UZ in 2024 (residual 999999 excluded). */
export const usExportsToUz2024Top: TrademapProduct2024[] = [
  {
    "hs": "854370",
    "labelRu": "Прочие машины и аппаратура",
    "valueUsd": 12939000,
    "quantity": 195865,
    "unitValueUsd": 66.06080718862482,
    "sharePct": 0.2856519029441419,
    "growth5yValuePct": 85,
    "growth5yQuantityPct": 44
  },
  {
    "hs": "841360",
    "labelRu": "Прочие насосы объемные роторные",
    "valueUsd": 11448000,
    "quantity": 162879,
    "unitValueUsd": 70.28530381448806,
    "sharePct": 0.8388546205150075,
    "growth5yValuePct": 37,
    "growth5yQuantityPct": 20
  },
  {
    "hs": "853710",
    "labelRu": "Пульты, панели, консоли, столы, распределительные щиты и основания для электрической аппаратуры на напряжение не более 1000 в",
    "valueUsd": 11384000,
    "quantity": 4790,
    "unitValueUsd": 2376.6179540709813,
    "sharePct": 0.1424823239437766,
    "growth5yValuePct": 115,
    "growth5yQuantityPct": 93
  },
  {
    "hs": "841182",
    "labelRu": "Прочие турбины газовые мощностью более 5000 квт",
    "valueUsd": 4543000,
    "quantity": 1,
    "unitValueUsd": 4543000,
    "sharePct": 0.2514064483568101,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "840999",
    "labelRu": "Прочие части,предназначенные исключительно или главным образом для двигателей товарной позиции 8407 или 8408",
    "valueUsd": 4176000,
    "quantity": 35,
    "unitValueUsd": 119314.28571428571,
    "sharePct": 0.1632586680344532,
    "growth5yValuePct": 32,
    "growth5yQuantityPct": 2
  },
  {
    "hs": "902219",
    "labelRu": "Прочая аппаратура на основе рентгеновского излучения, рентгенографическая",
    "valueUsd": 3564000,
    "quantity": 3481,
    "unitValueUsd": 1023.8437230680839,
    "sharePct": 0.5169532827403746,
    "growth5yValuePct": -23,
    "growth5yQuantityPct": 70
  },
  {
    "hs": "901540",
    "labelRu": "Фотограмметрические, геодезические или топографические инструменты и приборы",
    "valueUsd": 3546000,
    "quantity": 44,
    "unitValueUsd": 80590.90909090909,
    "sharePct": 4.984257281007534,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "840890",
    "labelRu": "Прочие двигатели внутреннего сгорания поршневые с воспламенением от сжатия (дизели или полудизели)",
    "valueUsd": 3290000,
    "quantity": 99,
    "unitValueUsd": 33232.32323232323,
    "sharePct": 0.1716572489969269,
    "growth5yValuePct": 131,
    "growth5yQuantityPct": 13
  },
  {
    "hs": "854430",
    "labelRu": "Комплекты проводов для свечей зажигания и комплекты проводов прочие,     используемые в моторных транспортных средствах, самолетах или судах",
    "valueUsd": 3103000,
    "quantity": 112827,
    "unitValueUsd": 27.502282255133967,
    "sharePct": 0.1082926785005704,
    "growth5yValuePct": 254,
    "growth5yQuantityPct": 1660
  },
  {
    "hs": "481151",
    "labelRu": "Бумага и картон с покрытием, пропиткой или ламинированные пластмассой (за искл.клеев) беленые, массой 1 м2 более 150 г",
    "valueUsd": 2706000,
    "quantity": 204,
    "unitValueUsd": 13264.70588235294,
    "sharePct": 0.4177253880091511,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "850213",
    "labelRu": "Установки электрогенераторные с поршневым двигателем внутреннего сгорания с воспламенением от сжатия мощностью более 375 ква",
    "valueUsd": 2646000,
    "quantity": 8,
    "unitValueUsd": 330750,
    "sharePct": 0.3544987580485687,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "901890",
    "labelRu": "Прочие инструменты и оборудование, прменяемые в медицине, хирургии, стоматологии или ветеринарии",
    "valueUsd": 2463000,
    "quantity": 2478,
    "unitValueUsd": 993.9467312348668,
    "sharePct": 0.0136248373649133,
    "growth5yValuePct": 49,
    "growth5yQuantityPct": 19
  },
  {
    "hs": "846210",
    "labelRu": "Ковочные или штамповочные машины (включая прессы) и молоты",
    "valueUsd": 2300000,
    "quantity": 15,
    "unitValueUsd": 153333.33333333334,
    "sharePct": 1.8767543573340295,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "903010",
    "labelRu": "Приборы и аппаратура для обнаружения или измерения ионизирующих излучен  ий",
    "valueUsd": 2281000,
    "quantity": 223,
    "unitValueUsd": 10228.699551569507,
    "sharePct": 0.3515466666255681,
    "growth5yValuePct": 113,
    "growth5yQuantityPct": 111
  },
  {
    "hs": "901580",
    "labelRu": "Прочие приборы и инструменты топографические, гидрографические,  океанографические, гидрологические, метеорологические или геофизические, кроме компасов, электронные",
    "valueUsd": 2261000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 0.2123106364717935,
    "growth5yValuePct": 9,
    "growth5yQuantityPct": null
  },
  {
    "hs": "830120",
    "labelRu": "Замки, предназначенные для установки в моторных транспортных средствах",
    "valueUsd": 2202000,
    "quantity": 123,
    "unitValueUsd": 17902.439024390245,
    "sharePct": 1.4669731188168282,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "902710",
    "labelRu": "Газо- или дымоанализаторы",
    "valueUsd": 2150000,
    "quantity": 24,
    "unitValueUsd": 89583.33333333333,
    "sharePct": 0.1728398634645469,
    "growth5yValuePct": 677,
    "growth5yQuantityPct": null
  },
  {
    "hs": "841199",
    "labelRu": "Прочие части для турбореактивных и турбовинтовых двигателей, прочих газовых турбин",
    "valueUsd": 2140000,
    "quantity": 1571,
    "unitValueUsd": 1362.1896880967536,
    "sharePct": 0.0334352274493843,
    "growth5yValuePct": 137,
    "growth5yQuantityPct": null
  },
  {
    "hs": "846299",
    "labelRu": "Прочие машины (включая прессы) для обработки металлов объемной штамповкой, ковкой или штамповкой",
    "valueUsd": 2087000,
    "quantity": 188,
    "unitValueUsd": 11101.063829787234,
    "sharePct": 2.368925867489983,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "840790",
    "labelRu": "Прочие двигатели внутреннего сгорания с искровым зажиганием, с вращающимися или возвратно-поступательным движением поршня",
    "valueUsd": 2082000,
    "quantity": 8,
    "unitValueUsd": 260250,
    "sharePct": 0.4326044993361329,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "851762",
    "labelRu": "Машины для приема, преобразования и передачи или восстановления голоса,  изображений или других данных, включая коммутационные устройства         и маршрутизаторы",
    "valueUsd": 2081000,
    "quantity": 38466,
    "unitValueUsd": 54.09972443196589,
    "sharePct": 0.00913507478909,
    "growth5yValuePct": 42,
    "growth5yQuantityPct": 154
  },
  {
    "hs": "210690",
    "labelRu": "Прочие пищевые продукты, в другом месте не поименованные или не включенные",
    "valueUsd": 1910000,
    "quantity": 73,
    "unitValueUsd": 26164.383561643837,
    "sharePct": 0.0261722352322135,
    "growth5yValuePct": 99,
    "growth5yQuantityPct": 103
  },
  {
    "hs": "820719",
    "labelRu": "Прочий инструмент, включая части, для бурения скальных пород или грунтов",
    "valueUsd": 1896000,
    "quantity": 9943,
    "unitValueUsd": 190.68691541788192,
    "sharePct": 0.3646693837356686,
    "growth5yValuePct": 58,
    "growth5yQuantityPct": 215
  },
  {
    "hs": "844313",
    "labelRu": "Машины для офсетной печати прочие",
    "valueUsd": 1799000,
    "quantity": 84,
    "unitValueUsd": 21416.666666666668,
    "sharePct": 1.742001704237354,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "851712",
    "labelRu": "Телефонные аппараты для сотовых сетей связи или других беспроводных сетеисвязи",
    "valueUsd": 1695000,
    "quantity": 2936,
    "unitValueUsd": 577.3160762942779,
    "sharePct": 0.0131509241957453,
    "growth5yValuePct": 37,
    "growth5yQuantityPct": 22
  },
  {
    "hs": "240120",
    "labelRu": "Табак с частично или полностью отделенной средней жилкой",
    "valueUsd": 1582000,
    "quantity": 154,
    "unitValueUsd": 10272.727272727272,
    "sharePct": 0.1680641915974278,
    "growth5yValuePct": 127,
    "growth5yQuantityPct": 5
  },
  {
    "hs": "470321",
    "labelRu": "Целлюлоза древесная,натронная или сульфатная,кроме растворимых сортов,полуббеленая или беленая,из хвойных пород",
    "valueUsd": 1563000,
    "quantity": 1844,
    "unitValueUsd": 847.6138828633406,
    "sharePct": 0.0342148566029748,
    "growth5yValuePct": 91,
    "growth5yQuantityPct": 82
  },
  {
    "hs": "847130",
    "labelRu": "Машины вычислительные цифровые портативные массой не более 10 кг, содержащие, по крайней мере,из центрального блока обработки данных, клавиатуры и дисплея",
    "valueUsd": 1489000,
    "quantity": 5264,
    "unitValueUsd": 282.8647416413374,
    "sharePct": 0.0223719730412466,
    "growth5yValuePct": 19,
    "growth5yQuantityPct": 28
  },
  {
    "hs": "700910",
    "labelRu": "Зеркала стеклянные, в рамах или без рам, заднего обзора для транспортных средств",
    "valueUsd": 1483000,
    "quantity": 245030,
    "unitValueUsd": 6.052320124066441,
    "sharePct": 0.0877600475786097,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "870895",
    "labelRu": "Пневмоподушки безопасности с системой надувания; их части",
    "valueUsd": 1483000,
    "quantity": 48488,
    "unitValueUsd": 30.58488698234615,
    "sharePct": 0.1262597238292029,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "491199",
    "labelRu": "Прочая печатная продукция, за исключением печатной репродукции и фотографии",
    "valueUsd": 1459000,
    "quantity": 4,
    "unitValueUsd": 364750,
    "sharePct": 0.1718453886191004,
    "growth5yValuePct": -2,
    "growth5yQuantityPct": 6
  },
  {
    "hs": "901380",
    "labelRu": "Прочие устройства, приборы и инструменты  на жидких кристаллах",
    "valueUsd": 1439000,
    "quantity": 307,
    "unitValueUsd": 4687.296416938111,
    "sharePct": 0.1353504532688216,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "847180",
    "labelRu": "Устройства вычислительных машин, прочие",
    "valueUsd": 1393000,
    "quantity": 5113,
    "unitValueUsd": 272.44279288089183,
    "sharePct": 0.0330029015544532,
    "growth5yValuePct": 190,
    "growth5yQuantityPct": 411
  },
  {
    "hs": "300215",
    "labelRu": "Иммунологические продукты, расфасованные в виде дозированных лекарственных форм или в формы или упаковки для розничной продажи",
    "valueUsd": 1377000,
    "quantity": 10,
    "unitValueUsd": 137700,
    "sharePct": 0.0042538225321921,
    "growth5yValuePct": 404,
    "growth5yQuantityPct": null
  },
  {
    "hs": "840991",
    "labelRu": "Части, предназначенные исключительно или главным образом для поршневых д игателей внутреннего сгорания с искровым зажиганием товарной позиции 8407 или 8408",
    "valueUsd": 1361000,
    "quantity": 45,
    "unitValueUsd": 30244.444444444445,
    "sharePct": 0.0430253286727303,
    "growth5yValuePct": 87,
    "growth5yQuantityPct": 33
  },
  {
    "hs": "020714",
    "labelRu": "Части тушек и субпродукты домашних кур, мороженые",
    "valueUsd": 1214000,
    "quantity": 1086,
    "unitValueUsd": 1117.8637200736648,
    "sharePct": 0.0371601787361744,
    "growth5yValuePct": 20,
    "growth5yQuantityPct": 14
  },
  {
    "hs": "847150",
    "labelRu": "Блоки вычислит.машин,блоки обработки данных, отличные от описанных в субпозиции 8471 41 или 8471 49, содержащ.или не содержащ.в одном корпусе одноили два из следующих устр-в:запоминающее,ввода,вывода",
    "valueUsd": 1209000,
    "quantity": 482,
    "unitValueUsd": 2508.298755186722,
    "sharePct": 0.0074129011703922,
    "growth5yValuePct": 15,
    "growth5yQuantityPct": 61
  },
  {
    "hs": "903180",
    "labelRu": "Прочие измерительные или контрольные приборы, приспособления и машины",
    "valueUsd": 1196000,
    "quantity": 1,
    "unitValueUsd": 1196000,
    "sharePct": 0.0372242418206265,
    "growth5yValuePct": -9,
    "growth5yQuantityPct": -24
  },
  {
    "hs": "850153",
    "labelRu": "Прочие двигатели переменного тока многофазные  мощностью более 75 квт",
    "valueUsd": 1187000,
    "quantity": 4,
    "unitValueUsd": 296750,
    "sharePct": 0.1541958950376721,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "843850",
    "labelRu": "Оборудование для переработки мяса или птицы",
    "valueUsd": 1170000,
    "quantity": 116,
    "unitValueUsd": 10086.206896551725,
    "sharePct": 0.6837786661056175,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "870840",
    "labelRu": "Коробки передач",
    "valueUsd": 1160000,
    "quantity": 178,
    "unitValueUsd": 6516.853932584269,
    "sharePct": 0.0148678968142327,
    "growth5yValuePct": null,
    "growth5yQuantityPct": -67
  },
  {
    "hs": "850300",
    "labelRu": "Части, предназначенные исключительно или в основном для машин товарной позиции 8501 или 8502",
    "valueUsd": 1135000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 0.0876192123071412,
    "growth5yValuePct": 162,
    "growth5yQuantityPct": null
  },
  {
    "hs": "870323",
    "labelRu": "Транспортные средства с двигателем внутреннего сгорания с искровым  зажиганием и с возвратно-поступат. движением поршня, с раб. объемом цилиндров более 1500 см3, но не более 3000 см3",
    "valueUsd": 1090000,
    "quantity": 55,
    "unitValueUsd": 19818.18181818182,
    "sharePct": 0.0045078823424512,
    "growth5yValuePct": 22,
    "growth5yQuantityPct": 26
  },
  {
    "hs": "731815",
    "labelRu": "Винты и болты прочие, из черных металлов, снабженные резьбой, в комплекте с гайками или шайбами или без них",
    "valueUsd": 1083000,
    "quantity": 142,
    "unitValueUsd": 7626.760563380281,
    "sharePct": 0.0299076260304047,
    "growth5yValuePct": 87,
    "growth5yQuantityPct": 59
  },
  {
    "hs": "848180",
    "labelRu": "Арматура прочая для трубопроводов, котлов, резервуаров, цистерн, баков  или аналогичных емкостей",
    "valueUsd": 998000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 0.0131730897798866,
    "growth5yValuePct": 116,
    "growth5yQuantityPct": null
  },
  {
    "hs": "847141",
    "labelRu": "Машины вычислительн. прочие, содерж в одном корпусе, по крайней мере,центр. блок обр-ки данных и устр-во вв. и выв, объединенные или нет",
    "valueUsd": 983000,
    "quantity": 111,
    "unitValueUsd": 8855.855855855856,
    "sharePct": 0.0987385968471952,
    "growth5yValuePct": 246,
    "growth5yQuantityPct": 213
  },
  {
    "hs": "870324",
    "labelRu": "Транспортные средства с двигателем внутреннего сгорания с искровым  зажиганием и с возвратно-поступательным движением поршня, с рабочим объемом цилиндров  двигателя более 3000 см3",
    "valueUsd": 973000,
    "quantity": 19,
    "unitValueUsd": 51210.52631578947,
    "sharePct": 0.0077078226636762,
    "growth5yValuePct": -19,
    "growth5yQuantityPct": -28
  },
  {
    "hs": "271019",
    "labelRu": "Прочие дистилляты и продукты",
    "valueUsd": 901000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 0.0012891935958128,
    "growth5yValuePct": -34,
    "growth5yQuantityPct": null
  },
  {
    "hs": "293629",
    "labelRu": "Витамины прочие и их производные",
    "valueUsd": 875000,
    "quantity": 26,
    "unitValueUsd": 33653.846153846156,
    "sharePct": 0.272724155879777,
    "growth5yValuePct": 30,
    "growth5yQuantityPct": 25
  },
  {
    "hs": "902790",
    "labelRu": "Микротомы; части и принадлежности",
    "valueUsd": 845000,
    "quantity": 2,
    "unitValueUsd": 422500,
    "sharePct": 0.0347769255716174,
    "growth5yValuePct": 26,
    "growth5yQuantityPct": null
  },
  {
    "hs": "392690",
    "labelRu": "Прочие изделия из пластмасс и изделия из прочих материалов товарных позиций 3901-3914",
    "valueUsd": 792000,
    "quantity": 12156,
    "unitValueUsd": 65.15301085883515,
    "sharePct": 0.0092532012337602,
    "growth5yValuePct": 13,
    "growth5yQuantityPct": -6
  },
  {
    "hs": "871690",
    "labelRu": "Части прицепов и полуприцепов, прочих несамоходных транспортных средств",
    "valueUsd": 775000,
    "quantity": 24,
    "unitValueUsd": 32291.666666666668,
    "sharePct": 0.0615220963555104,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "071290",
    "labelRu": "Прочие овощи и овощные смеси, сушеные, целые, нарезанные кусками, ломтиками, измельченные или в виде порошка, но не подвергнутые дальнейшей обработке",
    "valueUsd": 770000,
    "quantity": 33,
    "unitValueUsd": 23333.333333333332,
    "sharePct": 0.4774187148136207,
    "growth5yValuePct": 38,
    "growth5yQuantityPct": 22
  },
  {
    "hs": "870899",
    "labelRu": "Прочие части и принадлежности автомобилей товарных позиций 8701 - 8705",
    "valueUsd": 763000,
    "quantity": 120434,
    "unitValueUsd": 6.335420230167561,
    "sharePct": 0.0056757404126107,
    "growth5yValuePct": 185,
    "growth5yQuantityPct": 643
  },
  {
    "hs": "902780",
    "labelRu": "Прочие приборы и аппаратура  для физического или химического анализа",
    "valueUsd": 759000,
    "quantity": 1286,
    "unitValueUsd": 590.2021772939347,
    "sharePct": 0.0257437012726682,
    "growth5yValuePct": 7,
    "growth5yQuantityPct": 26
  },
  {
    "hs": "842139",
    "labelRu": "Прочее оборудование для фильтрования или очистки газов",
    "valueUsd": 732000,
    "quantity": null,
    "unitValueUsd": null,
    "sharePct": 0.0204766241991178,
    "growth5yValuePct": 67,
    "growth5yQuantityPct": null
  },
  {
    "hs": "846694",
    "labelRu": "Части и принадлежности, к станкам товарных позиций 8462 или 8463",
    "valueUsd": 731000,
    "quantity": 323,
    "unitValueUsd": 2263.157894736842,
    "sharePct": 0.1878737878799561,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "841960",
    "labelRu": "Машины для сжижения воздуха или газов",
    "valueUsd": 721000,
    "quantity": 2,
    "unitValueUsd": 360500,
    "sharePct": 0.7260679543211617,
    "growth5yValuePct": null,
    "growth5yQuantityPct": null
  },
  {
    "hs": "843143",
    "labelRu": "Части, предназначенные исключительно или в основном для бурильных или проходческих машин субпозиции 843041 или 843049",
    "valueUsd": 717000,
    "quantity": 271,
    "unitValueUsd": 2645.7564575645756,
    "sharePct": 0.0320753130138984,
    "growth5yValuePct": 94,
    "growth5yQuantityPct": 97
  },
  {
    "hs": "870380",
    "labelRu": "Транспортные средства, приводимые в движение только электрическим двигателем, прочие:",
    "valueUsd": 700000,
    "quantity": 9,
    "unitValueUsd": 77777.77777777778,
    "sharePct": 0.0126920442277852,
    "growth5yValuePct": 71,
    "growth5yQuantityPct": 15
  }
];

export const trademap2024Meta = {
  source: "ITC Trade Map · 2024 deep view",
  sourceId: "trademap_itc" as const,
  fetched_at: "2026-04-29",
  uzExportsToUsTotalUsd: 157530000,
  usExportsToUzTotalUsd: 380800000,
  is_demo: false,
};
