export type NewsTonality = "positive" | "neutral" | "critical";
export type NewsTag = "presidential" | "trade" | "investment" | "minerals" | "security" | "diplomatic" | "culture" | "economy";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  url: string;
  tags: NewsTag[];
  tonality: NewsTonality;
  summary: string;
  is_demo: boolean;
}

export const news: NewsItem[] = [
  { id: "n-1", title: "US and Uzbekistan sign critical minerals MoU in Washington", date: "2026-02-04", source: "Reuters", url: "https://www.reuters.com", tags: ["minerals", "diplomatic"], tonality: "positive", summary: "The MoU covers supply-chain resilience for rare earth elements and critical minerals.", is_demo: true },
  { id: "n-2", title: "Uzbekistan joins Council of Peace as founding member", date: "2026-01-22", source: "Associated Press", url: "https://apnews.com", tags: ["presidential", "diplomatic"], tonality: "positive", summary: "Signing ceremony at Davos with President Trump as the initiating head of state.", is_demo: true },
  { id: "n-3", title: "C5+1 Summit: leaders endorse cultural heritage statement", date: "2025-11-06", source: "White House Brief", url: "https://www.whitehouse.gov", tags: ["presidential", "culture", "diplomatic"], tonality: "positive", summary: "Second leaders-level C5+1; economic cooperation deepened.", is_demo: true },
  { id: "n-4", title: "Boeing to establish 787 MRO facility in Tashkent — report", date: "2025-12-15", source: "Aviation Week", url: "https://aviationweek.com", tags: ["investment", "trade"], tonality: "positive", summary: "Preliminary site selection under discussion.", is_demo: true },
  { id: "n-5", title: "UzAuto and Ford finalize Transit line in Andijan", date: "2024-05-20", source: "Daryo", url: "https://daryo.uz", tags: ["investment", "trade"], tonality: "positive", summary: "Construction to be completed in 2027.", is_demo: true },
  { id: "n-6", title: "US Trade with Uzbekistan reaches $1bn in 2025", date: "2026-02-10", source: "Gazeta.uz", url: "https://www.gazeta.uz", tags: ["trade", "economy"], tonality: "neutral", summary: "Full-year turnover $1.004 billion, -2% YoY, with shifting balance.", is_demo: false },
  { id: "n-7", title: "NYC Mayor Adams visits Tashkent — city diplomacy agenda", date: "2025-11-20", source: "Xabar", url: "https://xabar.uz", tags: ["diplomatic", "culture"], tonality: "positive", summary: "Mayor holds city-to-city cooperation meetings.", is_demo: true },
  { id: "n-8", title: "Utah delegation deepens LDS-initiated humanitarian ties", date: "2025-11-12", source: "Utah Policy", url: "https://utahpolicy.com", tags: ["diplomatic", "culture"], tonality: "positive", summary: "Elder Bednar received by President; Stirling Foundation announces healthcare center.", is_demo: true },
  { id: "n-9", title: "USAID Samarkand clinic equipment grants expanded", date: "2026-03-15", source: "USAID", url: "https://www.usaid.gov", tags: ["diplomatic"], tonality: "positive", summary: "Project C.U.R.E. expands tranche delivery.", is_demo: true },
  { id: "n-10", title: "Concerns raised over GSP program reauthorization", date: "2025-10-30", source: "Bloomberg", url: "https://www.bloomberg.com", tags: ["trade", "economy"], tonality: "critical", summary: "UZ exporters face cost disadvantages absent renewal.", is_demo: true },
  { id: "n-11", title: "Saidov–Rubio bilateral: minerals roadmap firmed", date: "2025-04-10", source: "State Department", url: "https://www.state.gov", tags: ["minerals", "diplomatic"], tonality: "positive", summary: "Second meeting in a month signals accelerated engagement.", is_demo: true },
  { id: "n-12", title: "ПП-314: Andijan, Bukhara khokims visit U.S. states", date: "2025-09-20", source: "Kun.uz", url: "https://kun.uz", tags: ["diplomatic", "investment"], tonality: "positive", summary: "Nine more regions scheduled by end-2026.", is_demo: true },
  { id: "n-13", title: "UZ–US defense dialogue: MS National Guard joint exercise announced", date: "2025-06-15", source: "Mississippi Business Journal", url: "https://msbusiness.com", tags: ["security"], tonality: "positive", summary: "Joint exercise planned for fall 2026.", is_demo: true },
  { id: "n-14", title: "Congressional Uzbekistan Caucus holds Capitol Hill reception", date: "2025-11-04", source: "Uzbekistan Embassy DC", url: "https://www.uzbekistan.org", tags: ["diplomatic"], tonality: "positive", summary: "16 members attended; Kelly & Gonzalez reaffirm co-chairship.", is_demo: true },
  { id: "n-15", title: "DFC executives cite Uzbekistan pipeline in quarterly briefing", date: "2026-02-25", source: "DFC", url: "https://www.dfc.gov", tags: ["investment"], tonality: "positive", summary: "Pipeline expected to materialise in FY26.", is_demo: true },
  { id: "n-16", title: "Tashkent hosts first informal US-UZ Business Council", date: "2026-02-07", source: "Spot.uz", url: "https://www.spot.uz", tags: ["investment", "diplomatic"], tonality: "positive", summary: "Sergio Gor leads U.S. side.", is_demo: true },
  { id: "n-17", title: "Bishkek B5+1 forum: UZ brings 40-person delegation", date: "2026-02-05", source: "24.kg", url: "https://24.kg", tags: ["diplomatic", "trade"], tonality: "positive", summary: "Uzbekistan leads regional dialogue.", is_demo: true },
  { id: "n-18", title: "Almalyk MMC × Freeport-McMoRan copper processing line breaks ground", date: "2025-10-01", source: "Mining Journal", url: "https://www.mining-journal.com", tags: ["investment", "minerals"], tonality: "positive", summary: "$520M line expected online in 2027.", is_demo: true },
  { id: "n-19", title: "Zampolli visit widens U.S.–UZ business pipeline", date: "2025-09-03", source: "Gazeta.uz", url: "https://www.gazeta.uz", tags: ["investment"], tonality: "positive", summary: "Special Envoy meets nine ministers.", is_demo: true },
  { id: "n-20", title: "Concerns about secondary CAATSA risk in mineral supply chains", date: "2026-03-10", source: "Eurasianet", url: "https://eurasianet.org", tags: ["security", "minerals"], tonality: "critical", summary: "Analysts warn of third-party sanctions exposure.", is_demo: true },
  { id: "n-21", title: "USAID releases mid-term Country Strategy review", date: "2026-04-10", source: "USAID", url: "https://www.usaid.gov", tags: ["diplomatic", "economy"], tonality: "neutral", summary: "Program indicators on track.", is_demo: true },
  { id: "n-22", title: "Forbes: Uzbekistan emerges as one of FDI's new bright spots", date: "2026-03-28", source: "Forbes", url: "https://www.forbes.com", tags: ["investment", "economy"], tonality: "positive", summary: "Reform trajectory cited as positive factor.", is_demo: true },
];
