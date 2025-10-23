import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="bg-cream-50 rounded-lg shadow-sm p-6 border border-cream-200">
      <h3 className="text-lg font-bold text-copper-800 mb-4">Categorías</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-copper-500 to-copper-700 text-white shadow-md'
              : 'bg-cream-100 text-copper-700 hover:bg-cream-200'
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-copper-500 to-copper-700 text-white shadow-md'
                : 'bg-cream-100 text-copper-700 hover:bg-cream-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
