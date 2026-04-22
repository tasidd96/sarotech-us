import { Product, ProductDetail } from "@/lib/types";

/**
 * Shared specs for the Laminated Wall Panel family. All A-series variants
 * share the same physical panel geometry — only finish/tone differs.
 * Placeholder tech sheet + install guide until we host the real PDFs.
 */
const laminatedWallPanelBase: Partial<ProductDetail> = {
  dimensions: { heightIn: 114.2, widthIn: 6.1, thicknessIn: 0.71 },
  piecesPerBox: 14,
  sqftPerBox: 69.5,
  description:
    "Add warmth and elegance to your walls or ceilings with this fluted laminated cladding. With a coverage of 69.5 ft² per box, its easy installation and realistic finish transform interiors with premium architectural depth and lasting durability.",
  techSheetUrl:
    "/technical_sheets/Technical Data Sheet - Coextruded WPC Wall Panel.pdf",
  installGuideUrl:
    "/installation_guides/Interior Ribbed Wall Paneling Installation Guide.pdf",
  technicalDrawingUrl: "/images/technical-drawings/laminated-wall-panel.png",
};

export const products: Product[] = [
  {
    id: "1",
    name: "Laminated Wall Panel",
    sku: "A02",
    skuNumber: "10002",
    variantName: "Natural Walnut",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a02-nogal-natural.png",
    featured: true,
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Natural Tones",
      swatchColor: "#6f4a2d",
    },
  },
  {
    id: "2",
    name: "Laminated Wall Panel",
    sku: "A09",
    skuNumber: "10005",
    variantName: "Oak",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a09-encino.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Natural Tones",
      swatchColor: "#e4d5b7",
    },
  },
  {
    id: "3",
    name: "Laminated Wall Panel",
    sku: "A103",
    skuNumber: "10006",
    variantName: "Tropical Hardwood",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a103-parota.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Natural Tones",
      swatchColor: "#8a6a55",
    },
  },
  {
    id: "4",
    name: "Laminated Wall Panel",
    sku: "A109",
    skuNumber: "10007",
    variantName: "White Oak",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a109-white-oak.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Light Tones",
      swatchColor: "#eae0cd",
    },
  },
  {
    id: "5",
    name: "Laminated Wall Panel",
    sku: "A46",
    skuNumber: "10010",
    variantName: "Tropical Hardwood Black",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a46-parota-black.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Dark Tones",
      swatchColor: "#3a2a22",
    },
  },
  {
    id: "6",
    name: "Laminated Wall Panel",
    sku: "A56",
    skuNumber: "10011",
    variantName: "Pine Black",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a56-pino-black.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Dark Tones",
      swatchColor: "#1f1a17",
    },
  },
  {
    id: "7",
    name: "Laminated Wall Panel",
    sku: "A77",
    skuNumber: "10012",
    variantName: "Light Walnut Black",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a46-parota-black.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Dark Tones",
      swatchColor: "#2a2520",
    },
  },
  {
    id: "8",
    name: "Laminated Wall Panel",
    sku: "A82",
    skuNumber: "10017",
    variantName: "Gray Matte",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a109-white-oak.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Gray Tones",
      swatchColor: "#8a8a8a",
    },
  },
  {
    id: "9",
    name: "Laminated Wall Panel",
    sku: "A98",
    skuNumber: "10020",
    variantName: "Striped Walnut",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a02-nogal-natural.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Natural Tones",
      swatchColor: "#6a4a30",
    },
  },
  {
    id: "10",
    name: "Laminated Wall Panel",
    sku: "A126",
    skuNumber: "10021",
    variantName: "Oporto Gray",
    category: "interior",
    productType: "wall-panels",
    image: "/images/products/a09-encino.png",
    detail: {
      ...laminatedWallPanelBase,
      toneFamily: "Gray Tones",
      swatchColor: "#7c7a78",
    },
  },
  {
    id: "11",
    name: "Wide Wall Panel",
    sku: "A01",
    skuNumber: "10022",
    variantName: "Walnut Matte",
    category: "interior",
    productType: "wide-wall-panels",
    image: "/images/products/a103-parota.png",
    detail: {
      toneFamily: "Dark Tones",
      swatchColor: "#3e2a1e",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Coextruded WPC Wall Panel.pdf",
      installGuideUrl:
        "/installation_guides/Interior Ribbed Wall Paneling Installation Guide.pdf",
    },
  },
  {
    id: "12",
    name: "Wide Wall Panel",
    sku: "A02",
    skuNumber: "10023",
    variantName: "Natural Walnut",
    category: "interior",
    productType: "wide-wall-panels",
    image: "/images/products/a02-nogal-natural.png",
    detail: {
      toneFamily: "Natural Tones",
      swatchColor: "#6f4a2d",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Coextruded WPC Wall Panel.pdf",
      installGuideUrl:
        "/installation_guides/Interior Ribbed Wall Paneling Installation Guide.pdf",
    },
  },
  {
    id: "13",
    name: "WPC Floor Decking",
    sku: "D01",
    skuNumber: "20001",
    variantName: "Teak",
    category: "exterior",
    productType: "floor-decking",
    image: "/images/categories/floor-decking.png",
    featured: true,
    detail: {
      toneFamily: "Natural Tones",
      swatchColor: "#8b5a2b",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Coextruded Decking Floor.pdf",
      installGuideUrl: "/installation_guides/Decking Installation Guide.pdf",
      technicalDrawingUrl: "/images/technical-drawings/wpc-floor-decking.png",
    },
  },
  {
    id: "14",
    name: "Synthetic Marble",
    sku: "M01",
    skuNumber: "30001",
    variantName: "Carrara White",
    category: "interior",
    productType: "synthetic-marble",
    image: "/images/categories/synthetic-marble.png",
    featured: true,
    detail: {
      toneFamily: "Light Tones",
      swatchColor: "#eeeae4",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Synthetic Marble Sheet- interior.pdf",
      installGuideUrl:
        "/installation_guides/Synthetic Marble Installation Guide.pdf",
    },
  },
  {
    id: "15",
    name: "Wall Cladding",
    sku: "WC01",
    skuNumber: "40001",
    variantName: "Natural Wood",
    category: "exterior",
    productType: "coextruded-panels",
    image: "/images/categories/wall-cladding.png",
    featured: true,
    detail: {
      toneFamily: "Natural Tones",
      swatchColor: "#8a6a50",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Coextruded Wall Cladding.pdf",
      installGuideUrl:
        "/installation_guides/Wall Cladding Installation Guide.pdf",
      technicalDrawingUrl: "/images/technical-drawings/wall-cladding.png",
    },
  },
  {
    id: "16",
    name: "Extruded Panel",
    sku: "LE01",
    skuNumber: "50001",
    variantName: "Classic Brown",
    category: "interior",
    productType: "coextruded-panels",
    image: "/images/categories/extruded-cladding.png",
    featured: true,
    detail: {
      toneFamily: "Dark Tones",
      swatchColor: "#5a3d2a",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Coextruded WPC Wall Panel.pdf",
      installGuideUrl:
        "/installation_guides/Co-Extruded Exterior Cladding Installation Guide.pdf",
    },
  },
  {
    id: "17",
    name: "Wave Panel",
    sku: "PW01",
    skuNumber: "60001",
    variantName: "White Wave",
    category: "interior",
    productType: "wall-panels",
    image: "/images/categories/wavy-panel.png",
    featured: true,
    detail: {
      toneFamily: "Light Tones",
      swatchColor: "#f4f1ec",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Coextruded Light WPC Wall Panel.pdf",
    },
  },
  {
    id: "18",
    name: "Deck Accessories - Clips",
    sku: "DA01",
    skuNumber: "70001",
    variantName: "Standard Clip",
    category: "accessories",
    productType: "deck-accessories",
    image: "/images/products/a56-pino-black.png",
    detail: {
      swatchColor: "#1f1a17",
    },
  },
  {
    id: "19",
    name: "Corner Piece - Exterior",
    sku: "CP01",
    skuNumber: "70002",
    variantName: "Brown Corner",
    category: "accessories",
    productType: "corner-pieces",
    image: "/images/products/a103-parota.png",
    detail: {
      swatchColor: "#8a6a55",
      techSheetUrl:
        "/technical_sheets/Technical Data Sheet - Coextruded Angle Trim.pdf",
    },
  },
  {
    id: "20",
    name: "Coextruded Light Clips",
    sku: "CL01",
    skuNumber: "70003",
    variantName: "Light Oak",
    category: "accessories",
    productType: "clips",
    image: "/images/products/a109-white-oak.png",
    detail: {
      swatchColor: "#eae0cd",
    },
  },
];

export const productTypeLabels: Record<string, string> = {
  "floor-decking": "Floor Decking",
  "wall-panels": "Wall Panels",
  "wide-wall-panels": "Wide Wall Panels",
  "synthetic-marble": "Synthetic Marble",
  "deck-accessories": "Deck Accessories",
  clips: "Clips & Fasteners",
  "corner-pieces": "Corner Pieces",
  "coextruded-panels": "Coextruded Panels",
};
