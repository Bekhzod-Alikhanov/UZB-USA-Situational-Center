export interface ComplianceStatus {
  id: string;
  label: string;
  value: string;
  note: string;
  source: string;
  source_url: string;
  fetched_at: string;
  is_demo: boolean;
}

export const complianceStatuses: ComplianceStatus[] = [
  {
    id: "ofac-sanctions",
    label: "OFAC Sanctions status",
    value: "Not SDN-listed",
    note: "Uzbekistan is not listed as a comprehensive-sanctions jurisdiction. Individual SDN listings may apply.",
    source: "Treasury OFAC SDN / sanctions programs",
    source_url:
      "https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists",
    fetched_at: "2026-04-18",
    is_demo: false,
  },
  {
    id: "ear-country-group",
    label: "EAR Country Group",
    value: "Group B",
    note: "Uzbekistan is classified in Country Group B for Export Administration Regulations.",
    source: "BIS EAR 740 Supplement 1",
    source_url: "https://www.bis.doc.gov/index.php/regulations/export-administration-regulations-ear",
    fetched_at: "2026-04-18",
    is_demo: false,
  },
  {
    id: "ear-dual-use",
    label: "EAR Dual-Use (ECCN)",
    value: "Case-by-case",
    note: "Most EAR99 items license-exception eligible; specific ECCNs require licensing.",
    source: "BIS EAR 734",
    source_url: "https://www.bis.doc.gov",
    fetched_at: "2026-04-18",
    is_demo: false,
  },
  {
    id: "itar",
    label: "ITAR Status",
    value: "No broad prohibition",
    note: "No general ITAR prohibition; specific defense articles require DDTC licensing.",
    source: "DDTC ITAR 126",
    source_url: "https://www.pmddtc.state.gov",
    fetched_at: "2026-04-18",
    is_demo: false,
  },
  {
    id: "gsp",
    label: "GSP Beneficiary Status",
    value: "Eligible (pending programmatic reauthorization)",
    note: "Uzbekistan is eligible as a GSP beneficiary; the U.S. GSP program itself lapsed in 2020 and awaits congressional renewal.",
    source: "USTR GSP",
    source_url: "https://ustr.gov/issue-areas/preference-programs/generalized-system-preferences-gsp",
    fetched_at: "2026-04-18",
    is_demo: false,
  },
  {
    id: "mfn",
    label: "MFN / PNTR",
    value: "Permanent Normal Trade Relations granted",
    note: "PNTR status granted via the Jackson-Vanik graduation (2020).",
    source: "USTR",
    source_url: "https://ustr.gov",
    fetched_at: "2026-04-18",
    is_demo: false,
  },
  {
    id: "fatf",
    label: "FATF / AML",
    value: "Compliant — not on grey/black list",
    note: "Uzbekistan removed from FATF grey list in 2022.",
    source: "FATF",
    source_url: "https://www.fatf-gafi.org",
    fetched_at: "2026-04-18",
    is_demo: false,
  },
  {
    id: "ofac-caatsa",
    label: "CAATSA / Section 231 exposure",
    value: "Monitored",
    note: "Third-party CAATSA secondary sanctions risk when engaging with sanctioned Russian/Iranian entities.",
    source: "Treasury OFAC",
    source_url: "https://home.treasury.gov",
    fetched_at: "2026-04-18",
    is_demo: true,
  },
];

export const eccnSamples = [
  {
    code: "EAR99",
    category: "Low-sensitivity commercial",
    typicalLicense: "No license generally required",
    exampleItem: "Consumer electronics",
  },
  {
    code: "1C350",
    category: "Chemicals precursors",
    typicalLicense: "License required; end-use review",
    exampleItem: "Specific chemical agents",
  },
  {
    code: "3A001",
    category: "Electronics / semiconductors",
    typicalLicense: "License required above thresholds",
    exampleItem: "Advanced ICs",
  },
  {
    code: "5A002",
    category: "Information security — cryptography",
    typicalLicense: "License, ENC exception",
    exampleItem: "Strong-encryption products",
  },
  {
    code: "9A610",
    category: "Military aircraft & related parts",
    typicalLicense: "ITAR / USML review",
    exampleItem: "Mil aircraft parts",
  },
];
