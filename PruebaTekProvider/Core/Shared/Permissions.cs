using System.Reflection;

namespace PruebaTekProvider.Core.Shared
{
    public static class Permissions
    {

        public static class Cliente
        {
            public const string Ver = "cliente.ver";
            public const string Crear = "cliente.crear";
            public const string Editar = "cliente.editar";
            public const string Cambiar = "cliente.cambiar";
        }

        public static IReadOnlyList<string> Todos { get; } =
            typeof(Permissions).GetNestedTypes()
                .SelectMany(t => t.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy))
                .Where(f => f.IsLiteral && f.FieldType == typeof(string))
                .Select(f => (string)f.GetRawConstantValue()!)
                .ToArray();
    }
}
