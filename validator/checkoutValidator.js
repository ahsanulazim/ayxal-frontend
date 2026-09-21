import z from "zod";

// Country postal code regex definitions
export const POSTAL_REGEX_MAP = {
  US: {
    regex: /^\d{5}(-\d{4})?$/,
    name: "ZIP Code",
    example: "90210 or 90210-1234",
  },
  CA: {
    regex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    name: "Postal Code",
    example: "K1A 0B1",
  },
  GB: {
    regex: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
    name: "Postcode",
    example: "SW1A 1AA",
  },
  AU: {
    regex: /^\d{4}$/,
    name: "Postal Code",
    example: "2000",
  },
  DE: {
    regex: /^\d{5}$/,
    name: "PLZ",
    example: "10115",
  },
  FR: {
    regex: /^\d{5}$/,
    name: "Code Postal",
    example: "75001",
  },
  IT: {
    regex: /^\d{5}$/,
    name: "CAP",
    example: "00100",
  },
  ES: {
    regex: /^\d{5}$/,
    name: "Código Postal",
    example: "28001",
  },
  NL: {
    regex: /^\d{4} ?[A-Za-z]{2}$/,
    name: "Postcode",
    example: "1012 AB",
  },
  IN: {
    regex: /^\d{6}$/,
    name: "PIN Code",
    example: "110001",
  },
  BD: {
    regex: /^\d{4}$/,
    name: "Postal Code",
    example: "1212",
  },
  NZ: {
    regex: /^\d{4}$/,
    name: "Postal Code",
    example: "1010",
  },
  SG: {
    regex: /^\d{6}$/,
    name: "Postal Code",
    example: "238858",
  },
  JP: {
    regex: /^\d{3}-?\d{4}$/,
    name: "Postal Code",
    example: "100-0001",
  },
};

// 2-Digit ZIP prefix ranges for US States and Territories
export const US_STATE_ZIP_RANGES = {
  AL: [35, 36],
  AK: [99],
  AZ: [85, 86],
  AR: [71, 72],
  CA: [90, 91, 92, 93, 94, 95, 96],
  CO: [80, 81],
  CT: [6],
  DE: [19],
  DC: [20],
  FL: [32, 33, 34],
  GA: [30, 31],
  HI: [96],
  ID: [83],
  IL: [60, 61, 62],
  IN: [46, 47],
  IA: [50, 51, 52],
  KS: [66, 67],
  KY: [40, 41, 42],
  LA: [70, 71],
  ME: [3, 4],
  MD: [20, 21],
  MA: [1, 2],
  MI: [48, 49],
  MN: [55, 56],
  MS: [38, 39],
  MO: [63, 64, 65],
  MT: [59],
  NE: [68, 69],
  NV: [88, 89],
  NH: [3],
  NJ: [7, 8],
  NM: [87, 88],
  NY: [10, 11, 12, 13, 14],
  NC: [27, 28],
  ND: [58],
  OH: [43, 44, 45],
  OK: [73, 74],
  OR: [97],
  PA: [15, 16, 17, 18, 19],
  RI: [2],
  SC: [29],
  SD: [57],
  TN: [37, 38],
  TX: [75, 76, 77, 78, 79],
  UT: [84],
  VT: [5],
  VA: [22, 23, 24],
  WA: [98, 99],
  WV: [24, 25, 26],
  WI: [53, 54],
  WY: [82],
  PR: [6, 7, 9],
  VI: [8],
  GU: [96],
  AS: [96],
  MP: [96],
};

export const checkoutSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First Name must be at least 2 characters")
      .max(35, "First Name is too long"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last Name must be at least 2 characters")
      .max(35, "Last Name is too long"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address for order receipts"),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number is required for courier delivery")
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        {
          message: "Please enter a valid phone number (7-15 digits)",
        }
      ),
    country: z.string().trim().min(2, "Country is required"),
    state: z.string().trim().min(1, "State / Province is required"),
    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(45, "City name is too long"),
    address: z
      .string()
      .trim()
      .min(5, "Street address must be at least 5 characters")
      .max(100, "Street address cannot exceed 100 characters (carrier limit)"),
    zip: z.string().trim().min(2, "Zip / Postal Code is required"),
    comment: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const country = (data.country || "").toUpperCase();
    const postalRule = POSTAL_REGEX_MAP[country];

    // 1. Validate Postal Code format by Country
    if (postalRule) {
      if (!postalRule.regex.test(data.zip)) {
        ctx.addIssue({
          path: ["zip"],
          code: z.ZodIssueCode.custom,
          message: `Invalid ${postalRule.name} format for ${country}. Example: ${postalRule.example}`,
        });
      }
    } else {
      // Generic international postal code
      if (!/^[A-Za-z0-9\s-]{3,10}$/.test(data.zip)) {
        ctx.addIssue({
          path: ["zip"],
          code: z.ZodIssueCode.custom,
          message: "Invalid postal code format",
        });
      }
    }

    // 2. Validate US State and ZIP prefix match
    if (country === "US") {
      const stateCode = (data.state || "").toUpperCase();
      const validPrefixes = US_STATE_ZIP_RANGES[stateCode];

      if (validPrefixes && data.zip) {
        const zipDigits = data.zip.replace(/\D/g, "");
        if (zipDigits.length >= 2) {
          const zipPrefix = parseInt(zipDigits.slice(0, 2), 10);
          const isMatch = validPrefixes.includes(zipPrefix);

          if (!isMatch) {
            ctx.addIssue({
              path: ["zip"],
              code: z.ZodIssueCode.custom,
              message: `ZIP code ${data.zip} does not belong to state ${stateCode}`,
            });
          }
        }
      }
    }
  });
