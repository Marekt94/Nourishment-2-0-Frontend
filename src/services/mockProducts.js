/**
 * Mock data for testing products display
 * Use this if backend returns empty/zero values
 */

export const mockProducts = [
  {
    id: 1,
    name: "Chicken Breast",
    category: {
      id: 5,
      name: "Protein",
    },
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    description: "Skinless, boneless chicken breast",
  },
  {
    id: 2,
    name: "Brown Rice",
    category: {
      id: 3,
      name: "Carbs",
    },
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    description: "Cooked brown rice",
  },
  {
    id: 3,
    name: "Broccoli",
    category: {
      id: 2,
      name: "Vegetables",
    },
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    description: "Fresh steamed broccoli",
  },
  {
    id: 4,
    name: "Salmon",
    category: {
      id: 5,
      name: "Protein",
    },
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    description: "Atlantic salmon fillet",
  },
  {
    id: 5,
    name: "Avocado",
    category: {
      id: 4,
      name: "Fats",
    },
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    description: "Fresh avocado",
  },
];
