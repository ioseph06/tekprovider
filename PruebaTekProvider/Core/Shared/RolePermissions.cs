namespace PruebaTekProvider.Core.Shared
{
    public static class RolePermissions
    {
        public static IReadOnlyDictionary<string, string[]> Mapa { get; } =
            new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
            {
                // Admin: todos los permisos.
                ["Admin"] = [.. Permissions.Todos],

                // User: lectura y alta, pero NO acciones Cambio de estatus ni edicion                
                ["User"] =
                [
                    Permissions.Cliente.Ver,
                    Permissions.Cliente.Crear,                    
                ],
            };

        // Permisos efectivos de un conjunto de roles (unión, sin duplicados).
        public static IEnumerable<string> ParaRoles(IEnumerable<string> roles) =>
            roles.Where(Mapa.ContainsKey)
                 .SelectMany(rol => Mapa[rol])
                 .Distinct();
    }
}
