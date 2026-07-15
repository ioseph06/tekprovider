namespace PruebaTekProvider.Core.Shared
{
    public sealed class Email
    {
        public string Valor { get;  set; } = string.Empty;

        private Email() { }                       // para EF Core
        private Email(string valor) => Valor = valor;

        public static Email Crear(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor) || !valor.Contains('@') || !valor.Contains('.'))
            //    throw new DomainException($"Email inválido: '{valor}'");
            throw new Exception($"Email inválido: '{valor}'");

            return new Email(valor.Trim().ToLowerInvariant());
        }

        public override string ToString() => Valor;

    }
}
