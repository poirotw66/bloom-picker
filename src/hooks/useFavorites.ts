import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bloom-picker-favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                setFavorites(JSON.parse(data));
            } catch (e) {
                setFavorites([]);
            }
        }
    }, []);

    const saveFavorites = (newFavs: string[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
        setFavorites(newFavs);
    };

    const toggleFavorite = (name: string) => {
        const idx = favorites.indexOf(name);
        let newFavs: string[];
        if (idx === -1) {
            newFavs = [...favorites, name];
        } else {
            newFavs = favorites.filter(n => n !== name);
        }
        saveFavorites(newFavs);
    };

    const isFavorite = (name: string) => favorites.includes(name);

    return { favorites, toggleFavorite, isFavorite, setFavorites: saveFavorites };
}
