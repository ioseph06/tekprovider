using PruebaTekProvider.Core.Common;
using PruebaTekProvider.Core.Tek.Domain;

namespace PruebaTekProvider.Core.Tek.Application
{
    public interface IClienteRepository
    {
        Task AgregarAsync(Cliente cliente);

        Task<PagedResult<Cliente>> ListarAsync(ParametrosPaginacion parametros);

        Task<Cliente?> ObtenerPorIdAsync(Guid id);

        Task GuardarCambiosAsync();

        Task<bool> ExisteEmailAsync(string email, Guid? excluirId = null);

        Task<bool> ExisteRFCAsync(string rfc, Guid? excluirId = null);

    }
}
