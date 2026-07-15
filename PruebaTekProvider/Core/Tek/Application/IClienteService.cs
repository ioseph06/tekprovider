using PruebaTekProvider.Core.Common;

namespace PruebaTekProvider.Core.Tek.Application
{
    public interface IClienteService
    {
        Task <Result<ClienteDto>> CrearAsync(CrearClienteDto dto);
        Task<PagedResult<ClienteDto>> ListarAsync(ParametrosPaginacion parametros);             
        Task <Result<ClienteDto>> EditarAsync(Guid id, EditarClienteDto dto);
        Task<ClienteDto?> ObtenerAsync(Guid id);
        Task <Result<ClienteDto>> CambiarEstadoAsync(Guid id, CambiarEstadoClienteDto dto);        
    }
}
