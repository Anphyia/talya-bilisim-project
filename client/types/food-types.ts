interface Food {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    allergens: string[];
    category: string;
    subcategory: string;
    isNew?: boolean;
}

interface Subcategory {
    id: string;
    name: string;
    items: Food[];
}

interface CategoryData {
    name: string;
    subcategories: Record<string, Subcategory>;
}

export type { Food, Subcategory, CategoryData };
