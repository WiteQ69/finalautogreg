import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Car, FilterCriteria } from '@/types/car';

const normStatus = (v: unknown) => String(v ?? '').trim().toLowerCase();

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

      setCars: (cars) => set(() => ({ cars: Array.isArray(cars) ? [...cars] : [] })),

      getActiveCars: () => {
        const { cars } = get();
        return Array.isArray(cars)
          ? cars.filter((car: any) => {
              const s = normStatus(car?.status);
              const badge = !!car?.sold_badge;
              return s === 'active' || (!s && !badge);
            })
          : [];
      },

      getSoldCars: () => {
        const { cars } = get();
        return Array.isArray(cars)
          ? cars.filter((car: any) => {
              const s = normStatus(car?.status);
              const badge = !!car?.sold_badge;
              return s === 'sold' || (!s && badge);
            })
          : [];
      },

      getFilteredCars: (criteria) => {
        const { cars, filterCriteria } = get();
        const filters = criteria || filterCriteria;
        if (!Array.isArray(cars)) return [];

        return cars.filter((car) => {
          if ((filters as any).status && (car as any).status !== (filters as any).status) return false;

          if ((filters as any).searchQuery) {
            const query = (filters as any).searchQuery.toLowerCase();
            const searchableText = `${(car as any).brand} ${(car as any).model} ${(car as any).title ?? ''} ${(car as any).description ?? ''}`.toLowerCase();
            if (!searchableText.includes(query)) return false;
          }

          if ((filters as any).brand && (car as any).brand !== (filters as any).brand) return false;
          if ((filters as any).model && (car as any).model !== (filters as any).model) return false;

          if ((filters as any).yearFrom && (car as any).year < (filters as any).yearFrom) return false;
          if ((filters as any).yearTo && (car as any).year > (filters as any).yearTo) return false;

          if (typeof (filters as any).priceFrom === 'number' && typeof (car as any).price === 'number' && (car as any).price < (filters as any).priceFrom) return false;
          if (typeof (filters as any).priceTo === 'number' && typeof (car as any).price === 'number' && (car as any).price > (filters as any).priceTo) return false;

          if ((filters as any).mileageFrom && (car as any).mileage < (filters as any).mileageFrom) return false;
          if ((filters as any).mileageTo && (car as any).mileage > (filters as any).mileageTo) return false;

          if ((filters as any).fuelType && (car as any).fuelType !== (filters as any).fuelType) return false;
          if ((filters as any).transmission && (car as any).transmission !== (filters as any).transmission) return false;
          if ((filters as any).bodyType && (car as any).bodyType !== (filters as any).bodyType) return false;
          if ((filters as any).drivetrain && (car as any).drivetrain !== (filters as any).drivetrain) return false;

          if ((filters as any).powerFrom != null && (typeof (car as any).power !== 'number' || (car as any).power < (filters as any).powerFrom)) return false;
          if ((filters as any).powerTo != null && (typeof (car as any).power !== 'number' || (car as any).power > (filters as any).powerTo)) return false;

          if ((filters as any).color && (car as any).color !== (filters as any).color) return false;
          if (typeof (filters as any).owners === 'number' && (car as any).owners !== (filters as any).owners) return false;

          if ((filters as any).accidentFree !== undefined && (car as any).accidentFree !== (filters as any).accidentFree) return false;
          if ((filters as any).serviceHistory !== undefined && (car as any).serviceHistory !== (filters as any).serviceHistory) return false;

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
