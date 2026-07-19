import { describe, expect, it } from "vitest";
import { sources } from "@/data/sources";
import enMessages from "@/messages/en.json";
import uzMessages from "@/messages/uz-latn.json";

type PublicSourceMetadata = Record<
  string,
  {
    dataType?: string;
    note?: string;
  }
>;

function registryMetadata(messages: typeof enMessages | typeof uzMessages): PublicSourceMetadata {
  const registry = messages.sourcesPage.registry as typeof messages.sourcesPage.registry & {
    metadata?: PublicSourceMetadata;
  };

  return registry.metadata ?? {};
}

describe("public source-registry localization", () => {
  const en = registryMetadata(enMessages);
  const uz = registryMetadata(uzMessages);

  it("has independently authored English and Uzbek Latin coverage for every source", () => {
    for (const source of sources) {
      expect(en[source.id]?.dataType, `${source.id} English data type`).toBeTruthy();
      expect(uz[source.id]?.dataType, `${source.id} Uzbek data type`).toBeTruthy();

      if (source.note) {
        expect(en[source.id]?.note, `${source.id} English note`).toBeTruthy();
        expect(uz[source.id]?.note, `${source.id} Uzbek note`).toBeTruthy();
      }
    }
  });

  it("does not expose repository paths or runtime-language implementation notes", () => {
    const publicCopy = Object.values(en)
      .flatMap((entry) => [entry.dataType, entry.note])
      .filter(Boolean)
      .join("\n");

    expect(publicCopy).not.toMatch(/(?:data[\\/]|\.tsx?\b|[A-Z]:\\)/i);
    expect(publicCopy).not.toMatch(/Russian translations/i);
  });

  it("does not silently reuse English metadata on the Uzbek page", () => {
    for (const source of sources) {
      expect(uz[source.id]?.dataType, `${source.id} localized data type`).not.toBe(en[source.id]?.dataType);

      if (source.note) {
        expect(uz[source.id]?.note, `${source.id} localized note`).not.toBe(en[source.id]?.note);
      }
    }
  });
});
