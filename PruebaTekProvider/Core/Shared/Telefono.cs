namespace PruebaTekProvider.Core.Shared
{
    public sealed class Telefono
    {
        public string Valor { get; private set; } = string.Empty;

        private Telefono() { }                     // para EF Core
        private Telefono(string valor) => Valor = valor;

        public static Telefono Crear(string valor)
        {
            var limpio = valor?.Trim() ?? string.Empty;
            var digitos = limpio.StartsWith('+') ? limpio[1..] : limpio;

            if (digitos.Length < 7 || digitos.Length > 15 || !digitos.All(char.IsDigit))
                throw new DomainException($"Teléfono inválido: '{valor}'");               
            return new Telefono(limpio);
        }

        public override string ToString() => Valor;
    }
}
