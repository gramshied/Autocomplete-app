import { useState, useEffect, useRef } from 'react';
import './styles.css';

interface Item {
  id: number;
  name: string;
}

interface CacheItem {
  query: string;
  results: Item[];
}

const Autocomplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cache, setCache] = useState<CacheItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dummy data
  const items: Item[] = [
    { id: 1, name: "React Query" },
    { id: 2, name: "React Hooks" },
    { id: 3, name: "React Router" },
    { id: 4, name: "React State Management" },
    { id: 5, name: "React Performance Optimization" },
    { id: 6, name: "React Tutorial" },
    { id: 7, name: "React Best Practices" },
    { id: 8, name: "React vs Vue" },
    { id: 9, name: "React Interview Questions" },
    { id: 10, name: "React Roadmap" },
    { id: 11, name: "Next.js Server Components" },
    { id: 12, name: "Next.js API Routes" },
    { id: 13, name: "Next.js Middleware" },
    { id: 14, name: "Next.js Authentication" },
    { id: 15, name: "Next.js Performance Optimization" },
    { id: 16, name: "Next.js Tutorial" },
    { id: 17, name: "Next.js vs React" },
    { id: 18, name: "Next.js SEO Best Practices" },
    { id: 19, name: "Next.js Roadmap" },
    { id: 20, name: "Next.js Interview Questions" },
    { id: 21, name: "TypeScript Basics" },
    { id: 22, name: "TypeScript Interfaces" },
    { id: 23, name: "TypeScript Generics" },
    { id: 24, name: "TypeScript Utility Types" },
    { id: 25, name: "TypeScript vs JavaScript" },
    { id: 26, name: "TypeScript Tutorial" },
    { id: 27, name: "TypeScript Best Practices" },
    { id: 28, name: "TypeScript Roadmap" },
    { id: 29, name: "TypeScript Interview Questions" },
    { id: 30, name: "TypeScript Performance Optimization" },
    { id: 31, name: "Node.js Streams" },
    { id: 32, name: "Node.js Event Loop" },
    { id: 33, name: "Node.js File System" },
    { id: 34, name: "Node.js Authentication" },
    { id: 35, name: "Node.js WebSockets" },
    { id: 36, name: "Node.js Tutorial" },
    { id: 37, name: "Node.js Best Practices" },
    { id: 38, name: "Node.js vs Deno" },
    { id: 39, name: "Node.js Performance Optimization" },
    { id: 40, name: "Node.js Interview Questions" },
    { id: 41, name: "Redux Toolkit" },
    { id: 42, name: "Redux Middleware" },
    { id: 43, name: "Redux Thunk" },
    { id: 44, name: "Redux Saga" },
    { id: 45, name: "Redux vs Context API" },
    { id: 46, name: "Redux Tutorial" },
    { id: 47, name: "Redux Best Practices" },
    { id: 48, name: "Redux Performance Optimization" },
    { id: 49, name: "Redux Interview Questions" },
    { id: 50, name: "Redux Roadmap" },
    { id: 51, name: "Tailwind CSS Grid" },
    { id: 52, name: "Tailwind CSS Flexbox" },
    { id: 53, name: "Tailwind CSS Animations" },
    { id: 54, name: "Tailwind CSS Responsive Design" },
    { id: 55, name: "Tailwind CSS Dark Mode" },
    { id: 56, name: "Tailwind CSS Tutorial" },
    { id: 57, name: "Tailwind CSS Best Practices" },
    { id: 58, name: "Tailwind CSS vs Bootstrap" },
    { id: 59, name: "Tailwind CSS Performance Optimization" },
    { id: 60, name: "Tailwind CSS Interview Questions" }
  ];

  // Check cache for existing results
  const getFromCache = (query: string): Item[] | null => {
    const cachedItem = cache.find(item => item.query === query);
    if (cachedItem) {
      // Move to end of array (most recently used)
      setCache(prev => [
        ...prev.filter(item => item.query !== query),
        cachedItem
      ]);
      return cachedItem.results;
    }
    return null;
  };

  // Add to cache with LRU logic
  const addToCache = (query: string, results: Item[]) => {
    if (cache.length >= 10) {
      // Remove least recently used (first item)
      setCache(prev => [...prev.slice(1), { query, results }]);
    } else {
      setCache(prev => [...prev, { query, results }]);
    }
  };

  // Filter items based on input
  const filterItems = (query: string): Item[] => {
    if (!query) return [];
    const cachedResults = getFromCache(query);
    if (cachedResults) return cachedResults;

    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    addToCache(query, filtered);
    return filtered;
  };

  // Debounce function
  const debounce = (func: (query: string) => void, delay: number) => {
    let timeoutId: number;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(query), delay);
    };
  };

  // Debounced filter function
  const debouncedFilter = useRef(
    debounce((query: string) => {
      const results = filterItems(query);
      setFilteredItems(results);
      setShowDropdown(results.length > 0);
    }, 300)
  ).current;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedFilter(value);
  };

  // Handle item selection
  const handleItemClick = (item: Item) => {
    setInputValue(item.name);
    setFilteredItems([]);
    setShowDropdown(false);
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      )
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete-container">
      <h1>SearchPro</h1>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search..."
          onFocus={() => setShowDropdown(filteredItems.length > 0)}
        />
      </div>
      {showDropdown && (
        <div ref={dropdownRef} className="dropdown">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              {highlightMatch(item.name, inputValue)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;