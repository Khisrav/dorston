/**
 * Powder Coating Material Calculator
 *
 * @param {number} paintId   - Paint color ID from DB (191–212)
 * @param {number} modelId   - Door model ID from DB (61–83)
 * @param {boolean} isStd    - true = Стандарт, false = Нестандарт
 * @returns {number} Consumption rate in kg
 */

// ─── Model → group ────────────────────────────────────────────────────────────
// Groups are derived from the Excel data: models in the same group always share
// the same consumption rates across all paints.
//
// Group A: Optima, Soros*, Veles*, Senator*
// Group B: Imperato, Nova  (Nova has extra overrides in premium paints — see RATES)
// Group C: Credo, Credo SP
// Group D: Darkwood SP*, Drevos SP*

const MODEL_GROUP: Record<number, string> = {
    77: "A", // Optima
    63: "A", // Soros Дуб чарлстон
    64: "A", // Soros Вудлайн тёмный
    72: "A", // Soros Вяз шоколад
    73: "A", // Soros Пино
    66: "A", // Veles Вяз шоколад
    67: "A", // Veles Вудлайн тёмный
    68: "A", // Veles Дуб чарлстон
    69: "A", // Veles Пино
    80: "A", // Senator SP
    81: "A", // Senator Max SP
    83: "B", // Imperato
    82: "B", // Nova  (also has Nova-specific override in some paints)
    79: "C", // Credo SP
    78: "C", // Credo
    65: "D", // Drevos SP Пино+чёрный
    61: "D", // Darkwood SP дуб чарлстон
    62: "D", // Darkwood SP вудлайн тёмный
    70: "D", // Darkwood SP Вяз шоколад
    71: "D", // Darkwood SP Пино
    74: "D", // Drevos SP Дуб чарлстон
    75: "D", // Drevos SP Вяз шоколад
    76: "D", // Drevos SP Вудлайн тёмный
};

// ─── Rate table ───────────────────────────────────────────────────────────────
// Structure per paint: { A: [std, nonStd], B: [...], C: [...], D: [...] }
// Nova (modelId 82) gets its own override only in premium paints (203–207).

const RATES: Record<number, { A: [number, number]; B: [number, number]; C: [number, number]; D: [number, number]; Nova?: [number, number] }> = {
    // 191 – Цинкогрунт
    191: { A: [1.2, 1.3], B: [1.2, 1.3], C: [1.2, 1.3], D: [1.2, 1.3] },

    // 192 – Антик медь
    192: { A: [2.2, 2.3], B: [2.3, 2.4], C: [2.4, 2.6], D: [1.4, 1.6] },

    // 193 – Антик серебро
    193: { A: [2.2, 2.3], B: [2.3, 2.4], C: [2.4, 2.6], D: [1.4, 1.6] },

    // 194 – Букле серый
    194: { A: [2.1, 2.3], B: [2.3, 2.4], C: [2.4, 2.6], D: [1.4, 1.6] },

    // 195 – Букле чёрный
    195: { A: [2.2, 2.3], B: [2.3, 2.4], C: [2.4, 2.6], D: [1.5, 1.7] },

    // 196 – Букле опал
    196: { A: [2.1, 2.3], B: [2.3, 2.4], C: [2.4, 2.6], D: [1.5, 1.7] },

    // 197–202 – Муар (plain)
    197: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    198: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    199: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    200: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    201: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    202: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },

    // 203–207 – Premium colors (Nova has a different rate than the rest of group B)
    203: { A: [2.5, 2.5], B: [2.5, 2.7], C: [2.5, 3.0], D: [2.0, 2.5], Nova: [2.2, 2.4] },
    204: { A: [2.5, 2.5], B: [2.5, 2.7], C: [2.5, 3.0], D: [2.0, 2.5], Nova: [2.2, 2.4] },
    205: { A: [2.5, 2.5], B: [2.5, 2.7], C: [2.5, 3.0], D: [2.0, 2.5], Nova: [2.2, 2.4] },
    206: { A: [2.5, 2.5], B: [2.5, 2.7], C: [2.5, 3.0], D: [2.0, 2.5], Nova: [2.2, 2.4] },
    207: { A: [2.5, 2.5], B: [2.5, 2.7], C: [2.5, 3.0], D: [2.0, 2.5], Nova: [2.2, 2.4] },

    // 208–212 – Муар металлик
    208: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    209: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    210: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    211: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
    212: { A: [2.0, 2.2], B: [2.3, 2.4], C: [2.1, 2.3], D: [2.0, 2.2] },
};

export function getRate(paintId: number, modelId: number, isStd: boolean): number {
    const entry = RATES[paintId];
    if (!entry) throw new Error(`Unknown paintId: ${paintId}`);

    const group = MODEL_GROUP[modelId];
    if (!group) throw new Error(`Unknown modelId: ${modelId}`);

    // Nova override: only applies when the paint entry has a Nova key
    if (modelId === 82 && entry.Nova) {
        return isStd ? entry.Nova[0] : entry.Nova[1];
    }

    const rates = entry[group as keyof typeof entry] as [number, number];
    return isStd ? rates[0] : rates[1];
}