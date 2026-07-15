using PruebaTekProvider.Core.Tek.Domain;

namespace PruebaTekProvider.Core.Tek.Application
{
    public static class ClienteMappings
    {
        public static ClienteDto ToDto(this Cliente b) => new()
        {
            Id = b.Id,
            Nombre = b.Nombre,
            RFC = b.RFC,
            Email = b.Email,
            Telefono = b.Telefono.Valor,
            Estado = b.EstadoCliente.ToString(),
            FechaAlta = b.FechaAlta.ToShortDateString(),           
        };
    }
}
