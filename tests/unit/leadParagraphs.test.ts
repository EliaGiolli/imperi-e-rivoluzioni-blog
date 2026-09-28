import { describe, expect, it } from "vitest";
import { leadParagraphs } from "../../src/core/helpers";

const body = `## Introduzione: il decennio del terrore

Tra il 1930 e il 1936 il Giappone attraversò una fase di *violenta* instabilità[1](#fonte-1).

Questa spirale disintegrò il sistema **parlamentare**, spostando il potere verso i [vertici militari](/articles/x).

---

## 1. Il terrorismo

- un elenco puntato
- che non è prosa

| Fazione | Metodi |
| --- | --- |

Il terzo paragrafo.`;

describe("leadParagraphs", () => {
	it("returns the opening prose paragraphs as plain text", () => {
		expect(leadParagraphs(body, 2)).toEqual([
			"Tra il 1930 e il 1936 il Giappone attraversò una fase di violenta instabilità.",
			"Questa spirale disintegrò il sistema parlamentare, spostando il potere verso i vertici militari.",
		]);
	});

	it("skips headings, rules, lists and tables", () => {
		expect(leadParagraphs(body, 3)[2]).toBe("Il terzo paragrafo.");
	});

	it("returns fewer paragraphs when the body has fewer", () => {
		expect(leadParagraphs("Un solo paragrafo.", 3)).toEqual(["Un solo paragrafo."]);
	});

	it("handles Windows line endings", () => {
		expect(leadParagraphs("Primo.\r\n\r\nSecondo.", 2)).toEqual(["Primo.", "Secondo."]);
	});
});
