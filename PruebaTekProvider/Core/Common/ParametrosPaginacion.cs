namespace PruebaTekProvider.Core.Common
{
    public class ParametrosPaginacion
    {
        private const int MaxPageSize = 100;
        private int _page = 1;
        private int _pageSize = 20;

        public int Page
        {
            get => _page;
            set => _page = value < 1 ? 1 : value;
        }

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value < 1 ? 1 : (value > MaxPageSize ? MaxPageSize : value);
        }

        // Texto de búsqueda opcional (cada repositorio decide sobre qué campo busca).
        public string? Buscar { get; set; }

        // Campo por el que ordenar. Cada repositorio acepta una LISTA CERRADA de campos (whitelist);
        // un valor desconocido o vacío usa el orden por defecto del módulo.
        public string? OrdenarPor { get; set; }

        // Dirección: descendente si true. Por defecto ascendente cuando se indica un OrdenarPor.
        public bool Desc { get; set; }
    }
}
