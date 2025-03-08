import { getInLocalStorage, setInLocalStorage } from "../Hooks/localStorage";

const fetchFiltersData = async () => { // 🔹 Ya no es un hook
  try {
    const filtersGuardados = getInLocalStorage("filters");
    if (filtersGuardados) {
      return filtersGuardados;
    }

    const res = await fetch("/api/brandsCategories");

    if (!res.ok) {
      throw new Error("Error al cargar los filtros");
    }

    const data = await res.json();
    setInLocalStorage("filters", data);
    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Error en fetchFiltersData:", error);
    return { marcas: [], categorias: [] };
  }
};

export default fetchFiltersData;
