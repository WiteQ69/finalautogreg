import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Car, FilterCriteria } from '@/types/car';

interface CarState {
  cars: Car[];
  favorites: string[];
  comparison: string[];
  filterCriteria: FilterCriteria;

  addCar: (car: Car) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  setCars: (cars: Car[]) => void;

  getActiveCars: () => Car[];
  getSoldCars: () => Car[];
  getFilteredCars: (criteria?: FilterCriteria) => Car[];
  setFilterCriteria: (criteria: FilterCriteria) => void;
  toggleFavorite: (carId: string) => void;
  addToComparison: (carId: string) => void;
  removeFromComparison: (carId: string) => void;
}

export const useCarStore = create<CarState>()(
  persist(
    (set, get) => ({
      cars: [],
      favorites: [],
      comparison: [],
      filterCriteria: {},

      addCar: (car) =>
        set((state) => ({
          // nowy rekord na początek
          cars: [car, ...state.cars],
        })),

      updateCar: (id, updates) =>
        set((state) => ({
          cars: state.cars.map((car) =>
            String(car.id) === String(id)
              ? { ...car, ...updates, updatedAt: new Date().toISOString() }
              : car
          ),
        })),

      deleteCar: (id) =>
        set((state) => ({
          cars: state.cars.filter((car) => String(car.id) !== String(id)),
        })),

      setCars: (cars) => set({ cars }),

      getActiveCars: () => {
        const { cars } = get();
        return Array.isArray(cars) ? cars.filter((car) => car.status === 'active') : [];
      },

      getSoldCars: () => {
        const { cars } = get();
        return Array.isArray(cars) ? cars.filter((car) => car.status === 'sold') : [];
      },

      getFilteredCars: (criteria) => {
        const { cars, filterCriteria } = get();
        const filters = criteria || filterCriteria;
        if (!Array.isArray(cars)) return [];

        return cars.filter((car) => {
          if (filters.status && car.status !== filters.status) return false;

          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const searchableText = `${car.brand} ${car.model} ${car.title ?? ''} ${car.description ?? ''}`.toLowerCase();
            if (!searchableText.includes(query)) return false;
          }

          if (filters.brand && car.brand !== filters.brand) return false;
          if (filters.model && car.model !== filters.model) return false;

          if (filters.yearFrom && car.year < filters.yearFrom) return false;
          if (filters.yearTo && car.year > filters.yearTo) return false;

          if (typeof filters.priceFrom === 'number' && typeof car.price === 'number' && car.price < filters.priceFrom) return false;
          if (typeof filters.priceTo === 'number' && typeof car.price === 'number' && car.price > filters.priceTo) return false;

          if (filters.mileageFrom && car.mileage < filters.mileageFrom) return false;
          if (filters.mileageTo && car.mileage > filters.mileageTo) return false;

          if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
          if (filters.transmission && car.transmission !== filters.transmission) return false;
          if (filters.bodyType && car.bodyType !== filters.bodyType) return false;
          if (filters.drivetrain && car.drivetrain !== filters.drivetrain) return false;

          if (filters.powerFrom != null && (typeof car.power !== 'number' || car.power < filters.powerFrom)) return false;
          if (filters.powerTo != null && (typeof car.power !== 'number' || car.power > filters.powerTo)) return false;

          if (filters.color && car.color !== filters.color) return false;
          if (typeof filters.owners === 'number' && car.owners !== filters.owners) return false;

          if (filters.accidentFree !== undefined && car.accidentFree !== filters.accidentFree) return false;
          if (filters.serviceHistory !== undefined && car.serviceHistory !== filters.serviceHistory) return false;

          return true;
        });
      },

      setFilterCriteria: (criteria) => set({ filterCriteria: criteria }),

      toggleFavorite: (carId) =>
        set((state) => ({
          favorites: state.favorites.includes(carId)
            ? state.favorites.filter((id) => id !== carId)
            : [...state.favorites, carId],
        })),

      addToComparison: (carId) =>
        set((state) => ({
          comparison:
            state.comparison.length < 3 && !state.comparison.includes(carId)
              ? [...state.comparison, carId]
              : state.comparison,
        })),

      removeFromComparison: (carId) =>
        set((state) => ({
          comparison: state.comparison.filter((id) => id !== carId),
        })),
    }),
    {
      name: 'car-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
